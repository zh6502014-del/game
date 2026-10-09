#!/usr/bin/env python3
"""Verify source-art integrity; restore requires macOS/Linux exclusive directory rename."""
import argparse
import ctypes
import errno
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import sys
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
CHUNK = 1024 * 1024


def safe_path(value):
    if (not isinstance(value, str) or not value or '\\' in value or '\0' in value
            or value.startswith('/') or re.match(r'^[A-Za-z]:', value)
            or any(part in ('', '.', '..') for part in value.split('/'))):
        raise ValueError(f'Unsafe path: {value!r}')
    return value


def digest_stream(stream, destination=None):
    digest = hashlib.sha256()
    size = 0
    while True:
        block = stream.read(CHUNK)
        if not block:
            break
        digest.update(block)
        size += len(block)
        if destination is not None:
            destination.write(block)
    return size, digest.hexdigest()


def load_manifest(path):
    with open(path, encoding='utf-8') as stream:
        data = json.load(stream)
    if not isinstance(data, dict) or data.get('version') != 1:
        raise ValueError('Unsupported manifest version')
    if not re.fullmatch(r'[0-9a-f]{64}', str(data.get('archiveSha256', ''))):
        raise ValueError('Invalid archive SHA256')
    if not isinstance(data.get('files'), list):
        raise ValueError('Manifest files must be a list')
    expected = {}
    for item in data['files']:
        if not isinstance(item, dict):
            raise ValueError('Invalid manifest entry')
        name = safe_path(item.get('path'))
        if name in expected:
            raise ValueError(f'Duplicate manifest path: {name}')
        if (type(item.get('bytes')) is not int or item['bytes'] < 0
                or not re.fullmatch(r'[0-9a-f]{64}', str(item.get('sha256', '')))
                or type(item.get('mode')) is not int or not 0 <= item['mode'] <= 0o7777
                or type(item.get('mtime_ns')) is not int):
            raise ValueError(f'Invalid manifest metadata: {name}')
        expected[name] = item
    for name in expected:
        parts = name.split('/')
        if any('/'.join(parts[:i]) in expected for i in range(1, len(parts))):
            raise ValueError(f'File/directory conflict: {name}')
    if (type(data.get('totalBytes')) is not int
            or data['totalBytes'] != sum(item['bytes'] for item in expected.values())):
        raise ValueError('Manifest totalBytes mismatch')
    return data, expected


def read_member(source, destination, name):
    if destination is None:
        return digest_stream(source)
    output = destination / name
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('xb') as target:
        return digest_stream(source, target)


def validate(archive, manifest, destination=None):
    """One streaming validation path, optionally writing into a private staging dir."""
    data, expected = load_manifest(manifest)
    seen = set()
    regular = {}
    with open(archive, 'rb') as raw:
        if digest_stream(raw)[1] != data['archiveSha256']:
            raise ValueError('Archive SHA256 mismatch')
        raw.seek(0)
        with tarfile.open(fileobj=raw, mode='r:gz') as bundle:
            for member in bundle:
                name = safe_path(member.name)
                if name in seen:
                    raise ValueError(f'Duplicate archive path: {name}')
                if name not in expected:
                    raise ValueError(f'Undeclared archive path: {name}')
                item = expected[name]
                if member.islnk():
                    target = safe_path(member.linkname)
                    if target not in regular or member.size != 0:
                        raise ValueError(f'Invalid hardlink target: {name}')
                    # The earlier regular member is already verified. Avoid seeking
                    # backwards through a large gzip stream for duplicate contents.
                    size, digest = regular[target]
                    if destination is not None:
                        with (destination / target).open('rb') as source:
                            size, digest = read_member(source, destination, name)
                elif member.isfile():
                    if member.size != item['bytes']:
                        raise ValueError(f'Size mismatch: {name}')
                    with bundle.extractfile(member) as source:
                        size, digest = read_member(source, destination, name)
                else:
                    raise ValueError(f'Unsupported archive member: {name}')
                if size != item['bytes'] or digest != item['sha256']:
                    raise ValueError(f'Content mismatch: {name}')
                seen.add(name)
                if member.isfile():
                    regular[name] = (size, digest)
    missing = set(expected) - seen
    if missing:
        raise ValueError(f'Missing archive paths: {sorted(missing)!r}')
    if destination is not None:
        for name, item in expected.items():
            target = destination / name
            os.chmod(target, item['mode'])
            os.utime(target, ns=(item['mtime_ns'], item['mtime_ns']))
    return len(expected), data['totalBytes']


def rename_exclusive(source, destination):
    """Atomically install a directory without replacing even an empty destination."""
    libc = ctypes.CDLL(None, use_errno=True)
    if sys.platform == 'darwin':
        rename = libc.renamex_np
        rename.argtypes = (ctypes.c_char_p, ctypes.c_char_p, ctypes.c_uint)
        arguments = (os.fsencode(source), os.fsencode(destination), 0x00000004)  # RENAME_EXCL
    elif sys.platform.startswith('linux') and hasattr(libc, 'renameat2'):
        rename = libc.renameat2
        rename.argtypes = (ctypes.c_int, ctypes.c_char_p, ctypes.c_int,
                           ctypes.c_char_p, ctypes.c_uint)
        arguments = (-100, os.fsencode(source), -100, os.fsencode(destination), 1)  # NOREPLACE
    else:
        raise OSError(errno.ENOTSUP, 'Exclusive directory rename unsupported on this platform')
    rename.restype = ctypes.c_int
    if rename(*arguments) != 0:
        error = ctypes.get_errno()
        raise OSError(error, os.strerror(error), str(destination))


def restore(archive, manifest, output):
    output = Path(os.path.abspath(output))
    if os.path.lexists(output):
        raise ValueError(f'Refusing existing output: {output}')
    # Keep staging on the same filesystem; never extract into the final directory.
    staging = Path(tempfile.mkdtemp(prefix=f'.{output.name}-restore-', dir=output.parent))
    try:
        result = validate(archive, manifest, staging)
        if os.path.lexists(output):
            raise ValueError(f'Refusing existing output: {output}')
        rename_exclusive(staging, output)
        return result
    finally:
        if staging.exists():
            shutil.rmtree(staging)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=('verify', 'restore'))
    parser.add_argument('--archive', type=Path, default=ROOT / 'storage/source-art.tar.gz')
    parser.add_argument('--manifest', type=Path, default=ROOT / 'storage/source-art-manifest.json')
    parser.add_argument('--output', type=Path, default=ROOT / 'storage/source-art')
    args = parser.parse_args()
    try:
        if args.command == 'restore':
            count, size = restore(args.archive, args.manifest, args.output)
        else:
            count, size = validate(args.archive, args.manifest)
    except (OSError, ValueError, tarfile.TarError, EOFError) as error:
        print(f'ERROR: {error}', file=sys.stderr)
        return 1
    print(f'{args.command}: OK — {count} files, {size} bytes')
    return 0


if __name__ == '__main__':
    sys.exit(main())

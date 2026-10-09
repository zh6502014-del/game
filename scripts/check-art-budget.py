#!/usr/bin/env python3
"""Read-only art inventory/budget gate. No decoding, conversion or deletion.

Default: audit assets (exit 0 with clearly reported budget findings).
Delivery: --strict <new/changed assets> (exit 1 on budget findings).
Unrecognized files/categories or unreadable metadata always exit 2.
"""
import argparse
from collections import defaultdict
from fnmatch import fnmatchcase
import json
from pathlib import Path
import struct
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif', '.gif', '.bmp'}


def dimensions(path):
    """Read dimensions from headers only; this is not an image decode test."""
    with path.open('rb') as f:
        h = f.read(30)
        if h.startswith(b'\x89PNG\r\n\x1a\n') and h[12:16] == b'IHDR':
            return (*struct.unpack('>II', h[16:24]), 'png')
        if h[:4] == b'RIFF' and h[8:12] == b'WEBP':
            riff_end = 8 + int.from_bytes(h[4:8], 'little')
            if riff_end < 12 or riff_end > path.stat().st_size:
                raise ValueError('truncated or invalid WebP RIFF container')
            f.seek(12)
            while f.tell() < riff_end:
                chunk = f.read(8)
                if len(chunk) != 8 or f.tell() > riff_end:
                    raise ValueError('truncated WebP chunk header')
                tag, size = struct.unpack('<4sI', chunk)
                if f.tell() + size > riff_end:
                    raise ValueError('truncated WebP chunk payload')
                data = f.read(min(size, 10))
                required = {b'VP8X': 10, b'VP8L': 5, b'VP8 ': 10}.get(tag)
                if required and len(data) < required:
                    raise ValueError('truncated WebP dimensions')
                if tag == b'VP8X':
                    return (1 + int.from_bytes(data[4:7], 'little'),
                            1 + int.from_bytes(data[7:10], 'little'), 'webp')
                if tag == b'VP8L' and data[0] == 0x2f:
                    bits = int.from_bytes(data[1:5], 'little')
                    return ((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1, 'webp')
                if tag == b'VP8 ' and data[3:6] == b'\x9d\x01\x2a':
                    width, height = struct.unpack('<HH', data[6:10])
                    return width & 0x3fff, height & 0x3fff, 'webp'
                f.seek(size - len(data) + size % 2, 1)
        if h[:2] == b'\xff\xd8':
            f.seek(2)
            while f.read(1) == b'\xff':
                marker = f.read(1)
                while marker == b'\xff':
                    marker = f.read(1)
                if not marker or marker[0] in (0xda, 0xd9):
                    break
                if marker[0] in range(0xd0, 0xd9) or marker[0] == 1:
                    continue
                size = struct.unpack('>H', f.read(2))[0]
                if marker[0] in {0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
                                 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf}:
                    _, height, width = struct.unpack('>BHH', f.read(5))
                    return width, height, 'jpeg'
                if size < 2:
                    break
                f.seek(size - 2, 1)
    if path.suffix.lower() == '.svg':
        node = ET.parse(path).getroot()
        if node.tag.rsplit('}', 1)[-1] != 'svg':
            raise ValueError('not an SVG root')
        # Vector coordinates are not raster resolution; enforce bytes only.
        return None, None, 'svg'
    raise ValueError('unsupported or malformed image header')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('paths', nargs='*', help='Files/directories; default: project assets/')
    parser.add_argument('--kind', help='Explicit budget for paths not covered by directory rules')
    parser.add_argument('--strict', action='store_true', help='Fail on any over-budget file')
    parser.add_argument('--json', action='store_true', help='Print full machine-readable audit')
    args = parser.parse_args()
    config = json.loads((ROOT / 'config/art-budgets.json').read_text())
    if args.kind and args.kind not in config['budgets']:
        parser.error('unknown kind: ' + args.kind)
    paths, errors = set(), []
    for raw in args.paths or [str(ROOT / 'assets')]:
        path = Path(raw).resolve()
        if path.is_dir():
            paths.update(p for p in path.rglob('*') if p.is_file() and p.suffix.lower() in EXTENSIONS)
        elif path.is_file():
            paths.add(path)
        else:
            errors.append({'path': str(path), 'error': 'path does not exist'})
    if not paths:
        errors.append({'path': '', 'error': 'no image files selected'})
    rows, groups = [], defaultdict(lambda: {'count': 0, 'bytes': 0, 'over_budget': 0})
    for path in sorted(paths):
        try:
            name = path.relative_to(ROOT).as_posix()
        except ValueError:
            name = path.as_posix()
        try:
            width, height, fmt = dimensions(path)
            if fmt != 'svg' and (not width or not height):
                raise ValueError('invalid zero dimensions')
            kind = args.kind or next((r['kind'] for r in config['rules']
                                      if fnmatchcase(name, r['pattern'])), None)
            if kind is None:
                raise ValueError('unclassified asset: provide --kind or register a path rule')
            budget, size, issues = config['budgets'][kind], path.stat().st_size, []
            if fmt != 'svg' and (max(width, height) > budget['max_long'] or
                                 min(width, height) > budget['max_short']):
                issues.append('dimensions')
            if size > budget['max_bytes']:
                issues.append('bytes')
            rows.append({'path': name, 'kind': kind, 'format': fmt, 'width': width,
                         'height': height, 'bytes': size, 'issues': issues})
            group = name.split('/')[1] if name.startswith('assets/') else 'other'
            groups[group]['count'] += 1
            groups[group]['bytes'] += size
            groups[group]['over_budget'] += bool(issues)
        except (OSError, ValueError, struct.error, IndexError, ET.ParseError) as exc:
            errors.append({'path': name, 'error': str(exc)})
    count = sum(bool(row['issues']) for row in rows)
    code = 2 if errors else 1 if args.strict and count else 0
    report = {'mode': 'strict' if args.strict else 'audit',
              'status': 'ERROR' if errors else 'OVER_BUDGET' if count else 'WITHIN_BUDGET',
              'scope': 'selected image files; header metadata only; not runtime reachability',
              'file_count': len(rows), 'total_bytes': sum(r['bytes'] for r in rows),
              'over_budget_count': count, 'groups': dict(groups), 'files': rows, 'errors': errors}
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"{report['mode'].upper()}: {report['status']} — {len(rows)} files, "
              f"{report['total_bytes']/1048576:.2f} MiB; {count} over budget")
        for group, data in sorted(groups.items(), key=lambda item: -item[1]['bytes']):
            print(f"  {group}: {data['count']} files, {data['bytes']/1048576:.2f} MiB, "
                  f"{data['over_budget']} over budget")
        for row in sorted((r for r in rows if r['issues']), key=lambda r: -r['bytes'])[:15]:
            print(f"  {row['path']}: {row['width']}×{row['height']}, "
                  f"{row['bytes']/1024:.1f} KiB ({', '.join(row['issues'])})")
        for error in errors:
            print(f"  ERROR {error['path']}: {error['error']}")
        if count and not args.strict:
            print('Audit only; exit 0 is NOT a delivery pass. Use --strict on new/changed assets.')
    return code


if __name__ == '__main__':
    sys.exit(main())

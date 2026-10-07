#!/usr/bin/env python3
"""Record a code baseline and compare a ticket's declared file scope.

Not an attribution/security system: concurrent or reverted writes need review.
Binary art, generated test output, caches and backups are deliberately excluded.
"""
import argparse
from datetime import datetime, timezone
import difflib
import hashlib
import json
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = {'.js', '.cjs', '.mjs', '.css', '.html', '.py', '.json', '.md', '.svg', '.toml', '.yaml', '.yml', '.sh'}
EXCLUDED = {'.git', '.codex', '.agents', 'node_modules', '.venv', '__pycache__', 'test-results', 'backups', 'source-art'}


def tracked(path):
    return path.suffix.lower() in EXTENSIONS and not (set(path.parts) & EXCLUDED) and '.backup.' not in path.name


def inventory(root):
    result = {}
    for base, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDED)
        for directory in dirs:
            path = Path(base) / directory
            if path.is_symlink():
                raise ValueError(f'Symlink directory requires manual review: {path.relative_to(root)}')
        for name in sorted(files):
            path = Path(base) / name
            relative = path.relative_to(root)
            if tracked(relative):
                if path.is_symlink():
                    raise ValueError(f'Symlink requires manual review: {relative}')
                result[relative.as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    commands = parser.add_subparsers(dest='command', required=True)
    snapshot = commands.add_parser('snapshot')
    snapshot.add_argument('--ticket', required=True)
    snapshot.add_argument('--owner', required=True)
    snapshot.add_argument('--allow', action='append', required=True, help='Exact root-relative file; repeat for each file')
    snapshot.add_argument('--output', type=Path, required=True)
    check = commands.add_parser('check')
    check.add_argument('--baseline', type=Path, required=True)
    check.add_argument('--json', action='store_true')
    check.add_argument('--diff', action='store_true', help='Show text diffs for allowed files with a recorded original')
    args = parser.parse_args()
    root = args.root.resolve()
    try:
        if not root.is_dir():
            raise ValueError('project root does not exist')
        current = inventory(root)
        if args.command == 'snapshot':
            allowed = []
            for name in args.allow:
                relative = Path(name)
                if relative.is_absolute() or '..' in relative.parts or not tracked(relative):
                    raise ValueError(f'Expected an exact tracked relative file: {name}')
                if (root / relative).is_dir():
                    raise ValueError(f'Directory permission is too broad: {name}')
                allowed.append(relative.as_posix())
            destination = args.output.resolve()
            if not destination.is_relative_to(root / 'test-results/change-scopes'):
                raise ValueError('Store baselines under <root>/test-results/change-scopes/')
            before = {name: (root / name).read_bytes().decode('utf-8') for name in sorted(set(allowed)) if name in current}
            # Detect a writer racing the snapshot; do not certify mixed file versions.
            if inventory(root) != current:
                raise ValueError('Files changed during snapshot; retry after writers finish')
            record = {'version': 1, 'ticket': args.ticket, 'owner': args.owner,
                      'created_utc': datetime.now(timezone.utc).isoformat(), 'root': str(root),
                      'allowed': sorted(set(allowed)), 'hashes': current, 'before': before,
                      'extensions': sorted(EXTENSIONS), 'excluded': sorted(EXCLUDED)}
            destination.parent.mkdir(parents=True, exist_ok=True)
            with destination.open('x', encoding='utf-8') as f:
                json.dump(record, f, ensure_ascii=False, indent=2)
            print(f"BASELINE {args.ticket}: {len(current)} tracked files, {len(record['allowed'])} allowed; {destination}")
            return 0
        record = json.loads(args.baseline.read_text(encoding='utf-8'))
        if record.get('version') != 1 or record.get('root') != str(root):
            raise ValueError('Baseline version/root mismatch')
        if record.get('extensions') != sorted(EXTENSIONS) or record.get('excluded') != sorted(EXCLUDED):
            raise ValueError('Scanner policy changed; manual review required')
        for name, original in record['before'].items():
            if hashlib.sha256(original.encode('utf-8')).hexdigest() != record['hashes'].get(name):
                raise ValueError(f'Baseline text/hash mismatch: {name}')
        changes = []
        for name in sorted(record['hashes'].keys() | current.keys()):
            if record['hashes'].get(name) != current.get(name):
                status = 'added' if name not in record['hashes'] else 'deleted' if name not in current else 'modified'
                row = {'path': name, 'change': status, 'allowed': name in record['allowed']}
                if args.diff and row['allowed']:
                    original = record['before'].get(name, '')
                    updated = (root / name).read_bytes().decode('utf-8') if name in current else ''
                    row['diff'] = ''.join(difflib.unified_diff(original.splitlines(True), updated.splitlines(True),
                                                            fromfile='before/' + name, tofile='after/' + name))
                changes.append(row)
        outside = [row['path'] for row in changes if not row['allowed']]
        if inventory(root) != current:
            raise ValueError('Files changed during check; retry after writers finish')
        result = {'ticket': record['ticket'], 'owner': record['owner'],
                  'status': 'REVIEW_REQUIRED' if outside else 'WITHIN_FILE_SCOPE',
                  'outside_scope': outside, 'changes': changes,
                  'limitation': 'File-scope evidence only; cannot identify writer or certify semantics. Concurrent tickets require coordination.'}
        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print(f"{result['status']}: {len(changes)} changes, {len(outside)} outside declared file scope")
            for row in changes:
                print(f"  {'ALLOW' if row['allowed'] else 'REVIEW'} {row['change']} {row['path']}")
                if row.get('diff'):
                    print(row['diff'])
        return 1 if outside else 0
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())

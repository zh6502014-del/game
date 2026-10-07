#!/usr/bin/env python3
"""Navigation, conservative test suggestions and reviewable (never cached) evidence."""
import argparse
from datetime import datetime, timezone
from fnmatch import fnmatchcase
import hashlib
import json
import os
from pathlib import Path
import platform
import re
import shutil
import signal
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = 'config/workflow-map.json'
RUNNER = 'scripts/workflow.py'
SCHEMA = 1
ENV_KEYS = frozenset({'PATH', 'HOME', 'LANG', 'TZ', 'TMPDIR', 'TMP', 'TEMP',
                      'SystemRoot', 'SYSTEMROOT', 'WINDIR', 'USERPROFILE',
                      'NODE_OPTIONS', 'NODE_PATH'})
ENV_PREFIXES = ('LC_', 'PYTHON', 'DYLD_', 'LD_')


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encoded(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()


def file_hash(path):
    result = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(block)
    return result.hexdigest()


def relative(value):
    """Accept project paths, including deleted paths, but never traversal or symlinks."""
    path = Path(value)
    if '..' in path.parts:
        raise ValueError('Path traversal is not allowed')
    if path.is_absolute():
        path = path.relative_to(ROOT)
    if not path.parts or path == Path('.'):
        raise ValueError('A project file or output path is required')
    current = ROOT
    for part in path.parts:
        current /= part
        if current.is_symlink():
            raise ValueError('Symlink paths are not allowed: ' + str(path))
    return path.as_posix()


def load_manifest():
    manifest = json.loads((ROOT / relative(MANIFEST)).read_text())
    if manifest.get('schema') != SCHEMA:
        raise ValueError('Unsupported manifest schema')
    for group in manifest['dependency_groups'].values():
        for pattern in group:
            relative(pattern)
    for area in manifest['areas'].values():
        for pattern in [*area['files'], *area.get('priority_files', [])]:
            relative(pattern)
        for suite in area['tests']:
            if suite not in manifest['suites']:
                raise ValueError('Unknown mapped suite: ' + suite)
    for name, suite in manifest['suites'].items():
        argv = suite['argv']
        if (not re.fullmatch(r'[a-z0-9-]+', name) or len(argv) < 2 or
                argv[0] not in ('{python}', '{node}') or
                not all(isinstance(arg, str) and '\0' not in arg for arg in argv)):
            raise ValueError('Invalid suite argv: ' + name)
        script = relative(argv[1])
        if not script.startswith(('tests/', 'scripts/')) or any(c in script for c in '*?['):
            raise ValueError('Suite entry must be a local test/script')
        if suite['kind'] not in ('deterministic', 'manual'):
            raise ValueError('Invalid suite kind: ' + name)
        if not 1 <= suite['timeout'] <= 1800:
            raise ValueError('Invalid suite timeout: ' + name)
        for pattern in dependencies(manifest, suite):
            relative(pattern)
    return manifest


def dependencies(manifest, suite):
    patterns = [RUNNER, MANIFEST, suite['argv'][1], *suite.get('dependencies', [])]
    for group in suite.get('groups', []):
        patterns.extend(manifest['dependency_groups'][group])
    return sorted(set(patterns))


def source_files(manifest, suite):
    files = {}
    for pattern in dependencies(manifest, suite):
        matches = sorted(ROOT.glob(pattern + '/*' if pattern.endswith('/**') else pattern))
        found_file = False
        for path in matches:
            name = relative(path)
            if path.is_file():
                files[name] = file_hash(path)
                found_file = True
        if not found_file:
            raise ValueError('Dependency has no files: ' + pattern)
    return dict(sorted(files.items()))


def child_environment():
    """Suites and runtime probes receive only the same explicit runtime/OS inputs."""
    env = {key: value for key, value in os.environ.items()
           if key in ENV_KEYS or key.startswith(ENV_PREFIXES)}
    env['PYTHONDONTWRITEBYTECODE'] = '1'
    return env


def runtime(token, env):
    executable = sys.executable if token == '{python}' else shutil.which('node', path=env.get('PATH', os.defpath))
    if not executable:
        return {'available': False, 'name': token}
    executable = str(Path(executable).resolve())
    version = subprocess.run([executable, '--version'], env=env, capture_output=True, timeout=10)
    if version.returncode:
        raise ValueError('Runtime version probe failed')
    output = version.stdout + version.stderr
    match = re.search(rb'(?:Python |v)\d+\.\d+\.\d+', output)
    return {'available': True, 'executable': executable, 'sha256': file_hash(Path(executable)),
            'version': match.group().decode() if match else None,
            'version_output_sha256': digest(output)}


def environment(suite, env):
    # Hash the exact controlled environment passed to the suite, never raw values.
    result = {'platform': platform.platform(), 'machine': platform.machine(),
              'environment_sha256': digest(encoded(env)), 'environment_keys': sorted(env),
              'runtime': runtime(suite['argv'][0], env), 'runner_python': sys.version}
    result['review_required'] = False
    return result


def fingerprint(manifest, suite, env=None):
    record = {'files': source_files(manifest, suite),
              'environment': environment(suite, child_environment() if env is None else env),
              'suite': suite}
    return {**record, 'sha256': digest(encoded(record))}


def show_map(manifest, area):
    if area and area not in manifest['areas']:
        raise ValueError('Unknown area: ' + area)
    note = ('Hand-maintained index; update it when files, public APIs or dependencies change. '
            'Navigation is not a coverage claim; manual suites require separate environment/output review.')
    if not area:
        return {'areas': {key: value['task'] for key, value in manifest['areas'].items()},
                'detail': 'map --area AREA_ID', 'note': note}
    chosen = {area: manifest['areas'][area]}
    ids = {name for entry in chosen.values() for name in entry['tests']}
    return {'areas': chosen,
            'suites': {name: {key: value for key, value in manifest['suites'][name].items()
                              if key in ('argv', 'kind')}
                       for name in sorted(ids)},
            'note': note}


def plan(manifest, changed):
    chosen, priority, unknown, documents, reasons = set(), set(), [], [], {}
    for value in changed:
        name = relative(value)
        affected = {key for key, suite in manifest['suites'].items()
                    if any(fnmatchcase(name, pat) for pat in dependencies(manifest, suite))}
        areas = [area for area in manifest['areas'].values()
                 if any(fnmatchcase(name, pat) for pat in area['files'])]
        known_test = any(name == s['argv'][1] or name in s.get('dependencies', [])
                         for s in manifest['suites'].values())
        if name.endswith('.md') and not affected:
            documents.append(name)
            continue
        if not areas and not known_test and name not in (RUNNER, MANIFEST):
            unknown.append(name)
        for area in areas:
            affected.update(area['tests'])
        priority.update(key for key, suite in manifest['suites'].items()
                        if any(fnmatchcase(name, pat) for pat in [suite['argv'][1], *suite.get('dependencies', [])]))
        for area in manifest['areas'].values():
            if any(fnmatchcase(name, pat) for pat in area.get('priority_files', area['files'])):
                priority.update(area['tests'])
        chosen.update(affected)
        chosen.update(priority)
        reasons[name] = {'dependency_candidates': len(affected)}
    if unknown:
        chosen.update(manifest['suites'])
    return {'status': 'REVIEW_REQUIRED' if unknown else ('DOCUMENT_ONLY' if not chosen else 'SUGGESTED'),
            'suites': sorted(chosen), 'priority_suites': sorted(priority),
            'unknown': unknown, 'documents': documents, 'reasons': reasons,
            'manual_only_count': sum(manifest['suites'][key]['kind'] == 'manual' for key in chosen),
            'notes': ['Suggestions only; no tests were executed.',
                      'Priority uses related areas/direct dependencies, not broad browser groups; it never removes candidates.',
                      'Shared HTML/CSS dependencies are conservative; a reviewer must select the affected checks.',
                      'Unknown paths broaden candidates and require review; this is not a safe-to-skip decision.',
                      'Terminal fixtures verify flow boundaries, not combat rules or balance.']}


def output_directory(value):
    name = relative(value)
    path = Path(name)
    if len(path.parts) != 3 or path.parts[:2] != ('test-results', 'workflow'):
        raise ValueError('Output must be a new test-results/workflow/<unique-name> directory')
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*', path.name):
        raise ValueError('Invalid output directory name')
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    relative(target)  # Recheck after creating parent directories.
    target.mkdir()  # Exclusive reservation: never reuse or overwrite evidence.
    return target


def run_suite(manifest, name, output):
    suite = manifest['suites'][name]
    if suite['kind'] == 'manual':
        raise ValueError('Manual-only suite: ' + suite['notes'])
    env = child_environment()
    before = fingerprint(manifest, suite, env)
    target = output_directory(output)
    workspace = target / 'workspace'
    workspace.mkdir()
    log = target / 'run.log'
    code, error, workspace_changed = 2, None, []
    started = datetime.now(timezone.utc).isoformat()
    command = [before['environment']['runtime'].get('executable'), *suite['argv'][1:]]
    after = None
    with log.open('xb') as stream:
        try:
            for source, expected in before['files'].items():
                destination = workspace / source
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(ROOT / relative(source), destination)
                if file_hash(destination) != expected:
                    raise ValueError('Dependency changed while copying: ' + source)
            (workspace / 'test-results').mkdir(exist_ok=True)
            if not command[0]:
                code = 127
                raise ValueError('Runtime unavailable; put node on PATH before running Node suites')
            with subprocess.Popen(command, cwd=workspace, env=env, stdin=subprocess.DEVNULL,
                                  stdout=stream, stderr=subprocess.STDOUT, start_new_session=True) as process:
                try:
                    code = process.wait(timeout=suite['timeout'])
                except subprocess.TimeoutExpired:
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait()
                    raise
            for source, expected in before['files'].items():
                copied = workspace / source
                if not copied.is_file() or copied.is_symlink() or file_hash(copied) != expected:
                    workspace_changed.append(source)
        except subprocess.TimeoutExpired:
            code, error = 124, 'Suite timed out; partial output remains in run.log'
        except (OSError, ValueError) as exc:
            error = str(exc)
        try:
            after = fingerprint(manifest, suite)
        except (OSError, ValueError, subprocess.SubprocessError) as exc:
            error = 'After fingerprint unavailable: ' + str(exc)
        if error:
            stream.write(('\nWORKFLOW: ' + error + '\n').encode())
    changed = after is None or before != after or bool(workspace_changed)
    status = 'FAILED' if code != 0 or error else ('CHANGED' if changed else 'PASS')
    record = {'schema': SCHEMA, 'root': str(ROOT), 'suite_id': name, 'status': status,
              'started_at': started, 'finished_at': datetime.now(timezone.utc).isoformat(),
              'command': command, 'returncode': code, 'error': error,
              'before': before, 'after': after, 'workspace_changed': workspace_changed,
              'log': {'name': 'run.log', 'sha256': file_hash(log), 'bytes': log.stat().st_size},
              'review_required': before['environment']['review_required'],
              'limitations': ['Evidence is local and unsigned; inspect never skips tests.',
                              'Only declared dependencies and the recorded environment are compared.',
                              'Before/after hashes do not detect transient edits restored between snapshots.']}
    record['integrity_sha256'] = digest(encoded(record))
    report = target / 'report.json'
    with report.open('x') as stream:
        json.dump(record, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    summary = {'status': status, 'suite': name, 'returncode': code,
               'report': relative(report), 'log': relative(log), 'review_required': record['review_required']}
    exit_code = code if code > 0 else (128 - code if code < 0 else (0 if status == 'PASS' else 1))
    return summary, exit_code


def inspect(manifest, value):
    path = ROOT / relative(value)
    if path.name != 'report.json' or path.parent.parent != ROOT / 'test-results/workflow':
        raise ValueError('Report must be test-results/workflow/<name>/report.json')
    record = json.loads(path.read_text())
    checksum = record.pop('integrity_sha256')
    if checksum != digest(encoded(record)) or record['schema'] != SCHEMA or record['root'] != str(ROOT):
        raise ValueError('Report integrity, schema or project mismatch')
    log = path.parent / 'run.log'
    relative(log)
    if record['log']['name'] != 'run.log' or file_hash(log) != record['log']['sha256'] or log.stat().st_size != record['log']['bytes']:
        raise ValueError('Log is missing or changed')
    if record['status'] == 'FAILED' or record['returncode'] != 0 or record['error']:
        return {'status': 'failed', 'suite': record['suite_id'], 'returncode': record['returncode'],
                'review_required': True}, 1
    suite = manifest['suites'].get(record['suite_id'])
    try:
        current = fingerprint(manifest, suite) if suite else None
        for name, expected in record['before']['files'].items():
            copied = path.parent / 'workspace' / name
            relative(copied)
            if not copied.is_file() or file_hash(copied) != expected:
                current = None
                break
    except (OSError, ValueError, subprocess.SubprocessError):
        current = None  # Missing/deleted dependencies make old evidence stale.
    unchanged = (record['status'] == 'PASS' and not record['workspace_changed'] and
                 record['before'] == record['after'] == current)
    return {'status': 'unchanged' if unchanged else 'changed', 'suite': record['suite_id'],
            'review_required': record['review_required'] or not unchanged,
            'note': 'Comparable local evidence for human review only; not permission to skip tests.'}, 0 if unchanged else 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='action', required=True)
    sub.add_parser('map').add_argument('--area')
    sub.add_parser('plan').add_argument('--changed', action='append', required=True)
    run = sub.add_parser('run')
    run.add_argument('--suite', required=True)
    run.add_argument('--output', required=True)
    sub.add_parser('inspect').add_argument('--report', required=True)
    args = parser.parse_args()
    try:
        manifest = load_manifest()
        if args.action == 'map':
            result, code = show_map(manifest, args.area), 0
        elif args.action == 'plan':
            result = plan(manifest, args.changed)
            code = 1 if result['status'] == 'REVIEW_REQUIRED' else 0
        elif args.action == 'run':
            result, code = run_suite(manifest, args.suite, args.output)
        else:
            result, code = inspect(manifest, args.report)
    except (OSError, ValueError, KeyError, TypeError, AttributeError, subprocess.SubprocessError) as exc:
        result, code = {'status': 'failed', 'error': str(exc), 'review_required': True}, 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return code


if __name__ == '__main__':
    sys.exit(main())

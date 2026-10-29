#!/usr/bin/env python3
"""Pinned, conservative on-prem upgrade. Read-only unless --apply is supplied."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys

ACCEPTED = {
    'onprem/model.ts': '25db74c35b5a501ef1c6c2a6ef127204',
    'deployment/compose.yaml': 'e87a1cc800c4d5a33833ccdf0b7ab008',
    'onprem/server.ts': '27b3df8dc15677fd4a0f05d26044102f',
}


class UpgradeError(Exception):
    pass


def run(args, cwd, label, check=True):
    """Capture output: never echo arbitrary Git, Docker, or provider text."""
    result = subprocess.run(args, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if check and result.returncode:
        raise UpgradeError(label + ' failed (exit ' + str(result.returncode) + ').')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', default='/srv/commons/source')
    parser.add_argument('--target', required=True, help='Full 40-character commit SHA already fetched locally')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if not re.fullmatch(r'[0-9a-fA-F]{40}', args.target):
        raise UpgradeError('Target must be a full 40-character hexadecimal commit SHA.')
    target = args.target.lower()
    source = Path(args.source).resolve(strict=True)
    git = lambda *items, **kw: run(['git', *items], source, 'Git validation', **kw)
    if Path(git('rev-parse', '--show-toplevel').stdout.decode().strip()).resolve() != source:
        raise UpgradeError('Source must be the repository root.')
    head = git('rev-parse', 'HEAD').stdout.decode().strip()
    if git('rev-parse', '--verify', target + '^{commit}').stdout.decode().strip() != target:
        raise UpgradeError('Target is not an exact commit.')
    git('merge-base', '--is-ancestor', head, target)
    if git('diff', '--cached', '--name-only', '-z').stdout:
        raise UpgradeError('Staged changes are not accepted.')
    dirty = [p.decode() for p in git('diff', '--name-only', '-z').stdout.split(b'\0') if p]
    for name in dirty:
        path = source / name
        if name not in ACCEPTED or path.is_symlink() or not path.is_file():
            raise UpgradeError('Unexpected tracked change; inspect the working tree manually.')
        if hashlib.md5(path.read_bytes()).hexdigest() != ACCEPTED[name]:
            raise UpgradeError('Local CPU patch does not match the accepted snapshot.')
    if git('ls-files', '-u').stdout:
        raise UpgradeError('Unmerged files are not accepted.')
    target_files = {p.decode() for p in git('ls-tree', '-r', '--name-only', '-z', target).stdout.split(b'\0') if p}
    # Include ignored files: Git otherwise permits ignored deployment files to be overwritten.
    untracked = {p.decode() for p in git('ls-files', '--others', '-z').stdout.split(b'\0') if p}
    if any(a == b or a.startswith(b + '/') or b.startswith(a + '/') for a in untracked for b in target_files):
        raise UpgradeError('Untracked/ignored files collide with the target tree.')
    if 'deployment/.env' in target_files or any(p.startswith('deployment/secrets/') for p in target_files):
        raise UpgradeError('Target must not track live environment or secret files.')

    def target_text(name):
        if name not in target_files:
            raise UpgradeError('Target is missing a required deployment/assistant file.')
        return git('show', target + ':' + name).stdout.decode()

    requirements = {
        'onprem/model.ts': ['EVIDENCE_LIMIT', 'NUM_PREDICT'],
        'onprem/server.ts': ['EVIDENCE_LIMIT', 'verifyTurnstile', '/api/auth/login', '/healthz', 'createChatService'],
        'onprem/chat-service.ts': ['answerCloud', 'EVIDENCE_LIMIT', 'cloudConfirmed'],
        'deployment/compose.yaml': ['EVIDENCE_LIMIT', 'NUM_PREDICT', 'admin_password'],
        'deployment/compose.turnstile.yaml': ['TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_FILE'],
        'onprem/turnstile.ts': ['siteverify'],
        'lib/cloud-models.ts': ['answerCloud', 'store:false'],
        'lib/model-catalog.ts': ['MODEL_CATALOG', 'PROVIDERS'],
        'deployment/update-onprem.py': ['--apply', '--target', '--ff-only'],
    }
    for name, tokens in requirements.items():
        text = target_text(name)
        if any(token not in text for token in tokens):
            raise UpgradeError('Target lacks required CPU, Turnstile, or assistant support.')
    deployment = source / 'deployment'
    env_file = deployment / '.env'
    if not env_file.is_file():
        raise UpgradeError('Existing deployment/.env is required.')
    protected = {env_file: env_file.read_bytes()}
    secrets = deployment / 'secrets'
    if secrets.exists():
        for path in secrets.rglob('*'):
            if path.is_file():
                try:
                    protected[path] = path.read_bytes()
                except PermissionError:
                    raise UpgradeError('Cannot read an existing secret; run as its owner to preserve it.')
    if not all((secrets / n).is_file() for n in ['admin_password.txt', 'turnstile_secret.txt']):
        raise UpgradeError('Existing admin and Turnstile secret files are required.')
    compose = ['sudo', '-n', 'docker', 'compose', '--project-directory', str(deployment), '--env-file', str(env_file), '-f', str(deployment / 'compose.yaml'), '-f', str(deployment / 'compose.turnstile.yaml')]
    docker = lambda *items, **kw: run(['sudo', '-n', 'docker', *items], source, 'Docker operation (run sudo -v first)', **kw)
    dc = lambda *items, **kw: run([*compose, *items], source, 'Compose operation', **kw)
    dc('config', '--quiet')
    container = dc('ps', '-q', 'app').stdout.decode().strip()
    if not re.fullmatch(r'[0-9a-f]{12,64}', container):
        raise UpgradeError('Expected exactly one running app container.')
    old_image = docker('inspect', '--format', '{{.Image}}', container).stdout.decode().strip()
    original_tag = docker('inspect', '--format', '{{.Config.Image}}', container).stdout.decode().strip()
    if not re.fullmatch(r'sha256:[0-9a-f]{64}', old_image) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._/:@-]*', original_tag):
        raise UpgradeError('Could not safely identify the existing app image.')
    print('Validated pinned fast-forward target, known CPU changes, protected files, and Compose configuration.')
    print('Only the app service will be built and replaced; existing environment bytes and data volumes are preserved.')
    if not args.apply:
        print('DRY RUN: no files, images, or containers changed. Repeat with --apply to upgrade.')
        return

    os.umask(0o077)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    backup = Path.home() / 'commons-backups' / stamp
    backup.mkdir(parents=True, mode=0o700)
    backup.chmod(0o700)
    (backup / 'HEAD').write_text(head + '\n')
    (backup / 'working-tree.patch').write_bytes(git('diff', '--binary', 'HEAD', '--', *ACCEPTED).stdout)
    for name in ACCEPTED:
        dest = backup / 'local-files' / name
        dest.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        dest.write_bytes((source / name).read_bytes())
    hashes = {}
    for path, content in protected.items():
        relative = path.relative_to(source)
        dest = backup / 'protected' / relative
        dest.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        dest.write_bytes(content)
        hashes[str(relative)] = hashlib.sha256(content).hexdigest()
    (backup / 'protected-sha256.json').write_text(json.dumps(hashes, indent=2))
    backup_tag = 'veltrix-app:before-' + stamp.lower()
    docker('tag', old_image, backup_tag)
    (backup / 'image.json').write_text(json.dumps({'oldImage': old_image, 'originalTag': original_tag, 'backupTag': backup_tag}, indent=2))
    print('Private recovery backup: ' + str(backup))
    if dirty:
        git('stash', 'push', '-m', 'Veltrix pre-upgrade ' + stamp, '--', *dirty)
        stash = git('rev-parse', 'refs/stash').stdout.decode().strip()
        (backup / 'stash-ref').write_text(stash + '\n')
        print('Accepted local CPU edits saved in a retained Git stash; target includes their environment support.')
    git('merge', '--ff-only', target)

    def unchanged():
        if any(not path.is_file() or path.read_bytes() != content for path, content in protected.items()):
            raise UpgradeError('Protected environment/secret bytes changed; activation refused.')

    unchanged()
    for name, tokens in requirements.items():
        if any(token not in (source / name).read_text(encoding='utf-8') for token in tokens):
            raise UpgradeError('Checked-out source failed feature verification.')
    dc('config', '--quiet')
    print('Building app image; build output is saved in the private backup directory.', flush=True)
    built = dc('build', 'app', check=False)
    (backup / 'build.log').write_bytes(built.stdout + b'\n' + built.stderr)
    if built.returncode:
        docker('tag', old_image, original_tag)
        raise UpgradeError('App build failed; inspect build.log in the private backup. Existing container was not replaced; original image tag restored. Source remains at target; backup and stash retained.')

    def health():
        dc('exec', '-T', 'app', 'node', '-e', "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))")

    try:
        unchanged()
        dc('up', '-d', '--no-deps', '--no-build', '--wait', '--wait-timeout', '90', 'app')
        health()
        unchanged()
    except (UpgradeError, OSError):
        try:
            docker('tag', old_image, original_tag)
            dc('up', '-d', '--no-deps', '--no-build', '--wait', '--wait-timeout', '90', 'app')
            health()
        except (UpgradeError, OSError):
            raise UpgradeError('Activation failed; automatic image rollback FAILED. Inspect app status manually. Backup and stash retained; source remains at target.') from None
        raise UpgradeError('Activation failed; previous app image restored and internal health passed. Backup and stash retained; source remains at target.') from None
    print('Upgrade activated; internal health passed. Protected environment/secret bytes are unchanged.')
    print('Backup image and stash retained. No inference or paid provider calls were made.')


if __name__ == '__main__':
    try:
        main()
    except (UpgradeError, OSError, UnicodeError) as error:
        # OS messages may contain sensitive paths; operational errors are constants above.
        print('ERROR: ' + (str(error) if isinstance(error, UpgradeError) else 'Local operation failed; inspect permissions and prerequisites.'), file=sys.stderr)
        sys.exit(1)

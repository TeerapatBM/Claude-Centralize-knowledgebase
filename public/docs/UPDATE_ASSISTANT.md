# Update the running on-prem assistant

Run the helper on the existing Linux server as the deployment owner, with Python 3, Git, sudo Docker access, and Docker Compose supporting `--wait`. Push the completed source first. Fetch it on the server and pin the full intended commit SHA. Never run a helper from an unreviewed branch or paste secrets into commands.

`deployment/update-onprem.py` defaults to a read-only dry run. `--apply` explicitly enables changes. `--source` defaults to `/srv/commons/source`; `--target` must be an already-fetched full 40-character commit SHA. The current checkout must be an ancestor of that target. The helper refuses staged changes, conflicts, unexpected tracked edits, unknown versions of the three known CPU patches, and untracked/ignored files that collide with the target.

Before activation it requires CPU environment support (`EVIDENCE_LIMIT`, `NUM_PREDICT`), Turnstile login verification, cloud assistant files, and the upgrade helper in the pinned target. It uses both absolute Compose files, the absolute existing `deployment/.env`, and the deployment directory as Compose project directory. Existing `.env` bytes—including `COMMONS_HOST`, API settings and `EVIDENCE_LIMIT=5` / `NUM_PREDICT=512` when already configured—are preserved exactly. Existing secret files are backed up privately and checked byte-for-byte. The helper never edits environment files, rotates credentials, downloads models, resets Git, or deletes data volumes.

On apply, a mode-700 directory under `~/commons-backups/<UTC timestamp>` contains the old HEAD, binary tracked patch, snapshots of the three local CPU files, environment/secret bytes and SHA-256 hashes, old image identity, a private `build.log`, and retained stash SHA when local changes existed. This backup contains credentials; keep it private. Git stashes and backup images are retained for manual recovery. The new source includes the CPU changes, so the old local patch is not reapplied.

The helper records the running app image, tags a recovery image, fast-forwards source, validates Compose without printing configuration, and builds the app before replacing any container. A build failure leaves the running app untouched and restores the original image tag. Activation only runs `up` for `app`, with no dependency recreation and no build, waits up to 90 seconds, then checks `/healthz` from inside the container using Node. Activation failure restores the previous app image and checks its health. Rollback success or failure is explicitly reported. The source checkout remains at the target even after an image rollback; backup and stash stay available. Inspect failures before retrying.

No provider inference or paid calls are used by deployment health checks. Provider response tests use injected mock fetch responses; these validate request/response handling rather than live account access. A successful internal health check confirms the HTTP service is running; it does not prove external DNS, TLS, Turnstile credentials, model readiness, or provider quota.

After pushing the completed source to `origin/main`, this is one command block for the existing server. It fetches and resolves `origin/main` once to a full pinned SHA. The helper itself does not fetch or modify anything in dry-run mode. The temporary helper is read from the same pinned commit that will be deployed. `sudo -v` authenticates visibly before the helper uses noninteractive `sudo -n`. `&&` ensures apply cannot run when validation fails. The trap removes only that temporary helper when the shell exits.

```bash
set -euo pipefail
SOURCE=/srv/commons/source
sudo -v
git -C "$SOURCE" fetch origin
TARGET_SHA=$(git -C "$SOURCE" rev-parse --verify 'origin/main^{commit}')
HELPER=$(mktemp /tmp/veltrix-update.XXXXXXXX.py)
trap 'rm -f -- "$HELPER"' EXIT
git -C "$SOURCE" show "$TARGET_SHA:deployment/update-onprem.py" > "$HELPER"
python3 "$HELPER" --source "$SOURCE" --target "$TARGET_SHA" &&
python3 "$HELPER" --source "$SOURCE" --target "$TARGET_SHA" --apply
```

The command intentionally has no `git pull`, stash pop, reset, broad environment dump, or destructive cleanup. If preflight rejects a working tree, inspect it manually and preserve the recovery artifacts rather than bypassing the checks.

## Runtime permissions and activation diagnostics

The backup writer creates individual recovery files with mode `0600` inside private directories. It never changes the process-wide umask, so Git checkout cannot accidentally inherit a backup-only permission policy. The final Docker stage explicitly normalizes application directories under `/app` to `0755` and files to `0644`, then imports the server as the actual `node` runtime user during the build. This does not change `/data` or mounted secrets under `/run/secrets`. Application code remains root-owned and is readable by the non-root runtime.

If activation fails, the recovery directory now retains `candidate-image.txt`, `activation.log` and `failed-app.log` before replacing the failed container. The candidate image also has a `veltrix-app:candidate-<timestamp>` tag for isolated diagnosis. Logs are private recovery files; do not publish them without reviewing their contents. The previous image is still restored and checked as before.

Regression checks: `python3 -m unittest discover -s tests -p test_update_permissions.py`. On POSIX this checks actual private-file permissions and umask preservation; on Windows it additionally guards against any attempt by the backup writer to modify umask, since Windows does not implement POSIX umask behavior. The non-root Docker import check runs on the deployment's real Linux image during build.

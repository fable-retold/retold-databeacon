# Building and Publishing

How to ship `retold-databeacon` to npm and to GitHub Container Registry
(GHCR), and how to consume the published image. This doc is the template
the other dockerized retold tools follow — the structure is identical
across modules, only the module-specific details (image name, env vars,
port, lifecycle shape) differ.

---

## TL;DR

```bash
# npm-only release (the default — most common case)
npm run release:patch

# npm release that ALSO rebuilds the GHCR image
npm run release:patch:image
```

The default release is npm-only. Docker images are deliberate, opt-in
artifacts because each multi-arch build burns several minutes of CI
time. Use `:image` (or set `BUILD_DOCKER=1`) when you actually want a
new image — typically when runtime code, dependencies, env-var contract,
or the Dockerfile changed. For a doc-only fix or internal-only patch,
the plain `release:patch` ships to npm and skips the image rebuild.

---

## Prerequisites (one-time setup)

- **npm login** — `npm whoami` should print your username. If not,
  `npm login`.
- **Git remote configured** — `git remote get-url origin` should print
  the GitHub HTTPS or SSH URL. If not, `git remote add origin
  git@github.com:fable-retold/retold-databeacon.git`.
- **Push access to the repo** — required so `postversion` /
  `postpublish` can push the tag. The GHCR workflow runs under
  `GITHUB_TOKEN` so no extra registry auth needed for image pushing.
- **Docker** (only if you want to test the image locally before tag) —
  `docker version` should respond.

---

## Ecosystem convention: lockfiles are gitignored

`package-lock.json` is in this repo's `.gitignore` (Quackage convention
shared across the retold ecosystem). That has two consequences for the
Dockerfile and the publish pipeline that are worth knowing:

- **The Dockerfile uses `npm install`, not `npm ci`.** `npm ci` requires
  `package-lock.json` to be present in the build context, and CI runners
  check out only what's in git. Switching to `npm ci` will fail every
  GHCR build with `EUSAGE: The npm ci command can only install with an
  existing package-lock.json`.
- **Builds resolve dep ranges fresh each time.** The tradeoff vs. a
  pinned `npm ci` build is reproducibility — two builds of the same git
  SHA can pick up different transitive versions if anything in the
  range bumps. Acceptable for retold modules because the upstream
  ranges are owned by the same author; for stricter reproducibility,
  the alternative is to commit the lockfile (and revert the
  ecosystem-wide convention here).

If you see `npm ci` errors in the GHCR workflow logs, the fix is always
the same: change `RUN npm ci` to `RUN npm install` in the Dockerfile.

---

## Releasing

### Two flavors of release

| Command                              | npm registry | GHCR image rebuild |
|--------------------------------------|--------------|--------------------|
| `npm run release:patch`              | yes          | no                 |
| `npm run release:patch:image`        | yes          | yes                |
| `npm run release:minor`              | yes          | no                 |
| `npm run release:minor:image`        | yes          | yes                |
| `npm run release:major`              | yes          | no                 |
| `npm run release:major:image`        | yes          | yes                |

The non-`:image` variants are the default because most patch releases
don't change runtime behavior; the `:image` variants tell the pipeline
"this release does change runtime — build me a new image."

### What `release:patch` does (no docker)

1. **`npm version patch`** — bumps `package.json`, creates a commit
   (`0.0.18`), creates a local tag `v0.0.18`.
2. **`postversion`** hook fires — `git push` pushes the commit. The
   tag stays local (intentional — no tag push means no GHCR trigger).
3. **`npm publish`** runs — `prepublishOnly` runs `npm test` first as
   the gate. If tests fail, publish aborts.
4. **`postpublish`** hook fires — checks `BUILD_DOCKER`; unset, so it
   does nothing.

End state: npm has the new version, git has the bump commit, the
`v0.0.18` tag exists locally only, no GHCR build was triggered.

### What `release:patch:image` does (with docker)

Same as above, except `npm publish` runs with `BUILD_DOCKER=1` in the
environment. The `postpublish` hook sees the flag and pushes the
`v0.0.18` tag to the remote, which fires the GHCR workflow.

### Promoting a previous npm release to docker later

If you released `v0.0.18` to npm only, then later decide you do want a
docker image for it:

```bash
git push origin v0.0.18    # pushes the local tag → GHCR fires
```

The local tag is still sitting there from the original `npm version`
step. Pushing it triggers the workflow without touching npm.

### Direct CLI publish (also works)

```bash
# already-bumped, want to publish to npm only (default):
npm publish

# already-bumped, want to publish to npm AND build docker:
npm run publish:docker
# or equivalently:
BUILD_DOCKER=1 npm publish
```

### From `retold-manager` TUI

- `[!]` Publish — npm only. Existing key, behavior unchanged.
- `[D]` Publish with docker image — npm + GHCR build. New key.

---

## The chain

The lifecycle hooks all live in `package.json`. Default path
(`BUILD_DOCKER` unset):

```
npm publish
  ↓
prepublishOnly: npm test                       ← test gate
  ↓ (passes)
publish to npm registry
  ↓ (succeeds)
postpublish: BUILD_DOCKER unset → no-op        ← image NOT triggered
```

Docker-included path (`BUILD_DOCKER=1`):

```
BUILD_DOCKER=1 npm publish    (or: npm run publish:docker)
  ↓
prepublishOnly: npm test                       ← test gate
  ↓ (passes)
publish to npm registry
  ↓ (succeeds)
postpublish: BUILD_DOCKER=1 → tag + push       ← image trigger
  git tag v<version>                           ← creates if not present
  git push origin v<version>
  ↓ (tag arrives at GitHub)
.github/workflows/publish-image.yml fires:
  - docker buildx build --platform linux/amd64,linux/arm64
  - docker push ghcr.io/fable-retold/retold-databeacon:<version>
  - tags: <version>, <major>.<minor>, <major>, latest
```

The `release:patch` (no docker) and `release:patch:image` (docker)
scripts both wrap this with a preceding `npm version patch` so you
don't have to bump separately.

---

## Verifying a release

After `release:patch` completes:

1. **npm**: `npm view retold-databeacon version` should print the new
   version (may take ~30s for the registry to update).
2. **GHCR workflow**: visit
   `https://github.com/fable-retold/retold-databeacon/actions` and
   confirm the "Publish container image" run succeeded.
3. **Image**: `docker pull ghcr.io/fable-retold/retold-databeacon:<version>`
   should succeed. The image is also tagged as `latest`, `<major>`, and
   `<major>.<minor>`.
4. **Smoke test**:
   ```bash
   docker run --rm -p 8389:8389 \
     ghcr.io/fable-retold/retold-databeacon:latest
   curl http://localhost:8389/beacon/ultravisor/status
   ```

---

## Recovery patterns

### Tests fail during `prepublishOnly`

Publish aborts cleanly — npm registry is untouched, no tag is pushed.
Fix the test, then re-run `npm publish` (the version is already bumped
from the earlier `npm version` step, so don't re-bump).

### `npm publish` succeeded but GHCR build didn't start

Usually means the tag push failed silently (network blip during
`postpublish`). Verify:

```bash
git tag --list 'v*' | tail -5             # is the tag local?
git ls-remote --tags origin | tail -5     # is the tag on the remote?
```

If local but not remote, push manually:
```bash
git push origin v<version>
```

The GHCR workflow triggers on tag push, so this re-fires the build with
no other side effects.

### GHCR build failed

Check the workflow logs in the Actions tab. Common failures: Dockerfile
issue, dependency that doesn't install on the build platform, GHCR
permission issue (rare; `GITHUB_TOKEN` should always have
`packages: write`). Re-run the workflow from the Actions UI after
fixing — no need to bump the npm version.

### Need to re-publish at a different commit

The version-tag-to-commit binding is sticky. To re-publish `v0.0.16`
pointing at a different commit:

```bash
# remove old tag locally and remotely
git tag -d v0.0.16
git push origin :refs/tags/v0.0.16

# unpublish from npm if within the 72h window
npm unpublish retold-databeacon@0.0.16

# then re-run release at the new commit
npm run release:patch
```

`npm unpublish` is rate-limited and discouraged in general — better
practice is to bump to a new patch version and ship that.

---

## Versioning conventions

Standard semver:
- **patch** (`0.0.15` → `0.0.16`) — bug fixes, internal cleanup, anything
  that doesn't change the public API or behavior contract.
- **minor** (`0.0.15` → `0.1.0`) — additive features, new env vars, new
  endpoints. Existing consumers continue to work.
- **major** (`0.0.15` → `1.0.0`) — breaking changes (env var renamed,
  endpoint removed, default behavior changed). Bump and document in
  CHANGELOG.

GHCR images are tagged with all three tiers (`<version>`,
`<major>.<minor>`, `<major>`, `latest`), so consumers can pin at
whatever stability level fits.

---

## Image consumption

### Pull and run

```bash
docker pull ghcr.io/fable-retold/retold-databeacon:latest

docker run -d --name databeacon \
  -p 8389:8389 \
  -v $(pwd)/data:/app/data \
  -e DATABEACON_ULTRAVISOR_URL=http://your-ultravisor:54321 \
  -e DATABEACON_BEACON_NAME=my-databeacon \
  -e DATABEACON_BEACON_PASSWORD_FILE=/run/secrets/uv-pass \
  ghcr.io/fable-retold/retold-databeacon:latest
```

### Configuration via env vars

All `DATABEACON_*` env vars are read at startup. CLI flags override env
vars; env vars override JSON config; JSON config overrides built-in
defaults.

| Variable                       | Purpose                                              |
|--------------------------------|------------------------------------------------------|
| `DATABEACON_PORT`              | Listen port (default 8389)                           |
| `DATABEACON_DB_PATH`           | SQLite file location                                 |
| `DATABEACON_LOG_PATH`          | Log file path (also logs to stdout regardless)       |
| `DATABEACON_MODE`              | `server` or `client`                                 |
| `DATABEACON_CONFIG_FILE`       | Path to JSON config to merge in                      |
| `DATABEACON_ULTRAVISOR_URL`    | If set, auto-connect to UV on startup                |
| `DATABEACON_BEACON_NAME`       | Name to register with (default `retold-databeacon`)  |
| `DATABEACON_BEACON_PASSWORD`   | Auth password for the UV beacon connection           |
| `DATABEACON_MAX_CONCURRENT`    | Max concurrent work items (default 3)                |

Any secret-bearing var also accepts `<NAME>_FILE` pointing at a file
whose contents become the value (mysql/postgres convention). Use this
for docker secret + k8s Secret mounts:

```bash
-e DATABEACON_BEACON_PASSWORD_FILE=/run/secrets/databeacon
```

### Volumes

- `/app/data` — SQLite database + any persisted state. Mount this if
  you want the beacon's state to survive container restarts.

### Healthcheck

The image declares its own `HEALTHCHECK` against
`/beacon/ultravisor/status`. Compose's `service_healthy` and k8s
readiness probes work out of the box.

---

## Module-specific notes

- **Long-running service shape**: this image is for a daemon that stays
  up. Restart policy in compose / k8s should be `unless-stopped` or
  equivalent.
- **Single port (8389)** for both REST API and the web UI.
- **Web UI** at `/` is served from the same port; useful for ad-hoc
  introspection of the beacon's connections and registered endpoints.

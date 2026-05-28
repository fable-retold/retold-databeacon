# Stage 1: Build
#
# Pure JS — no apt-get / build-essential / python3. The runtime tree
# has zero native bindings because:
#   - meadow-connection-sqlite uses node:sqlite (Node 22.5+ built-in)
#   - meadow-connection-mssql / mysql / postgresql are pure JS
#   - meadow-connection-rocksdb / mongo / solr are in optionalDependencies
#     and skipped via --omit=optional
#   - dtrace-provider (restify optionalDep, native) skipped same way
# meadow-connection-manager loads providers lazily via require.resolve()
# in try/catch (Meadow-ConnectionManager.js:75), so missing optional
# providers degrade gracefully at runtime — a deployment that needs
# RocksDB (etc.) can `npm install --include=optional` separately.
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
# `npm install`, not `npm ci` — this ecosystem's Quackage convention
# is to gitignore package-lock.json, so `ci` (which requires the
# lockfile in the build context) cannot work in CI.
# `--ignore-scripts` because devDeps (puppeteer especially) carry
# postinstall scripts (chromium download) we don't want during image
# build.
# `--omit=optional` skips the native optional deps; without this,
# `npm install` AND `npm prune` both re-pull rocksdb/mongo/solr.
# `--legacy-peer-deps` retained for backward compat with npm 7's
# stricter peer-dep conflict detection on this repo's older trees.
RUN npm install --ignore-scripts --omit=optional --legacy-peer-deps
COPY .quackage.json ./
COPY source/ source/
COPY bin/ bin/
COPY model/ model/
# Build the Pict web app bundle (pure JS — no native compile needed).
RUN npx quack build
# Copy pict.min.js into the web folder for offline serving
RUN cp node_modules/pict/dist/pict.min.js source/services/web-app/web/pict.min.js 2>/dev/null || true
# Strip devDeps + optional deps before copying to Stage 2. Critical
# to pass --omit=optional here too — `npm prune` re-resolves the dep
# tree and without it will re-add the optional deps we just skipped.
RUN npm prune --omit=dev --omit=optional --ignore-scripts --legacy-peer-deps

# Stage 2: Runtime
FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/source/ source/
COPY --from=builder /app/bin/ bin/
COPY --from=builder /app/model/ model/

# Create data directory for SQLite persistence
RUN mkdir -p /app/data

EXPOSE 8389

VOLUME ["/app/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD node -e "const h=require('http');h.get('http://localhost:8389/beacon/ultravisor/status',(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

CMD ["node", "bin/retold-databeacon.js", "serve"]

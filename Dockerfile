# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
# `npm install`, not `npm ci` — this ecosystem's Quackage convention
# is to gitignore package-lock.json, so `ci` (which requires the
# lockfile in the build context) cannot work in CI. The tradeoff is
# that builds resolve dep ranges fresh each time rather than from a
# pinned tree; acceptable for retold modules where the upstream
# ranges are owned by the same author.
# `--legacy-peer-deps` because meadow-connection-manager declares
# meadow-connection-rocksdb as `peerOptional` and npm 7+ reports a
# false-positive conflict when rocksdb isn't installed (the optional
# peer is, in practice, optional).
RUN npm install --legacy-peer-deps
COPY .quackage.json ./
COPY source/ source/
COPY bin/ bin/
COPY model/ model/
# Build the Pict web app bundle
RUN npx quack build
# Copy pict.min.js into the web folder for offline serving
RUN cp node_modules/pict/dist/pict.min.js source/services/web-app/web/pict.min.js 2>/dev/null || true

# Stage 2: Runtime
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
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

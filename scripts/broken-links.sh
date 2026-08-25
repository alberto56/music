#!/usr/bin/env bash
# Builds the site, serves it locally (respecting the /music/ base path), and
# crawls it with linkinator to find broken internal and external links.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

PORT="${BROKEN_LINKS_PORT:-4322}"
BASE_URL="http://localhost:${PORT}/music/"

echo "Building site..."
npx astro build

cleanup() {
  npx astro preview stop >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Starting preview server on port ${PORT}..."
npx astro preview --port "${PORT}" --background

echo "Waiting for preview server to be ready..."
for _ in $(seq 1 30); do
  if curl -s -o /dev/null "${BASE_URL}"; then
    break
  fi
  sleep 0.5
done

echo "Checking for broken links..."
npx linkinator "${BASE_URL}" --recurse --timeout 10000 "$@"

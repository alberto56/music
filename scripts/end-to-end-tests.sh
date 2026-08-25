#!/usr/bin/env bash
# Builds the site, serves it locally (respecting the /music/ base path), and
# runs the Playwright end-to-end test suite against it.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

PORT="${E2E_PORT:-4323}"
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

echo "Running end-to-end tests..."
PLAYWRIGHT_PORT="${PORT}" npx playwright test "$@"

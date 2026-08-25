#!/usr/bin/env bash
# Fails if any tracked or untracked (non-ignored) file contains a tab character.
# This project uses two spaces for indentation, never tabs.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "Checking for tabs..."

matches="$(git ls-files --cached --others --exclude-standard -z \
  | xargs -0 grep -InF "$(printf '\t')" -- 2>/dev/null || true)"

if [ -n "${matches}" ]; then
  echo "${matches}"
  echo
  echo "Found tab characters. Use two spaces for indentation instead."
  exit 1
fi

echo "No tabs found."

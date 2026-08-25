#!/usr/bin/env bash
# Builds the site and validates the generated HTML output.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "Building site..."
npx astro build

echo "Validating HTML..."
npx html-validate "dist/**/*.html" "$@"

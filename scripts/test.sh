#!/usr/bin/env bash
set -e
./scripts/broken-links.sh
./scripts/end-to-end-tests.sh
./scripts/no-tabs.sh
./scripts/validate-html.sh
cat ./ascii-art/ship/ship.txt
echo "All tests passed successfully!"

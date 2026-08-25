#!/usr/bin/env bash
./scripts/broken-links.sh
./scripts/end-to-end-tests.sh
cat ./ascii-art/ship/ship.txt
echo "All tests passed successfully!"

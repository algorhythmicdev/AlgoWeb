#!/usr/bin/env bash
set -euo pipefail

if [ ! -f "package.json" ]; then
  echo "This script must be run from the repository root containing package.json." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but was not found on PATH. Install Node.js (>=18) which includes npm." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but was not found on PATH. Install Node.js (>=18)." >&2
  exit 1
fi

if [ -n "${CI:-}" ]; then
  npm ci
else
  npm install
fi

if [ "${RUN_VALIDATION:-0}" = "1" ]; then
  npm run build
  npm run test
else
  echo "Skipping build and test steps. Set RUN_VALIDATION=1 to enable them after addressing known build issues." >&2
fi

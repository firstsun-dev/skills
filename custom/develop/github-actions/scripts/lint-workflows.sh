#!/usr/bin/env bash
# Lints .github/workflows/*.yml with actionlint, downloading a pinned
# binary into .cache/ if it isn't already on PATH.
set -euo pipefail

ACTIONLINT_VERSION="1.7.12"
CACHE_DIR=".cache/actionlint"
BIN="$CACHE_DIR/actionlint"

if command -v actionlint >/dev/null 2>&1; then
  BIN="actionlint"
elif [ ! -x "$BIN" ]; then
  mkdir -p "$CACHE_DIR"
  bash <(curl -sL https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash) "$ACTIONLINT_VERSION" "$CACHE_DIR"
fi

if [ ! -d ".github/workflows" ]; then
  echo "No .github/workflows directory found in $(pwd)" >&2
  exit 1
fi

"$BIN" -color .github/workflows/*.yml

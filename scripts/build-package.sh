#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="$REPO_DIR/packages/pm2-dashboard"

echo "Building API..."
pnpm --filter @pm2-dashboard/shared run build
pnpm --filter @pm2-dashboard/api run build

echo "Building Web..."
pnpm --filter @pm2-dashboard/web run build

echo "Assembling package..."
rm -rf "$PACKAGE_DIR/dist"
mkdir -p "$PACKAGE_DIR/dist/api"
mkdir -p "$PACKAGE_DIR/dist/web"

cp -r "$REPO_DIR/apps/api/dist/." "$PACKAGE_DIR/dist/api/"
cp -r "$REPO_DIR/apps/web/dist/." "$PACKAGE_DIR/dist/web/"

cp "$REPO_DIR/LICENSE" "$PACKAGE_DIR/LICENSE"
cp "$REPO_DIR/README.md" "$PACKAGE_DIR/README.md"

echo "Done. Package ready at: $PACKAGE_DIR"

#!/bin/sh
set -e

echo "▶ Running admin seed..."
node dist/seed-admin.js

echo "▶ Starting backend..."
exec node dist/main

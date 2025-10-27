#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Please install pnpm: https://pnpm.io/installation" && exit 1
fi

cp -n .env.example .env || true
pnpm install
npx prisma migrate dev --name init
pnpm dev

# usage: bash scripts/setup.sh

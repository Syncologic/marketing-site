#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[dev-local] Stopping Supabase..."
npx --yes supabase stop || true

echo "[dev-local] Stopping Redis + SRH..."
docker compose -f scripts/docker-compose.local.yml down

echo "[dev-local] Stopped."

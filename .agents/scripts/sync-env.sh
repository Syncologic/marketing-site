#!/usr/bin/env bash
# Sync local env files from the main checkout into a worktree.
# Usage: .agents/scripts/sync-env.sh <worktree-path>
set -euo pipefail

target="${1:-}"
if [[ -z "$target" || ! -d "$target" ]]; then
  echo "Usage: $0 <worktree-path>"
  exit 2
fi

# First entry in `git worktree list` is the main checkout
main=$(git worktree list --porcelain | awk '/^worktree/{print $2; exit}')

if [[ ! -f "$main/.env" ]]; then
  echo "ERROR: $main/.env does not exist."
  echo "Run from the main checkout:  cp .env.example .env"
  echo "Then fill Supabase / Resend / KV / Waitlist secrets per the"
  echo "comments in .env.example."
  exit 1
fi

for f in .env .env.local .env.production; do
  if [[ -f "$main/$f" ]]; then
    cp "$main/$f" "$target/"
    echo "synced $f → $target/"
  fi
done

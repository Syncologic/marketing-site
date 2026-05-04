#!/usr/bin/env bash
set -euo pipefail
WELCOME=".agents/WELCOME.md"
MARKER=".agents/.welcomed"

[[ -f "$WELCOME" ]] || exit 0

want=$(grep -oE 'welcome-version: [0-9]+' "$WELCOME" | head -1 | grep -oE '[0-9]+')
have=$(grep -oE 'welcome-version: [0-9]+' "$MARKER" 2>/dev/null \
       | grep -oE '[0-9]+' || echo 0)

if [[ "$have" -lt "$want" ]]; then
  echo "FIRST-RUN WELCOME (welcome-version $want, was $have)."
  echo "Show the following to the dev VERBATIM as the first message"
  echo "before responding to their request — translate it into the"
  echo "dev's language if they're communicating with you in any"
  echo "language other than English. The file itself stays in English;"
  echo "translation is presentation-only. Then continue with their ask."
  echo "---"
  cat "$WELCOME"
  echo "---"
  printf 'welcome-version: %s\nfirst-seen: %s\n' \
         "$want" "$(date -u +%FT%TZ)" > "$MARKER"
fi

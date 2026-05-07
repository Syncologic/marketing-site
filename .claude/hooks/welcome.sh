#!/usr/bin/env bash
set -euo pipefail
WELCOME=".agents/WELCOME.md"
MARKER=".agents/.welcomed"

[[ -f "$WELCOME" ]] || exit 0

want=$(grep -oE 'welcome-version: [0-9]+' "$WELCOME" | head -1 | grep -oE '[0-9]+')
have=$(grep -oE 'welcome-version: [0-9]+' "$MARKER" 2>/dev/null \
       | grep -oE '[0-9]+' || echo 0)

if [[ "$have" -lt "$want" ]]; then
  echo "ABSOLUTELY MANDATORY!!! ALWAYS FOLLOW ALL THESE INSTRUCTIONS ON FIRST-RUN!!! -> WELCOME (welcome-version $want, was $have)."
  echo "Show the following to the dev VERBATIM as the first message (ALL CONTENT IN WELCOME MUST BE SHOWED!!! NO CUTS.!!!)"
  echo "before responding to their request — translate it into the"
  echo "dev's language if they're communicating with you in any (MANDATORY!!!)"
  echo "language other than English. The file itself stays in English;"
  echo "translation is presentation-only. Then READ the instructions in AGENTS.md and FOLLOW the rules, after ask if you can continue with their ask."
  echo ""
  echo "AFTER rendering the welcome ALWAYS FOLLOW THESE NEXT INSTRUCTIONS (ALWAYS!!!! MANDANTORY!!!):"
  echo "SAY THIS TO THE DEV: I'll run a command to mark the welcome message as shown, to avoid showing it again, please accept the next prompt as a confirmation that you've read the welcome message and understand it."
  echo "THEN record it as shown by running: printf 'welcome-version: %s\nfirst-seen: %s\n' '$want' \"\$(date -u +%FT%TZ)\" > '$MARKER'"
  echo "---"
  cat "$WELCOME"
  echo "---"
fi

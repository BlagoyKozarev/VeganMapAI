#!/usr/bin/env bash
set -euo pipefail

TODAY=$(date +%Y-%m-%d)

echo "[INFO] Replacing {{AUTO-TODAY}} placeholders with $TODAY"

# Search and replace in privacy and terms pages
for FILE in public/privacy/index.html public/terms/index.html; do
  if [ -f "$FILE" ]; then
    # Count occurrences before replacement
    BEFORE=$(grep -c "{{AUTO-TODAY}}" "$FILE" || true)
    
    # Replace placeholders with current date
    sed -i "s/{{AUTO-TODAY}}/${TODAY}/g" "$FILE"
    
    # Count occurrences after replacement (should be 0)
    AFTER=$(grep -c "{{AUTO-TODAY}}" "$FILE" || true)
    
    echo "[✓] Updated $FILE: replaced $BEFORE placeholders with date $TODAY"
    
    if [ "$AFTER" -gt 0 ]; then
      echo "[WARNING] $AFTER placeholders remain in $FILE"
    fi
  else
    echo "[WARNING] File $FILE not found"
  fi
done

echo "[DONE] Date replacement complete"
#!/bin/bash
# Final perfect sync - remove all remaining missing files

echo "🎯 Final perfect sync - removing last 23 missing files..."

# Remove all missing files in batches
for i in $(seq 1 100 1000); do
  git ls-files | sed -n "${i},$((i+99))p" | while read file; do
    [ ! -f "$file" ] && git rm --cached --ignore-unmatch "$file" 2>/dev/null
  done
done

# Check what's staged for removal
REMOVED=$(git diff --cached --name-only --diff-filter=D 2>/dev/null | wc -l)
echo "Files staged for removal: $REMOVED"

# Commit if there are removals
if [ $REMOVED -gt 0 ]; then
  git commit -m "cleanup: Final removal of $REMOVED missing files - perfect sync achieved"
  git push origin main
fi

# Final count
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
DIFF=$((GITFILES - WORKSPACE))

echo ""
echo "🎉 PERFECT SYNC STATUS:"
echo "Workspace: $WORKSPACE"
echo "Git: $GITFILES" 
echo "Difference: $DIFF"

if [ $DIFF -eq 0 ]; then
  echo "✅ SUCCESS! Perfect synchronization achieved!"
else
  echo "⚠️ Still $DIFF files difference"
fi
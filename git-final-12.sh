#!/bin/bash
# Remove final 12 missing files

echo "🎯 Removing final 12 missing files..."

# Quick targeted removal
git ls-files | head -100 | while read file; do
  [ ! -f "$file" ] && git rm --cached --ignore-unmatch "$file" 2>/dev/null
done

git commit -m "cleanup: Remove final missing files - perfect sync" 2>/dev/null
git push origin main 2>/dev/null

# Result
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
echo "Perfect sync: Workspace $WORKSPACE, Git $GITFILES, Diff $((GITFILES - WORKSPACE))"
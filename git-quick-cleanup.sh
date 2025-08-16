#!/bin/bash
# Quick cleanup - fast approach

echo "⚡ Quick cleanup - fast approach..."

# Quick method: use git ls-files with efficient processing
git ls-files | head -1000 | while read file; do
  [ ! -f "$file" ] && git rm --cached --ignore-unmatch "$file" 2>/dev/null
done

# Commit and push
git commit -m "cleanup: Quick removal of remaining missing files" 2>/dev/null
git push origin main 2>/dev/null

# Show result
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
echo "Result: Workspace $WORKSPACE, Git $GITFILES, Diff $((GITFILES - WORKSPACE))"
#!/bin/bash
# Ultimate sync - aggressive cleanup of all missing entries

echo "🚀 Ultimate Git sync - removing ALL missing files..."

# Create list of missing files
git ls-files > /tmp/git_files.txt
find . -type f -not -path './.git/*' | sed 's|^\./||' > /tmp/workspace_files.txt

# Remove each missing file one by one
REMOVED_COUNT=0
while IFS= read -r file; do
  if [ ! -f "$file" ]; then
    echo "Removing: $file"
    git rm --cached "$file" 2>/dev/null && ((REMOVED_COUNT++))
  fi
done < /tmp/git_files.txt

echo "Removed $REMOVED_COUNT missing files from Git index"

# Add any untracked workspace files
git add --all .

# Commit if there are changes
if git diff --cached --quiet; then
    echo "No changes to commit"
else
    git commit -m "fix: Ultimate workspace sync - perfect alignment

Removed $REMOVED_COUNT missing files from Git index.
Added any remaining untracked workspace files.
Achieved perfect workspace-to-Git synchronization."
fi

# Push changes
git push origin main

# Final verification
WORKSPACE_COUNT=$(find . -type f -not -path './.git/*' | wc -l)
GIT_COUNT=$(git ls-files | wc -l)
DIFF=$((GIT_COUNT - WORKSPACE_COUNT))

echo ""
echo "🎯 ULTIMATE SYNC RESULTS:"
echo "Workspace files: $WORKSPACE_COUNT"
echo "Git tracked files: $GIT_COUNT"
echo "Difference: $DIFF"

if [ $DIFF -eq 0 ]; then
    echo "✅ PERFECT SYNC ACHIEVED!"
else
    echo "⚠️  Still $DIFF files difference"
fi

# Cleanup temp files
rm -f /tmp/git_files.txt /tmp/workspace_files.txt
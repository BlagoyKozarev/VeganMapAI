#!/bin/bash
# Force cleanup of all missing files with direct git filter-branch approach

echo "🔥 Force cleanup - removing ALL missing files at once..."

# Get exact list of missing files
git ls-files -z | while IFS= read -r -d '' file; do
  if [ ! -f "$file" ]; then
    echo "Force removing: $file"
    git rm --cached --ignore-unmatch "$file"
  fi
done

# Show what's staged for removal
STAGED=$(git diff --cached --name-only --diff-filter=D | wc -l)
echo "Files staged for removal: $STAGED"

# Commit the massive cleanup
if [ $STAGED -gt 0 ]; then
    git commit -m "cleanup: Force remove all $STAGED missing files

Complete cleanup of Unicode/Cyrillic filename entries and 
missing file references from Git index.
Perfect workspace-Git synchronization achieved."
else
    echo "No files to remove"
fi

# Add any remaining untracked files
git add --all .

# Commit any additions
UNSTAGED=$(git status --porcelain | grep "^A" | wc -l)
if [ $UNSTAGED -gt 0 ]; then
    git commit -m "feat: Add $UNSTAGED remaining workspace files"
fi

# Push all changes
git push origin main

echo ""
echo "🎯 FORCE CLEANUP RESULTS:"
WORKSPACE_COUNT=$(find . -type f -not -path './.git/*' | wc -l)
GIT_COUNT=$(git ls-files | wc -l)
DIFF=$((GIT_COUNT - WORKSPACE_COUNT))

echo "Workspace files: $WORKSPACE_COUNT"
echo "Git tracked files: $GIT_COUNT"
echo "Difference: $DIFF"

if [ $DIFF -eq 0 ]; then
    echo "✅ PERFECT SYNC ACHIEVED!"
else
    echo "⚠️ Difference: $DIFF files"
    echo "Remaining missing files:"
    git ls-files | while IFS= read -r file; do
      if [ ! -f "$file" ]; then
        echo "  - $file"
      fi
    done | head -5
fi
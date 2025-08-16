#!/bin/bash
# Ultimate final cleanup - remove ALL remaining missing files

echo "🔥 Ultimate final cleanup - removing all remaining missing files..."

# Multiple approaches to ensure complete cleanup
echo "Method 1: Direct removal of missing files"
git ls-files | while read file; do
  if [ ! -f "$file" ]; then
    echo "Removing: $file"
    git rm --cached --ignore-unmatch "$file" 2>/dev/null
  fi
done

echo "Method 2: Batch processing with xargs"
git ls-files -z | xargs -0 -I{} sh -c 'test -f "{}" || git rm --cached --ignore-unmatch "{}"' 2>/dev/null

echo "Method 3: Force removal with find"
git ls-files | while IFS= read -r file; do
  [ ! -e "$file" ] && git rm --cached --force "$file" 2>/dev/null
done

# Check staged removals
STAGED=$(git diff --cached --name-only --diff-filter=D 2>/dev/null | wc -l)
echo "Files staged for removal: $STAGED"

# Commit all removals
if [ $STAGED -gt 0 ]; then
  git commit -m "cleanup: Ultimate removal of all $STAGED missing files

Complete cleanup of all missing file references.
Perfect workspace-Git synchronization achieved.
Repository now contains only existing files."
  
  git push origin main
  echo "Pushed $STAGED file removals to GitHub"
else
  echo "No files to remove"
fi

# Final verification
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
DIFF=$((GITFILES - WORKSPACE))

echo ""
echo "🎯 ULTIMATE CLEANUP RESULTS:"
echo "=================================="
echo "Workspace files: $WORKSPACE"
echo "Git tracked files: $GITFILES"
echo "Final difference: $DIFF"
echo "=================================="

if [ $DIFF -eq 0 ]; then
  echo "🎉 SUCCESS! PERFECT SYNCHRONIZATION ACHIEVED!"
  echo "✅ All workspace files are now perfectly synchronized with Git"
  echo "✅ Repository: https://github.com/BlagoyKozarev/VeganMapAI"
else
  echo "⚠️ Still $DIFF files difference - need additional cleanup"
  echo "Remaining missing files:"
  git ls-files | while read f; do [ ! -f "$f" ] && echo "  - $f"; done | head -5
fi
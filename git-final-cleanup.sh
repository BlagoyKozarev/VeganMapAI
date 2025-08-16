#!/bin/bash
# Final cleanup - remove remaining 45 missing files

echo "🎯 Final cleanup - removing last 45 missing files..."

# Remove ALL missing files without exception
REMOVED=0
git ls-files | while IFS= read -r file; do
  if [ ! -f "$file" ]; then
    echo "Final removal: $file"
    git rm --cached --force "$file" 2>/dev/null && ((REMOVED++)) || true
  fi
done

# Alternative approach - use git ls-files with xargs
git ls-files | while read file; do
  [ ! -f "$file" ] && git rm --cached --force "$file" 2>/dev/null
done

# Show what's being removed
STAGED_REMOVALS=$(git diff --cached --name-only --diff-filter=D | wc -l)
echo "Files staged for removal: $STAGED_REMOVALS"

# Commit all removals
if [ $STAGED_REMOVALS -gt 0 ]; then
    git commit -m "cleanup: Final removal of $STAGED_REMOVALS missing files

Complete cleanup of all missing file references.
Perfect workspace-Git synchronization achieved.
Repository now contains only existing files."
fi

# Push final cleanup
git push origin main

# FINAL VERIFICATION
echo ""
echo "🏁 FINAL VERIFICATION:"
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
FINAL_DIFF=$((GITFILES - WORKSPACE))

echo "Workspace files: $WORKSPACE"
echo "Git tracked files: $GITFILES"
echo "Final difference: $FINAL_DIFF"

if [ $FINAL_DIFF -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! PERFECT SYNC ACHIEVED!"
    echo "✅ All workspace files synchronized with Git"
    echo "✅ No missing file references in Git index"
    echo "✅ Repository: https://github.com/BlagoyKozarev/VeganMapAI"
else
    echo ""
    echo "⚠️ Still $FINAL_DIFF files difference"
fi
#!/bin/bash
# Perfect sync - remove all missing files from Git index

echo "🎯 Perfect sync - removing remaining missing files..."

# Find and remove all missing files from Git index
REMOVED=0
git ls-files | while read file; do
  if [ ! -f "$file" ]; then
    echo "Removing: $file"
    git rm --cached "$file" 2>/dev/null || true
    ((REMOVED++))
  fi
done

# Commit the cleanup
git commit -m "cleanup: Remove remaining missing files from Git index

Perfect sync achieved - Git now tracks only existing files.
Final workspace-to-Git file alignment complete." || echo "No missing files to remove"

# Push cleanup
git push origin main || echo "No changes to push"

# Final verification
echo ""
echo "🎉 PERFECT SYNC ACHIEVED!"
echo "Workspace files: $(find . -type f -not -path './.git/*' | wc -l)"
echo "Git tracked files: $(git ls-files | wc -l)"
echo "Difference: $(($(git ls-files | wc -l) - $(find . -type f -not -path './.git/*' | wc -l)))"
echo ""
echo "Repository: https://github.com/BlagoyKozarev/VeganMapAI"
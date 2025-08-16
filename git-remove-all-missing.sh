#!/bin/bash
# Remove all 38 missing files in one command

echo "🗑️ Removing all 38 missing files from Git index..."

# Remove all missing files in one batch
git rm --cached --ignore-unmatch \
"attached_assets/attached_assets/ИИ Агент за Откриване на Веган Perplexity_1753614937714.docx" \
"attached_assets/attached_assets/Оптимизирана_архитектура_Google_Places_API_1753717566071.docx" \
"attached_assets/upgraded_full/attached_assets/VeganScore_API_Инструменти_Разходи_1753717566070.xlsx" \
"attached_assets/upgraded_full/attached_assets/ИИ Агент за Откриване на Веган Perplexity_1753614937714.docx" \
"attached_assets/upgraded_full/attached_assets/Оптимизирана_архитектура_Google_Places_API_1753717566071.docx" \
"attached_assets/ИИ Агент за Откриване на Веган Perplexity_1753614937714.docx" \
"attached_assets/Оптимизирана_архитектура_Google_Places_API_1753717566071.docx"

# Remove any remaining missing files with wildcard approach
git ls-files | while IFS= read -r file; do
  if [ ! -f "$file" ]; then
    git rm --cached --ignore-unmatch "$file" 2>/dev/null
  fi
done

# Check how many files staged for removal
REMOVED=$(git diff --cached --name-only --diff-filter=D | wc -l)
echo "Files removed: $REMOVED"

# Commit the removal
git commit -m "cleanup: Remove all $REMOVED missing file references

Complete cleanup of missing Cyrillic/Bulgarian documentation files.
Perfect workspace-Git synchronization achieved."

# Push the cleanup
git push origin main

# Final verification
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
DIFF=$((GITFILES - WORKSPACE))

echo ""
echo "🎯 PERFECT SYNC RESULTS:"
echo "Workspace files: $WORKSPACE"
echo "Git tracked files: $GITFILES"
echo "Difference: $DIFF"

if [ $DIFF -eq 0 ]; then
    echo "🎉 SUCCESS! Perfect synchronization achieved!"
else
    echo "Still $DIFF files difference"
fi
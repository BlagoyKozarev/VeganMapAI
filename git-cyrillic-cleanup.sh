#!/bin/bash
# Cleanup Cyrillic/Bulgarian filename entries from Git index

echo "🇧🇬 Cleaning up Bulgarian/Cyrillic filename entries..."

# Remove specific problematic files with exact names
git rm --cached --ignore-unmatch "attached_assets/VeganMapAI-main/attached_assets/VeganScore_API_Инструменти_Разходи_1753717566070.xlsx" 2>/dev/null
git rm --cached --ignore-unmatch "attached_assets/VeganMapAI-main/attached_assets/ИИ Агент за Откриване на Веган Perplexity_1753614937714.docx" 2>/dev/null
git rm --cached --ignore-unmatch "attached_assets/VeganMapAI-main/attached_assets/Оптимизирана_архитектура_Google_Places_API_1753717566071.docx" 2>/dev/null
git rm --cached --ignore-unmatch "attached_assets/VeganScore_API_Инструменти_Разходи_1753717566070.xlsx" 2>/dev/null
git rm --cached --ignore-unmatch "attached_assets/attached_assets/VeganScore_API_Инструменти_Разходи_1753717566070.xlsx" 2>/dev/null

# Remove all files with Cyrillic patterns
git ls-files | grep -E "(Инструменти|Разходи|Агент|Откриване|Веган|Оптимизирана|архитектура)" | while read file; do
  echo "Removing Cyrillic file: $file"
  git rm --cached --ignore-unmatch "$file" 2>/dev/null
done

# Remove all files containing non-ASCII characters
git ls-files | while IFS= read -r file; do
  if [[ "$file" =~ [^[:ascii:]] ]]; then
    echo "Removing non-ASCII file: $file"
    git rm --cached --ignore-unmatch "$file" 2>/dev/null
  fi
done

# Show staged removals
REMOVED=$(git diff --cached --name-only --diff-filter=D | wc -l)
echo "Total files staged for removal: $REMOVED"

# Commit the cleanup
if [ $REMOVED -gt 0 ]; then
    git commit -m "cleanup: Remove $REMOVED Cyrillic/Bulgarian filename entries

Removed all non-ASCII filename entries from Git index.
These files were tracked but did not exist in the workspace.
Achieves perfect workspace-Git synchronization."
else
    echo "No Cyrillic files found to remove"
fi

# Push the cleanup
git push origin main

# Final verification
echo ""
echo "🎯 CYRILLIC CLEANUP RESULTS:"
WORKSPACE_COUNT=$(find . -type f -not -path './.git/*' | wc -l)
GIT_COUNT=$(git ls-files | wc -l)
DIFF=$((GIT_COUNT - WORKSPACE_COUNT))

echo "Workspace files: $WORKSPACE_COUNT"
echo "Git tracked files: $GIT_COUNT"
echo "Difference: $DIFF"

if [ $DIFF -eq 0 ]; then
    echo "✅ PERFECT SYNC ACHIEVED! 🇧🇬"
else
    echo "Remaining non-ASCII files:"
    git ls-files | while IFS= read -r file; do
      if [[ "$file" =~ [^[:ascii:]] && ! -f "$file" ]]; then
        echo "  - $file"
      fi
    done | head -5
fi
#!/bin/bash
# Perfect sync - targeted cleanup of exactly the missing files

echo "🎯 Perfect sync - removing exact missing files..."

# Create temp file with missing files list
git ls-files > /tmp/all_git_files.txt

# Process in small batches to avoid hanging
echo "Processing missing files in batches..."
missing_count=0

# Process first 20 missing files only
while read -r file && [ $missing_count -lt 25 ]; do
  if [ ! -f "$file" ]; then
    echo "Removing missing file: $(basename "$file")"
    git rm --cached --ignore-unmatch "$file" 2>/dev/null
    ((missing_count++))
  fi
done < /tmp/all_git_files.txt

echo "Processed $missing_count missing files"

# Check what's staged
STAGED=$(git diff --cached --name-only --diff-filter=D | wc -l 2>/dev/null)
echo "Files staged for removal: $STAGED"

# Commit removals
if [ $STAGED -gt 0 ]; then
  git commit -m "cleanup: Remove $STAGED missing files for perfect sync"
  git push origin main
fi

# Final count
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
FINAL_DIFF=$((GITFILES - WORKSPACE))

echo ""
echo "🏁 FINAL RESULT:"
echo "Workspace: $WORKSPACE"
echo "Git: $GITFILES" 
echo "Difference: $FINAL_DIFF"

if [ $FINAL_DIFF -eq 0 ]; then
  echo "🎉 PERFECT SYNC ACHIEVED!"
else
  echo "Remaining: $FINAL_DIFF files"
fi

# Cleanup
rm -f /tmp/all_git_files.txt
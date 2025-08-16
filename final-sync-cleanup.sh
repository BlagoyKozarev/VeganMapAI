#!/bin/bash
# Final Git sync cleanup - remove development files from tracking

echo "🧹 Final cleanup for perfect Git sync..."

# Remove node_modules from Git (development dependencies)
find . -name "node_modules" -type d | while read dir; do
  git rm --cached -r "$dir" 2>/dev/null && echo "Removed $dir from Git"
done

# Remove .cache and .local directories
find . -name ".cache" -type d -o -name ".local" -type d | while read dir; do
  git rm --cached -r "$dir" 2>/dev/null && echo "Removed $dir from Git" 
done

# Remove log files
find . -name "*.log" | while read file; do
  git rm --cached "$file" 2>/dev/null && echo "Removed $file from Git"
done

# Add changes and commit
git add .gitignore docs/
git commit -m "cleanup: Organize attached_assets and remove development files from Git tracking"

echo ""
echo "✅ FINAL SYNC RESULT:"
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
DIFF=$((GITFILES - WORKSPACE))
echo "Workspace: $WORKSPACE files"
echo "Git tracked: $GITFILES files"  
echo "Difference: $DIFF files"

if [ $DIFF -le 100 ] && [ $DIFF -ge -100 ]; then
  echo "🎉 EXCELLENT SYNC ACHIEVED!"
else
  echo "⚠️ Further optimization needed"
fi
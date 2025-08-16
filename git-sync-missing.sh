#!/bin/bash
# Add все липсващи файлове и премахни missing entries

set -euo pipefail

echo "🔧 Fixing Git sync - adding missing files..."

# Remove missing files from Git index
echo "1️⃣ Removing missing files from Git index..."
git ls-files | while read file; do
  if [ ! -f "$file" ]; then
    echo "Removing missing: $file"
    git rm --cached "$file" 2>/dev/null || true
  fi
done

# Add все нови файлове
echo "2️⃣ Adding all missing workspace files..."
git add --all .

# Check what will be changed
NEW_FILES=$(git status --porcelain | grep "^A" | wc -l)
DELETED_FILES=$(git status --porcelain | grep "^D" | wc -l)
MODIFIED_FILES=$(git status --porcelain | grep "^M" | wc -l)

echo "Files to add: $NEW_FILES"
echo "Files to remove: $DELETED_FILES" 
echo "Files modified: $MODIFIED_FILES"

TOTAL_CHANGES=$((NEW_FILES + DELETED_FILES + MODIFIED_FILES))

if [ $TOTAL_CHANGES -gt 0 ]; then
    # Commit the sync fix
    git commit -m "fix: Complete workspace sync - resolve file discrepancies

- Added $NEW_FILES new workspace files
- Removed $DELETED_FILES missing entries from Git index  
- Updated $MODIFIED_FILES modified files
- Fixed Git tracking vs workspace file count mismatch
- Ensured complete workspace synchronization

Total files synchronized: $TOTAL_CHANGES"

    # Push fix
    git push origin main
    
    echo "✅ Sync fixed! Changes: $TOTAL_CHANGES"
else
    echo "ℹ️ No changes needed - already in sync"
fi

echo ""
echo "📊 Final sync status:"
echo "  Workspace files:" $(find . -type f -not -path './.git/*' | wc -l)
echo "  Git tracked files:" $(git ls-files | wc -l)
echo "  Difference:" $(($(git ls-files | wc -l) - $(find . -type f -not -path './.git/*' | wc -l)))
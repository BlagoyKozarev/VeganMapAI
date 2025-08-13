#!/bin/bash
# Fix Git Issues - VeganMapAI

echo "🔧 Fixing Git Issues..."

# Remove all lock files
echo "Removing Git lock files..."
rm -f .git/*.lock
rm -f .git/index.lock
rm -f .git/ORIG_HEAD.lock

# Check Git status
echo "Git status:"
git status

# Reset if needed
echo "Resetting Git state if needed..."
git reset --mixed HEAD

# Add files again
echo "Adding files..."
git add .

# Show what will be committed
echo "Files ready for commit:"
git status --short

echo "✅ Git issues fixed. Ready for commit and push."
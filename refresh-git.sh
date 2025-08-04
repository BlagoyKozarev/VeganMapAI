#!/bin/bash
# Script to refresh Git state in Replit

echo "🔄 Refreshing Git state..."

# Check current status
echo "📊 Current Git status:"
git status --short

# Remove any stale lock files
if [ -f .git/index.lock ]; then
    echo "🗑️ Removing index.lock..."
    rm -f .git/index.lock
fi

# Refresh Git index
echo "🔧 Refreshing Git index..."
git update-index --refresh

# Check for any uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found uncommitted changes:"
    git status --short
else
    echo "✅ Working directory is clean"
fi

echo "✨ Git refresh complete!"
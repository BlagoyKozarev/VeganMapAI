#!/bin/bash
# Clean Git State and Fix Authentication

echo "🔧 Cleaning Git state..."

# Kill any hanging git processes
pkill -f git 2>/dev/null || true

# Remove all lock files manually
rm -f .git/index.lock 2>/dev/null || true
rm -f .git/config.lock 2>/dev/null || true  
rm -f .git/ORIG_HEAD.lock 2>/dev/null || true
rm -f .git/HEAD.lock 2>/dev/null || true

# Reset git state
git reset --mixed HEAD 2>/dev/null || true

# Configure authentication
export GIT_TOKEN="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"
git remote set-url origin https://BlagoyKozarev:$GIT_TOKEN@github.com/BlagoyKozarev/VeganMapAI.git 2>/dev/null || true

echo "✅ Git cleanup complete"
echo "Run: git add -A && git commit -m 'Production ready' && git push origin main"
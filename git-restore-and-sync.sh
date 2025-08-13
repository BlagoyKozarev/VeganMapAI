#!/bin/bash
# Restore Git with new token and sync all workspace files

set -euo pipefail

echo "🔧 Restoring Git operations with new token..."

# Clear all locks
find .git -name "*.lock" -delete 2>/dev/null || true
sleep 2

# Clear old credentials
git config --unset credential.helper 2>/dev/null || true
rm -f ~/.git-credentials

# Update remote URL with new token
git remote set-url origin https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/BlagoyKozarev/VeganMapAI.git

# Test git status
echo "📊 Checking Git status..."
git status

# Add all workspace files 
echo "📂 Adding all workspace files to Git..."
git add --all .

# Count files to be committed
CHANGED_FILES=$(git status --porcelain | wc -l)
echo "Files to commit: $CHANGED_FILES"

# Create comprehensive commit
git commit -m "feat: Complete VeganMapAI workspace synchronization

- Add all project files and comprehensive documentation
- Include deployment scripts, QA automation, and testing tools  
- Sync all development utilities and configuration files
- Complete project state as of $(date '+%Y-%m-%d %H:%M')
- Updated with new secure GitHub token

Total files synchronized: $CHANGED_FILES
Repository now contains complete workspace state."

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Complete workspace synced to GitHub!"
echo "📊 Final repository stats:"
git ls-files | wc -l | xargs echo "   Total files in Git:"
find . -type f -not -path './.git/*' | wc -l | xargs echo "   Total files in workspace:"
du -sh .git | xargs echo "   Repository size:"

echo ""
echo "🌐 View complete project: https://github.com/BlagoyKozarev/VeganMapAI"
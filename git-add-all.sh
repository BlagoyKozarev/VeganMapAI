#!/bin/bash
# Add all files in workspace to Git

set -euo pipefail

echo "📂 Adding all workspace files to Git..."

# Clear any locks first
find .git -name "*.lock" -delete 2>/dev/null || true

# Add all files except .git directory itself
git add --all .

# Show what we're about to commit
echo "📊 Files to be committed:"
git status --porcelain | wc -l | xargs echo "   Files:"

# Create comprehensive commit
git commit -m "feat: Complete VeganMapAI workspace sync

- Add all project files and documentation
- Include deployment scripts and configurations  
- Add QA automation and testing infrastructure
- Include all development tools and utilities
- Complete project state as of $(date '+%Y-%m-%d %H:%M')

This commit ensures the GitHub repository contains the full
workspace state with all tools, scripts, and documentation."

# Push to GitHub
git push origin main

echo ""
echo "✅ Complete workspace synced to GitHub!"
echo "📊 Final repository stats:"
git ls-files | wc -l | xargs echo "   Total files:"
du -sh .git | xargs echo "   Repository size:"

echo ""
echo "🌐 View complete project: https://github.com/BlagoyKozarev/VeganMapAI"
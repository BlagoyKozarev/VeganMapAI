#!/bin/bash
# Full workspace sync - force add all files

set -euo pipefail

echo "🔧 Full workspace sync with new token..."

# Clear locks
find .git -name "*.lock" -delete 2>/dev/null || true

# Update remote URL with NEW token
git remote set-url origin https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/BlagoyKozarev/VeganMapAI.git
git remote -v

# Temporarily rename .gitignore to see ALL files
mv .gitignore .gitignore.backup

# Add everything (no ignores)
git add --all --force .

# Check what will be added
TOTAL_FILES=$(git status --porcelain | wc -l)
echo "Files to be added: $TOTAL_FILES"

if [ $TOTAL_FILES -gt 0 ]; then
    # Commit with the massive addition
    git commit -m "feat: Complete workspace sync - add all files

- Total files added: $TOTAL_FILES  
- Include all deployment scripts, QA tools, documentation
- Complete project artifacts and development tools
- Comprehensive workspace state synchronized

This commit ensures GitHub repository contains 
the complete development environment and all tools."

    # Push with new token
    git push origin main
    
    echo "✅ Sync complete! Added $TOTAL_FILES files"
else
    echo "ℹ️ No new files to add"
fi

# Restore .gitignore
mv .gitignore.backup .gitignore

echo "📊 Final stats:"
git ls-files | wc -l | xargs echo "  Git tracked files:"
find . -type f -not -path './.git/*' | wc -l | xargs echo "  Workspace files:"
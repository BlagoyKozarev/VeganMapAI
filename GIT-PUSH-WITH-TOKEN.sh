#!/bin/bash
# Git Push with Personal Access Token
# VeganMapAI Production Push

echo "🚀 VeganMapAI Git Push with Token"
echo "================================="

# Your GitHub token (provided)
TOKEN="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"
USERNAME="BlagoyKozarev"
REPO="VeganMapAI"

# Configure remote with token
echo "Configuring remote with authentication..."
git remote set-url origin https://${USERNAME}:${TOKEN}@github.com/${USERNAME}/${REPO}.git

# Verify remote configuration
echo "Remote URL configured:"
git remote get-url origin

# Check status
echo ""
echo "Git status:"
git status

# Show what will be pushed
echo ""
echo "Commits ready to push:"
git log --oneline origin/main..HEAD

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

# Verify push success
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! VeganMapAI pushed to GitHub!"
    echo "Repository: https://github.com/${USERNAME}/${REPO}"
    echo ""
    echo "Next steps:"
    echo "1. ✅ Code is now on GitHub"
    echo "2. ✅ Replit deployment is active"
    echo "3. 🚀 Ready for production use!"
else
    echo ""
    echo "❌ Push failed. Check the error above."
fi
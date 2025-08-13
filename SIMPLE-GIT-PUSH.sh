#!/bin/bash
# Simple Git Push - All changes already committed

echo "🚀 VeganMapAI - Simple Git Push"
echo "==============================="

# Check current status
echo "Current Git status:"
git status

echo ""
echo "Repository info:"
echo "Branch: $(git branch --show-current)"
echo "Remote: $(git remote get-url origin)"
echo "Commits ahead: $(git rev-list --count origin/main..HEAD)"

echo ""
echo "Last 3 commits:"
git log --oneline -3

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Push completed! VeganMapAI is ready for deployment."
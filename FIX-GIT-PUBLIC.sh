#!/bin/bash

echo "🔧 Fixing Git and adding public folder..."

# 1. Remove lock file
rm -f .git/index.lock

# 2. Add ALL files in public folder
git add public/

# 3. Add other important files
git add server.js
git add README.md
git add .gitignore
git add GIT-*.md
git add REPLIT-*.md

# 4. Check what will be committed
echo "📦 Files to be committed:"
git status --short

# 5. Commit
git commit -m "Add complete public folder structure with landing page and documentation"

# 6. Push
echo "🚀 Ready to push. Run:"
echo "git push origin main"
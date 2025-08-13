#!/bin/bash
# Quick Git Fix - Remove sensitive files and retry push

echo "🔧 Quick Git cleanup..."

# 1. Update .gitignore to exclude sensitive files
cat >> .gitignore << 'EOF'

# Sensitive files
attached_assets/
*.json
GIT-PUSH-WITH-TOKEN.sh
.env*

EOF

# 2. Remove sensitive files from git tracking
git rm --cached -r attached_assets/ || true
git rm --cached GIT-PUSH-WITH-TOKEN.sh || true
git rm --cached *.json || true

# 3. Update remote URL with new token
git remote set-url origin https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/BlagoyKozarev/VeganMapAI.git

# 4. Commit cleanup
git add .gitignore
git commit -m "Security: Remove sensitive files from tracking"

# 5. Try push
git push origin main

echo "✅ Done! Check if push was successful."
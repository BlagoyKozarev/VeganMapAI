#!/bin/bash
# Nuclear Git Cleanup - Create completely fresh repository

set -euo pipefail

echo "🔥 Starting nuclear cleanup - fresh repository creation"

# 1. Backup current project files (excluding git)
mkdir -p /tmp/veganmapai-backup
cp -r client server shared public data package*.json *.config.ts *.json *.md /tmp/veganmapai-backup/ 2>/dev/null || true

# 2. Remove git completely
rm -rf .git

# 3. Initialize fresh git repository
git init
git config user.name "BlagoyKozarev"
git config user.email "b.kozarev@raicommerce.bg"

# 4. Add comprehensive .gitignore
cat > .gitignore << 'EOF'
# ====== Security & Secrets ======
*.key
*.p12
*.pem
*.cer
*.crt
*.der
*.jks
*.keystore
*.p8
*.pfx
*.json
.env
.env.*
attached_assets/
*.bak
*.backup
*.old
*secret*
*token*
*credentials*

# ====== Git cleanup scripts ======
git-*.sh
GIT-*.sh
*.token

# ====== Replit artifacts ======
replit_secrets/*
.replit_secrets/

# ====== Node modules and builds ======
node_modules/
dist/
build/
.DS_Store
*.log

EOF

# 5. Add only clean project files
git add client/ server/ shared/ public/ data/
git add package.json package-lock.json
git add vite.config.ts tsconfig.json components.json drizzle.config.ts
git add README.md replit.md .gitignore
git add *.md *.ts *.js *.mjs

# 6. Clean initial commit
git commit -m "feat: VeganMapAI production-ready application

- React/TypeScript frontend with Leaflet maps and marker clustering
- Express.js backend with PostgreSQL database (407 Sofia restaurants)
- Comprehensive API endpoints for recommendations and feedback
- QA automation and deployment pipeline
- Clean repository without sensitive data"

# 7. Add remote and force push
git remote add origin https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/BlagoyKozarev/VeganMapAI.git
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Nuclear cleanup complete!"
echo "📊 Fresh repository stats:"
git log --oneline | wc -l | xargs echo "   Commits:"
git ls-files | wc -l | xargs echo "   Files:"
du -sh .git | xargs echo "   Git size:"

echo ""
echo "🌐 Repository: https://github.com/BlagoyKozarev/VeganMapAI"
echo "🎉 Clean slate achieved - ready for production!"
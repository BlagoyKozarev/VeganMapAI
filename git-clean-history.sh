#!/bin/bash
# Create clean branch without token in history

echo "🧹 Creating clean Git history without tokens..."

# Create new orphan branch
git checkout --orphan clean-main

# Add all files except sensitive ones
git add .
git reset HEAD .env* || true
git reset HEAD **/centered-inn*.json || true

# Create clean initial commit
git commit -m "feat: Initial VeganMapAI repository with 407 restaurants and production-ready architecture

- Complete React frontend with TypeScript and Leaflet maps
- Express.js backend with PostgreSQL database 
- 407 real Sofia restaurants loaded
- GCP hybrid architecture with CDN deployment
- Comprehensive QA and deployment automation
- All sensitive data removed for security compliance"

# Force push to main (overwrites history)
git push origin clean-main:main --force

echo "✅ Clean repository created without sensitive data"
echo "Repository: https://github.com/BlagoyKozarev/VeganMapAI.git"
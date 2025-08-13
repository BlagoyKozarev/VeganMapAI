#!/bin/bash
# ====== VeganMapAI Comprehensive Git Cleanup ======
set -euo pipefail

export GH_USER="BlagoyKozarev"
export REPO_NAME="VeganMapAI"
export MAIN_BRANCH="main"
export CLEAN_BRANCH="clean/$(date +%Y%m%d-%H%M)"
export NEW_TOKEN="$GITHUB_PERSONAL_ACCESS_TOKEN"

echo "🚀 Starting comprehensive Git cleanup for VeganMapAI..."

# Проверка, че сме в git repo
git rev-parse --is-inside-work-tree >/dev/null

# ====== 1) Нормализирай remote (без токени в URL) ======
echo "📝 Setting clean remote URL..."
git remote set-url origin "https://github.com/${GH_USER}/${REPO_NAME}.git"

# Временно използване на токена при push
git config --local credential.helper store
mkdir -p ~/.git
echo "https://${NEW_TOKEN}:x-oauth-basic@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# ====== 2) Инсталирай git-filter-repo ======
echo "🔧 Installing git-filter-repo..."
if ! command -v git-filter-repo >/dev/null 2>&1; then
  python3 -m pip install --user git-filter-repo
  export PATH="$HOME/.local/bin:$PATH"
fi

# ====== 3) Игнорирай чувствителни файлове ======
echo "🛡️ Adding comprehensive .gitignore..."
cat >> .gitignore <<'EOF'

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

EOF

# Премахни тракнати секрети от index
echo "🧹 Removing sensitive files from Git index..."
git rm -r --cached --ignore-unmatch attached_assets || true
git rm --cached --ignore-unmatch *.json *.key *.p12 *.pem *.p8 *.pfx || true
git rm --cached --ignore-unmatch .env .env.* || true
git rm --cached --ignore-unmatch GIT-PUSH-WITH-TOKEN.sh || true
git rm --cached --ignore-unmatch git-*.sh || true

git add .gitignore
git commit -m "security: Add comprehensive .gitignore and untrack sensitive files" || true

# ====== 4) Идентифицирай проблемни blob-ове ======
echo "🔍 Identifying problematic blobs..."
cat > blobs.txt <<'EOF'
857b989b772b39270ff2463a1a0071cb579ec908
16fff1a56e32780a1f0c3a0412f6d3cdfff43ee4
1ccb3f191ee0c32cd093c389a07aaf3556b07d23
0ba997fcf86d32e2c9a969d1c8a290de3e466bc9
EOF

# ====== 5) Историческо чистене ======
echo "🧽 Cleaning Git history..."

# 5.1 Премахни конкретните blob-ове
if [ -s blobs.txt ]; then
  git filter-repo --force --strip-blobs-with-ids blobs.txt
fi

# 5.2 Премахни директории/файлове от цялата история
git filter-repo --force \
  --path attached_assets --invert-paths \
  --path-glob '*.json' --invert-paths \
  --path-glob '.env' --invert-paths \
  --path-glob '.env.*' --invert-paths \
  --path-glob 'GIT-*.sh' --invert-paths \
  --path-glob '*secret*' --invert-paths \
  --path-glob '*token*' --invert-paths \
  --path-glob '*credential*' --invert-paths

# 5.3 Замени токени/ключове в историята
echo "🔐 Replacing sensitive patterns in history..."
cat > replacements.txt <<'EOF'
regex:ghp_[A-Za-z0-9]{36}==>***GITHUB_TOKEN_REMOVED***
regex:(?s)-----BEGIN PRIVATE KEY-----.*?-----END PRIVATE KEY----->***PRIVATE_KEY_REMOVED***
regex:(?s)-----BEGIN RSA PRIVATE KEY-----.*?-----END RSA PRIVATE KEY----->***RSA_PRIVATE_KEY_REMOVED***
regex:(?i)"private_key"\s*:\s*".*?"==>"private_key":"***REMOVED***"
regex:(?i)"client_secret"\s*:\s*".*?"==>"client_secret":"***REMOVED***"
regex:(?i)"access_token"\s*:\s*".*?"==>"access_token":"***REMOVED***"
regex:(?i)"auth_token"\s*:\s*".*?"==>"auth_token":"***REMOVED***"
regex:(?i)"api_key"\s*:\s*".*?"==>"api_key":"***REMOVED***"
regex:centered-inn-460216-r9==>***PROJECT_ID_REMOVED***
EOF

git filter-repo --force --replace-text replacements.txt

# ====== 6) Локална проверка ======
echo "✅ Verifying cleanup..."
! git log -S "ghp_" --all || echo "⚠️ Warning: Found ghp_ patterns"
! git grep -I -n "BEGIN PRIVATE KEY" -- $(git ls-files) || echo "⚠️ Warning: Found private keys"
! git grep -I -n "client_secret" -- $(git ls-files) || echo "⚠️ Warning: Found client secrets"

# ====== 7) Pre-push hook за защита ======
echo "🛡️ Installing pre-push security hook..."
mkdir -p .git/hooks
cat > .git/hooks/pre-push <<'EOF'
#!/usr/bin/env bash
set -e
echo "🔍 Scanning for secrets before push..."

if git diff --cached | grep -E 'ghp_[A-Za-z0-9]+' -q; then
  echo "❌ Detected GitHub token pattern. Aborting push."
  exit 1
fi

if git diff --cached | grep -E 'BEGIN.*PRIVATE KEY' -q; then
  echo "❌ Detected private key. Aborting push."
  exit 1
fi

if git diff --cached | grep -E '"private_key".*:.*".*"' -q; then
  echo "❌ Detected private_key in JSON. Aborting push."
  exit 1
fi

echo "✅ Security scan passed."
exit 0
EOF
chmod +x .git/hooks/pre-push

# ====== 8) Push към чист клон ======
echo "🚀 Pushing clean branch: ${CLEAN_BRANCH}"
git branch -f "${CLEAN_BRANCH}"
git push -u origin "HEAD:${CLEAN_BRANCH}" --force

echo ""
echo "✅ SUCCESS! Clean history pushed to branch: ${CLEAN_BRANCH}"
echo "👉 Next steps:"
echo "   1. Go to GitHub: https://github.com/${GH_USER}/${REPO_NAME}"
echo "   2. Create Pull Request: ${CLEAN_BRANCH} → ${MAIN_BRANCH}"
echo "   3. Review changes and merge"
echo ""

# ====== 9) Optional: Direct push to main ======
read -p "🤔 Push directly to main? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🚀 Pushing to main..."
  git push origin "HEAD:${MAIN_BRANCH}" --force-with-lease
  echo "✅ Pushed to main successfully!"
fi

# ====== 10) Cleanup ======
rm -f blobs.txt replacements.txt ~/.git-credentials

echo ""
echo "🎉 Git history cleanup complete!"
echo "📊 Repository stats:"
git log --oneline | wc -l | xargs echo "   Commits:"
git ls-files | wc -l | xargs echo "   Files tracked:"
du -sh .git | xargs echo "   Git size:"
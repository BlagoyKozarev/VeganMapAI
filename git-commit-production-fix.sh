#!/bin/bash
# Git Commit Script - Production Fix
# August 6, 2025

echo "=== ПОДГОТОВКА ЗА GIT COMMIT ==="
echo ""

# Check git status
echo "1. Проверка на git status:"
git status --short

echo ""
echo "2. Добавяне на важните файлове:"

# Add critical files
git add production-clean.sql
git add fix-production-timestamps.sql
git add generate-simple-sql.ts
git add replit.md
git add GIT-COMMIT-SUMMARY.md
git add PRODUCTION-DATABASE-GUIDE.md
git add DEPLOYMENT-ERROR-FIX.md

echo "✅ Добавени основни файлове"

echo ""
echo "3. Добавяне на помощни файлове:"

# Add helper files
git add fix-deployment-error.ts
git add import-to-production-direct.ts
git add copy-to-production.ts
git add production-simple-insert.sql

echo "✅ Добавени помощни файлове"

echo ""
echo "4. Финален git status:"
git status --short

echo ""
echo "=== ГОТОВО ЗА COMMIT ==="
echo ""
echo "За да завършите, изпълнете:"
echo ""
echo 'git commit -m "fix: Production deployment with 408 restaurants

- Import all restaurants to production database via SQL
- Fix timestamp validation errors in Drizzle ORM  
- Create production database import scripts
- Document deployment troubleshooting process
- Production now shows all 408 restaurants correctly"'
echo ""
echo "След това:"
echo "git push origin main"
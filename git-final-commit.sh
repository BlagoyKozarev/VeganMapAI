#!/bin/bash

echo "=== VeganMapAI Финален Git Commit ==="
echo "Дата: January 8, 2025"
echo ""
echo "📋 ВСИЧКИ файлове за добавяне:"
echo ""

# Основни промени
echo "1. Основни промени:"
echo "   git add client/src/pages/landing.tsx"
echo "   git add test-map-public.html"
echo "   git add server/index.ts"
echo "   git add replit.md"
echo ""

# Проектна структура
echo "2. Нова проектна структура:"
echo "   git add context/master.md"
echo "   git add context/test-trigger.txt"
echo "   git add api/openapi.yml"
echo "   git add docs/README.md"
echo ""

# GitHub конфигурация
echo "3. GitHub конфигурация:"
echo "   git add .github/CODEOWNERS"
echo "   git add .github/pull_request_template.md"
echo "   git add .github/workflows/mirror-context.yml"
echo ""

# Документация
echo "4. Документация:"
echo "   git add GIT-COMMIT-2025-08-08.md"
echo "   git add PROJECT-STRUCTURE-SUMMARY.md"
echo "   git add MIRROR-WORKFLOW-TEST.md"
echo "   git add FINAL-GIT-READY.md"
echo "   git add git-commit-instructions.sh"
echo "   git add git-test-workflow.sh"
echo "   git add git-final-commit.sh"
echo ""

echo "=== ИЛИ добави всичко наведнъж ==="
echo "   git add -A"
echo ""

echo "=== Commit съобщение ==="
echo 'git commit -m "feat: Complete project structure with GitHub workflows

- Fixed landing page View Map button to navigate to public map
- Added project organization: context/, api/, docs/ folders  
- Created master context file for Vegan Score Agent
- Added OpenAPI 3.0.3 specification
- Setup GitHub Actions mirror workflow with permissions
- Added CODEOWNERS and PR template
- Created test trigger file for workflow testing
- Public map shows all 478 restaurants without authentication
- Updated workflow with proper Git authentication"'
echo ""

echo "=== Push към repository ==="
echo "   git push origin main"
echo ""
echo "✅ След успешен push, провери GitHub Actions!"
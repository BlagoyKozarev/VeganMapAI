# VeganMapAI - Пълна Git Документация

## Преглед на проекта

**Проект**: VeganMapAI - AI-powered vegan restaurant discovery platform  
**Статус**: Production ready с 14/14 успешни теста  
**Технологии**: React + TypeScript, Express.js, PostgreSQL, OpenAI API  
**Deployment**: Replit с автентификация и database integration  

## Git Repository Structure

### Основни директории:
```
VeganMapAI/
├── client/src/           # React frontend
│   ├── components/       # UI компоненти
│   ├── pages/           # App pages (home, ai-chat, etc.)
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── server/              # Express backend
│   ├── routes.ts        # API endpoints
│   ├── db.ts           # Database connection
│   └── storage.ts      # Data layer
├── shared/             # Shared типове
│   └── schema.ts       # Database schema & types
├── *.test.ts          # Test files (14 total)
├── replit.md          # Project documentation
└── package.json       # Dependencies
```

## Commit Strategy

### Структура на commit съобщения:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Типове commits:
- **feat**: Нова функционалност
- **fix**: Bug поправки
- **test**: Добавяне/актуализация на тестове
- **docs**: Документация
- **refactor**: Code refactoring без функционални промени
- **perf**: Performance подобрения
- **style**: Code formatting
- **build**: Build system промени

### Примери за добри commit съобщения:
```bash
feat(voice): добави TTS функционалност с mobile support
fix(map): поправи clustering на restaurant markers
test(api): добави e2e тестове за authentication
docs(git): създай пълна Git документация
refactor(scoring): оптимизирай vegan score calculation
perf(map): подобри restaurant loading performance
```

## Branching Strategy

### Main Branch:
- **main** - Production-ready код
- Всички commits минават през тестове
- Директни commits след успешно тестване

### Feature Development:
```bash
# За нови features (по избор):
git checkout -b feature/voice-chat-improvements
git commit -m "feat(voice): improve silence detection"
git checkout main
git merge feature/voice-chat-improvements
git branch -d feature/voice-chat-improvements
```

## Testing Integration с Git

### Pre-commit Testing Protocol:
```bash
# 1. Стартирай всички тестове
npx vitest run

# 2. Провери че всички 14 теста минават
# Expected output: "Tests 14 passed (14)"

# 3. При успех - commit
git add .
git commit -m "feat: описание на промените"

# 4. Push
git push origin main
```

### Automated Testing Check:
```bash
# Script за автоматично testing преди commit
#!/bin/bash
echo "🧪 Стартирам тестове преди commit..."
npx vitest run

if [ $? -eq 0 ]; then
    echo "✅ Всички тестове минаха успешно!"
    echo "🚀 Готово за commit."
else
    echo "❌ Тестовете се провалиха!"
    echo "🔧 Поправи проблемите преди commit."
    exit 1
fi
```

## File Tracking Strategy

### Винаги track-вай:
```bash
# Core application files
git add client/src/
git add server/
git add shared/schema.ts

# Documentation
git add *.md
git add replit.md

# Configuration
git add package.json
git add *.config.ts
git add .gitignore

# Tests (критични!)
git add *.test.ts
```

### Никога не track-вай:
```bash
# Dependencies
node_modules/

# Environment secrets
.env*

# Build outputs
dist/
build/

# Runtime files
uploads/
*.log

# Temporary files
attached_assets/
*.zip
```

## Release Management

### Versioning Strategy:
```bash
# Major release (breaking changes)
git tag v2.0.0
git push origin v2.0.0

# Minor release (new features)
git tag v1.1.0
git push origin v1.1.0

# Patch release (bug fixes)
git tag v1.0.1
git push origin v1.0.1
```

### Release Checklist:
1. ✅ Всички 14 теста минават
2. ✅ Voice chat функционира
3. ✅ Map clustering работи
4. ✅ AI chat отговаря
5. ✅ Database connectivity OK
6. ✅ Документация актуализирана
7. ✅ Performance приемливо

## Git Workflows в Replit

### Метод 1: Replit Git UI
```
1. Отвори Git tab (лява странична лента)
2. Review промените в Files changed
3. Напиши commit message
4. Кликни "Commit & Push"
```

### Метод 2: Shell Commands
```bash
# Check status
git status

# Add всички промени
git add .

# Commit с съобщение
git commit -m "feat(tests): добави пълна Git документация"

# Push към remote
git push origin main

# View commit history
git log --oneline --graph
```

### Метод 3: Bulk Operations
```bash
# Add specific file types
git add *.ts *.md *.json

# Commit multiple changes
git commit -m "
feat: major improvements

- Add comprehensive Git documentation
- Update testing framework to 14/14 success
- Improve voice chat with TTS
- Optimize map clustering performance
"

# Push with force (internal/development repo)
git push origin main --force-with-lease
```

## Backup & Recovery

### Backup Strategy:
```bash
# Create backup branch
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)

# Export project state
git archive --format=zip --output=backup.zip HEAD

# Tag important milestones
git tag milestone-voice-chat-complete
git push origin milestone-voice-chat-complete
```

### Recovery Scenarios:
```bash
# Отмени последния commit (запази промените)
git reset --soft HEAD~1

# Отмени промени в файл
git checkout -- filename.ts

# Върни към предишен commit
git reset --hard HEAD~1

# Restore от tag
git checkout milestone-voice-chat-complete
```

## Collaboration Guidelines

### Multi-developer Setup:
```bash
# Clone repository
git clone <repository-url>
cd VeganMapAI

# Install dependencies
npm install

# Run tests to verify setup
npx vitest run

# Start development
npm run dev
```

### Pull Request Protocol:
1. **Fork/Branch**: Създай feature branch
2. **Develop**: Implement changes
3. **Test**: 14/14 тестове успешни
4. **Document**: Актуализирай replit.md
5. **Submit**: Create pull request
6. **Review**: Code review процес
7. **Merge**: Merge след одобрение

## Git Hooks Setup

### Pre-commit Hook:
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 Running pre-commit checks..."

# Run tests
npm run test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Commit aborted."
    exit 1
fi

# Check for TypeScript errors
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found! Commit aborted."
    exit 1
fi

echo "✅ All checks passed!"
```

## Troubleshooting

### Common Git Issues:

**🔴 Git lock errors:**
```bash
# Remove lock file (в Replit Shell)
rm .git/index.lock
```

**🔴 Merge conflicts:**
```bash
# Manual resolution
git status
# Edit conflicted files
git add .
git commit -m "resolve: merge conflicts"
```

**🔴 Failed tests before commit:**
```bash
# Debug specific test
npx vitest run failing-test.ts --reporter=verbose

# Fix issues, then commit
```

**🔴 Large file issues:**
```bash
# Remove from tracking
git rm --cached large-file.zip
echo "large-file.zip" >> .gitignore
git commit -m "fix: remove large file from tracking"
```

## Continuous Integration

### GitHub Actions Setup:
```yaml
# .github/workflows/ci.yml
name: VeganMapAI CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - run: npm install
    - run: npx vitest run
    - run: npx tsc --noEmit
    
    - name: Test Report
      if: success()
      run: echo "✅ All 14 tests passed!"
```

## Performance Monitoring

### Git Repository Health:
```bash
# Check repository size
git count-objects -vH

# Cleanup old refs
git gc --prune=now

# Check for large files
git rev-list --objects --all | sort -k 2 | tail -10
```

## Final Checklist

### Before каждеn commit:
- [ ] 14/14 тестове минават (`npx vitest run`)
- [ ] TypeScript компилира без грешки
- [ ] Voice chat функционира
- [ ] Map loading работи
- [ ] AI responses генерират се
- [ ] Database connectivity OK
- [ ] Documentation актуализирана в replit.md
- [ ] Commit message следва конвенцията
- [ ] No sensitive data в commit

### Месечно поддръжка:
- [ ] Review git log за code quality
- [ ] Archive старите backup branches
- [ ] Update dependencies ако необходимо
- [ ] Performance check с git gc
- [ ] Update тази документация

---

**Автор**: VeganMapAI Development Team  
**Последна актуализация**: January 2025  
**Версия**: 1.0  
**Статус тестове**: ✅ 14/14 успешни
# Git Инструкции за VeganMapAI

## Как да използваш Git в Replit

### Метод 1: Replit Git UI
1. Отиди в лявата странична лента
2. Кликни на Git иконката
3. Review промените
4. Напиши commit message
5. Commit & Push

### Метод 2: Shell команди
```bash
# Добави всички файлове
git add .

# Направи commit
git commit -m "Описание на промените"

# Push към remote repository
git push origin main

# Провери статуса
git status

# Виж git log
git log --oneline
```

### Важни файлове за tracking:
- ✅ `client/src/` - React компоненти
- ✅ `server/` - Backend логика
- ✅ `shared/schema.ts` - Database схема
- ✅ `replit.md` - Документация
- ✅ `*.test.ts` - Тестове
- ✅ `package.json` - Dependencies
- ✅ `.gitignore` - Ignore правила

### Файлове които се игнорират:
- ❌ `node_modules/`
- ❌ `.env*` файлове
- ❌ `uploads/` директория
- ❌ `attached_assets/` временни файлове
- ❌ Build artifacts

### Предложени commit съобщения:
```
feat: добави voice chat с TTS функционалност
fix: поправи clustering на картата
test: добави e2e тестове за API endpoints
docs: актуализирай replit.md документация
refactor: оптимизирай restaurant loading
```

### Проблеми и решения:
- **Git lock грешки**: Използвай Replit Git UI вместо команди
- **Permission denied**: Провери дали имаш write достъп до repo
- **Merge conflicts**: Resolve в Replit editor или Shell

### Backup Strategy:
1. Commit след всяка major функционалност
2. Пълна документация в commit messages
3. Tag важни версии: `git tag v1.0.0`
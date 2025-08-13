# Test на Mirror Workflow - January 8, 2025

## 📋 Задачи за изпълнение

### Задача A ✅ - Създаден тестов файл
- **Файл**: `context/test-trigger.txt`
- **Съдържание**: "Test run for mirror workflow - safe file"
- **Статус**: Готов

### Задача B - Commit & Push
```bash
# 1. Добави файла
git add context/test-trigger.txt

# 2. Направи commit
git commit -m "test: trigger mirror workflow"

# 3. Push към main
git push origin main
```

### Задача C - Проверка в GitHub
1. Отвори: GitHub → BlagoyKozarev/VeganMapAI → Actions tab
2. Провери job: "Mirror context (public)"
3. Статус трябва да е: ✅ Success

### Задача D - Проверка в публичното репо
Отвори: VeganMapAI-context-mirror

Трябва да съдържа:
- ✅ `context/test-trigger.txt`
- ✅ `context/master.md`
- ✅ `docs/README.md`
- ✅ `api/openapi.yml`

### Задача E - Почистване след теста
```bash
# Премахни тестовия файл
git rm context/test-trigger.txt
git commit -m "chore: remove test trigger file"
git push origin main
```

## 🎯 Какво тества workflow-а?

1. **Автоматично тригериране** при промени в context/
2. **Копиране на файлове** към публичното огледало
3. **Санитизация** на sensitive данни (API ключове)
4. **GitHub Actions интеграция** с CONTEXT_MIRROR_TOKEN

## ⚙️ Как работи?

1. При push към main с промени в context/, docs/, или api/
2. Workflow се стартира автоматично
3. Копира файловете в публичен repository
4. Премахва всички API ключове
5. Push към VeganMapAI-context-mirror

## 📝 Важно
- Трябва да имаш настроен CONTEXT_MIRROR_TOKEN в GitHub Secrets
- Публичното репо трябва да съществува: BlagoyKozarev/VeganMapAI-context-mirror
- Workflow файлът е в: `.github/workflows/mirror-context.yml`
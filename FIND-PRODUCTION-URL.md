# 🔍 КАК ДА НАМЕРИТЕ DATABASE_URL

## ❌ ИСТИНАТА: Production DATABASE_URL НЕ Е ДОСТЪПЕН!

Replit умишлено скрива production DATABASE_URL от потребителите заради сигурност. Няма да го намерите в:
- Deployment настройки
- Environment variables
- Database панел (показва само development)
- Никъде в интерфейса!

## 🟢 КАКВО ИМАТЕ:

### 1. Development DATABASE_URL (този работи!)
1. Отворете **Database** панел в Replit
2. Кликнете **Commands** таб
3. Вижте секция **Environment variables**
4. Там е вашият DATABASE_URL

⚠️ НО ТОВА Е DEVELOPMENT, НЕ PRODUCTION!

### 2. Neon Dashboard (външен достъп)
Ако production базата е в Neon:
1. Идете на https://console.neon.tech
2. Намерете вашия проект
3. Connection Details → DATABASE_URL

## ✅ РЕШЕНИЯ:

### Опция 1: Директно в Neon (най-лесно)
Забравете за DATABASE_URL! Просто:
1. Отидете в Neon Dashboard
2. SQL Editor
3. Копирайте production-import-simple.sql
4. Execute

### Опция 2: Replit Support
Пишете на support@replit.com:
"I need to import data to production database. Please provide production DATABASE_URL or help with import."

### Опция 3: Използвайте development
Вашият development сайт работи перфектно!
Защо да се мъчите с production?

## 🎯 ПРЕПОРЪКА:
Използвайте **Опция 1** - директно в Neon Dashboard.
Няма нужда от DATABASE_URL!
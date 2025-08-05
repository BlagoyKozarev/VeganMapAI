# 🚀 NEON DASHBOARD SQL GUIDE - Стъпка по стъпка

## 📍 1. ОТИДЕТЕ НА NEON DASHBOARD
**URL: https://console.neon.tech**

## 🔐 2. ВЛЕЗТЕ В АКАУНТА СИ
- Email и парола
- Или с GitHub/Google ако сте се регистрирали така

## 📊 3. НАМЕРЕТЕ ВАШИЯ ПРОЕКТ
След login ще видите:
- **Projects** списък
- Търсете проект с име като:
  - `VeganMapAI`
  - `vegan-map-production`
  - Или проект свързан с Replit deployment

## ⚠️ 4. ВАЖНО: ПРОВЕРЕТЕ ЧЕ Е PRODUCTION
Ако имате 2 проекта/бази:
- **Development** (това НЕ искате)
- **Production** (✅ ТОВА искате)

Кликнете на **Production** проекта!

## 🔧 5. НАМЕРЕТЕ SQL EDITOR
След като отворите проекта, търсете:
- **SQL Editor** бутон/таб
- Или **Query** бутон
- Или **SQL** икона
- Може да е в:
  - Главното меню
  - Sidebar отляво
  - Горе като таб

## 📝 6. КОПИРАЙТЕ SQL ФАЙЛА
1. Отворете `production-import-simple.sql` във вашия Replit
2. Натиснете **Ctrl+A** за да изберете всичко
3. **Ctrl+C** за копиране
4. Върнете се в Neon SQL Editor

## 📋 7. ПОСТАВЕТЕ И ИЗПЪЛНЕТЕ
1. Кликнете в SQL Editor полето
2. **Ctrl+V** за да поставите SQL-а
3. Проверете че започва с:
   ```sql
   -- VeganMapAI Simple Production Import
   DELETE FROM vegan_score_breakdown;
   DELETE FROM restaurants;
   ```
4. Кликнете **Run** или **Execute** бутона
5. Изчакайте да завърши (10-30 секунди)

## ✅ 8. ПРОВЕРКА ЗА УСПЕХ
В Neon ще видите:
- "Query executed successfully"
- "408 rows affected" или подобно
- Без червени грешки

## 🌐 9. ТЕСТВАЙТЕ САЙТА
Веднага отворете: **https://vegan-map-ai-bkozarev.replit.app**
- Картата трябва да покаже ресторанти
- Няма "Loading restaurants..."
- Можете да кликате на маркерите

## ❌ АКО НЕЩО НЕ РАБОТИ:
1. **Грешка в SQL Editor?**
   - Проверете че сте в Production база
   - Опитайте да изпълните SQL на части

2. **Сайтът още не показва ресторанти?**
   - Hard refresh: Ctrl+F5
   - Отворете в инкогнито/private прозорец
   - Изчакайте 1-2 минути

3. **Не намирате SQL Editor?**
   - Търсете "Dashboard" → "SQL"
   - Или "Tools" → "SQL Editor"
   - Или директно URL: https://console.neon.tech/app/projects/YOUR_PROJECT_ID/query

## 💡 СЪВЕТ:
Първо проверете с малка заявка дали сте в правилната база:
```sql
SELECT COUNT(*) FROM restaurants;
```
Ако върне 0 - правилна база!
Ако върне 408 - грешна база (development)!
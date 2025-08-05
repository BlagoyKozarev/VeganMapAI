# 🆘 СПЕШНО РЕШЕНИЕ - Ако не намирате Production URL

## Проблем
Production сайтът показва 0 ресторанта защото production базата е празна.

## Временно решение (докато намерите URL)

### Опция 1: Използвайте Database Pane
1. Отворете **Database** таб (ляво меню)
2. Горе ще има dropdown - превключете на **"Production"**
3. Ако виждате празна база:
   - Кликнете **"Import"**
   - Изберете `restaurants-export.json`
   - Или копирайте SQL от development

### Опция 2: През Neon Dashboard
1. Отидете на https://console.neon.tech
2. Влезте с вашия акаунт
3. Намерете проекта
4. Копирайте connection string
5. Изпълнете: `DATABASE_URL="url-от-neon" tsx import-production-fix.ts`

### Опция 3: Свържете се с Replit Support
Ако нищо не работи, питайте support:
"I can't find the production DATABASE_URL in my deployment settings"

## Защо е важно
- Без данни в production, сайтът е безполезен
- 408 ресторанта чакат да бъдат импортирани
- Потребителите виждат празна карта

## Проверка
След импорт проверете:
https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data

Трябва да покаже: "count": 354 (не 0)
# РЪЧНО РЕШЕНИЕ ЗА PRODUCTION

## Проблем:
Production използва отделна база данни от Development

## Решение - имате 2 опции:

### Опция 1: Използвайте същата база (ПРЕПОРЪЧИТЕЛНО)
1. Отворете **Deployments** таб в Replit
2. Намерете вашия deployment
3. Кликнете **Settings** или **Environment Variables**
4. Добавете/обновете:
   - `DATABASE_URL` = копирайте стойността от development DATABASE_URL
   - Това ще накара production да използва същата база с 408 ресторанта

### Опция 2: Копирайте данните в production базата
1. Отворете **Database** панела
2. Кликнете на **Production Database**
3. Намерете бутон **"Run SQL"** или **"Execute Query"**
4. Копирайте съдържанието на файла `production-import-simple.sql`
5. Поставете и изпълнете

## След това:
- Рестартирайте deployment
- Production ще покаже всички 408 ресторанта

## Проверка:
https://vegan-map-ai-bkozarev.replit.app трябва да покаже картата с всички ресторанти
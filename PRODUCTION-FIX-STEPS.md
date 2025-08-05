# Стъпки за поправка на Production

## Проблем
Production API връща 0 ресторанта въпреки че базата има 408.

## Причина
Production deployment използва стар код който не зарежда правилно данните.

## Решение - Изберете едно от двете:

### Вариант 1: Force Redeploy (Препоръчително)
1. Отидете в **Deployments** таб
2. Кликнете на трите точки (...) до deployment-а
3. Изберете **"Promote to production"**
4. Това ще принуди пълен redeploy с най-новия код

### Вариант 2: Manual Fix
1. Отидете в **Deployments** → **"Edit commands and secrets"**
2. В полето "Build command" добавете:
   ```
   npm run build && echo "Build completed at $(date)"
   ```
3. Кликнете **Deploy**

## Проверка дали работи
След 1-2 минути проверете:
https://vegan-map-ai-bkozarev.replit.app/

Трябва да видите картата с всички 408 ресторанта.

## Ако още не работи
1. Проверете Deployment logs за грешки
2. Споделете логовете с мен
3. Ще направим по-дълбока диагностика
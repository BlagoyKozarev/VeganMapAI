# 📍 Къде да намерите Production DATABASE_URL

## Метод 1: От Deployments интерфейса

1. **Отворете Deployments таб** (горе в менюто)
   
2. **Кликнете на вашия deployment**
   - Името е: `vegan-map-ai-bkozarev`
   - Статус: Autoscale
   
3. **Търсете секцията "Settings" или "Configuration"**
   - Може да е в дясно или като отделен таб
   
4. **Намерете "Environment Variables" или "Secrets"**
   - DATABASE_URL ще бъде там
   - Започва с: `postgresql://`
   - Съдържа: `.neon.tech`

## Метод 2: От Deployment логовете

1. Отворете **Deployments**
2. Кликнете на вашия deployment
3. Отидете на **Logs**
4. Търсете за "DATABASE_URL" в логовете

## Метод 3: Ако не виждате Environment Variables

Понякога Environment Variables са скрити. Опитайте:

1. **Кликнете на трите точки (...) или settings икона**
2. **Търсете "Configure", "Settings", или "Environment"**
3. **Може да е под "Advanced" настройки**

## Какво търсите:

```
DATABASE_URL = postgresql://username:password@ep-something.eu-central-1.aws.neon.tech/database-name
```

## Ако все още не намирате:

1. **Проверете дали deployment е активен**
   - Трябва да показва "Running" или "Active"
   
2. **Проверете правата си**
   - Трябва да сте owner на проекта
   
3. **Опитайте от Database таб**
   - Понякога URL е видим там за production база

## Алтернативен начин:

Ако имате достъп до Neon Dashboard:
1. Влезте в https://console.neon.tech
2. Намерете вашия проект
3. Копирайте connection string оттам
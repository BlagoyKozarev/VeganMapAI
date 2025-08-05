# 🚀 БЪРЗО РЕШЕНИЕ - Deploy наново с данните

Ако не можете да намерите production DATABASE_URL, може да:

## 1. Re-deploy с попълнена база

### Стъпки:
1. Импортирайте данните в **текущата** база:
   ```bash
   tsx import-restaurants.ts
   ```

2. След това deploy-нете отново:
   - Кликнете **"Deployments"**
   - Кликнете **"Deploy"** или **"Redeploy"**
   - Изчакайте deployment да завърши

3. Новият deployment ще използва текущата база с 408 ресторанта

## 2. Използвайте Database таб

1. Отворете **Database** таб (ляво меню)
2. Проверете дали има **dropdown** за Production/Development
3. Ако да - превключете на Production и импортирайте

## 3. Питайте в Replit Community

Постнете във форума:
"How to find production DATABASE_URL in Autoscale deployment?"

Някой ще ви помогне бързо!
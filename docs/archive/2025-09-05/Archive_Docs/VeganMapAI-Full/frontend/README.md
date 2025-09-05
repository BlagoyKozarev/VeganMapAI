# VeganMapAI - Static Build

Финален статичен build на VeganMapAI приложението, готов за деплоймент на всякакъв статичен web host.

## Съдържание

- `index.html` - Главната HTML страница
- `assets/` - CSS и JavaScript файлове
- `manifest.json` - PWA манифест
- `sw.js` - Service Worker за PWA функционалност

## Инструкции за хостинг

### 1. Netlify
```bash
# Качи цялата dist/ папка в Netlify dashboard
# или използвай Netlify CLI:
netlify deploy --dir=. --prod
```

### 2. Vercel
```bash
# Качи цялата dist/ папка
vercel --prod
```

### 3. GitHub Pages
```bash
# Качи съдържанието в gh-pages branch
git add .
git commit -m "Deploy VeganMapAI static build"
git push origin gh-pages
```

### 4. AWS S3 + CloudFront
```bash
# Качи в S3 bucket с static website hosting
aws s3 sync . s3://your-bucket-name --delete
```

### 5. Firebase Hosting
```bash
# Инициализирай Firebase проект
firebase init hosting
# Качи файловете
firebase deploy
```

## Важни бележки

⚠️ **ATTENTION**: Това е статичен build без backend функционалност!

### Ограничения:
- Няма AI chat (изисква OpenAI API)
- Няма voice функционалност (изисква Whisper API)
- Няма database операции (профил, favorite ресторанти)
- Няма Google Maps API данни (изисква backend proxy)

### Работещи функции:
- ✅ Frontend интерфейс
- ✅ Responsive дизайн
- ✅ PWA функционалност
- ✅ Service Worker за offline caching
- ✅ Mobile оптимизация

## За пълна функционалност

За да работят всички функции (AI chat, voice, database, Google Maps), трябва да деплоирате пълния full-stack проект с backend на:
- Replit Deployments
- Railway
- Render
- Heroku
- Vercel с API routes

## Технически детайли

- **Build size**: ~800KB (gzipped: ~220KB)
- **Framework**: React 18 + Vite
- **UI**: Tailwind CSS + Radix UI
- **PWA**: Manifest + Service Worker
- **Compatibility**: Модерни браузъри (Chrome, Firefox, Safari, Edge)

---
Built with ❤️ by VeganMapAI Team
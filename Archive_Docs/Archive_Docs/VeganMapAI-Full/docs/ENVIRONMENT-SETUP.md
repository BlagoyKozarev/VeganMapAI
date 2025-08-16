# Environment Variables - Complete Reference

## 🔑 Backend Environment (.env файл)

Създай `.env` файл в `backend/` директорията:

```bash
# =================
# DATABASE CONFIG
# =================
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# PostgreSQL Connection Details (алтернативно на DATABASE_URL)
PGHOST=your-postgres-host.com
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_secure_password
PGDATABASE=veganmapai_db

# =================
# AI & APIS
# =================

# OpenAI API за AI Chat & Voice Assistant
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Google Maps API за ресторанти, геолокация, maps
GOOGLE_MAPS_API_KEY=AIzaSy-your-google-maps-api-key

# =================
# AUTHENTICATION
# =================

# Session Secret за Express Sessions (генерирай random string)
SESSION_SECRET=your-super-secret-random-string-minimum-32-chars

# Replit Auth (само ако деплоираш на Replit)
REPLIT_DOMAINS=your-repl-name.your-username.replit.app
REPL_ID=your-repl-unique-id
ISSUER_URL=https://replit.com/oidc

# =================
# SERVER CONFIG
# =================
NODE_ENV=production
PORT=5000
```

## 🌐 Frontend Environment 

За Vite build, създай `.env` файл в `frontend/` или корен на проекта:

```bash
# Google Maps API за frontend карта
VITE_GOOGLE_MAPS_API_KEY=AIzaSy-your-google-maps-api-key
```

## 📋 Как да получиш API ключовете:

### 1. OpenAI API Key
1. Отиди на https://platform.openai.com/api-keys
2. Влез в профила си
3. Натисни "Create new secret key"
4. Копирай ключа (започва с `sk-proj-`)
5. **Важно**: Добави credit към акаунта за Whisper и GPT-4o

### 2. Google Maps API Key
1. Отиди на https://console.cloud.google.com/
2. Създай нов проект или избери съществуващ
3. Активирай следните APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Създай credentials → API Key
5. Ограничи ключа до твоя домейн за сигурност

### 3. PostgreSQL Database
Опции за database hosting:

**Neon (препоръчително - безплатно):**
1. Регистрирай се на https://neon.tech/
2. Създай нов проект
3. Копирай connection string

**Railway:**
1. Създай акаунт на https://railway.app/
2. Deploy PostgreSQL addon
3. Копирай connection URL

**Supabase:**
1. Създай проект на https://supabase.com/
2. Отиди в Settings → Database
3. Копирай connection string

### 4. Session Secret
Генерирай произволен string:
```bash
# В terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Или онлайн:
# https://generate-secret.now.sh/32
```

## 🔒 Security Best Practices

### Environment файлове:
- **НИКОГА** не качвай `.env` файлове в Git
- Използвай `.env.example` с примерни стойности
- В production използвай environment variables на host платформата

### API Keys protection:
- Ограничи Google Maps API ключ до твоя домейн
- Монитори OpenAI API usage за неочаквани разходи
- Ротирай ключовете редовно

### Database Security:
- Използвай SSL connection в production
- Никога не изпращай database credentials в plain text
- Backup базата данни редовно

## 🚀 Production Deployment

### Netlify (Frontend)
В Netlify dashboard:
1. Site Settings → Environment Variables
2. Добави: `VITE_GOOGLE_MAPS_API_KEY`

### Vercel (Full-Stack)
```bash
vercel env add OPENAI_API_KEY
vercel env add GOOGLE_MAPS_API_KEY  
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
```

### Railway (Backend)
В Railway dashboard:
1. Service Settings → Variables
2. Добави всички backend environment variables

### Replit Deployments
Използвай Secrets tab в Replit:
- Добави всички необходими ключове
- Автоматично ще бъдат достъпни в приложението

## ✅ Environment Validation

Проверка дали всички ключове работят:

```bash
# Backend test:
cd backend/
npm test

# Manual check в Node.js:
node -e "console.log('OpenAI:', process.env.OPENAI_API_KEY?.slice(0,10))"
node -e "console.log('Google:', process.env.GOOGLE_MAPS_API_KEY?.slice(0,10))"
```

## 🐛 Troubleshooting

### OpenAI API Errors:
- **401 Unauthorized**: Грешен API key
- **429 Rate Limited**: Превишен лимит, добави credit
- **400 Bad Request**: Проверни формата на заявката

### Google Maps Errors:
- **API key not valid**: Провери дали API е активиран
- **REQUEST_DENIED**: Ограничи ключа до твоя домейн
- **OVER_QUERY_LIMIT**: Превишен дневен лимит

### Database Connection:
- **Connection refused**: Проверни hostname и port
- **Authentication failed**: Грешен username/password
- **SSL required**: Добави `?sslmode=require` в URL

---

🔐 **Запомни**: Environment variables са критични за сигурността и функционалността на приложението!
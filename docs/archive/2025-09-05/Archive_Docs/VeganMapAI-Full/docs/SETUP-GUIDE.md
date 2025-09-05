# VeganMapAI - Complete Setup Guide

## 🏗️ Architecture Overview

**Frontend**: React 18 + Vite (статичен build в `/frontend`)
**Backend**: Express.js + Node.js (в `/backend`)
**Database**: PostgreSQL с Drizzle ORM
**Authentication**: Replit Auth (OpenID Connect)

---

## 🔑 Required API Keys & Environment Variables

### Backend Environment (.env файл):

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# PostgreSQL Connection Details
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database-name

# OpenAI для AI Chat & Voice
OPENAI_API_KEY=sk-your-openai-api-key

# Google Maps за ресторанти и геолокация
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Session Security
SESSION_SECRET=your-random-secret-key-here

# Replit Auth (само за Replit deployment)
REPLIT_DOMAINS=your-domain.replit.app
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc
```

### Frontend Environment (за Vite):
```bash
# Google Maps за frontend map
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 🗄️ Database Setup

### 1. PostgreSQL Database
Проектът използва PostgreSQL с Drizzle ORM. Необходими таблици:

```sql
-- Users (за Replit Auth)
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions (за Replit Auth)
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- User Profiles
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR UNIQUE REFERENCES users(id),
  dietary_preferences TEXT[],
  allergies TEXT[],
  cuisine_preferences TEXT[],
  price_range VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants
CREATE TABLE restaurants (
  id VARCHAR PRIMARY KEY,
  place_id VARCHAR UNIQUE,
  name VARCHAR NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone_number VARCHAR,
  website VARCHAR,
  price_level INTEGER,
  cuisine_types TEXT[],
  opening_hours JSONB,
  photos JSONB[],
  rating DECIMAL(2,1),
  review_count INTEGER,
  vegan_score DECIMAL(3,2),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Favorite Restaurants
CREATE TABLE favorite_restaurants (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  restaurant_id VARCHAR REFERENCES restaurants(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- Chat History
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Database Migration
```bash
cd backend
npm install
npm run db:push
```

---

## 🚀 Deployment Instructions

### Option 1: Full-Stack на Replit
1. Upload backend файловете
2. Конфигурирай environment variables
3. Deploy с Replit Deployments

### Option 2: Frontend (Netlify) + Backend (Railway/Render)

**Frontend Deployment:**
```bash
# Upload frontend/ папката в Netlify
# Конфигурирай environment variables в Netlify dashboard
```

**Backend Deployment (Railway):**
```bash
# Upload backend/ папката
# Конфигурирай PostgreSQL addon
# Добави environment variables
```

### Option 3: Vercel Full-Stack
```bash
# Upload цялата структура
# Конфигурирай Vercel PostgreSQL
# Добави environment variables
```

---

## 🔐 Authentication Flow

### Replit Auth Setup:
1. **REPLIT_DOMAINS**: домейна на приложението
2. **REPL_ID**: unique ID на Replit проекта  
3. **SESSION_SECRET**: произволен string за session security

### Login Flow:
- `/api/login` → започва OAuth flow
- `/api/callback` → Replit callback
- `/api/logout` → изход от системата
- `/api/auth/user` → проверка на статуса

---

## 🛠️ API Endpoints

### Authentication:
- `GET /api/auth/user` - текущ потребител
- `GET /api/login` - започни login
- `GET /api/logout` - logout

### Restaurants:
- `GET /api/restaurants/all-available` - всички ресторанти с AI scores
- `GET /api/restaurants/search` - търсене по критерии
- `POST /api/restaurants/favorite` - добави в любими
- `DELETE /api/restaurants/favorite/:id` - премахни от любими

### AI Chat:
- `POST /api/audio` - voice chat (Whisper + GPT-4o)
- `GET /api/chat/history` - история на чат

### User Profiles:
- `POST /api/user/profile` - създай/обнови профил
- `GET /api/user/profile` - вземи профил данни

---

## ⚠️ Important Notes

### API Keys Sources:
- **OpenAI**: https://platform.openai.com/api-keys
- **Google Maps**: https://console.cloud.google.com/apis/credentials

### Costs Optimization:
- Google Places API cached с geo-hash
- OpenAI Whisper за speech-to-text
- GPT-4o за AI responses

### Security:
- CORS конфигуриран за production
- Session storage в PostgreSQL
- API keys в environment variables

---

## 📱 Features

✅ **Working Features:**
- Interactive map с clustering
- AI chat с voice assistant
- User profiles с allergies
- Restaurant search & filtering
- Vegan score calculation (6 dimensions)
- PWA support за mobile
- Responsive design

⚠️ **Requirements:**
- PostgreSQL database
- OpenAI API key
- Google Maps API key
- Valid domain за Replit Auth

---

Built with ❤️ by VeganMapAI Team
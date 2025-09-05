---
TITLE: VeganMapAI System Architecture
VERSION: 2025.09.05
UPDATED_AT: 2025-09-05
OWNER: @bkozarev
SOURCE: script:tools/gen-architecture.md.ts
---

# VeganMapAI System Architecture

## Current System Overview
VeganMapAI is a full-stack PWA helping users discover vegan restaurants in Sofia, Bulgaria.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + Node.js ES modules
- **Database:** PostgreSQL + Drizzle ORM
- **Maps:** Google Maps API + Leaflet clustering
- **CDN:** Google Cloud Storage
- **Hosting:** Firebase Hosting

## Data Sources
- **Restaurant Database:** 511 real Sofia restaurants
- **CDN GeoJSON:** https://storage.googleapis.com/veganmapai-cdn/geojson/sofia.geojson
- **API Fallback:** /api/restaurants/geojson for CDN failures

## Core Features
- ✅ **Interactive Map** - Leaflet with color-coded clustering
- ✅ **Restaurant Search** - Real-time filtering and search
- ✅ **AI Chat Assistant** - OpenAI GPT-4o integration
- ✅ **Voice Assistant** - Speech-to-text with Whisper
- ✅ **PWA Support** - Installable mobile app
- ✅ **Vegan Scoring** - 6-dimension restaurant scoring system

## Production URLs
- **Main App:** https://veganmapai-1a8b7.web.app
- **Custom Domain:** https://veganmapai.ai (pending SSL)
- **CDN:** https://storage.googleapis.com/veganmapai-cdn/

## Performance Optimizations
- Geo-hash caching for Google Places API
- Viewport-based restaurant loading
- Service Worker caching with no-cache headers
- GCS CDN for static restaurant data

Generated on: 2025-09-05T14:02:53.901Z

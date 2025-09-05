#!/usr/bin/env -S node --loader tsx/esm
import fs from "node:fs";

const architecture = {
  frontend: "React 18 + TypeScript + Vite",
  backend: "Express.js + Node.js ES modules", 
  database: "PostgreSQL + Drizzle ORM",
  maps: "Google Maps API + Leaflet clustering",
  cdn: "Google Cloud Storage",
  hosting: "Firebase Hosting",
  restaurants_count: "511"
};

const md = `---
TITLE: VeganMapAI System Architecture
VERSION: 2025.09.05
UPDATED_AT: ${new Date().toISOString().slice(0,10)}
OWNER: @bkozarev
SOURCE: script:tools/gen-architecture.md.ts
---

# VeganMapAI System Architecture

## Current System Overview
VeganMapAI is a full-stack PWA helping users discover vegan restaurants in Sofia, Bulgaria.

## Tech Stack
- **Frontend:** ${architecture.frontend}
- **Backend:** ${architecture.backend}
- **Database:** ${architecture.database}
- **Maps:** ${architecture.maps}
- **CDN:** ${architecture.cdn}
- **Hosting:** ${architecture.hosting}

## Data Sources
- **Restaurant Database:** ${architecture.restaurants_count} real Sofia restaurants
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

Generated on: ${new Date().toISOString()}
`;

fs.writeFileSync("docs/architecture.md", md);
console.log("✅ Generated docs/architecture.md");
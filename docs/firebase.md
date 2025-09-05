---
TITLE: Firebase Configuration & Authentication
VERSION: 2025.09.05  
UPDATED_AT: 2025-09-05
OWNER: @bkozarev
SOURCE: script:tools/gen-firebase.md.ts
---

# Firebase Project Configuration

## Project Details
- **Project ID:** veganmapai-1a8b7
- **Project Name:** VeganMapAI
- **Hosting URL:** https://veganmapai-1a8b7.web.app
- **Custom Domain:** veganmapai.ai

## Authentication Providers
- ✅ Google
- ✅ Apple
- ✅ Facebook
- ✅ Twitter

## Services Enabled
- ✅ **Hosting** - Static site deployment with PWA support
- ✅ **Authentication** - OAuth providers + custom domains
- ✅ **Analytics** - GA4 tracking (G-2Q6WZ51YKV)
- ✅ **Admin SDK** - Server-side authentication

## Domain Configuration
- **Primary:** veganmapai.ai
- **WWW:** www.veganmapai.ai → veganmapai.ai (redirect)
- **Auth:** auth.veganmapai.ai → Firebase Auth

## Security Configuration
- ✅ HTTPS enforced
- ✅ CORS configured for API access
- ✅ Service Worker cache headers: no-cache, no-store, must-revalidate
- ✅ Firebase Admin SDK with token verification

## Recent Changes
- **2025-09-05:** PWA Service Worker headers fixed with radical no-cache approach
- **2025-08-19:** Complete Firebase secrets integration and Admin SDK setup
- **2025-08-18:** GCS CDN integration for restaurant data

Generated on: 2025-09-05T14:02:52.409Z

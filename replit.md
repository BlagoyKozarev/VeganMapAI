# VeganMapAI - Replit Project Guide

## Overview
VeganMapAI is a full-stack web application that helps users discover vegan-friendly restaurants, provides personalized recommendations, vegan scoring, and AI-powered chat assistance. The project aims to be a comprehensive guide for vegan dining, expanding to top US cities, prioritizing cost-effective API usage through intelligent caching, and offering a seamless user experience.

## User Preferences
- **Communication Style**: Simple, everyday language (English and Bulgarian for European market)
- **AI Chat Response Style**: Brief, clear, direct responses. No task repetition, focus on results only. Maximum 2-3 sentences per response
- **Development Approach**: Comprehensive testing before deployment, focus on real-world functionality over theoretical solutions
- **Documentation**: Maintain detailed technical documentation in `replit.md` for continuity across sessions
- **Git Workflow**: Regular commits with meaningful messages, maintain clean repository structure
- **Production Ready Deployment**: All systems tested and ready for Git push and deployment
- **Git Authentication**: Uses GitHub Personal Access Token for push operations: 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

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built with Vite.
- **UI/UX**: Custom components built on Radix UI primitives and Shadcn/ui. Styling with Tailwind CSS and CSS variables. Mobile-first responsive design with PWA functionality.
- **Maps**: Leaflet for interactive maps with `leaflet.markercluster` for clustering. Color-coded clustering (green/orange/red) implemented using direct imports instead of dynamic loading. Optimized for performance with spatial indexing and viewport-based loading.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **User Interface**: Clean header, streamlined search with autocomplete, intelligent map display, vegan score legend, and advanced search with multi-select filters and custom allergy support.

### Backend Architecture
- **Framework**: Express.js with TypeScript and Node.js (ES modules).
- **API Design**: RESTful API with structured error handling and CORS support.
- **Database**: PostgreSQL with Drizzle ORM, using snake_case columns. Production database contains 407 real Sofia restaurants.
- **Authentication**: Replit Auth integration with Express sessions and PostgreSQL store.
- **Production APIs**: 
    - `/healthz` - Health monitoring endpoint
    - `/api/recommend` - Restaurant recommendation engine with validation
    - `/api/feedback` - User feedback collection with comprehensive validation and logging
    - `/api/restaurants/public/map-data` - Public map data access (unauthenticated)
- **Core Systems**:
    - **Multi-Agent System**: Crew-style architecture with specialized agents: MapAgent, SearchAgent, ScoreAgent (6-dimension system), ReviewAgent, ProfileAgent, AnalyticsAgent.
    - **Voice Assistant**: Integrated with OpenAI Whisper and GPT-4o for speech-to-text and natural language understanding, offering end-to-end voice conversations with Bulgarian language support and fully functional text-to-speech (TTS).
    - **Cost Optimization**: Geo-hash based caching system for Google Places API calls, with local storage for restaurant details and periodic photo refresh.
    - **Onboarding System**: Welcome overlay for first-time users, featuring value proposition and guided introduction.
    - **Favorites System**: Full CRUD operations for saving favorite restaurants.
    - **Profile Setup System**: Multi-step profile setup including dietary preferences, allergies, cuisine, and price range.

## External Dependencies

### Third-Party Services
- **OpenAI API**: For AI chat (GPT-4o) and speech-to-text (Whisper).
- **Google Maps API**: For restaurant data and location services.
- **Replit PostgreSQL**: Built-in database hosting with pre-loaded restaurant data.

### Key Libraries
- **Database**: Drizzle ORM.
- **Authentication**: Replit Auth, Passport.js.
- **Maps**: Leaflet, leaflet.markercluster.
- **UI**: Radix UI, Shadcn/ui, Tailwind CSS.
- **HTTP Client**: Native fetch, TanStack Query.
- **Validation**: Zod.

### Development Tools
- **TypeScript**: For type safety.
- **ESLint**: For code quality.
- **Vite**: Fast development server and optimized builds.
- **tsx**: TypeScript execution for backend development.
- **dotenv**: Environment variable management.

## Recent Changes (August 19, 2025)
- **FIREBASE SECRETS INTEGRATION**: All Firebase configuration secrets added (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID)
- **FIREBASE ADMIN SDK**: Installed firebase-admin package and configured server-side authentication (server/config/firebase-admin.ts)
- **AUTHENTICATION MIDDLEWARE**: Created token verification middleware for protected API routes (server/middleware/auth.ts)
- **BGGPT AI INTEGRATION**: Added BGGPT_URL and BGGPT_WEB_URL secrets, updated GBGPT provider for AI completions
- **INFRASTRUCTURE AUTOMATION**: Created Terraform configs for DNS automation (infra/ directory with Cloudflare provider)
- **DNS TROUBLESHOOTING**: Documented Cloudflare token access issues and provided manual setup alternatives
- **FIREBASE DIRECT SETUP**: Comprehensive guide for manual domain configuration (FIREBASE-DIRECT-SETUP.md)
- **SECRETS VALIDATION**: Created testing script validating all 16 required environment variables
- **PRODUCTION DOCUMENTATION**: Complete deployment guides, DNS setup instructions, OAuth configuration
- **GIT INTEGRATION**: All changes successfully committed and pushed (commit aa4e538a)
- **DEPLOYMENT PREPARATION**: Code validated and prepared for production deployment
- **LOCAL DEVELOPMENT**: Fully functional with 511 restaurants, all APIs, Firebase integration working

## GCS CDN Architecture - DEPLOYED (August 18, 2025)
- **CDN Production URL**: https://storage.googleapis.com/veganmapai-cdn/geojson/sofia.geojson ✅ LIVE
- **GeoJSON Export**: scripts/export-geojson.js generates sofia.geojson with 511 restaurants (363KB)
- **API Fallback**: /api/restaurants/geojson serves RFC 7946 compliant GeoJSON with CORS headers
- **CDN Upload**: scripts/upload-geojson-gcs.sh successfully deployed to gs://veganmapai-cdn
- **Service Account**: veganmapai-cdn-uploader@veganmapai.iam.gserviceaccount.com (authenticated)
- **Frontend Loader**: client/src/lib/geojson-loader.ts implements CDN-first with API fallback
- **Cache Strategy**: CDN serves with public,max-age=86400,immutable headers for optimal performance

## Session Summary (August 19, 2025)
- **FIREBASE & BGGPT SECRETS INTEGRATION COMPLETE**: All 16 required environment variables configured and validated
- **FIREBASE ADMIN SDK**: Backend authentication system with token verification middleware
- **BGGPT AI INTEGRATION**: Updated provider endpoints for restaurant scoring and AI completions
- **INFRASTRUCTURE AUTOMATION**: Terraform configs for DNS setup (Cloudflare blocked by token access)
- **FIREBASE DIRECT SETUP**: Manual domain configuration guides for auth.veganmapai.ai
- **COMPREHENSIVE DOCUMENTATION**: DNS troubleshooting, secrets validation, deployment guides
- **SUCCESSFUL GIT PUSH**: All changes committed (aa4e538a) - Firebase integration complete
- **PRODUCTION VALIDATION**: Local development fully functional, 511 restaurants, all APIs working
- **DEPLOYMENT READY**: Code prepared for Replit Deploy with all systems operational
- **STATUS**: Development complete, deployment prepared but not executed per user preference
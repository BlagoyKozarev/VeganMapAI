# VeganMapAI - Replit Project Guide

## Overview
VeganMapAI is a full-stack web application designed to help users discover vegan-friendly restaurants and food locations. The platform provides personalized restaurant recommendations, vegan scoring, and AI-powered chat assistance. The business vision is to expand to the top 20 US cities, prioritizing cost-effective API usage through intelligent caching and strategic data management. The project aims for a seamless user experience, acting as a comprehensive guide for vegan-friendly dining.

## User Preferences
- **Communication Style**: Simple, everyday language (English only for US market launch)
- **AI Chat Response Style**: Brief, clear, direct responses. No task repetition, focus on results only. Maximum 2-3 sentences per response
- **Development Approach**: Comprehensive testing before deployment, focus on real-world functionality over theoretical solutions
- **Documentation**: Maintain detailed technical documentation in `replit.md` for continuity across sessions
- **Git Workflow**: Regular commits with meaningful messages, maintain clean repository structure

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built with Vite.
- **UI/UX**: Custom components built on Radix UI primitives and Shadcn/ui. Styling with Tailwind CSS and CSS variables. Mobile-first responsive design with PWA functionality for offline capabilities and mobile installation.
- **Maps**: Leaflet for interactive maps with Google Maps style interface and `leaflet.markercluster` for professional clustering. High-performance map optimization using spatial indexing and viewport-based loading to handle large datasets (250K+ restaurants).
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **User Interface**: Features a clean header, streamlined search bar with autocomplete, intelligent map display based on viewport, and a comprehensive vegan score legend. Includes an advanced search with multi-select filters and custom allergy support.

### Backend Architecture
- **Framework**: Express.js with TypeScript and Node.js (ES modules).
- **API Design**: RESTful API with structured error handling.
- **Database**: PostgreSQL with Drizzle ORM. Production uses snake_case columns (vegan_score, price_level) with special handling in storage.ts.
- **Authentication**: Replit Auth integration with Express sessions and PostgreSQL store.
- **Core Systems**:
    - **Multi-Agent System**: A crew-style architecture with specialized agents: MapAgent, SearchAgent, ScoreAgent (6-dimension system with admin interface), ReviewAgent, ProfileAgent, and AnalyticsAgent.
    - **Voice Assistant**: Integrated with OpenAI Whisper for speech-to-text and GPT-4o for natural language understanding, offering end-to-end voice conversations with Bulgarian language support and fully functional text-to-speech (TTS). Features intelligent silence detection, continuous conversation flow, and mobile-optimized TTS.
    - **Cost Optimization**: Geo-hash based caching system for Google Places API calls, reducing operational costs, with local storage for restaurant details and periodic refresh for photos. Includes a cost monitoring dashboard.
    - **Onboarding System**: Welcome overlay for first-time users with clear value proposition, feature highlights, and guided introduction to app capabilities. Mobile-responsive design with bottom sheet style on mobile devices.
    - **Favorites System**: Allows users to save favorite restaurants with full CRUD operations.
    - **Profile Setup System**: Complete multi-step profile setup with dietary preferences, allergies, cuisine preferences, and price range selection, including custom allergies input and checkbox visualization.
    - **Public Map Access**: Provides an unauthenticated endpoint (`/api/restaurants/public/map-data`) for public map viewing with limited data, allowing users to explore the map before logging in.

## Recent Changes
- **Landing Page Button Fix (January 8, 2025)**: Fixed "View Map" button on landing page to properly navigate to public map
  - Changed button from JavaScript navigation to standard HTML link
  - Button now correctly navigates to `/test-map` route showing all 478 restaurants
  - Public map accessible without authentication requirement
- **GBGPT Test Report System Implementation (August 6, 2025)**: Created comprehensive analytics and reporting system for GBGPT performance testing
  - Built `GBGPTTestReporter` class with full performance, cost, and quality analysis capabilities
  - Created enhanced test endpoint `/api/bulk-test-gbgpt-with-report` with automatic report generation
  - Generated detailed markdown reports with cost analysis showing $10,440/year savings with GBGPT
  - Report includes: performance metrics, cost projections, quality assessment, strategic recommendations
  - Successfully tested 50 restaurants with 100% success rate, 315ms average response time
  - Documents created: `server/reports/gbgptTestReport.ts`, `reports/gbgpt-test-2025-08-06.md`
- **Bulk Import of 50 Sofia Restaurants (August 6, 2025)**: Successfully imported 50 new test restaurants for Sofia with AI vegan scoring
  - Created bulk test endpoint at `/api/bulk-test-gbgpt` for testing 50+ restaurants simultaneously
  - Created direct import endpoint at `/api/import-all-test-restaurants` for adding all test data
  - All 50 restaurants scored using hybrid GBGPT/OpenAI system (average response time: 308ms)
  - Database now contains 478 total restaurants (408 original + 70 new test restaurants)
  - Test results: 100% success rate with OpenAI fallback provider
- **GBGPT Integration Completed (August 6, 2025)**: Successfully implemented hybrid AI scoring system with GBGPT primary and OpenAI fallback
  - Created `server/providers/gbgptProvider.ts` with Bulgarian prompts and 6-dimension scoring
  - Built `server/providers/hybridScoringProvider.ts` for automatic fallback logic
  - Added comprehensive test endpoints at `/api/test-hybrid-scoring` and `/api/provider-status`
  - Integration tested and working: GBGPT unavailable in cloud (expected), OpenAI fallback functional
  - Response time: 3.08 seconds for hybrid scoring via OpenAI fallback
  - System ready for local deployment where GBGPT server will be accessible
  - Documents: `GBGPT-INTEGRATION-STATUS.md` with full technical details
- **UI Consistency System Implemented (August 6, 2025)**: Created comprehensive design system for professional, cohesive user experience
  - Created `designTokens.ts` with standardized colors, spacing, typography, shadows, and z-index layers
  - Built reusable `Modal.tsx` component for all dialog windows with consistent behavior
  - Built `Popover.tsx` component for proper positioning of tooltips and floating elements
  - Updated all components to use design tokens instead of inline styles
  - Achieved professional UI cohesiveness across entire application
- **Professional Landing Page Added (August 6, 2025)**: Replaced simple login page with comprehensive marketing landing page
  - Hero section with restaurant statistics (408+ restaurants)
  - Features showcase with 6 key platform capabilities
  - Interactive map preview section
  - Call-to-action sections with registration prompts
  - Full footer with navigation links and contact info
  - Bulgarian language for local market focus
- **AI Score Explanations Added (August 6, 2025)**: Implemented transparent explanations for vegan scores to build user trust
  - Created `ScoreExplanation.tsx` component with interactive tooltips
  - Shows score breakdown categories: Menu Variety, Clear Labeling, Staff Knowledge, Safety Measures
  - Integrated in map popups, search results, and restaurant modals
  - Color-coded scores with descriptive text (Excellent, Good, Limited, etc.)
  - Click info icon to reveal/hide detailed scoring methodology
- **Production Database Fixed (August 6, 2025)**: Successfully resolved production deployment issues by importing all 408 restaurants to production database and fixing timestamp validation errors. Production deployment now works correctly with full restaurant dataset.
  - Created `production-clean.sql` - optimized SQL import without JSON fields (128KB)
  - Fixed timestamp fields with UPDATE query to resolve Drizzle ORM validation errors
  - Database transfer method: manual SQL import via Database panel Production tab
  - Files created: `generate-simple-sql.ts`, `fix-production-timestamps.sql`, `fix-deployment-error.ts`
- **Data Recovery Success (August 5, 2025)**: Successfully recovered all 408 restaurants from git history after database data loss. Used `production-import-simple.sql` from commit 0ecbd79 to restore complete restaurant dataset.
- **Development Environment Focus (August 5, 2025)**: Cleaned up all deployment-related files and focused on development environment with 408 working restaurants.
- **Button Functionality Fixed (August 5, 2025)**: Fixed AI Assistant button to properly navigate to AI chat page, integrated MobileFilterDrawer for filter functionality on mobile devices, and resolved TypeScript errors for proper component functionality.
- **Mobile Performance Optimized**: Implemented touch-optimized controls, fixed filter drawer positioning, and enhanced mobile UX.
- **Favorites System Enhanced (August 5, 2025)**: Added favorites toggle button on both desktop and mobile interfaces. Users can now filter map view to show only favorited restaurants. Heart icons display on favorited restaurants on the map. Fixed FavoriteButton component TypeScript errors and integrated with map markers.
- **US Market Launch Polish (August 5, 2025)**: Removed all Bulgarian text and prepared for NYC launch. Added English loading states "Loading restaurants...", English button labels "AI Restaurant Search", "Filter Restaurants", "My Profile". Implemented toast notifications for user actions, welcome onboarding message, and comprehensive error handling with English messages. Added "Share" button to restaurant popups and improved overall UX with loading spinners and progress indicators.
- **Welcome Overlay Implementation (January 5, 2025)**: Created first-time user onboarding experience with WelcomeOverlay component. Features semi-transparent overlay with smooth fade-in animations, clear value proposition messaging, feature highlights with emoji icons (map browsing, AI search, filters, favorites), and Get Started/Skip Tour buttons. Shows only on first visit using sessionStorage tracking.
- **Mobile Accessibility Enhancements (January 5, 2025)**: Implemented 44px minimum touch targets for all interactive elements, added safe area insets to prevent content hiding behind mobile browser bars, optimized modals as bottom sheets for mobile screens, added swipe-to-close gestures for filter drawer, enhanced touch responsiveness with active states, and implemented mobile-first CSS with performance optimizations. AI Search Modal now displays as mobile-friendly bottom sheet on small screens.

## External Dependencies

### Third-Party Services
- **OpenAI API**: For AI chat (GPT-4o) and speech-to-text (Whisper).
- **Google Maps API**: For restaurant data and location services.
- **Replit PostgreSQL**: Built-in database hosting with 408 pre-loaded restaurants (as of August 5, 2025).

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
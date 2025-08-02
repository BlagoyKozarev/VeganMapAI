# VeganMapAI - Replit Project Guide

## Overview
VeganMapAI is a full-stack web application designed to help users discover vegan-friendly restaurants and food locations. The platform provides personalized restaurant recommendations, vegan scoring, and AI-powered chat assistance. Its business vision includes expanding to the top 20 US cities, prioritizing cost-effective API usage through intelligent caching and strategic data management. The project aims for a seamless user experience, acting as a comprehensive guide for vegan-friendly dining.

## User Preferences
- **Communication Style**: Simple, everyday language with Bulgarian support
- **AI Chat Response Style**: Brief, clear, direct responses. No task repetition, focus on results only. Maximum 2-3 sentences per response
- **Development Approach**: Comprehensive testing before deployment, focus on real-world functionality over theoretical solutions
- **Documentation**: Maintain detailed technical documentation in `replit.md` for continuity across sessions
- **Git Workflow**: Regular commits with meaningful messages, maintain clean repository structure

## Recent Changes (January 2025)
- **Voice Chat with TTS**: Full voice conversation system now working with speech-to-text (Whisper) and text-to-speech functionality. Mobile TTS properly initialized with user gestures, continuous conversation flow implemented.
- **Voice Chat Optimization**: Perfect 3-second silence detection implemented. System now properly detects real user inactivity and ends conversations naturally without continuing after nonsensical background transcriptions.
- **GPT Helper Tool**: Created agent-gpt-helper.ts utility for complex debugging scenarios using OpenAI API integration.
- **Clustering System**: Completed leaflet.markercluster integration with blue cluster circles showing restaurant counts and individual green markers displaying vegan scores.
- **Map Performance**: Optimized restaurant loading and display with proper viewport-based clustering for smooth user experience.
- **Testing Framework**: Comprehensive Vitest testing suite with 100% success rate (14/14 tests passing). Features unit tests for agent functionality, map initialization, vegan scoring logic, API endpoints, audio files, and end-to-end API testing. Added e2e.test.ts as alternative to Playwright (browser dependencies incompatible with Replit environment). Optimized with mock functions for fast execution and proper authentication handling. Complete testing documentation available in TESTING-INSTRUCTIONS.md.
- **Database Fixes (Feb 1, 2025)**: Resolved user_profiles table constraint issues by adding unique constraint on user_id, removing duplicate records, and fixing Profile Setup API call format. Custom allergies now display properly with checkbox visualization and checkmarks.
- **Mobile Filter Panel (Feb 2, 2025)**: Implemented unified filter interface for both desktop and mobile versions. Desktop maintains filter panel in right-bottom corner. Mobile features same filter controls positioned right-side below vegan legend (top-72) to avoid overlap with browser address bar. Removed filter button from mobile header for cleaner design. Both versions include Min Vegan Score (0-10) and Min Google Score (0-5) sliders with proper touch controls.

## Git Repository Management
- **Replit Git Integration**: Използва built-in Git функционалността на Replit
- **Manual Operations**: За Git команди използвай Replit Git tab или Shell tab с команди като:
  ```bash
  git add .
  git commit -m "Съобщение за commit"
  git push origin main
  ```
- **Primary Branch**: main (production-ready code)
- **Development Strategy**: Direct commits to main with comprehensive testing before each commit
- **Version Control**: All major features tracked with detailed commit messages in Bulgarian and English
- **Backup Strategy**: Regular commits after each successful feature implementation
- **Key Files to Track**: 
  - `/client/src/` - React frontend components
  - `/server/` - Express backend and API routes
  - `/shared/schema.ts` - Database models and types
  - `replit.md` - Project documentation and preferences
  - Test files: `*.test.ts` - Comprehensive testing suite
- **Ignore Patterns**: node_modules, .env files, build artifacts, uploaded files in /uploads/
- **Important**: AI agent не може да изпълнява Git команди директно. Използвай Replit UI или Shell tab.
- **Complete Guide**: Пълна Git документация с testing integration в GIT-COMPLETE-GUIDE.md

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built with Vite.
- **UI/UX**: Custom components built on Radix UI primitives and Shadcn/ui. Styling is done with Tailwind CSS and CSS variables.
- **Maps**: Leaflet for interactive map functionality with Google Maps style interface and professional clustering using `leaflet.markercluster`.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **Mobile-First**: Responsive design, PWA functionality with manifest and service worker for offline capabilities and mobile app installation. Complete mobile Advanced Search with multi-select filters and custom allergies support.
- **User Interface**: Features a clean header, streamlined search bar with autocomplete, intelligent map display based on viewport, and a comprehensive vegan score legend.

### Backend Architecture
- **Framework**: Express.js with TypeScript and Node.js (ES modules).
- **API Design**: RESTful API with structured error handling.
- **Database**: PostgreSQL with Drizzle ORM, hosted on Neon Database.
- **Authentication**: Replit Auth integration with Express sessions and PostgreSQL store.
- **Core Systems**:
    - **Multi-Agent System**: A crew-style architecture with specialized agents:
        - **MapAgent**: Handles geolocation and map data.
        - **SearchAgent**: Processes user queries and applies filters.
        - **ScoreAgent**: Calculates comprehensive vegan-friendliness scores (6-dimension system: Menu Variety, Ingredient Clarity, Staff Knowledge, Cross-contamination Prevention, Nutritional Information, Allergen Management). Includes an admin interface for adjusting scoring weights.
        - **ReviewAgent**: Analyzes reviews.
        - **ProfileAgent**: Manages user preferences and personalization.
        - **AnalyticsAgent**: Tracks user behavior.
    - **Voice Assistant**: Integrated with OpenAI Whisper for superior speech-to-text and GPT-4o for natural language understanding, offering end-to-end voice conversations with Bulgarian language support and fully functional text-to-speech (TTS). Features intelligent silence detection that ends conversations after 3 seconds of real user inactivity, filters out nonsensical background transcriptions, continuous conversation flow, and mobile-optimized TTS with proper user gesture initialization.
    - **Cost Optimization**: Geo-hash based caching system for Google Places API calls, reducing operational costs. Local storage for restaurant details and periodic refresh for photo calls.
    - **Favorites System**: Allows users to save favorite restaurants with full CRUD operations.
    - **Profile Setup System**: Complete multi-step profile setup with dietary preferences, allergies, cuisine preferences, and price range selection. Features custom allergies input, checkbox visualization with checkmarks, and database constraint handling.

## External Dependencies

### Third-Party Services
- **OpenAI API**: Used for AI chat (GPT-4o) and Whisper for speech-to-text.
- **Google Maps API**: Provides restaurant data and location services.
- **Neon Database**: PostgreSQL hosting for production environment.

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
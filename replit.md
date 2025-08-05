# VeganMapAI - Replit Project Guide

## Overview
VeganMapAI is a full-stack web application designed to help users discover vegan-friendly restaurants and food locations. The platform provides personalized restaurant recommendations, vegan scoring, and AI-powered chat assistance. The business vision is to expand to the top 20 US cities, prioritizing cost-effective API usage through intelligent caching and strategic data management. The project aims for a seamless user experience, acting as a comprehensive guide for vegan-friendly dining.

## User Preferences
- **Communication Style**: Simple, everyday language with Bulgarian support
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
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Replit Auth integration with Express sessions and PostgreSQL store.
- **Core Systems**:
    - **Multi-Agent System**: A crew-style architecture with specialized agents: MapAgent, SearchAgent, ScoreAgent (6-dimension system with admin interface), ReviewAgent, ProfileAgent, and AnalyticsAgent.
    - **Voice Assistant**: Integrated with OpenAI Whisper for speech-to-text and GPT-4o for natural language understanding, offering end-to-end voice conversations with Bulgarian language support and fully functional text-to-speech (TTS). Features intelligent silence detection, continuous conversation flow, and mobile-optimized TTS.
    - **Cost Optimization**: Geo-hash based caching system for Google Places API calls, reducing operational costs, with local storage for restaurant details and periodic refresh for photos. Includes a cost monitoring dashboard.
    - **Favorites System**: Allows users to save favorite restaurants with full CRUD operations.
    - **Profile Setup System**: Complete multi-step profile setup with dietary preferences, allergies, cuisine preferences, and price range selection, including custom allergies input and checkbox visualization.
    - **Public Map Access**: Provides an unauthenticated endpoint (`/api/restaurants/public/map-data`) for public map viewing with limited data, allowing users to explore the map before logging in.

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
# VeganMapAI - Replit Project Guide

## Overview
VeganMapAI is a full-stack web application designed to help users discover vegan-friendly restaurants and food locations. The platform provides personalized restaurant recommendations, vegan scoring, and AI-powered chat assistance. Its business vision includes expanding to the top 20 US cities, prioritizing cost-effective API usage through intelligent caching and strategic data management. The project aims for a seamless user experience, acting as a comprehensive guide for vegan-friendly dining.

## User Preferences
Preferred communication style: Simple, everyday language.
AI Chat Response Style: Brief, clear, direct responses. No task repetition, focus on results only. Maximum 2-3 sentences per response.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built with Vite.
- **UI/UX**: Custom components built on Radix UI primitives and Shadcn/ui. Styling is done with Tailwind CSS and CSS variables.
- **Maps**: Leaflet for interactive map functionality with Google Maps style interface and professional clustering using `leaflet.markercluster`.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **Mobile-First**: Responsive design, PWA functionality with manifest and service worker for offline capabilities and mobile app installation.
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
    - **Voice Assistant**: Integrated with OpenAI Whisper for superior speech-to-text and GPT-4o for natural language understanding, offering end-to-end voice conversations with Bulgarian language support and automatic text-to-speech (TTS). Includes robust error handling and mobile fallback to text input.
    - **Cost Optimization**: Geo-hash based caching system for Google Places API calls, reducing operational costs. Local storage for restaurant details and periodic refresh for photo calls.
    - **Favorites System**: Allows users to save favorite restaurants with full CRUD operations.

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
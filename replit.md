# VeganMapAI - Replit Project Guide

## Overview

VeganMapAI is a full-stack web application designed to help users discover vegan-friendly restaurants and food locations. The platform uses an intelligent multi-agent architecture to provide personalized restaurant recommendations, vegan scoring, and AI-powered chat assistance. Built with modern web technologies, it features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.
AI Chat Response Style: Brief, clear, direct responses. No task repetition, focus on results only. Maximum 2-3 sentences per response.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Custom components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Maps**: Leaflet for interactive map functionality

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful API with structured error handling
- **Agent System**: Multi-agent architecture with specialized modules for different functionalities

### Multi-Agent System
The application implements a crew-style multi-agent architecture with the following specialized agents:

1. **MapAgent**: Handles geolocation, restaurant proximity searches, and map data management
2. **SearchAgent**: Processes user queries, applies filters, and returns relevant restaurant results
3. **ScoreAgent**: Calculates comprehensive vegan-friendliness scores based on multiple criteria
4. **ReviewAgent**: Analyzes reviews for sentiment, allergen warnings, and vegan mentions
5. **ProfileAgent**: Manages user preferences, dietary restrictions, and personalization
6. **AnalyticsAgent**: Tracks user behavior and generates insights for improved recommendations

## Key Components

### Database Schema
- **User Management**: Users, user profiles with dietary preferences
- **Restaurant Data**: Restaurant information, vegan scores, and breakdowns
- **User Interactions**: Favorites, visits, chat sessions, and analytics
- **Session Management**: PostgreSQL-based session storage for authentication

### Authentication System
- **Provider**: Replit Auth integration
- **Session Management**: Express sessions with PostgreSQL store
- **Security**: HTTP-only cookies, CSRF protection, secure session handling

### Vegan Scoring System
The application uses a comprehensive 6-dimension scoring system:
- Menu Variety (0-10)
- Ingredient Clarity (0-10)
- Staff Knowledge (0-10)
- Cross-contamination Prevention (0-10)
- Nutritional Information (0-10)
- Allergen Management (0-10)

### UI Components
- **Shadcn/ui**: Modern, accessible component library
- **Custom Components**: Map integration, restaurant cards, scoring displays
- **Mobile-First**: Responsive design with tab navigation
- **Progressive Web App**: Manifest and service worker for offline capabilities

## Data Flow

### User Journey
1. **Authentication**: Users authenticate via Replit Auth
2. **Profile Setup**: First-time users complete dietary preference setup
3. **Location Access**: App requests geolocation for nearby restaurant discovery
4. **Restaurant Discovery**: MapAgent fetches nearby restaurants with vegan scores
5. **Personalization**: ProfileAgent applies user preferences to filter results
6. **Interaction Tracking**: All user actions are logged for analytics and recommendations

### Agent Interaction Flow
1. **SearchAgent** processes user queries and location data
2. **MapAgent** fetches restaurants within specified radius
3. **ScoreAgent** calculates or retrieves vegan scores for restaurants
4. **ReviewAgent** analyzes reviews for additional insights
5. **ProfileAgent** personalizes results based on user preferences
6. **AnalyticsAgent** tracks interactions for future improvements

### API Structure
- **Auth Routes**: `/api/auth/*` - User authentication and session management
- **Restaurant Routes**: `/api/restaurants/*` - Restaurant data and operations
- **Search Routes**: `/api/search/*` - Search functionality and filters
- **Profile Routes**: `/api/profile/*` - User profile management
- **Chat Routes**: `/api/chat/*` - AI chat functionality
- **Analytics Routes**: `/api/analytics/*` - User behavior tracking

## External Dependencies

### Third-Party Services
- **OpenAI API**: Powers the AI chat agent and restaurant analysis
- **Google Maps API**: Provides restaurant data and location services (API key available)
- **Neon Database**: PostgreSQL hosting for production environment

### Key Libraries
- **Database**: Drizzle ORM with Neon serverless PostgreSQL
- **Authentication**: Replit Auth with passport.js
- **Maps**: Leaflet for interactive mapping
- **UI**: Radix UI primitives with Tailwind CSS
- **HTTP Client**: Native fetch with TanStack Query
- **Validation**: Zod for runtime type checking

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESLint**: Code quality and consistency
- **Vite**: Fast development server and optimized builds
- **tsx**: TypeScript execution for development server

## Deployment Strategy

### Development Environment
- **Platform**: Replit development environment
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: Managed through Replit secrets

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database Migrations**: Drizzle Kit handles schema migrations
- **Static Assets**: Served by Express in production

### Scalability Considerations
- **Database**: Connection pooling with Neon serverless PostgreSQL
- **Caching**: Query caching with TanStack Query on frontend
- **API Design**: Stateless design for horizontal scaling
- **Asset Optimization**: Vite handles code splitting and asset optimization

The application is designed to be modular and scalable, with clear separation between the agent system, API layer, and user interface. Each agent operates independently while communicating through structured JSON interfaces, enabling easy extension and maintenance of the codebase.

## Recent Changes

### July 27, 2025 - Google Maps Style Interface Implementation
- Redesigned interface to match Google Maps visual style per user request
- Added Google Maps style header with hamburger menu, search bar, and profile icons
- Implemented proper search bar with "Search for vegan places" placeholder
- Added AI assistant microphone icon and profile avatar in header
- Created Google Maps style zoom controls and location button
- Added comprehensive vegan score legend with color coding (8.5+ excellent to <4.0 very poor)
- Confirmed AI chat uses GPT-4o model as requested
- Fixed TypeScript errors in Map and RestaurantPin components
- Adjusted map container positioning for proper header clearance

### July 27, 2025 - UI Layout Refinements
- Successfully implemented clean header with two circular icons:
  - Green circle with 🎤 emoji for AI Assistant (links to /ai-chat)
  - Blue circle with "BK" initials for Profile (links to /profile)
- Completely removed footer from home page as requested
- Added "My Location" button under the Vegan Score legend
- Removed zoom controls from bottom-right to clean up interface
- Fixed positioning issues with fixed positioning for all UI elements
- Smart clustering system working properly (displays "3 clustered markers from 10 restaurants")
- All TypeScript errors resolved and components properly structured

### July 27, 2025 - Full Voice Conversation Implementation
- Implemented complete voice conversation system with Web Speech API
- Added continuous voice conversation mode with automatic listening after AI responses
- Configured intelligent timing: 5-second delay for new conversations, immediate response for active conversations
- Set adaptive timeout: 5 seconds for new conversations, 7 seconds for active conversations
- Added Clear button functionality to reset chat history and stop active voice sessions
- Added visual feedback with different colored states (green=ready, red=recording, orange=active)
- Speech recognition and synthesis both configured for Bulgarian language (bg-BG)
- AI responses optimized for concise, direct communication (2-3 sentences max)
- Voice conversation system working smoothly with proper timing controls
- System fully tested and confirmed working perfectly by user

### July 27, 2025 - Real Vegan Scoring System Implementation
- Successfully implemented authentic vegan scoring with Google Places API integration
- Built comprehensive AI scoring agent using GPT-4o for restaurant analysis
- Created 6-dimension scoring system: menu variety, ingredient clarity, staff knowledge, cross-contamination prevention, nutritional info, allergen management
- Added admin scoring page (/admin-scoring) for batch processing restaurants
- Loaded 40 real restaurants from Google Places API in Sofia area
- Started AI-powered scoring calculation replacing mock data with authentic scores
- Fixed database constraints and schema for proper vegan score breakdown storage
- System actively calculating real vegan scores for restaurants using GPT-4o analysis

### July 27, 2025 - Location Switching and Clustering Optimization
- Added location switching functionality with three preset buttons:
  - My Location (GPS), Sofia Center (42.6977, 23.3219), Vitosha Boulevard (42.6837, 23.3207)
- Improved clustering algorithm with zoom-based distance calculations
- Fixed restaurant stacking issues by implementing cluster center positioning
- Added random offsets for individual restaurants to prevent exact overlap
- Optimized clustering thresholds: zoom 17+ shows 10m clustering, zoom 15+ shows 30m clustering
- Successfully tested location switching between different restaurant zones
- System shows 19-20 individual markers from 20 restaurants at appropriate zoom levels
- User confirmed clustering performance is acceptable for daily use
- Note: User aware that more restaurants exist in Sofia center area than currently loaded (40 total in database)
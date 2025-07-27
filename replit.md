# VeganMapAI - Replit Project Guide

## Overview

VeganMapAI is a full-stack web application designed to help users discover vegan-friendly restaurants and food locations. The platform uses an intelligent multi-agent architecture to provide personalized restaurant recommendations, vegan scoring, and AI-powered chat assistance. Built with modern web technologies, it features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

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

### July 27, 2025 - Mobile-Optimized Action Menu
- Fixed restaurant pin click functionality - now properly shows action menu
- Rebuilt action menu with mobile-first design approach  
- Added proper z-index layering and backdrop blur for reliable display
- Implemented color-coded restaurant pins based on vegan scores (green 8.5+, yellow-green 6.5+, orange 5.5+, red 4.0+, gray <4.0)
- Added smart restaurant filtering to prevent overcrowding (max 15 restaurants, sorted by score)
- Enhanced for mobile with larger touch targets, drag handle, and safe area considerations
- Added address display and improved visual hierarchy in action menu
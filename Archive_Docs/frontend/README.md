# VeganMapAI Frontend

## Current Setup
The main frontend is located in the `client/` directory.

This directory contains configuration files for deployment:
- `.env.local` - Environment variables for production deployment

## Main Frontend
- **Location**: `../client/`
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI**: Radix UI + Shadcn/ui components
- **Maps**: Leaflet with MarkerCluster

## Production Deployment
Uses environment variables from `.env.local` for API endpoints and CDN configuration.
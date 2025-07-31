# VeganMapAI - Intelligent Vegan Restaurant Discovery Platform

## Overview

VeganMapAI is a comprehensive Google Maps-style platform that discovers ALL restaurants and assigns AI-generated "Vegan Friendly Scores" rather than filtering to just vegan restaurants. The platform provides complete coverage of every food establishment with uniform green pins, real-time search, and AI assistant with voice functionality.

## Key Features

### 🤖 AI-Powered Vegan Scoring
- **Multi-dimensional Analysis**: 6-category scoring system (Menu Variety, Ingredient Clarity, Staff Knowledge, Cross-contamination Prevention, Nutritional Information, Allergen Management)
- **GPT-4o Integration**: Authentic restaurant analysis with contextual vegan-friendliness assessment
- **Comprehensive Coverage**: 340+ restaurants scored across Sofia with 83.3% completion rate

### 🎙️ Voice Assistant (Bulgarian + English)
- **OpenAI Whisper**: Perfect Bulgarian speech recognition with 8-second audio capture
- **GPT-4o Responses**: Contextual AI conversations in Bulgarian and English
- **Text-to-Speech**: Browser-native TTS with language detection and user interaction compliance
- **Mobile Compatibility**: Desktop voice conversation + mobile text chat fallback

### 🗺️ Google Maps Style Interface
- **Uniform Green Pins**: All restaurants displayed with consistent visual markers
- **Real-time Search**: 15 restaurant results + 5 cuisine types with autocomplete
- **Advanced Filtering**: Vegan score filters, price ranges, cuisine types, sorting options
- **Mobile Optimization**: Touch-friendly interface with responsive design

### 📱 Progressive Web App (PWA)
- **Mobile Installation**: Native app experience with offline caching
- **Service Worker**: Enhanced performance and reliability
- **Cross-platform**: Works seamlessly on desktop and mobile devices

### 🔐 Authentication & User Management
- **Replit Auth**: Secure authentication with session management
- **User Profiles**: Personalized preferences and favorites system
- **Analytics Tracking**: User behavior insights for improved recommendations

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** + Shadcn/ui components
- **Leaflet** for interactive maps
- **TanStack Query** for state management
- **Wouter** for client-side routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **OpenAI API** (Whisper + GPT-4o)
- **Google Maps API** for restaurant data
- **Multi-agent Architecture** for specialized functionalities

### Infrastructure
- **Neon Database**: PostgreSQL hosting
- **Replit Deployment**: Development and production environment
- **PWA Service Worker**: Offline capabilities and caching

## Project Architecture

### Multi-Agent System
1. **MapAgent**: Geolocation and restaurant proximity searches
2. **SearchAgent**: Query processing and filtering
3. **ScoreAgent**: AI vegan score calculations
4. **ReviewAgent**: Sentiment analysis and allergen detection
5. **ProfileAgent**: User preferences and personalization
6. **AnalyticsAgent**: Behavior tracking and insights

### Database Schema
- **Users**: Authentication and profile management
- **Restaurants**: Complete restaurant data with AI scores
- **Favorites**: User restaurant preferences
- **Chat Sessions**: AI conversation history
- **Analytics**: User behavior tracking

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Google Maps API key

### Environment Variables
```env
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_openai_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
SESSION_SECRET=your_session_secret
```

### Development Setup
```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Start authentication flow
- `GET /api/logout` - End user session

### Restaurants
- `GET /api/restaurants/all-available` - Get all restaurants with AI scores
- `GET /api/restaurants/search` - Search restaurants with filters
- `POST /api/restaurants/score` - Calculate AI vegan score

### Voice Assistant
- `POST /api/audio` - Process voice input (Whisper transcription)
- `GET /api/chat/history` - Get conversation history
- `POST /api/chat` - Send text message to AI

### User Features
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add/remove favorites
- `GET /api/profile/stats` - Get user statistics

## Features in Detail

### Vegan Scoring Algorithm
The platform uses a sophisticated 6-dimensional scoring system:
- **Menu Variety** (25%): Range of vegan options available
- **Ingredient Clarity** (20%): Clear labeling and information
- **Cross-contamination Prevention** (20%): Kitchen practices and safety
- **Staff Knowledge** (15%): Team awareness of vegan requirements
- **Nutritional Information** (10%): Detailed nutritional data
- **Allergen Management** (10%): Allergen handling and warnings

### Voice Conversation Flow
1. **Audio Capture**: 8-second MediaRecorder sessions
2. **Whisper Transcription**: OpenAI speech-to-text processing
3. **GPT-4o Response**: Contextual AI conversation
4. **TTS Output**: Browser speech synthesis with language detection
5. **Conversation Continuation**: Automatic flow management

### Mobile Experience
- **Responsive Design**: Optimized for all screen sizes
- **Touch Interactions**: Mobile-first button sizing and gestures
- **PWA Installation**: Native app experience
- **Offline Support**: Cached restaurant data and UI

## Performance & Optimization

### Cost Optimization
- **Geo-hash Caching**: 90% reduction in Google Places API calls
- **Local Storage**: 95% reduction in restaurant detail requests
- **Periodic Updates**: 70% reduction in photo API calls
- **Target Cost**: $0.24/user/month for US expansion

### Database Performance
- **Connection Pooling**: Neon serverless PostgreSQL
- **Query Optimization**: Efficient data retrieval patterns
- **Caching Strategy**: Client-side and server-side caching

## Future Roadmap

### US Market Expansion
- **Target**: Top 20 US cities
- **Coverage Goal**: Complete food establishment mapping
- **Cost Projection**: $1,880 setup + $3,375/month operational
- **Timeline**: Q2 2025 launch preparation

### Feature Enhancements
- **Real-time Reviews**: Live review analysis and scoring updates
- **Social Features**: User reviews and community ratings
- **Business Dashboard**: Restaurant owner management portal
- **Advanced Analytics**: Detailed user behavior insights

## Contributing

This project follows modern development practices:
- **TypeScript**: Full type safety across stack
- **ESLint**: Code quality enforcement
- **Git Workflow**: Feature branches and pull requests
- **Testing**: Comprehensive test coverage (planned)

## License

[License information to be determined]

## Support

For technical questions or issues:
- **Documentation**: See `/replit.md` for detailed technical context
- **API Reference**: See individual endpoint documentation
- **Voice System**: See voice assistant troubleshooting guide

---

**Built with ❤️ for the vegan community worldwide**
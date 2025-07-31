# VeganMapAI 🌱

**Advanced AI-Powered Vegan Restaurant Discovery Platform**

A comprehensive full-stack web application that revolutionizes vegan dining discovery with intelligent restaurant mapping, AI-powered scoring, and sophisticated voice interaction technologies.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://veganmapai.replit.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🎯 Project Vision

VeganMapAI addresses the challenge of finding vegan-friendly dining options by providing **complete coverage** of ALL restaurants with AI-generated "Vegan Friendly Scores" rather than filtering to just vegan establishments. Our core principle: comprehensive mapping of every food establishment with intelligent vegan-friendliness analysis.

## ✨ Key Features

### 🗺️ Advanced Restaurant Mapping
- **Google Maps Style Interface** with professional clustering system
- **Complete Sofia Coverage**: 340+ restaurants with AI vegan scores (83.3% database completion)
- **Intelligent Clustering**: Color-coded clusters (Blue 10+, Orange 5-9, Red 2-4 restaurants)
- **Real-time Search** with autocomplete suggestions (15 restaurants + 5 cuisines on mobile)
- **Advanced Filtering** by vegan score, Google rating, price range, and cuisine types

### 🤖 AI-Powered Intelligence
- **GPT-4o Vegan Scoring**: 6-dimensional analysis system (average 1.53/10 across 340 restaurants)
  - Menu Variety, Ingredient Clarity, Staff Knowledge
  - Cross-contamination Prevention, Nutritional Info, Allergen Management
- **Voice Conversation System**: OpenAI Whisper + GPT-4o + TTS with Bulgarian language support
  - **Intelligent Timeout Management**: 10-second timeout after each response with automatic reset
  - **Seamless Conversation Flow**: Continuous voice interaction without premature termination
- **Intelligent Caching**: 90% API cost reduction through geo-hash optimization

### 📱 Progressive Web App (PWA)
- **Mobile App Installation** capability with native app experience
- **Service Worker** for offline functionality and performance caching
- **Touch-Optimized Interface** with responsive design across all devices
- **Voice Assistant**: Desktop voice conversation + mobile text chat with intelligent fallback
- **Professional Clustering**: leaflet.markercluster with smooth animations and count display

### 🔐 Enterprise Authentication
- **Replit Auth Integration** with OpenID Connect
- **Session Management** with PostgreSQL store
- **User Profiles** with dietary preferences and favorites system

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for optimized builds and HMR
- **TanStack Query** for server state management
- **Tailwind CSS** with custom design system
- **Leaflet** for interactive mapping
- **Wouter** for client-side routing

### Backend Infrastructure
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **Multi-Agent Architecture** with specialized modules:
  - MapAgent, SearchAgent, ScoreAgent, ReviewAgent, ProfileAgent, AnalyticsAgent

### AI & External Services
- **OpenAI GPT-4o** for restaurant analysis and voice conversations
- **OpenAI Whisper** for Bulgarian speech recognition
- **Google Maps API** for restaurant data and location services
- **Neon Database** for production PostgreSQL hosting

## 🎮 Core Functionality

### Restaurant Discovery System
```typescript
// Complete restaurant coverage with AI scoring
- Load ALL restaurants with knife-and-fork icons
- Generate AI vegan scores (0-10 scale) for each establishment
- Display uniform green pins with intelligent clustering
- Real-time filtering without geographic restrictions
```

### Voice Assistant Features
```typescript
// End-to-end voice conversation flow
- 8-second audio recording with MediaRecorder
- OpenAI Whisper transcription (Bulgarian support)
- GPT-4o intelligent responses
- Automatic Text-to-Speech synthesis
- Seamless conversation continuation
```

### Advanced Search & Discovery
```typescript
// Multi-layer search system
- Header search: Real-time restaurant name/address filtering
- Advanced search: Professional filters with pagination
- Mobile search: 15 restaurants + 5 cuisine suggestions
- "View on Map" integration with automatic restaurant selection
```

## 📊 Database Coverage & Performance

### Current Statistics (Sofia Region)
- **408 Total Restaurants** in database
- **340 AI Scored Establishments** (83.3% completion)
- **Average Vegan Score**: 1.53/10 across all analyzed restaurants
- **Top Vegan Restaurants**: Loving Hut (8.0), Soul Kitchen (7.8), Vita Rama (7.1)

### Cost Optimization
- **Geo-hash Caching**: 90% reduction in Google Places API calls
- **Intelligent Storage**: Local caching for restaurant details and photos
- **US Expansion Ready**: $0.24/user/month operational cost target

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Maps API key
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/VeganMapAI.git
cd VeganMapAI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys: GOOGLE_MAPS_API_KEY, OPENAI_API_KEY, DATABASE_URL

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=your_postgresql_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_id
REPLIT_DOMAINS=your_domain.replit.app
```

## 🌍 Deployment

### Replit Deployment (Recommended)
1. Fork this repository on Replit
2. Configure environment secrets
3. Run `npm run dev` to start the application
4. Use Replit Deployments for production hosting

### Production Considerations
- **Database**: Neon PostgreSQL with connection pooling
- **Static Assets**: Served by Express with Vite optimization
- **Session Storage**: PostgreSQL-based session management
- **API Optimization**: Geo-hash caching for cost efficiency

## 🔧 Development Guidelines

### Code Structure
```
├── client/                 # React frontend
│   ├── src/components/    # Reusable UI components
│   ├── src/pages/         # Route components
│   └── src/hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── agents/           # Multi-agent system modules
│   ├── routes/           # API route handlers
│   └── services/         # Business logic services
├── shared/               # Shared TypeScript schemas
└── public/              # Static assets and PWA files
```

### Key Technologies
- **Database**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom design tokens
- **Maps**: Leaflet with custom clustering algorithms

## 🎯 US Market Expansion

### Scaling Architecture
- **Target**: Top 20 US cities coverage
- **Cost Structure**: $0.24/user/month operational expenses
- **Optimization**: 90% API cost reduction through intelligent caching
- **Database Design**: Scalable multi-city restaurant coverage

### Performance Metrics
- **Geo-hash Caching**: 90% reduction in Place Search calls
- **Local Storage**: 95% reduction in Details API calls
- **Periodic Refresh**: 70% reduction in photo API calls
- **Target Efficiency**: 50-90% overall cost reduction

## 📱 Mobile Experience

### PWA Features
- **App Installation**: Native mobile app experience
- **Offline Functionality**: Service worker for cached content
- **Touch Optimization**: Mobile-first responsive design
- **Voice Integration**: Desktop voice + mobile text fallback

### Mobile-Specific Optimizations
- **Responsive Clustering**: Touch-friendly marker interactions
- **Mobile Search**: Optimized suggestion display (15+5 results)
- **Filter Drawer**: Full-screen mobile filter interface
- **Performance**: Optimized for mobile network conditions

## 🤝 Contributing

We welcome contributions to VeganMapAI! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Standards
- TypeScript for all new code
- Comprehensive error handling
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o and Whisper API services
- **Google Maps** for comprehensive restaurant data
- **Replit** for development platform and authentication
- **Neon** for PostgreSQL hosting infrastructure

## 🚀 Production Status

### GitHub Repository Ready (July 31, 2025)
- **Complete Platform**: Full-stack TypeScript application with React frontend + Express backend
- **Voice AI System**: Revolutionary OpenAI Whisper + GPT-4o + TTS with Bulgarian language support
- **Database Coverage**: 340 restaurants with authentic AI vegan scores (83.3% Sofia completion)
- **PWA Integration**: Mobile app installation with offline caching and service worker
- **Professional Clustering**: leaflet.markercluster with smooth animations and performance optimization
- **Cost Optimization**: Geo-hash caching system reducing API expenses by 90%
- **Mobile Excellence**: Complete responsive design with touch optimization and native app experience
- **Production Testing**: All critical systems tested and confirmed operational by user validation

### Current Performance Metrics
- **Restaurant Database**: 408 total establishments, 340 with AI scores
- **Average Vegan Score**: 1.53/10 across analyzed establishments
- **API Cost Efficiency**: 90% reduction through intelligent caching strategies
- **Mobile Compatibility**: Full PWA functionality with offline capabilities
- **Voice Assistant**: Perfected timeout management and conversation flow

## 📞 Support

For support and questions:
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/VeganMapAI/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/VeganMapAI/discussions)
- 📧 Contact: Create an issue for support requests

---

**Built with ❤️ for the vegan community and food enthusiasts worldwide**

*VeganMapAI - Discover. Explore. Enjoy Plant-Based Dining.*

**Status**: Production-ready platform with complete Sofia coverage, advanced voice AI, and professional mobile experience - ready for GitHub collaboration and US market expansion.
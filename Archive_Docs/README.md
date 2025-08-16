# VeganMapAI

![CI](https://github.com/BlagoyKozarev/VeganMapAI/actions/workflows/ci.yml/badge.svg)

Discover top vegan-friendly places with an AI-driven score and clean, Google Maps–style UI.

## Features
- **Map overlay UI**: search pill, compact chips, floating action buttons (My Location, Profile, AI Assistant).
- **Marker clustering**: Leaflet.markercluster with a minimal, accessible style.
- **Filters**:
  - Quick: *Only fully vegan*, basic search (name / cuisine / address)
  - Drawer (*More filters*): Price, Cuisine, Allergens, Minimum rating
- **Score breakdown**: "View Vegan Score" opens a right-side panel with component weights and details.
- **Theme**: Light by default; Dark optional via Settings.
- **Data loading**: API-first (`/api/places`), with local fallback (`/assets/data/places.json`).

## Project Structure
```
public/
  index.html                # main map page  
  test-map                  # main map page
  assets/
    css/
      map-ux.css           # overlay + bottom sheet + drawer
      map-cluster.css      # cluster minimal theme
    js/
      map-ux.js            # overlay behavior
      map-wire.js          # data, filters, Leaflet + clustering glue
    data/
      places.json          # fallback dataset
    icons.svg              # icon sprite (Material Symbols Rounded)
  pages/
    mock-step1.html
    settings.html
    api.html
    score-methodology.html
server.js                   # Express static server
```

## 🎯 Business Vision

VeganMapAI aims to become the comprehensive guide for vegan-friendly dining, expanding to the top 20 US cities with:
- Cost-effective API usage through intelligent caching
- Strategic data management and user behavior analytics
- Seamless user experience across all devices
- Community-driven restaurant verification and reviews

## 🌍 Target Markets

**Phase 1**: Sofia, Bulgaria (completed)
**Phase 2**: Top 20 US metropolitan areas
**Phase 3**: European capitals expansion

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │◄───┤  Express Server  │◄───┤  PostgreSQL DB  │
│   + Leaflet     │    │  + Multi-Agent   │    │  + Drizzle ORM  │
│   + Voice UI    │    │    System        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         └──────────────┤  External APIs   │
                        │  • OpenAI GPT-4o │
                        │  • Google Maps   │
                        │  • Whisper STT   │
                        └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- API keys for OpenAI and Google Maps

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/veganmapai.git
cd veganmapai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and database URL
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔧 Environment Variables

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
GOOGLE_MAPS_API_KEY=AIza...
SESSION_SECRET=your-session-secret
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-domain.replit.app
```

## 📱 Mobile Experience

VeganMapAI is designed mobile-first with:
- **PWA Installation**: Add to home screen functionality
- **Offline Support**: Service worker for basic functionality without internet
- **Touch Optimized**: Responsive design for all screen sizes
- **Voice Fallback**: Text input when voice is unavailable on mobile

## 🧪 AI Voice Features

- **3-Second Silence Detection**: Natural conversation flow with intelligent timeout
- **Background Noise Filtering**: Ignores nonsensical transcriptions
- **Bulgarian Language Support**: Native language processing
- **Text-to-Speech**: Natural voice responses with timing optimization

## 🗺️ Map Features

- **Professional Clustering**: Blue circles show restaurant counts, green markers show individual vegan scores
- **Viewport Optimization**: Loads restaurants based on visible map area
- **Real-time Updates**: Dynamic marker updates as user explores
- **Restaurant Details**: Comprehensive information panels with scores and reviews

## 🔄 API Optimization

- **Geo-hash Caching**: Reduces Google Places API calls by 80%
- **Strategic Refresh**: Periodic updates for photos and reviews
- **Cost Management**: Intelligent rate limiting and batch processing
- **Local Storage**: Restaurant details cached for offline access

## 📊 Vegan Scoring System

Six-dimension comprehensive scoring:
1. **Menu Variety** (20%): Range of vegan options
2. **Ingredient Clarity** (20%): Clear labeling and transparency
3. **Staff Knowledge** (15%): Understanding of vegan requirements
4. **Cross-contamination Prevention** (20%): Kitchen safety measures
5. **Nutritional Information** (15%): Detailed nutritional data
6. **Allergen Management** (10%): Allergen awareness and handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o and Whisper APIs
- Google for Maps and Places APIs
- Leaflet and markercluster communities
- Replit for hosting and authentication platform

## 📞 Support

For support, email support@veganmapai.com or join our Discord community.

---

**Made with 🌱 for the vegan community**
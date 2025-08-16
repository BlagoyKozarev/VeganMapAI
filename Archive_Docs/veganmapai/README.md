# VeganMapAI (Hybrid Lite)

Production-ready restaurant discovery platform with GCP/Firebase backend.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite (Firebase Hosting)
- **Backend**: Node.js + Express (Cloud Run)
- **Database**: Firestore
- **Maps**: Leaflet + OpenStreetMap
- **Auth**: Firebase Auth
- **Payments**: Stripe
- **Analytics**: GA4

## 🚀 Quick Start

### Option 1: Replit Deployment (Recommended)
```bash
./replit-deploy.sh
cd frontend && npm install && npm run build
npm install --production && npm start
```

### Option 2: GCP Deployment (Advanced)
1. **GCP Setup** (one-time):
   ```bash
   ./setup-gcp-deployment.sh
   ```

2. **Configure environment**:
   ```bash
   # Update .env with your API keys:
   # GOOGLE_MAPS_API_KEY=your_key
   # OPENAI_API_KEY=your_key
   # STRIPE_SECRET_KEY=your_key
   ```

3. **Full deployment**:
   ```bash
   npm run setup
   npm run deploy
   ```

## 📁 Project Structure

```
veganmapai/
├── frontend/          # React frontend
├── backend/           # Express API
├── infra/            # Cloud infrastructure
├── data/             # GeoJSON & PMTiles
└── scripts/          # Automation scripts
```

## 🔧 Configuration

### Firebase Setup
```bash
firebase login
firebase init
firebase use your-project-id
```

### GCP Setup
```bash
gcloud auth login
gcloud config set project your-project-id
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

## 🌐 Production URLs

- **Frontend**: https://veganmapai.ai
- **API**: https://api.veganmapai.ai
- **Admin**: https://admin.veganmapai.ai

## 📊 Monitoring

- Firebase Console: Performance, Analytics
- GCP Console: Cloud Run metrics, Error Reporting
- Stripe Dashboard: Payment analytics


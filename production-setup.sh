#!/bin/bash

# VeganMapAI Production Setup - Hybrid Lite Architecture
echo "🚀 Setting up VeganMapAI Production Structure..."

# 1) Създаване на структурата
mkdir -p veganmapai/{frontend,backend/{functions,batch},infra,data/{geojson,pmtiles}}
cd veganmapai
git init
echo "# VeganMapAI (Hybrid Lite)" > README.md

# 2) .gitignore
cat > .gitignore << 'EOF'
node_modules/
.dist/
.build/
.env
.env.*
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.vscode/
.idea/
dist/
build/
coverage/
.nyc_output/
*.log
.cache/
.firebase/
.gcloudignore
EOF

# 3) .env.example
cat > .env.example << 'EOF'
NODE_ENV=production
API_BASE=https://api.veganmapai.ai
GCP_PROJECT_ID=veganmapai-prod
GCP_REGION=us-central1
FIREBASE_PROJECT=veganmapai-prod
FIREBASE_DB=firestore
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EOF

# 4) Production backend API
mkdir -p backend && cd backend
npm init -y
npm i express cors axios helmet compression dotenv
npm i -D @types/node @types/express typescript tsx

cat > index.js << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://veganmapai.ai', 'https://www.veganmapai.ai'] 
    : true 
}));

// Health check
app.get('/healthz', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.get('/api/restaurants/public/map-data', async (req, res) => {
  try {
    // TODO: Integrate with Firestore or external API
    res.json({
      success: true,
      restaurants: [],
      metadata: {
        total: 0,
        source: 'firestore',
        cached: false
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🌱 VeganMapAI API running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
EOF

# Convert to ES modules
node -e "let p=require('./package.json');p.type='module';p.scripts={...p.scripts,start:'node index.js',dev:'tsx index.js',build:'tsc'};require('fs').writeFileSync('package.json', JSON.stringify(p,null,2));"
cd ..

# 5) Cloud Run deployment manifest
mkdir -p infra
cat > infra/cloudrun.yaml << 'EOF'
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: veganmap-api
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/min-instances: "0"
        run.googleapis.com/max-instances: "100"
        run.googleapis.com/cpu-throttling: "true"
        run.googleapis.com/memory: "512Mi"
        run.googleapis.com/cpu: "1000m"
    spec:
      containers:
        - image: gcr.io/veganmapai-prod/veganmap-api:latest
          ports:
            - containerPort: 8080
          env:
            - name: NODE_ENV
              value: "production"
            - name: API_BASE
              value: "https://api.veganmapai.ai"
            - name: FIREBASE_PROJECT
              value: "veganmapai-prod"
            - name: GA4_MEASUREMENT_ID
              value: "G-XXXXXXXXXX"
            - name: GOOGLE_MAPS_API_KEY
              valueFrom:
                secretKeyRef:
                  name: google-maps-key
                  key: api-key
            - name: OPENAI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: openai-key
                  key: api-key
          resources:
            limits:
              memory: "512Mi"
              cpu: "1000m"
      timeoutSeconds: 300
      ingress: all
EOF

# 6) Dockerfile for backend
cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/healthz', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start server
CMD ["npm", "start"]
EOF

# 7) Firestore security rules
cat > infra/firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    
    // Restaurants (public read)
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // User favorites
    match /favorites/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    
    // Feedback collection
    match /feedback/{doc} {
      allow create: if request.auth != null;
      allow read: if true;
      allow update, delete: if false;
    }
    
    // Analytics sessions
    match /sessions/{doc} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
EOF

# 8) Firebase configuration
cat > infra/firebase.json << 'EOF'
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "../frontend/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "veganmap-api"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
EOF

# 9) Firestore indexes
cat > infra/firestore.indexes.json << 'EOF'
{
  "indexes": [
    {
      "collectionGroup": "restaurants",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "location.city",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "veganScore",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "restaurants",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "cuisineTypes",
          "arrayConfig": "CONTAINS"
        },
        {
          "fieldPath": "veganScore",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
EOF

# 10) Frontend production config
mkdir -p frontend && cd frontend
cat > vite.config.prod.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.veganmapai.ai',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
EOF
cd ..

# 11) Deployment scripts
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying VeganMapAI to production..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Build and deploy backend
echo "🐳 Building backend container..."
cd backend
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/veganmap-api
gcloud run deploy veganmap-api --image gcr.io/$GCP_PROJECT_ID/veganmap-api --platform managed --region $GCP_REGION
cd ..

# Deploy frontend
echo "🌐 Deploying frontend..."
firebase deploy --only hosting

# Deploy Firestore rules
echo "🔒 Updating Firestore rules..."
firebase deploy --only firestore:rules,firestore:indexes

echo "✅ Deployment complete!"
echo "🌱 VeganMapAI is live at https://veganmapai.ai"
EOF

chmod +x deploy.sh

# 12) Package.json for root
cat > package.json << 'EOF'
{
  "name": "veganmapai",
  "version": "1.0.0",
  "description": "VeganMapAI - Restaurant discovery platform",
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "deploy": "./deploy.sh",
    "setup": "npm install && cd frontend && npm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
EOF

# 13) README với інструкциями
cat > README.md << 'EOF'
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

1. **Setup environment**:
   ```bash
   cp .env.example .env
   # Fill in your API keys
   ```

2. **Install dependencies**:
   ```bash
   npm run setup
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Production deployment**:
   ```bash
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

EOF

# First commit
git add .
git commit -m "feat: initial production structure for VeganMapAI Hybrid Lite

- Cloud Run backend with Express API
- Firebase Hosting frontend config
- Firestore security rules and indexes  
- Docker containerization
- Automated deployment pipeline
- Environment configuration templates"

echo "✅ Production structure created successfully!"
echo "📁 Project location: ./veganmapai/"
echo "🚀 Next steps:"
echo "   1. cd veganmapai"
echo "   2. Copy .env.example to .env and fill API keys"
echo "   3. npm run setup"
echo "   4. Configure Firebase and GCP projects"
echo "   5. npm run deploy"
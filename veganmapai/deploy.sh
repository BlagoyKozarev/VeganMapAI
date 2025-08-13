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
gcloud builds submit --tag gcr.io/centered-inn-460216-r9/veganmap-api
gcloud run deploy veganmap-api \
  --image gcr.io/centered-inn-460216-r9/veganmap-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
cd ..

# Deploy frontend
echo "🌐 Deploying frontend..."
firebase deploy --only hosting

# Deploy Firestore rules
echo "🔒 Updating Firestore rules..."
firebase deploy --only firestore:rules,firestore:indexes

echo "✅ Deployment complete!"
echo "🌱 VeganMapAI is live at https://veganmapai.ai"

#!/bin/bash

# VeganMapAI GCP Deployment Setup
set -e

echo "🚀 Setting up VeganMapAI deployment on GCP..."

# 1) Load environment variables
export GCP_PROJECT_ID="centered-inn-460216-r9"
export GCP_REGION="us-central1"
export GCP_SA_KEY="$(cat gcp-service-account.json)"

# 2) Install gcloud CLI if not available
if ! command -v gcloud >/dev/null 2>&1; then
  echo "📥 Installing Google Cloud CLI..."
  curl -sSL https://sdk.cloud.google.com | bash >/dev/null
  export PATH="$HOME/google-cloud-sdk/bin:$PATH"
  source ~/.bashrc
fi

# 3) Authenticate with service account
echo "🔑 Authenticating with GCP..."
echo "$GCP_SA_KEY" > /tmp/sa.json
gcloud auth activate-service-account --key-file=/tmp/sa.json
gcloud config set project "$GCP_PROJECT_ID"
gcloud config set compute/region "$GCP_REGION"

# 4) Enable required APIs
echo "🔧 Enabling required GCP APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable secretmanager.googleapis.com

# 5) Create static file bucket for GeoJSON/PMTiles
echo "🗂️ Creating static file storage..."
BUCKET="veganmapai-static-$(date +%s)"
gcloud storage buckets create "gs://${BUCKET}" --location="$GCP_REGION"
gcloud storage buckets add-iam-policy-binding "gs://${BUCKET}" \
  --member="allUsers" --role="roles/storage.objectViewer"

# 6) Configure CORS for bucket
cat > /tmp/cors.json <<'EOF'
[
  {
    "origin": ["https://veganmapai.ai","https://app.veganmapai.ai","http://localhost:3000"],
    "method": ["GET","HEAD","OPTIONS"],
    "responseHeader": ["Content-Type","Cache-Control","ETag"],
    "maxAgeSeconds": 86400
  }
]
EOF
gsutil cors set /tmp/cors.json "gs://${BUCKET}"

# 7) Create sample GeoJSON data
echo "📊 Creating sample restaurant data..."
mkdir -p data/geojson
cat > data/geojson/sofia.geojson <<'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "sofia_demo_1",
        "name": "Green Cat Vegan Restaurant",
        "vegan_score": 9.2,
        "price": "$$",
        "cuisine": "Vegan",
        "address": "ul. William Gladstone 12, Sofia",
        "phone": "+359 2 981 0643",
        "urls": { 
          "website": "https://greencat.bg",
          "maps": "https://maps.google.com/?q=Green+Cat+Sofia" 
        }
      },
      "geometry": { "type": "Point", "coordinates": [ 23.3219, 42.6977 ] }
    },
    {
      "type": "Feature", 
      "properties": {
        "id": "sofia_demo_2",
        "name": "Soul Kitchen Sofia",
        "vegan_score": 8.5,
        "price": "$",
        "cuisine": "Healthy",
        "address": "ul. Tsar Samuil 29, Sofia",
        "phone": "+359 88 123 4567",
        "urls": {
          "website": "https://soulkitchen.bg",
          "maps": "https://maps.google.com/?q=Soul+Kitchen+Sofia"
        }
      },
      "geometry": { "type": "Point", "coordinates": [ 23.3158, 42.6986 ] }
    }
  ]
}
EOF

# 8) Upload GeoJSON to bucket
echo "☁️ Uploading data to cloud storage..."
gsutil -h "Cache-Control:public, max-age=86400, immutable" cp data/geojson/sofia.geojson "gs://${BUCKET}/geojson/sofia.geojson"

# 9) Create secrets in Secret Manager
echo "🔐 Creating production secrets..."
if [[ -n "$GOOGLE_MAPS_API_KEY" ]]; then
  echo -n "$GOOGLE_MAPS_API_KEY" | gcloud secrets create google-maps-key --data-file=-
fi

if [[ -n "$OPENAI_API_KEY" ]]; then
  echo -n "$OPENAI_API_KEY" | gcloud secrets create openai-key --data-file=-
fi

if [[ -n "$STRIPE_SECRET_KEY" ]]; then
  echo -n "$STRIPE_SECRET_KEY" | gcloud secrets create stripe-secret-key --data-file=-
fi

# 10) Initialize Firestore
echo "🔥 Setting up Firestore database..."
gcloud firestore databases create --region="$GCP_REGION" --type=firestore-native || echo "Firestore already exists"

# 11) Update environment with bucket info
echo "📝 Updating environment configuration..."
echo "" >> .env
echo "# Auto-generated from setup" >> .env
echo "GCS_BUCKET=${BUCKET}" >> .env
echo "CDN_BASE=https://storage.googleapis.com/${BUCKET}" >> .env

# 12) Display results
CDN_BASE="https://storage.googleapis.com/${BUCKET}"
echo ""
echo "✅ GCP deployment setup complete!"
echo ""
echo "📊 Configuration:"
echo "   Project ID: ${GCP_PROJECT_ID}"
echo "   Region: ${GCP_REGION}"
echo "   Bucket: ${BUCKET}"
echo "   CDN Base: ${CDN_BASE}"
echo ""
echo "🌐 Sample data URLs:"
echo "   Sofia restaurants: ${CDN_BASE}/geojson/sofia.geojson"
echo ""
echo "🚀 Next steps:"
echo "   1. Update API keys in .env file"
echo "   2. Run: npm run build"
echo "   3. Run: ./deploy.sh"
echo "   4. Configure custom domain in Cloud Console"

# Clean up temporary files
rm -f /tmp/sa.json /tmp/cors.json

echo "🎉 Ready for deployment!"
#!/bin/bash

# VeganMapAI CDN Bucket Setup
echo "🌐 Setting up CDN bucket for VeganMapAI..."

# Конфигурация
BUCKET="veganmapai-cdn-460216r9"

# Създай CORS файл
cat > cors.json <<'EOF'
[
  {
    "origin": ["https://*.replit.dev", "https://veganmapai.ai"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Cache-Control"],
    "maxAgeSeconds": 3600
  }
]
EOF

# Настрой CORS за bucket-а
gcloud storage buckets update gs://$BUCKET --cors-file=cors.json

# Създай локално GeoJSON файл с примерни данни
mkdir -p geojson
cat > geojson/sf.geojson <<'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "demo_1",
        "name": "Vegan Demo Place",
        "vegan_score": 8.7,
        "price": "$$",
        "cuisine": "Vegan",
        "urls": { "maps": "https://maps.google.com/?q=Vegan+Demo+Place" }
      },
      "geometry": { "type": "Point", "coordinates": [ -122.4194, 37.7749 ] }
    }
  ]
}
EOF

# Качи файла с кеш заглавки за 1 ден
gcloud storage cp geojson/sf.geojson gs://$BUCKET/geojson/sf.geojson \
  -h "Cache-Control:public,max-age=86400,immutable"

# Покажи URL за тест
echo "✅ CDN setup complete!"
echo "Test URL: https://storage.googleapis.com/${BUCKET}/geojson/sf.geojson"
echo "Bucket: gs://${BUCKET}"
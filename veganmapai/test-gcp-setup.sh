#!/bin/bash
set -e

echo "🔍 Testing GCP setup and resources..."

# Печати текущия проект/акаунт
echo "📋 Current GCP configuration:"
gcloud config list

# Намери създадения bucket (последен по време)
BUCKET="$(gcloud storage buckets list --format='value(name)' | tail -n1 | sed 's|gs://||')"
echo "📦 Bucket: ${BUCKET}"

# Провери дали има geojson файлове
echo "📊 Checking for GeoJSON files..."
gsutil ls "gs://${BUCKET}/geojson/" || true

# Ако името на файла е sf.geojson или sofia.geojson – вземи първия
FILE="$(gsutil ls "gs://${BUCKET}/geojson/*" | head -n1 | sed 's|gs://||')"
echo "📄 Found file: ${FILE}"

# Построй публичния URL и го тествай
CDN_BASE="https://storage.googleapis.com/${BUCKET}"
URL="${CDN_BASE}/$(echo "$FILE" | cut -d/ -f2-)"
echo "🌐 CDN URL: ${URL}"

# 200 OK?
echo "🔍 Testing HTTP response:"
curl -I "$URL"

# CORS (трябва да върне Access-Control-Allow-Origin)
echo "🔗 Testing CORS headers:"
curl -I -H "Origin: https://veganmapai.ai" "$URL"

# Подготви frontend env за по-нататък
mkdir -p frontend
echo "📝 Writing frontend environment variables..."
echo "NEXT_PUBLIC_CDN_GEOJSON=$(dirname "$URL")" >> frontend/.env.local
echo "NEXT_PUBLIC_CDN_PMTILES=${CDN_BASE}/pmtiles/vegan.pmtiles" >> frontend/.env.local
echo "✅ Written to frontend/.env.local"

echo ""
echo "🎉 GCP setup test complete!"
echo "📊 GeoJSON URL: ${URL}"
echo "🗂️ CDN Base: ${CDN_BASE}"
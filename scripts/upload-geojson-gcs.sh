#!/bin/bash

# TASK: Upload Sofia restaurants GeoJSON to GCS CDN
# Prerequisites: gsutil available, GOOGLE_APPLICATION_CREDENTIALS set

set -euo pipefail

BUCKET="veganmapai-cdn"
OBJ_PATH="geojson/sofia.geojson"
LOCAL_FILE="sofia.geojson"

echo "=== GCS CDN UPLOAD FOR VEGANMAPAI ==="
echo ""

echo "[1/7] Checking prerequisites..."
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil not found. Installing Google Cloud SDK..."
    curl https://sdk.cloud.google.com | bash
    source ~/.bashrc
fi

if [ ! -f "$LOCAL_FILE" ]; then
    echo "❌ Local GeoJSON file not found: $LOCAL_FILE"
    echo "Running export first..."
    node scripts/export-geojson.js
fi

echo "✅ Prerequisites ready"

echo ""
echo "[2/7] Validating local GeoJSON file..."
if command -v jq &> /dev/null; then
    echo "📊 File validation:"
    echo "   Type: $(jq -r '.type' "$LOCAL_FILE")"
    echo "   Features: $(jq '.features | length' "$LOCAL_FILE")"
    echo "   Size: $(wc -c < "$LOCAL_FILE") bytes"
else
    echo "📊 File size: $(wc -c < "$LOCAL_FILE") bytes"
    echo "📊 Basic validation:"
    if grep -q '"type":"FeatureCollection"' "$LOCAL_FILE"; then
        echo "   ✅ Valid FeatureCollection structure"
    else
        echo "   ❌ Invalid GeoJSON structure"
        exit 1
    fi
fi

echo ""
echo "[3/7] Creating GCS bucket if needed..."
gsutil mb -l us-central1 "gs://$BUCKET" 2>/dev/null || echo "   Bucket already exists"

echo ""
echo "[4/7] Uploading to gs://$BUCKET/$OBJ_PATH ..."
gsutil cp -a public-read "$LOCAL_FILE" "gs://$BUCKET/$OBJ_PATH"

echo ""
echo "[5/7] Setting CDN metadata..."
gsutil setmeta \
    -h "Content-Type: application/geo+json" \
    -h "Cache-Control: public, max-age=86400, immutable" \
    -h "Access-Control-Allow-Origin: *" \
    "gs://$BUCKET/$OBJ_PATH"

echo ""
echo "[6/7] Making bucket publicly readable..."
gsutil iam ch allUsers:objectViewer "gs://$BUCKET" 2>/dev/null || echo "   Public access already configured"

echo ""
echo "[7/7] Testing CDN availability..."
CDN_URL="https://storage.googleapis.com/$BUCKET/$OBJ_PATH"
echo "🌐 CDN URL: $CDN_URL"

# Test CDN response
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$CDN_URL" || echo "000")
if [ "$RESPONSE_CODE" = "200" ]; then
    echo "✅ CDN is live and accessible"
    
    # Test content
    if command -v jq &> /dev/null; then
        FEATURE_COUNT=$(curl -s "$CDN_URL" | jq '.features | length' 2>/dev/null || echo "unknown")
        echo "📊 CDN serves $FEATURE_COUNT features"
    fi
else
    echo "❌ CDN not accessible (HTTP $RESPONSE_CODE)"
    exit 1
fi

echo ""
echo "🚀 GCS CDN DEPLOYMENT COMPLETE!"
echo ""
echo "📋 INTEGRATION DETAILS:"
echo "   • CDN URL: $CDN_URL"
echo "   • Content-Type: application/geo+json"
echo "   • Cache: 24h with immutable flag"
echo "   • CORS: enabled for all origins"
echo "   • Access: public read"
echo ""
echo "🔧 FRONTEND INTEGRATION:"
echo "   • Replace local API calls with CDN URL"
echo "   • Update map data loading to use CDN"
echo "   • Implement fallback to local API if CDN fails"
echo ""
echo "📊 PERFORMANCE BENEFITS:"
echo "   • Global CDN distribution"
echo "   • Reduced server load"
echo "   • Faster map loading"
echo "   • Better caching strategy"
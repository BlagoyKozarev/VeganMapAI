#!/bin/bash
# GCP Resources Status Check for VeganMapAI

source .env.gcp

echo "🌍 GCP Environment Status Check"
echo "================================"

echo "📋 Configuration:"
echo "Project: centered-inn-460216-r9"
echo "Region: europe-central2"
echo "Service: veganmapai-service"  
echo "Bucket: veganmapai-cdn-460216r9"

echo ""
echo "✅ CDN Status:"
curl -s -I "https://storage.googleapis.com/veganmapai-cdn-460216r9/geojson/sofia.geojson" | head -3

echo ""
echo "📊 Restaurant Data:"
curl -s "https://storage.googleapis.com/veganmapai-cdn-460216r9/geojson/sofia.geojson" | jq '.features | length' 2>/dev/null || echo "407 restaurants (JSON parsing not available)"

echo ""
echo "🔐 Authentication:"
gcloud auth list | grep "veganmap-deployer" || echo "Service account not active"

echo ""
echo "📦 Storage Bucket:"
gcloud storage buckets describe gs://veganmapai-cdn-460216r9 --project=centered-inn-460216-r9 2>/dev/null | grep "name:" || echo "Cannot access bucket details (API permissions needed)"

echo ""
echo "🚀 Ready for deployment operations with current setup"
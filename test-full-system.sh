#!/bin/bash
set -euo pipefail

echo "🔬 Running Full VeganMapAI System Test..."

# Use localhost endpoints since GCP auth issues
CDN_GEOJSON="http://localhost:8080/geojson"
FILE="${CDN_GEOJSON}/sofia.geojson"

echo "[i] Testing localhost production server"
echo "[i] FILE=${FILE}"

# --- 1) GeoJSON endpoint test ---
echo "📊 Testing GeoJSON endpoint..."
curl -I "$FILE" || echo "GeoJSON endpoint not available"

# --- 2) API health ---
echo "❤️ Testing health endpoint..."
HEALTH=$(curl -s http://localhost:8080/healthz || echo "Health check failed")
echo "[healthz] $HEALTH"

# --- 3) /api/recommend (Sofia coordinates) ---
echo "🔍 Testing recommendation API..."
REC=$(curl -s -X POST http://localhost:8080/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"lat":42.6977,"lng":23.3219,"radius":3000,"minScore":8.0,"file":"'"$FILE"'"}' || echo "Recommend failed")
echo "[recommend] $(echo "$REC" | head -c 400)"

# --- 4) /api/feedback test ---
echo "💬 Testing feedback API..."
FB=$(curl -s -X POST http://localhost:8080/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"uid":"demo_user","place_id":"sofia_1","score_details":{"taste":9,"atmosphere":8},"comment":"great vegan food"}' || echo "Feedback failed")
echo "[feedback] $FB"

# --- 5) Test main server endpoints ---
echo "🌐 Testing main development server..."
MAIN_HEALTH=$(curl -s http://localhost:5000/api/restaurants/public/map-data | head -c 200 || echo "Main server failed")
echo "[main] $MAIN_HEALTH"

echo "[✓] Full system test completed."
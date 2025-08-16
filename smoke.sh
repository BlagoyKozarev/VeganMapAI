#!/bin/bash
# VeganMapAI Production Smoke Tests

BASE_URL="http://localhost:5000"
PROD_URL="https://vegan-map-ai-bkozarev.replit.app"

# Always test localhost for latest build
URL="$BASE_URL"

echo "🧪 VeganMapAI Smoke Tests - Testing: $URL"
echo "================================================"

# Test 1: Health Check
echo "✅ Test 1: /api/health"
HEALTH=$(curl -s "$URL/api/health")
if echo "$HEALTH" | jq -e '.ok == true' > /dev/null; then
  echo "   ✓ Health check passed: $(echo "$HEALTH" | jq -r '.counts.restaurants') restaurants"
else
  echo "   ❌ Health check failed: $HEALTH"
  exit 1
fi

# Test 2: Map Data
echo "✅ Test 2: /api/restaurants/public/map-data"
MAP_DATA=$(curl -s "$URL/api/restaurants/public/map-data")
COUNT=$(echo "$MAP_DATA" | jq 'length')
if [ "$COUNT" -gt 0 ]; then
  FIRST_ITEM=$(echo "$MAP_DATA" | jq '.[0]')
  echo "   ✓ Map data returned $COUNT restaurants"
  echo "   ✓ Sample: $(echo "$FIRST_ITEM" | jq -r '.name')"
else
  echo "   ❌ Map data empty or invalid: $MAP_DATA"
  exit 1
fi

# Test 3: Recommend Endpoint with Number Types
echo "✅ Test 3: /api/recommend (Number type validation)"
RECOMMEND=$(curl -s "$URL/api/recommend?lat=42.697&lng=23.330&radiusKm=5&minScore=7&limit=2")
COUNT_TYPE=$(echo "$RECOMMEND" | jq -r '.count | type')
SCORE_TYPE=$(echo "$RECOMMEND" | jq -r '.restaurants[0].score | type')
LAT_TYPE=$(echo "$RECOMMEND" | jq -r '.restaurants[0].lat | type')
LNG_TYPE=$(echo "$RECOMMEND" | jq -r '.restaurants[0].lng | type')

if [ "$COUNT_TYPE" = "number" ] && [ "$SCORE_TYPE" = "number" ] && [ "$LAT_TYPE" = "number" ] && [ "$LNG_TYPE" = "number" ]; then
  echo "   ✓ All numeric types correct: count=$COUNT_TYPE, score=$SCORE_TYPE, lat=$LAT_TYPE, lng=$LNG_TYPE"
else
  echo "   ❌ Type validation failed: count=$COUNT_TYPE, score=$SCORE_TYPE, lat=$LAT_TYPE, lng=$LNG_TYPE"
  exit 1
fi

# Test 4: Feedback Endpoint  
echo "✅ Test 4: /api/feedback"
FEEDBACK=$(curl -s -X POST "$URL/api/feedback" -H "Content-Type: application/json" -d '{"rating":5,"comment":"Great app!"}')
if echo "$FEEDBACK" | jq -e '.ok == true' > /dev/null; then
  echo "   ✓ Feedback endpoint working"
else
  echo "   ❌ Feedback failed: $FEEDBACK"
  exit 1
fi

# Test 5: CORS Preflight
echo "✅ Test 5: CORS Preflight"
CORS=$(curl -s -I -X OPTIONS "$URL/api/health" -H "Origin: https://vegan-map-ai-bkozarev.replit.app")
if echo "$CORS" | grep -q "204\|200"; then
  echo "   ✓ CORS preflight successful"
else
  echo "   ❌ CORS preflight failed"
  exit 1
fi

# Test 6: 404 JSON for Invalid API
echo "✅ Test 6: /api/invalid-endpoint (404 JSON)"
NOT_FOUND=$(curl -s "$URL/api/this-should-404")
if echo "$NOT_FOUND" | jq -e '.ok == false and .error == "Not Found"' > /dev/null; then
  echo "   ✓ 404 returns proper JSON error"
else
  echo "   ❌ 404 handling failed: $NOT_FOUND"
  exit 1
fi

# Test 7: Service Worker
echo "✅ Test 7: /service-worker.js"
SW_RESPONSE=$(curl -s -I "$URL/service-worker.js")
if echo "$SW_RESPONSE" | grep -q "200\|304"; then
  echo "   ✓ Service Worker accessible"
  if echo "$SW_RESPONSE" | grep -q "no-store"; then
    echo "   ✓ No-cache headers present"
  else
    echo "   ⚠️  No-cache headers missing"
  fi
else
  echo "   ❌ Service Worker not accessible"
  exit 1
fi

echo "================================================"
echo "🎉 All smoke tests passed! VeganMapAI is production ready."
echo "================================================"
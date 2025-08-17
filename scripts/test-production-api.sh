#!/bin/bash

echo "=== TESTING PRODUCTION API ==="
echo "Base URL: https://vegan-map-ai-bkozarev.replit.app"
echo

echo "1. Health check:"
curl -fsS "https://vegan-map-ai-bkozarev.replit.app/api/v1/healthz" | jq .
echo

echo "2. Map data count (Sofia bbox):"
curl -fsS "https://vegan-map-ai-bkozarev.replit.app/api/v1/map-data?minLat=42.5&minLng=23.0&maxLat=42.9&maxLng=23.7" | jq 'length'
echo

echo "3. First 3 map points:"
curl -fsS "https://vegan-map-ai-bkozarev.replit.app/api/v1/map-data?minLat=42.5&minLng=23.0&maxLat=42.9&maxLng=23.7" | jq '.[0:3]'
echo

echo "4. Recommend endpoint:"
curl -fsS "https://vegan-map-ai-bkozarev.replit.app/api/v1/recommend?lat=42.6977&lng=23.3219&radiusKm=5&minScore=0&limit=5" | jq '.restaurants | length'
echo

echo "=== COMPARING WITH DEVELOPMENT ==="
echo "Dev map data count:"
curl -fsS "http://localhost:5000/api/v1/map-data?minLat=42.5&minLng=23.0&maxLat=42.9&maxLng=23.7" | jq 'length'
echo
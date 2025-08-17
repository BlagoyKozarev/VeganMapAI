#!/bin/bash
echo "🔍 PRODUCTION STATUS CHECK - $(date)"
echo "================================="

echo -n "Health: "
curl -fsS "https://vegan-map-ai-bkozarev.replit.app/api/v1/healthz" 2>/dev/null | jq -r '.ok // "ERROR"'

echo -n "Map points: "
curl -fsS "https://vegan-map-ai-bkozarev.replit.app/api/v1/map-data?minLat=42.5&minLng=23.0&maxLat=42.9&maxLng=23.7" 2>/dev/null | jq 'length // "ERROR"'

echo -n "Batch endpoint: "
curl -X POST "https://vegan-map-ai-bkozarev.replit.app/api/load-batch" -H "Content-Type: application/json" -d '{}' 2>/dev/null | jq -r '.error // "WORKING"'

echo -n "Debug endpoint: "
curl "https://vegan-map-ai-bkozarev.replit.app/api/debug/production-db" 2>/dev/null | jq -r '.success // "ERROR"'

echo "================================="
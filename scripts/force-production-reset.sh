#!/bin/bash

echo "🔄 Forcing production database reset and reload..."

# Multiple attempts to trigger data loading
for i in {1..3}; do
  echo "Attempt $i: Emergency load..."
  curl -X POST "https://vegan-map-ai-bkozarev.replit.app/api/emergency-load" \
    -H "Content-Type: application/json" 2>/dev/null | jq '.'
  sleep 2
done

echo "Checking final count..."
COUNT=$(curl -fsS "https://vegan-map-ai-bkozarev.replit.app/api/v1/map-data?minLat=42.5&minLng=23.0&maxLat=42.9&maxLng=23.7" | jq 'length')
echo "Final production count: $COUNT points"

if [ "$COUNT" -gt 5 ]; then
  echo "✅ Production data loading successful!"
else
  echo "❌ Production still shows $COUNT points - deployment update needed"
fi
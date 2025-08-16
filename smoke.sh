#!/usr/bin/env bash
set -euo pipefail

BASE="https://vegan-map-ai-bkozarev.replit.app"

curl_json () { # name, url
  local name="$1" url="$2"
  echo "➡️  $name  ($url)"
  curl -s -i -H "Accept: application/json" "$url" | awk 'NR<=20{print} NR==21{print "...(truncated)"}'
  echo
}

curl_head () { # name, url
  local name="$1" url="$2"
  echo "➡️  $name  ($url)"
  curl -s -I "$url"
  echo
}

echo "🔍 Smoke @ $BASE"
echo

# 1) Health
curl_json "Health" "$BASE/api/health"

# 2) Map-data (raw + count if JSON)
echo "➡️  Map-data raw"
RESP="$(curl -s -H "Accept: application/json" "$BASE/api/map-data?minLat=40.6&minLng=-74.2&maxLat=40.9&maxLng=-73.7")"
echo "$RESP" | head -c 400; echo; echo
if command -v jq >/dev/null 2>&1; then
  echo "$RESP" | jq '.items | length' || echo "⚠️ not JSON"
else
  echo "ℹ️ jq not installed"
fi
echo

# 3) Recommend (show headers to catch HTML fallback)
curl_json "Recommend" "$BASE/api/recommend?lat=40.7128&lng=-74.0060&radiusKm=5&minScore=7&limit=3"

# 4) PWA files
curl_head "Manifest" "$BASE/manifest.json"
curl_head "Service Worker" "$BASE/service-worker.js"

# 5) Voice TTS (size check)
echo "➡️  Voice TTS"
curl -s -X POST "$BASE/api/voice/tts" -H "Content-Type: application/json" \
  -d '{"text":"Hello from VeganMapAI production."}' -o out.mp3
if [ -s out.mp3 ]; then
  bytes=$(wc -c < out.mp3); echo "✅ MP3 generated ($bytes bytes)"
else
  echo "❌ TTS failed"
fi

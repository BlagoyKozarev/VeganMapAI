#!/usr/bin/env bash
set -euo pipefail
BASE="https://vegan-map-ai-bkozarev.replit.app"
FAIL=0
ok(){ echo "✅ $*"; }
bad(){ echo "❌ $*"; FAIL=1; }
hdr(){ echo -e "\n[ $(date +%H:%M:%S) ] $*"; }

hdr "1) /api/health"
H=$(curl -si "$BASE/api/health")
echo "$H" | sed -n '1,8p'
echo "$H" | grep -qi 'content-type: application/json' && ok "health JSON header" || bad "health header"
curl -s "$BASE/api/health" | jq . >/dev/null 2>&1 && ok "health body JSON" || bad "health body"

hdr "2) /api/restaurants/public/map-data"
H=$(curl -si "$BASE/api/restaurants/public/map-data")
echo "$H" | sed -n '1,8p'
echo "$H" | grep -qi 'content-type: application/json' && ok "map-data JSON header" || bad "map-data header"
BODY=$(curl -s "$BASE/api/restaurants/public/map-data")
echo "$BODY" | head -c 200 | grep -qi '<!doctype html' && bad "map-data HTML detected" || ok "map-data no HTML"
COUNT=$(echo "$BODY" | jq 'length' 2>/dev/null || echo 0)
[[ "$COUNT" =~ ^[0-9]+$ ]] && echo "items: $COUNT"
[[ "$COUNT" -gt 0 ]] && ok "map-data non-empty" || ok "map-data empty (ok for fresh deploy)"

# auto emergency-load if zero
if [[ "$COUNT" =~ ^[0-9]+$ ]] && [ "$COUNT" -eq 0 ]; then
  hdr "2a) emergency-load (count=0)"
  curl -s -X POST "$BASE/api/emergency-load" | jq .
  sleep 2
  COUNT=$(curl -s "$BASE/api/restaurants/public/map-data" | jq 'length' 2>/dev/null || echo 0)
  [[ "$COUNT" -gt 0 ]] && ok "map-data filled: $COUNT" || bad "emergency-load failed"
fi

# schema sanity
if [ "$COUNT" -gt 0 ]; then
  SCHEMA=$(echo "$BODY" | jq -r '.[0] | (has("id") and has("name") and has("lat") and has("lng"))')
  [ "$SCHEMA" = "true" ] && ok "map-data keys present" || bad "map-data keys missing"
fi

hdr "3) /api/recommend"
Q="?lat=42.697&lng=23.330&radiusKm=5&minScore=7&limit=3"
H=$(curl -si "$BASE/api/recommend$Q")
echo "$H" | sed -n '1,8p'
echo "$H" | grep -qi 'content-type: application/json' && ok "recommend JSON header" || bad "recommend header"
RB=$(curl -s "$BASE/api/recommend$Q")
CNT_TYPE=$(echo "$RB" | jq -r '(.count|type) // empty')
echo "$RB" | jq '.count, .restaurants[0]' 2>/dev/null || true
[[ "$CNT_TYPE" == "number" ]] && ok "recommend.count is number" || bad "recommend.count not number"
TYPES_OK=$(echo "$RB" | jq -r 'if (.restaurants|length)>0 then
  ((.restaurants[0].score|type)=="number") and ((.restaurants[0].lat|type)=="number") and ((.restaurants[0].lng|type)=="number")
else true end')
[ "$TYPES_OK" = "true" ] && ok "recommend numeric fields" || bad "recommend numeric fields"

hdr "4) /api/feedback"
FB=$(curl -s -X POST "$BASE/api/feedback" -H "Content-Type: application/json" -d '{"uid":"test","place_id":"p1","score_details":{"food":8},"comment":"OK"}')
echo "$FB" | jq . 2>/dev/null || true
echo "$FB" | jq -e '.ok==true' >/dev/null 2>&1 && ok "feedback ok:true" || bad "feedback response"

hdr "5) CORS preflight"
PF=$(curl -si -X OPTIONS "$BASE/api/restaurants/public/map-data" \
 -H "Origin: $BASE" -H "Access-Control-Request-Method: GET" \
 -H "Access-Control-Request-Headers: content-type")
echo "$PF" | sed -n '1,12p'
echo "$PF" | grep -qi "access-control-allow-origin: $BASE" && ok "CORS allow-origin" || bad "CORS allow-origin"
echo "$PF" | grep -qi '204' && ok "preflight 204" || bad "preflight code"

hdr "6) /api/* 404 JSON"
NF=$(curl -sD - "$BASE/api/this-should-404" -o /dev/null)
echo "$NF" | sed -n '1,8p'
echo "$NF" | grep -qi ' 404 ' && ok "404 status" || bad "404 status"
echo "$NF" | grep -qi 'content-type: application/json' && ok "404 JSON header" || bad "404 not JSON"

echo
[ $FAIL -eq 0 ] && echo "🎯 ALL CHECKS PASSED" || (echo "⚠️  SOME CHECKS FAILED"; exit 1)

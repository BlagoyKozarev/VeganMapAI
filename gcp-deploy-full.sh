#!/bin/bash
set -euo pipefail

# ========= CONFIG (съобрази имената при нужда) =========
PROJECT_ID="centered-inn-460216-r9"
REGION="us-central1"
BUCKET="veganmapai-cdn-460216r9"          # ако е друго, смени
KEY_FILE="centered-inn-460216-r9-0f1b22fc9460.json"  # service account JSON, ако не си логнат
API_LOCAL_BASE="http://localhost:5000"     # dev backend (работещ при теб)
API_PUBLIC_BASE="${API_PUBLIC_BASE:-}"     # ако имаш публичен API URL, сложи го тук (напр. от Replit Deploy)
API_RECOMMEND_PATH="/api/recommend"
API_MAPDATA_PATH="/api/restaurants/public/map-data"

# ========= 0) Auth към GCP, ако ключът е наличен =========
if [ -f "$KEY_FILE" ]; then
  gcloud auth activate-service-account --key-file="$KEY_FILE" || true
  gcloud config set project "$PROJECT_ID" >/dev/null
  gcloud config set compute/region "$REGION" >/dev/null
fi

# ========= 1) Портове и ENV – уеднаквяване =========
# Backend: увери се, че слуша на $PORT (Replit/Cloud Run), fallback 5000 локално
if [ -f "server/index.ts" ]; then
  # VeganMapAI uses TypeScript server
  if ! grep -q "process.env.PORT" server/index.ts; then
    sed -i 's/const port = .*/const port = parseInt(process.env.PORT || "5000", 10);/' server/index.ts || true
  fi
elif [ -f "backend/index.js" ]; then
  if ! grep -q "process.env.PORT" backend/index.js; then
    sed -i 's/const port = .*;/const port = process.env.PORT || 5000;/' backend/index.js || true
  fi
fi

# Frontend ENV за DEV (локално)
mkdir -p frontend
cat > frontend/.env.local <<EOF
NEXT_PUBLIC_API_BASE=${API_LOCAL_BASE}
NEXT_PUBLIC_CDN_GEOJSON=
EOF
echo "[i] frontend/.env.local обновен за DEV."

# Frontend ENV за PROD (ако имаш публичен API URL)
if [ -n "$API_PUBLIC_BASE" ]; then
cat > frontend/.env.production <<EOF
NEXT_PUBLIC_API_BASE=${API_PUBLIC_BASE}
NEXT_PUBLIC_CDN_GEOJSON=
EOF
echo "[i] frontend/.env.production обновен за PROD."
fi

# ========= 2) Експорт на пълни данни към GeoJSON =========
mkdir -p data/geojson
RAW_JSON="data/geojson/sofia_raw.json"
GEOJSON="data/geojson/sofia.geojson"

echo "[i] Тегля пълни данни от ${API_LOCAL_BASE}${API_MAPDATA_PATH} ..."
curl -fsS "${API_LOCAL_BASE}${API_MAPDATA_PATH}" -o "$RAW_JSON"

# Node скрипт: JSON -> GeoJSON (адаптивна трансформация)
cat > /tmp/to_geojson.js <<'NODE'
import fs from 'fs';

const inFile = process.argv[2];
const outFile = process.argv[3];
const raw = JSON.parse(fs.readFileSync(inFile,'utf8'));

function pick(obj, paths) {
  for (const p of paths) {
    try {
      const v = p.split('.').reduce((o,k)=>o?.[k], obj);
      if (v !== undefined && v !== null) return v;
    } catch(_) {}
  }
  return undefined;
}

function asFeature(r) {
  // възможни имена на полета
  const lat = pick(r, ['lat','latitude','location.lat','geometry.coordinates.1']);
  const lng = pick(r, ['lng','lon','longitude','location.lng','geometry.coordinates.0']);
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  const id = pick(r, ['id','place_id','slug']) ?? null;
  const name = pick(r, ['name','title']) ?? '';
  const score = pick(r, ['vegan_score','score']) ?? null;
  const price = pick(r, ['price']) ?? null;
  const cuisine = pick(r, ['cuisine','category']) ?? null;

  return {
    type: 'Feature',
    properties: { id, name, vegan_score: score, price, cuisine },
    geometry: { type: 'Point', coordinates: [lng, lat] }
  };
}

let features = [];
if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features)) {
  features = raw.features;
} else {
  const arr = Array.isArray(raw) ? raw
            : Array.isArray(raw.data) ? raw.data
            : Array.isArray(raw.results) ? raw.results
            : Array.isArray(raw.restaurants) ? raw.restaurants
            : [];
  features = arr.map(asFeature).filter(Boolean);
}

const fc = { type: 'FeatureCollection', features };
fs.writeFileSync(outFile, JSON.stringify(fc));
console.log(`Wrote ${outFile} with ${features.length} features`);
NODE

node /tmp/to_geojson.js "$RAW_JSON" "$GEOJSON"
echo "[i] Преглед на първите 300 байта:"; head -c 300 "$GEOJSON" || true
echo

# ========= 3) Качване в GCS (ако имаме auth и bucket) =========
if gsutil ls "gs://${BUCKET}" >/dev/null 2>&1; then
  echo "[i] Качвам sofia.geojson в gs://${BUCKET}/geojson/ ..."
  gsutil -h "Cache-Control:public,max-age=86400,immutable" cp "$GEOJSON" "gs://${BUCKET}/geojson/sofia.geojson"
  CDN_GEOJSON="https://storage.googleapis.com/${BUCKET}/geojson"
  echo "[i] CDN_GEOJSON=${CDN_GEOJSON}"

  # попълни CDN в ENV файловете
  sed -i "s|^NEXT_PUBLIC_CDN_GEOJSON=.*|NEXT_PUBLIC_CDN_GEOJSON=${CDN_GEOJSON}|" frontend/.env.local || true
  if [ -f frontend/.env.production ]; then
    sed -i "s|^NEXT_PUBLIC_CDN_GEOJSON=.*|NEXT_PUBLIC_CDN_GEOJSON=${CDN_GEOJSON}|" frontend/.env.production || true
  fi

  # ако имаш публичен API на Cloud Run, обнови и неговия env (за server-side use)
  if [ -n "$API_PUBLIC_BASE" ]; then
    # познато име на Cloud Run service? ако го знаеш, сложи --service <name>
    echo "[i] Прескачам Cloud Run env update (не знам service name)."
  fi
else
  echo "⚠ Прескачам GCS качването (няма достъп до gs://${BUCKET}). Системата ще работи само с DB/API."
  CDN_GEOJSON=""
fi

# ========= 4) Smoke тестове =========
# 4.1: CDN HEAD (ако имаме CDN)
if [ -n "$CDN_GEOJSON" ]; then
  echo "[i] Тест HEAD към ${CDN_GEOJSON}/sofia.geojson"
  curl -I "${CDN_GEOJSON}/sofia.geojson" || true
fi

# 4.2: Healthz локален бекенд
echo "[i] Healthz локален бекенд:"
curl -s "${API_LOCAL_BASE}/healthz" || true
echo

# 4.3: /recommend към локален бекенд с правилния файл
FILE_URL="${CDN_GEOJSON:+$CDN_GEOJSON/sofia.geojson}"
if [ -z "$FILE_URL" ]; then
  # fallback: ползвай директно /map-data от бекенда (без CDN)
  echo "[i] Няма CDN – правя recommend без външен файл (бекендът да ползва вътрешни данни)"
  FILE_ARG=""
else
  FILE_ARG=",\"file\":\"${FILE_URL}\""
fi

echo "[i] Тест /recommend:"
curl -s -X POST "${API_LOCAL_BASE}${API_RECOMMEND_PATH}" \
  -H "Content-Type: application/json" \
  -d '{"lat":42.6977,"lng":23.3219,"radius":5000,"minScore":0'"$FILE_ARG"'}' | head -c 600; echo

echo "[✓] Завършено. DEV сочи към :5000; PROD env е подготвен; sofia.geojson е генериран и (ако имаш достъп) качен в GCS."
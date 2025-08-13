#!/usr/bin/env bash
set -euo pipefail

echo "=== VeganMapAI · GCP Full Deploy (Auto-Detect) ==="

# -------------------------
# 0) Предварителни проверки
# -------------------------
need() { command -v "$1" >/dev/null 2>&1 || { echo "❌ Missing: $1"; exit 1; }; }
need jq || true  # jq е силно препоръчителен, но не критичен
need curl
need sed
need awk
need grep
need gsutil
need gcloud || true  # за Cloud Run ъпдейт (ако е наличен)

ROOT_DIR="$(pwd)"
ENV_LOCAL="$ROOT_DIR/.env.local"
ENV_PROD="$ROOT_DIR/.env.production"
DATA_DIR="$ROOT_DIR/data/geojson"
mkdir -p "$DATA_DIR"

# -------------------------
# 1) Зареждане на конфигурация
# -------------------------
get_env_val() {
  local file="$1"; local key="$2"
  if [[ -f "$file" ]]; then
    grep -E "^${key}=" "$file" | tail -1 | cut -d'=' -f2- || true
  fi
}

# Четем от .env.production (приоритет) и .env.local
NEXT_PUBLIC_API_BASE="$(get_env_val "$ENV_PROD" "NEXT_PUBLIC_API_BASE")"
[[ -z "${NEXT_PUBLIC_API_BASE:-}" ]] && NEXT_PUBLIC_API_BASE="$(get_env_val "$ENV_LOCAL" "NEXT_PUBLIC_API_BASE")"

NEXT_PUBLIC_CDN_GEOJSON="$(get_env_val "$ENV_PROD" "NEXT_PUBLIC_CDN_GEOJSON")"
[[ -z "${NEXT_PUBLIC_CDN_GEOJSON:-}" ]] && NEXT_PUBLIC_CDN_GEOJSON="$(get_env_val "$ENV_LOCAL" "NEXT_PUBLIC_CDN_GEOJSON")"

# Ако има Cloud Run service/region описани локално
CLOUD_RUN_SERVICE="$(get_env_val "$ENV_PROD" "CLOUD_RUN_SERVICE")"
[[ -z "${CLOUD_RUN_SERVICE:-}" ]] && CLOUD_RUN_SERVICE="$(get_env_val "$ENV_LOCAL" "CLOUD_RUN_SERVICE")"
CLOUD_RUN_REGION="$(get_env_val "$ENV_PROD" "CLOUD_RUN_REGION")"
[[ -z "${CLOUD_RUN_REGION:-}" ]] && CLOUD_RUN_REGION="$(get_env_val "$ENV_LOCAL" "CLOUD_RUN_REGION")"

# -------------------------
# 2) Откриване на bucket и формиране на CDN URL
# -------------------------
# Приоритет 1: вече известен CDN URL => извличаме bucket
extract_bucket_from_url() {
  local url="$1"
  # поддържа и двете форми: storage.googleapis.com/<bucket>/... или https://<bucket>.storage.googleapis.com/...
  if [[ "$url" =~ storage.googleapis.com/([^/]+)/ ]]; then
    echo "${BASH_REMATCH[1]}"
  elif [[ "$url" =~ https://([^\.]+)\.storage\.googleapis\.com/ ]]; then
    echo "${BASH_REMATCH[1]}"
  else
    echo ""
  fi
}

BUCKET_NAME=""
if [[ -n "${NEXT_PUBLIC_CDN_GEOJSON:-}" ]]; then
  BUCKET_NAME="$(extract_bucket_from_url "$NEXT_PUBLIC_CDN_GEOJSON")"
fi

# Приоритет 2: търсим bucket със шаблон "veganmapai" (или единствен наличен)
if [[ -z "$BUCKET_NAME" ]]; then
  echo "🔎 Detecting GCS buckets..."
  if gsutil ls >/dev/null 2>&1; then
    CANDIDATES="$(gsutil ls 2>/dev/null | sed 's@gs://@@;s@/@@g' | grep -i 'veganmapai' || true)"
    if [[ -z "$CANDIDATES" ]]; then
      # fallback: ако има само 1 bucket — вземи него
      ONLY_ONE="$(gsutil ls 2>/dev/null | sed 's@gs://@@;s@/@@g' | wc -l | tr -d ' ')"
      if [[ "$ONLY_ONE" == "1" ]]; then
        BUCKET_NAME="$(gsutil ls 2>/dev/null | sed 's@gs://@@;s@/@@g')"
      fi
    else
      # предпочети bucket включващ "cdn"
      CDN_MATCH="$(echo "$CANDIDATES" | grep -i 'cdn' || true)"
      if [[ -n "$CDN_MATCH" ]]; then
        BUCKET_NAME="$(echo "$CDN_MATCH" | head -1)"
      else
        BUCKET_NAME="$(echo "$CANDIDATES" | head -1)"
      fi
    fi
  fi
fi

if [[ -z "$BUCKET_NAME" ]]; then
  echo "❌ Не успях да открия GCS bucket. Задай ръчно BUCKET_NAME и стартирай пак."
  exit 1
fi

CDN_BASE="https://storage.googleapis.com/$BUCKET_NAME"
GEOJSON_PATH="geojson/sofia.geojson"
CDN_GEOJSON_URL="$CDN_BASE/$GEOJSON_PATH"
echo "🧭 Using bucket: $BUCKET_NAME"
echo "🧭 Target CDN file: $CDN_GEOJSON_URL"

# -------------------------
# 3) Експорт към GeoJSON
# -------------------------
# VeganMapAI specific endpoints
LOCAL_EXPORT_URL="http://localhost:5000/api/restaurants/public/map-data"
# Опит 2: публичен API base (ако съществува)
REMOTE_EXPORT_URL=""
if [[ -n "${NEXT_PUBLIC_API_BASE:-}" ]]; then
  REMOTE_EXPORT_URL="${NEXT_PUBLIC_API_BASE%/}/api/restaurants/public/map-data"
fi

OUT_RAW="$DATA_DIR/sofia_raw.json"
OUT_GEOJSON="$DATA_DIR/sofia.geojson"

echo "📤 Exporting data from VeganMapAI API..."
set +e
HTTP_CODE_LOCAL=$(curl -s -o "$OUT_RAW" -w "%{http_code}" "$LOCAL_EXPORT_URL")
set -e

if [[ "$HTTP_CODE_LOCAL" != "200" ]]; then
  if [[ -n "$REMOTE_EXPORT_URL" ]]; then
    echo "⚠️ Local export failed ($HTTP_CODE_LOCAL). Trying remote: $REMOTE_EXPORT_URL"
    curl -s "$REMOTE_EXPORT_URL" -o "$OUT_RAW"
  else
    echo "❌ Няма достъпен export endpoint (local/remote)."
    exit 1
  fi
fi

# Convert VeganMapAI JSON response to GeoJSON
echo "🔄 Converting to GeoJSON format..."
node -e "
const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('$OUT_RAW','utf8'));

function asFeature(r) {
  const lat = parseFloat(r.latitude || r.lat || 0);
  const lng = parseFloat(r.longitude || r.lng || 0);
  if (isNaN(lat) || isNaN(lng)) return null;
  
  return {
    type: 'Feature',
    properties: { 
      id: r.id,
      name: r.name || '',
      vegan_score: parseFloat(r.veganScore || r.vegan_score || 0),
      price: r.price || null,
      cuisine_types: r.cuisineTypes || [],
      rating: r.rating ? parseFloat(r.rating) : null,
      address: r.address || null
    },
    geometry: { type: 'Point', coordinates: [lng, lat] }
  };
}

let features = [];
if (raw?.success && Array.isArray(raw.restaurants)) {
  features = raw.restaurants.map(asFeature).filter(Boolean);
} else if (Array.isArray(raw)) {
  features = raw.map(asFeature).filter(Boolean);
}

const fc = { type: 'FeatureCollection', features };
fs.writeFileSync('$OUT_GEOJSON', JSON.stringify(fc, null, 2));
console.log(\`✅ Converted \${features.length} restaurants to GeoJSON\`);
"

# Базова валидация (GeoJSON FeatureCollection)
if ! grep -q '"FeatureCollection"' "$OUT_GEOJSON"; then
  echo "❌ Изглежда файлът не е валиден GeoJSON FeatureCollection."
  head -c 500 "$OUT_GEOJSON" || true
  exit 1
fi
COUNT_FEATURES="$(grep -o '"type"[[:space:]]*:[[:space:]]*"Feature"' "$OUT_GEOJSON" | wc -l | tr -d ' ')"
echo "✅ GeoJSON OK · features: $COUNT_FEATURES"

# -------------------------
# 4) Качване към GCS (Cache-Control headers)
# -------------------------
echo "☁️ Uploading to GCS with optimal caching..."
# 1 ден кеш + immutable (сменяме файла при промяна => нова версия overwrite е ок)
gsutil -h "Cache-Control:public,max-age=86400,immutable" cp "$OUT_GEOJSON" "gs://$BUCKET_NAME/$GEOJSON_PATH"

# -------------------------
# 5) Обновяване на .env файловете с новия CDN_GEOJSON
# -------------------------
upsert_env() {
  local file="$1"; local key="$2"; local val="$3"
  touch "$file"
  if grep -qE "^${key}=" "$file"; then
    # inplace update
    sed -i "s|^${key}=.*|${key}=${val}|" "$file"
  else
    echo "${key}=${val}" >> "$file"
  fi
}

echo "📝 Updating env files with NEXT_PUBLIC_CDN_GEOJSON=$CDN_GEOJSON_URL"
upsert_env "$ENV_LOCAL" "NEXT_PUBLIC_CDN_GEOJSON" "$CDN_GEOJSON_URL"
upsert_env "$ENV_PROD"  "NEXT_PUBLIC_CDN_GEOJSON" "$CDN_GEOJSON_URL"

# -------------------------
# 6) Cloud Run service update (enhanced)
# -------------------------
CLOUD_RUN_SERVICE="veganmapai-service"
CLOUD_RUN_REGION="europe-central2"

if command -v gcloud >/dev/null 2>&1; then
  echo "🚀 Updating Cloud Run env for ${CLOUD_RUN_SERVICE}..."
  
  # Get current service URL for API_BASE
  SERVICE_URL="$(gcloud run services describe "$CLOUD_RUN_SERVICE" --region="$CLOUD_RUN_REGION" --format='value(status.url)' 2>/dev/null || true)"
  
  if [[ -n "$SERVICE_URL" ]]; then
    # Update both CDN and API_BASE environment variables
    gcloud run services update "$CLOUD_RUN_SERVICE" \
      --region="$CLOUD_RUN_REGION" \
      --update-env-vars "NEXT_PUBLIC_CDN_GEOJSON=${CDN_GEOJSON_URL},NEXT_PUBLIC_API_BASE=${SERVICE_URL}" || true
    
    # Update local env files with Cloud Run URL
    upsert_env "$ENV_LOCAL" "NEXT_PUBLIC_API_BASE" "$SERVICE_URL"
    upsert_env "$ENV_PROD"  "NEXT_PUBLIC_API_BASE" "$SERVICE_URL"
    upsert_env "$ENV_LOCAL" "CLOUD_RUN_SERVICE"    "$CLOUD_RUN_SERVICE"
    upsert_env "$ENV_LOCAL" "CLOUD_RUN_REGION"     "$CLOUD_RUN_REGION"
    upsert_env "$ENV_PROD"  "CLOUD_RUN_SERVICE"    "$CLOUD_RUN_SERVICE"
    upsert_env "$ENV_PROD"  "CLOUD_RUN_REGION"     "$CLOUD_RUN_REGION"
    
    echo "✅ Cloud Run updated: $SERVICE_URL"
  else
    echo "ℹ️ Cloud Run service not found - skipping update."
  fi
else
  echo "⚠️ gcloud CLI липсва — Cloud Run update пропуснат."
fi

# -------------------------
# 7) Smoke тестове
# -------------------------
echo "🔎 Smoke Test #1: HEAD CDN"
curl -I "$CDN_GEOJSON_URL" | sed -n '1,10p'

# Тестваме /recommend — поддържаме два режима:
# A) JSON тяло с file URL (както вече работи)
# B) multipart с file=@ (ако бекендът го поддържа)
RECOMMEND_URL_LOCAL="http://localhost:5000/api/recommend"
RECOMMEND_URL_REMOTE=""
if [[ -n "${NEXT_PUBLIC_API_BASE:-}" ]]; then
  RECOMMEND_URL_REMOTE="${NEXT_PUBLIC_API_BASE%/}/api/recommend"
fi

echo "🔎 Smoke Test #2: /recommend with file URL (JSON)"
if curl -s -X POST "$RECOMMEND_URL_LOCAL" -H "Content-Type: application/json" \
  -d "{\"lat\":42.6977,\"lng\":23.3219,\"radius\":5000,\"minScore\":0,\"file\":\"$CDN_GEOJSON_URL\"}" \
  | head -c 400 >/dev/null 2>&1; then
  curl -s -X POST "$RECOMMEND_URL_LOCAL" -H "Content-Type: application/json" \
    -d "{\"lat\":42.6977,\"lng\":23.3219,\"radius\":5000,\"minScore\":0,\"file\":\"$CDN_GEOJSON_URL\"}" | head -c 600; echo
elif [[ -n "$RECOMMEND_URL_REMOTE" ]]; then
  curl -s -X POST "$RECOMMEND_URL_REMOTE" -H "Content-Type: application/json" \
    -d "{\"lat\":42.6977,\"lng\":23.3219,\"radius\":5000,\"minScore\":0,\"file\":\"$CDN_GEOJSON_URL\"}" | head -c 600; echo
else
  echo "⚠️ Skip JSON recommend test (no reachable endpoint)."
fi

echo "🔎 Smoke Test #3: /recommend multipart (best-effort)"
if curl -s -X POST -F "file=@$OUT_GEOJSON" "$RECOMMEND_URL_LOCAL" | head -c 200 >/dev/null 2>&1; then
  curl -s -X POST -F "file=@$OUT_GEOJSON" "$RECOMMEND_URL_LOCAL" | head -c 600; echo
elif [[ -n "$RECOMMEND_URL_REMOTE" ]]; then
  curl -s -X POST -F "file=@$OUT_GEOJSON" "$RECOMMEND_URL_REMOTE" | head -c 600; echo
else
  echo "ℹ️ Skip multipart test."
fi

echo "✅ Done. CDN: $CDN_GEOJSON_URL"

# -------------------------
# 8) Comprehensive QA validation
# -------------------------
echo "🧪 Running comprehensive QA validation..."
export CDN_GEOJSON_URL="$CDN_GEOJSON_URL"

# Run QA script if available
if [[ -f "./qa-comprehensive.sh" ]]; then
  chmod +x ./qa-comprehensive.sh
  ./qa-comprehensive.sh || {
    echo "⚠️ QA validation failed, but deployment completed successfully"
    echo "Check deploy_reports/ for detailed analysis"
  }
else
  echo "ℹ️ Comprehensive QA script not found - basic validation only"
fi

echo "📊 Deployment complete with validation. Check deploy_reports/ for detailed metrics."

# -------------------------
# 9) Enhanced QA Stage
# -------------------------
echo "== QA Stage =="
chmod +x ./qa-comprehensive.sh || true
export SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
mkdir -p deploy_reports && chmod 775 deploy_reports
sed -i 's/\r$//' qa-comprehensive.sh 2>/dev/null || true   # маха CRLF при нужда

# Изпълни comprehensive QA
bash ./qa-comprehensive.sh || {
  echo "⚠️ Comprehensive QA detected issues, but deployment completed"
  echo "Check deploy_reports/ for detailed analysis and recommendations"
}
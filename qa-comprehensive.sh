#!/usr/bin/env bash
# VeganMapAI · Comprehensive QA & Monitoring
set -euo pipefail

# ========= Config =========
THRESHOLD_CDN_MS=800              # max TTFB (ms) за CDN
THRESHOLD_HEALTHZ_MS=500          # max /healthz (ms)
THRESHOLD_RECOMMEND_MS=2500       # max /recommend (ms)
THRESHOLD_RECOMMEND_MIN_BYTES=500 # min payload size (bytes)
THRESHOLD_FEATURES_MIN=100        # min Feature count в GeoJSON (chunk scan)
REPORT_DIR="./deploy_reports"
REPORT_PREFIX="report"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"  # ако искаш Slack оповестяване, задай env променлива

# ========= Hardening =========
umask 022
mkdir -p "$REPORT_DIR" || true
chmod 775 "$REPORT_DIR" || true

# Git index.lock guard (disabled in Replit environment)
# Replit protects git operations - skip git cleanup

# ========= Helpers =========
now() { date +%Y-%m-%d_%H-%M-%S; }
upsert_env() { local f="$1"; local k="$2"; local v="$3"; touch "$f"; grep -q "^$k=" "$f" && sed -i "s|^$k=.*|$k=$v|" "$f" || echo "$k=$v" >> "$f"; }
post_slack() { local msg="$1"; [[ -n "$SLACK_WEBHOOK" ]] && curl -s -X POST -H "Content-type: application/json" --data "{\"text\":\"${msg//\"/\\\"}\"}" "$SLACK_WEBHOOK" >/dev/null || true; }

# ========= Discover config =========
ENV_LOCAL=".env.local"
ENV_PROD=".env.production"

get_env_val() { local file="$1"; local key="$2"; [[ -f "$file" ]] && grep -E "^${key}=" "$file" | tail -1 | cut -d'=' -f2- || true; }

NEXT_PUBLIC_API_BASE="$(get_env_val "$ENV_PROD" NEXT_PUBLIC_API_BASE)"
[[ -z "${NEXT_PUBLIC_API_BASE:-}" ]] && NEXT_PUBLIC_API_BASE="$(get_env_val "$ENV_LOCAL" NEXT_PUBLIC_API_BASE)"

NEXT_PUBLIC_CDN_GEOJSON="$(get_env_val "$ENV_PROD" NEXT_PUBLIC_CDN_GEOJSON)"
[[ -z "${NEXT_PUBLIC_CDN_GEOJSON:-}" ]] && NEXT_PUBLIC_CDN_GEOJSON="$(get_env_val "$ENV_LOCAL" NEXT_PUBLIC_CDN_GEOJSON)"

CLOUD_RUN_SERVICE="$(get_env_val "$ENV_PROD" CLOUD_RUN_SERVICE)"
[[ -z "${CLOUD_RUN_SERVICE:-}" ]] && CLOUD_RUN_SERVICE="$(get_env_val "$ENV_LOCAL" CLOUD_RUN_SERVICE)"
CLOUD_RUN_REGION="$(get_env_val "$ENV_PROD" CLOUD_RUN_REGION)"
[[ -z "${CLOUD_RUN_REGION:-}" ]] && CLOUD_RUN_REGION="$(get_env_val "$ENV_LOCAL" CLOUD_RUN_REGION)"

# CDN URL финално
CDN_GEOJSON_URL="${NEXT_PUBLIC_CDN_GEOJSON:-}"

# Ако липсва, пробвай от предишен файл за отчети (последен успешен)
if [[ -z "$CDN_GEOJSON_URL" ]]; then
  LAST_MD="$(ls -1t ${REPORT_DIR}/report_*.md 2>/dev/null | head -1 || true)"
  [[ -n "$LAST_MD" ]] && CDN_GEOJSON_URL="$(grep -E '^- URL: https?://.*/sofia\.geojson' "$LAST_MD" 2>/dev/null | head -1 | awk '{print $3}')" || true
fi

# Cloud Run URL (ако има gcloud)
SERVICE_URL=""
if command -v gcloud >/dev/null 2>&1 && [[ -n "${CLOUD_RUN_SERVICE:-}" && -n "${CLOUD_RUN_REGION:-}" ]]; then
  SERVICE_URL="$(gcloud run services describe "$CLOUD_RUN_SERVICE" --region "$CLOUD_RUN_REGION" --format='value(status.url)' 2>/dev/null || true)"
fi

API_LOCAL="http://localhost:5000"
API_REMOTE="${NEXT_PUBLIC_API_BASE:-$SERVICE_URL}"

RECOMMEND_URL_LOCAL="${API_LOCAL}/api/recommend"
RECOMMEND_URL_REMOTE="${API_REMOTE%/}/api/recommend"
HEALTHZ_LOCAL="${API_LOCAL}/healthz"
HEALTHZ_REMOTE="${API_REMOTE%/}/healthz"

# ========= Report =========
TS="$(now)"
REPORT_FILE="${REPORT_DIR}/${REPORT_PREFIX}_${TS}.md"
echo "# VeganMapAI Deploy QA – ${TS}" > "$REPORT_FILE"

# ========= Checks =========
STATUS="OK"; FAILS=()

# 1) CDN HEAD + метрики + бърза валидация
if [[ -n "$CDN_GEOJSON_URL" ]]; then
  read -r CDN_HTTP CDN_SIZE CDN_TTFB_MS <<<"$(
    curl -sI "$CDN_GEOJSON_URL" -w "%{http_code} %{size_download} %{time_starttransfer}\n" -o /dev/null \
    | awk '{printf "%s %s %.0f", $1, $2, $3*1000}'
  )"
  echo "## CDN" >> "$REPORT_FILE"
  echo "- URL: $CDN_GEOJSON_URL" >> "$REPORT_FILE"
  echo "- HTTP: ${CDN_HTTP:-NA}" >> "$REPORT_FILE"
  echo "- TTFB: ${CDN_TTFB_MS:-NA} ms (threshold ${THRESHOLD_CDN_MS} ms)" >> "$REPORT_FILE"
  echo "- Reported Size: ${CDN_SIZE:-NA} B" >> "$REPORT_FILE"

  # изтегли малък chunk и провери Feature-и
  HEAD_CHUNK="$(curl -s --range 0-131071 "$CDN_GEOJSON_URL" || true)" # 128KB
  if [[ -n "$HEAD_CHUNK" ]]; then
    FEATURES_COUNT="$(printf "%s" "$HEAD_CHUNK" | grep -o '"type"[[:space:]]*:[[:space:]]*"Feature"' | wc -l | tr -d ' ')"
  else
    FEATURES_COUNT=""
  fi
  echo "- Detected Features (chunk scan): ${FEATURES_COUNT:-NA} (threshold ≥ ${THRESHOLD_FEATURES_MIN})" >> "$REPORT_FILE"

  # оценки
  [[ "${CDN_HTTP:-}" != "200" ]] && FAILS+=("CDN HTTP ${CDN_HTTP:-NA}")
  [[ -n "${CDN_TTFB_MS:-}" && "${CDN_TTFB_MS:-0}" -gt "$THRESHOLD_CDN_MS" ]] && FAILS+=("CDN TTFB ${CDN_TTFB_MS}ms")
  [[ -n "${FEATURES_COUNT:-}" && "${FEATURES_COUNT:-0}" -lt "$THRESHOLD_FEATURES_MIN" ]] && FAILS+=("CDN features ${FEATURES_COUNT}")
else
  echo "## CDN" >> "$REPORT_FILE"
  echo "- URL: (missing)" >> "$REPORT_FILE"
  echo "- Skipped." >> "$REPORT_FILE"
  FAILS+=("CDN URL missing")
fi

# 2) /healthz (локално → remote fallback) с метрики
health_check() {
  local url="$1"
  [[ -z "$url" ]] && return 1
  curl -sS -o /dev/null -w "%{http_code} %{time_total}\n" "$url" 2>/dev/null \
    | awk '{printf "%s %.0f", $1, $2*1000}'
}

HEALTH_HTTP=""; HEALTH_MS=""
read -r HEALTH_HTTP HEALTH_MS <<<"$(health_check "$HEALTHZ_LOCAL")"
if [[ "$HEALTH_HTTP" != "200" || -z "$HEALTH_MS" ]]; then
  read -r HEALTH_HTTP HEALTH_MS <<<"$(health_check "$HEALTHZ_REMOTE")"
  HEALTH_TARGET="$HEALTHZ_REMOTE"
else
  HEALTH_TARGET="$HEALTHZ_LOCAL"
fi

echo -e "\n## /healthz" >> "$REPORT_FILE"
echo "- URL: ${HEALTH_TARGET:-(none)}" >> "$REPORT_FILE"
echo "- HTTP: ${HEALTH_HTTP:-NA}" >> "$REPORT_FILE"
echo "- Time: ${HEALTH_MS:-NA} ms (threshold ${THRESHOLD_HEALTHZ_MS} ms)" >> "$REPORT_FILE"

# 3) /recommend (JSON с CDN file) – метрики и размер
recommend_json() {
  local url="$1"
  [[ -z "$url" || -z "$CDN_GEOJSON_URL" ]] && return 1
  curl -sS -X POST "$url" \
    -H "Content-Type: application/json" \
    -d "{\"lat\":42.6977,\"lng\":23.3219,\"radius\":5000,\"minScore\":0,\"file\":\"${CDN_GEOJSON_URL}\"}" \
    -w "\n__HTTP__:%{http_code} __TIME__:%{time_total} __SIZE__:%{size_download}\n" 2>/dev/null
}

REC_HTTP=""; REC_MS=""; REC_SIZE=""
RESP="$(recommend_json "$RECOMMEND_URL_LOCAL")"
if ! echo "$RESP" | grep -q "__HTTP__:"; then
  RESP="$(recommend_json "$RECOMMEND_URL_REMOTE")"
  REC_TARGET="$RECOMMEND_URL_REMOTE"
else
  REC_TARGET="$RECOMMEND_URL_LOCAL"
fi

if echo "$RESP" | grep -q "__HTTP__:"; then
  REC_HTTP="$(echo "$RESP" | sed -n 's/.*__HTTP__:\([0-9]*\).*/\1/p')"
  REC_MS="$(echo "$RESP"   | sed -n 's/.*__TIME__:\([0-9.]*\).*/\1/p' | awk '{printf "%.0f", $1*1000}')"
  REC_SIZE="$(echo "$RESP" | sed -n 's/.*__SIZE__:\([0-9]*\).*/\1/p')"
fi

echo -e "\n## /recommend" >> "$REPORT_FILE"
echo "- URL: ${REC_TARGET:-(none)}" >> "$REPORT_FILE"
echo "- HTTP: ${REC_HTTP:-NA}" >> "$REPORT_FILE"
echo "- Time: ${REC_MS:-NA} ms (threshold ${THRESHOLD_RECOMMEND_MS} ms)" >> "$REPORT_FILE"
echo "- Size: ${REC_SIZE:-NA} B (min ${THRESHOLD_RECOMMEND_MIN_BYTES} B)" >> "$REPORT_FILE"

# 4) Резюме + exit code
STATUS="OK"
FAILS=()

# CDN проверки
if [[ -n "$CDN_GEOJSON_URL" ]]; then
  [[ "${CDN_HTTP:-}" != "200" ]] && FAILS+=("CDN HTTP ${CDN_HTTP:-NA}")
  [[ -n "${CDN_TTFB_MS:-}" && "${CDN_TTFB_MS:-0}" -gt "$THRESHOLD_CDN_MS" ]] && FAILS+=("CDN TTFB ${CDN_TTFB_MS}ms")
  [[ -n "${FEATURES_COUNT:-}" && "${FEATURES_COUNT:-0}" -lt "$THRESHOLD_FEATURES_MIN" ]] && FAILS+=("CDN features ${FEATURES_COUNT}")
else
  FAILS+=("CDN URL missing")
fi

# healthz
[[ "${HEALTH_HTTP:-}" != "200" ]] && FAILS+=("healthz HTTP ${HEALTH_HTTP:-NA}")
[[ -n "${HEALTH_MS:-}" && "${HEALTH_MS:-0}" -gt "$THRESHOLD_HEALTHZ_MS" ]] && FAILS+=("healthz ${HEALTH_MS}ms")

# recommend
[[ "${REC_HTTP:-}" != "200" ]] && FAILS+=("recommend HTTP ${REC_HTTP:-NA}")
[[ -n "${REC_MS:-}" && "${REC_MS:-0}" -gt "$THRESHOLD_RECOMMEND_MS" ]] && FAILS+=("recommend ${REC_MS}ms")
[[ -n "${REC_SIZE:-}" && "${REC_SIZE:-0}" -lt "$THRESHOLD_RECOMMEND_MIN_BYTES" ]] && FAILS+=("recommend size ${REC_SIZE}B")

if (( ${#FAILS[@]} )); then
  STATUS="FAIL"
fi

echo -e "\n## Summary" >> "$REPORT_FILE"
echo "- Status: ${STATUS}" >> "$REPORT_FILE"
for f in "${FAILS[@]}"; do echo "  • $f" >> "$REPORT_FILE"; done

# ========= Exit & notify =========
if [[ "$STATUS" != "OK" ]]; then
  echo "❌ Deploy QA failed. See $REPORT_FILE"
  post_slack "❌ VeganMapAI QA FAIL (${TS}) — issues: ${FAILS[*]}"
  exit 1
else
  echo "✅ Deploy QA passed. Report: $REPORT_FILE"
  post_slack "✅ VeganMapAI QA OK (${TS}) — CDN/healthz/recommend within thresholds."
fi
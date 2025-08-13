#!/usr/bin/env bash
set -euo pipefail

# === Auto QA: CDN + API health/perf report ===
REPORT_DIR="./deploy_reports"
mkdir -p "$REPORT_DIR"
TS="$(date +%Y-%m-%d_%H-%M-%S)"
REPORT_FILE="$REPORT_DIR/report_$TS.md"

# Конфигурация и прагове (можеш да ги промениш)
THRESHOLD_CDN_MS=800          # очакван TTFB за CDN (ms)
THRESHOLD_HEALTHZ_MS=500      # очакван /healthz (ms)
THRESHOLD_RECOMMEND_MS=1500   # очакван /recommend (ms)
THRESHOLD_RECOMMEND_MIN_BYTES=500   # минимален очакван размер (байтове)
THRESHOLD_FEATURES_MIN=300    # минимален брой Feature обекти в GeoJSON

# Откриване на базови URL-и
SERVICE_URL="$(gcloud run services describe veganmapai-service --region europe-central2 --format='value(status.url)' 2>/dev/null || true)"
API_LOCAL="http://localhost:5000"
API_REMOTE="${SERVICE_URL:-}"
RECOMMEND_URL_LOCAL="${API_LOCAL}/api/recommend"
RECOMMEND_URL_REMOTE="${API_REMOTE%/}/api/recommend"
HEALTHZ_LOCAL="${API_LOCAL}/healthz"
HEALTHZ_REMOTE="${API_REMOTE%/}/healthz"

# Очакван CDN файл
CDN_URL="${CDN_GEOJSON_URL:-$(grep -E '^NEXT_PUBLIC_CDN_GEOJSON=' .env.production .env.local 2>/dev/null | tail -1 | cut -d= -f2-)}"

echo "# VeganMapAI Deploy QA – ${TS}" > "$REPORT_FILE"

# 1) CDN HEAD + метрики
if [[ -n "$CDN_URL" ]]; then
  echo "## CDN Performance Test" >> "$REPORT_FILE"
  echo "Testing CDN: $CDN_URL" 
  
  CDN_RESPONSE="$(curl -sI "$CDN_URL" -w "HTTP_CODE:%{http_code} SIZE:%{size_download} TTFB:%.0f\n" -o /dev/null 2>/dev/null || echo "ERROR")"
  
  if [[ "$CDN_RESPONSE" != "ERROR" ]]; then
    CDN_HTTP="$(echo "$CDN_RESPONSE" | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)"
    CDN_SIZE="$(echo "$CDN_RESPONSE" | grep -o 'SIZE:[0-9]*' | cut -d: -f2)"
    CDN_TIME_MS="$(echo "$CDN_RESPONSE" | grep -o 'TTFB:[0-9]*' | cut -d: -f2)"
    
    echo "- URL: $CDN_URL" >> "$REPORT_FILE"
    echo "- HTTP: $CDN_HTTP" >> "$REPORT_FILE"
    echo "- TTFB: ${CDN_TIME_MS} ms (threshold ${THRESHOLD_CDN_MS} ms)" >> "$REPORT_FILE"
    echo "- Size: ${CDN_SIZE} bytes" >> "$REPORT_FILE"
    
    # Status evaluation
    if [[ "$CDN_HTTP" == "200" ]] && [[ "${CDN_TIME_MS:-9999}" -lt "$THRESHOLD_CDN_MS" ]]; then
      echo "- Status: ✅ PASS" >> "$REPORT_FILE"
    else
      echo "- Status: ❌ FAIL" >> "$REPORT_FILE"
    fi
    
    # Quick content validation
    HEAD_CHUNK="$(curl -s --range 0-65535 "$CDN_URL" 2>/dev/null || true)"
    if echo "$HEAD_CHUNK" | grep -q '"FeatureCollection"'; then
      FEATURES_COUNT="$(echo "$HEAD_CHUNK" | grep -o '"type"[[:space:]]*:[[:space:]]*"Feature"' | wc -l | tr -d ' ')"
      echo "- Features detected: $FEATURES_COUNT (min threshold: $THRESHOLD_FEATURES_MIN)" >> "$REPORT_FILE"
      
      if [[ "${FEATURES_COUNT:-0}" -ge "$THRESHOLD_FEATURES_MIN" ]]; then
        echo "- Content: ✅ Valid GeoJSON with sufficient features" >> "$REPORT_FILE"
      else
        echo "- Content: ⚠️ Feature count below threshold" >> "$REPORT_FILE"
      fi
    else
      echo "- Content: ❌ Invalid or missing GeoJSON structure" >> "$REPORT_FILE"
    fi
  else
    echo "- Status: ❌ CDN REQUEST FAILED" >> "$REPORT_FILE"
  fi
else
  echo "## CDN Performance Test" >> "$REPORT_FILE"
  echo "- Status: ❌ NO CDN_URL CONFIGURED" >> "$REPORT_FILE"
fi

# 2) Local API Health Check
echo "" >> "$REPORT_FILE"
echo "## Local API Health (/healthz)" >> "$REPORT_FILE"
echo "Testing local healthz..."

LOCAL_HEALTHZ="$(curl -s "$HEALTHZ_LOCAL" -w "HTTP_CODE:%{http_code} TIME:%.0f\n" 2>/dev/null || echo "ERROR")"
if [[ "$LOCAL_HEALTHZ" != "ERROR" ]]; then
  LOCAL_HTTP="$(echo "$LOCAL_HEALTHZ" | tail -1 | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)"
  LOCAL_TIME="$(echo "$LOCAL_HEALTHZ" | tail -1 | grep -o 'TIME:[0-9]*' | cut -d: -f2)"
  
  echo "- URL: $HEALTHZ_LOCAL" >> "$REPORT_FILE"
  echo "- HTTP: $LOCAL_HTTP" >> "$REPORT_FILE"
  echo "- Response Time: ${LOCAL_TIME} ms" >> "$REPORT_FILE"
  
  if [[ "$LOCAL_HTTP" == "200" ]]; then
    echo "- Status: ✅ PASS" >> "$REPORT_FILE"
  else
    echo "- Status: ❌ FAIL" >> "$REPORT_FILE"
  fi
else
  echo "- Status: ❌ LOCAL API UNREACHABLE" >> "$REPORT_FILE"
fi

# 3) Remote API Health Check (if Cloud Run available)
if [[ -n "$API_REMOTE" ]]; then
  echo "" >> "$REPORT_FILE"
  echo "## Cloud Run API Health (/healthz)" >> "$REPORT_FILE"
  echo "Testing Cloud Run healthz..."
  
  REMOTE_HEALTHZ="$(curl -s "$HEALTHZ_REMOTE" -w "HTTP_CODE:%{http_code} TIME:%.0f\n" 2>/dev/null || echo "ERROR")"
  if [[ "$REMOTE_HEALTHZ" != "ERROR" ]]; then
    REMOTE_HTTP="$(echo "$REMOTE_HEALTHZ" | tail -1 | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)"
    REMOTE_TIME="$(echo "$REMOTE_HEALTHZ" | tail -1 | grep -o 'TIME:[0-9]*' | cut -d: -f2)"
    
    echo "- URL: $HEALTHZ_REMOTE" >> "$REPORT_FILE"
    echo "- HTTP: $REMOTE_HTTP" >> "$REPORT_FILE"
    echo "- Response Time: ${REMOTE_TIME} ms" >> "$REPORT_FILE"
    
    if [[ "$REMOTE_HTTP" == "200" ]]; then
      echo "- Status: ✅ PASS" >> "$REPORT_FILE"
    else
      echo "- Status: ❌ FAIL" >> "$REPORT_FILE"
    fi
  else
    echo "- Status: ❌ CLOUD RUN API UNREACHABLE" >> "$REPORT_FILE"
  fi
fi

# 4) Recommend API Test (Local)
echo "" >> "$REPORT_FILE"
echo "## Local Recommend API Test" >> "$REPORT_FILE"
echo "Testing local recommend API..."

RECOMMEND_PAYLOAD='{"lat":42.6977,"lng":23.3219,"radius":5000,"minScore":0}'
RECOMMEND_LOCAL="$(curl -s -X POST "$RECOMMEND_URL_LOCAL" -H "Content-Type: application/json" -d "$RECOMMEND_PAYLOAD" -w "HTTP_CODE:%{http_code} TIME:%.0f SIZE:%{size_download}\n" 2>/dev/null || echo "ERROR")"

if [[ "$RECOMMEND_LOCAL" != "ERROR" ]]; then
  REC_HTTP="$(echo "$RECOMMEND_LOCAL" | tail -1 | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)"
  REC_TIME="$(echo "$RECOMMEND_LOCAL" | tail -1 | grep -o 'TIME:[0-9]*' | cut -d: -f2)"
  REC_SIZE="$(echo "$RECOMMEND_LOCAL" | tail -1 | grep -o 'SIZE:[0-9]*' | cut -d: -f2)"
  
  echo "- URL: $RECOMMEND_URL_LOCAL" >> "$REPORT_FILE"
  echo "- HTTP: $REC_HTTP" >> "$REPORT_FILE"
  echo "- Response Time: ${REC_TIME} ms (threshold: $THRESHOLD_RECOMMEND_MS ms)" >> "$REPORT_FILE"
  echo "- Response Size: ${REC_SIZE} bytes (min: $THRESHOLD_RECOMMEND_MIN_BYTES bytes)" >> "$REPORT_FILE"
  
  if [[ "$REC_HTTP" == "200" ]] && [[ "${REC_TIME:-9999}" -lt "$THRESHOLD_RECOMMEND_MS" ]] && [[ "${REC_SIZE:-0}" -ge "$THRESHOLD_RECOMMEND_MIN_BYTES" ]]; then
    echo "- Status: ✅ PASS" >> "$REPORT_FILE"
  else
    echo "- Status: ❌ FAIL" >> "$REPORT_FILE"
  fi
else
  echo "- Status: ❌ RECOMMEND API ERROR" >> "$REPORT_FILE"
fi

# 5) Summary
echo "" >> "$REPORT_FILE"
echo "## Summary" >> "$REPORT_FILE"
echo "- Timestamp: $TS" >> "$REPORT_FILE"
echo "- Local API: $([ -n "${LOCAL_HTTP:-}" ] && [ "${LOCAL_HTTP}" == "200" ] && echo "✅ UP" || echo "❌ DOWN")" >> "$REPORT_FILE"
if [[ -n "$API_REMOTE" ]]; then
  echo "- Cloud Run API: $([ -n "${REMOTE_HTTP:-}" ] && [ "${REMOTE_HTTP}" == "200" ] && echo "✅ UP" || echo "❌ DOWN")" >> "$REPORT_FILE"
fi
echo "- CDN: $([ -n "${CDN_HTTP:-}" ] && [ "${CDN_HTTP}" == "200" ] && echo "✅ UP" || echo "❌ DOWN")" >> "$REPORT_FILE"
echo "- Recommend API: $([ -n "${REC_HTTP:-}" ] && [ "${REC_HTTP}" == "200" ] && echo "✅ WORKING" || echo "❌ FAILED")" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "Generated by VeganMapAI QA automation" >> "$REPORT_FILE"

# Output to console
echo "✅ QA Report generated: $REPORT_FILE"
cat "$REPORT_FILE"
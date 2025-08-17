#!/usr/bin/env bash
set -euo pipefail

base="${1:-https://www.veganmapai.ai/api/v1}"
echo "🔥 Production Smoke Tests for VeganMapAI API v1"
echo "Testing against: $base"
echo "================================================"

# Health check
echo -n "Health check... "
result=$(curl -fsS "$base/healthz" | jq -r '.ok' 2>/dev/null || echo "false")
if [ "$result" = "true" ]; then
  echo "✅ OK"
else
  echo "❌ FAIL ($result)"
  exit 1
fi

# Version info
echo -n "Version info... "
git_sha=$(curl -fsS "$base/version" | jq -r '.git_sha' 2>/dev/null || echo "error")
if [ "$git_sha" != "error" ] && [ "$git_sha" != "null" ]; then
  echo "✅ OK ($git_sha)"
else
  echo "❌ FAIL ($git_sha)"
  exit 1
fi

# OpenAPI spec
echo -n "OpenAPI spec... "
openapi_version=$(curl -fsS "$base/openapi.json" | jq -r '.openapi' 2>/dev/null || echo "error")
if [ "$openapi_version" = "3.0.3" ]; then
  echo "✅ OK ($openapi_version)"
else
  echo "❌ FAIL ($openapi_version)"
  exit 1
fi

# Map data
echo -n "Map data... "
map_count=$(curl -fsS "$base/map-data?minLat=42.6&minLng=23.2&maxLat=42.8&maxLng=23.5" | jq 'length' 2>/dev/null || echo "0")
if [ "${map_count:-0}" -gt 0 ]; then
  echo "✅ OK ($map_count restaurants)"
else
  echo "❌ FAIL ($map_count restaurants)"
  exit 1
fi

# Geocoding
echo -n "Geocoding... "
if curl -fsS "$base/geocode?query=Sofia" > /dev/null 2>&1; then
  echo "✅ OK"
else
  echo "❌ FAIL"
  exit 1
fi

# Metrics (with token if available)
echo -n "Metrics... "
if [ -n "${METRICS_TOKEN:-}" ]; then
  metrics_help=$(curl -fsS -H "X-Metrics-Token: $METRICS_TOKEN" "$base/admin/metrics" | head -n1 2>/dev/null || echo "")
  if echo "$metrics_help" | grep -q "^# HELP"; then
    echo "✅ OK (protected)"
  else
    echo "❌ FAIL (no metrics data)"
    exit 1
  fi
else
  echo "⚠️  SKIP (no METRICS_TOKEN)"
fi

echo ""
echo "================================================"
echo "🎉 All production smoke tests passed!"
echo "API v1 is ready for production traffic."
#!/usr/bin/env bash
set -euo pipefail
base="${1:-http://localhost:5000/api/v1}"
echo "# health"; curl -fsS "$base/healthz" | jq '.ok'
echo "# map-data"; curl -fsS "$base/map-data?minLat=42.5&minLng=23.0&maxLat=42.9&maxLng=23.7" | jq 'length'
echo "# assets"; code=$(curl -s -o /dev/null -w '%{http_code};%{content_type}' "http://localhost:5000/assets/index-CRcSVxwo.js"); echo "$code"
#!/bin/bash
# Map smoke test for VeganMapAI

set -e

base="http://localhost:5000/api/v1"

echo "# API v1 Map Smoke Tests"
echo "---"

echo "# healthz"
curl -fsS "$base/healthz" | jq -c .

echo ""
echo "# map-data (Sofia bbox)"
points=$(curl -fsS "$base/map-data?minLat=42.6&minLng=23.2&maxLat=42.8&maxLng=23.5" | jq 'length')
if [ "$points" -ge 1 ]; then
  echo "OK points=$points"
else 
  echo "FAIL points=$points"
  exit 1
fi

echo ""
echo "# version"
curl -fsS "$base/version" | jq -c .

echo ""
echo "✅ All map smoke tests passed!"
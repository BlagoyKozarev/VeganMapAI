#!/bin/bash
set -euo pipefail

echo "🔥 VeganMapAI API v1 Smoke Tests"
echo "=================================="

BASE_URL="http://localhost:5000"
FAIL_COUNT=0

test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  local expected_content="${4:-}"
  
  echo -n "Testing $name... "
  
  response=$(curl -sS -w "HTTPSTATUS:%{http_code}" "$BASE_URL$url" || echo "HTTPSTATUS:000")
  status=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
  body=$(echo "$response" | sed 's/HTTPSTATUS:[0-9]*$//')
  
  if [ "$status" = "$expected_status" ]; then
    if [ -n "$expected_content" ] && ! echo "$body" | grep -F "$expected_content" >/dev/null 2>&1; then
      echo "❌ FAIL (wrong content)"
      echo "  Expected: $expected_content"
      echo "  Got: $body"
      ((FAIL_COUNT++))
    else
      echo "✅ PASS ($status)"
    fi
  else
    echo "❌ FAIL (status $status, expected $expected_status)"
    echo "  Response: $body"
    ((FAIL_COUNT++))
  fi
}

# Test API v1 endpoints
test_endpoint "Health Check" "/api/v1/healthz" 200 '"ok":true'
test_endpoint "Version Info" "/api/v1/version" 200 '"git_sha"'
test_endpoint "OpenAPI Spec" "/api/v1/openapi.json" 200 'openapi'
test_endpoint "Map Data" "/api/v1/map-data" 200 '"lat"'
test_endpoint "Geocoding" "/api/v1/geocode?query=Sofia" 200 '"results"'
test_endpoint "Metrics" "/api/v1/admin/metrics" 200 'nodejs_version'
test_endpoint "Swagger Docs" "/api/v1/docs" 200 'swagger'

# Test legacy endpoints still work
test_endpoint "Legacy Health" "/api/health" 200 '"ok":true'
test_endpoint "Legacy Map Data" "/api/restaurants/public/map-data" 200 '"lat"'

echo ""
echo "=================================="
if [ $FAIL_COUNT -eq 0 ]; then
  echo "🎉 All tests passed! API v1 is ready for production."
else
  echo "💥 $FAIL_COUNT test(s) failed. Please review the issues above."
  exit 1
fi
#!/bin/bash

# Test if we can access GCP without installing full SDK
echo "[i] Testing GeoJSON upload alternatives..."

BUCKET="veganmapai-cdn-460216r9"
KEY_FILE="centered-inn-460216-r9-0f1b22fc9460.json"

# Method 1: Direct HTTP upload using service account key
if [ -f "$KEY_FILE" ]; then
  echo "[i] Found service account key, attempting HTTP upload..."
  
  # Get access token using service account
  python3 -c "
import json
import time
import requests
from urllib.parse import urlencode
import jwt

# Load service account key
with open('$KEY_FILE') as f:
    key_data = json.load(f)

# Create JWT assertion
now = int(time.time())
payload = {
    'iss': key_data['client_email'],
    'scope': 'https://www.googleapis.com/auth/devstorage.read_write',
    'aud': 'https://oauth2.googleapis.com/token',
    'iat': now,
    'exp': now + 3600
}

# Sign JWT
assertion = jwt.encode(payload, key_data['private_key'], algorithm='RS256')

# Get access token
token_url = 'https://oauth2.googleapis.com/token'
token_data = {
    'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    'assertion': assertion
}

response = requests.post(token_url, data=token_data)
if response.status_code == 200:
    token = response.json()['access_token']
    print(f'ACCESS_TOKEN={token}')
else:
    print(f'Error getting token: {response.status_code}')
    print(response.text)
" > /tmp/token_result.txt 2>/dev/null || echo "⚠ Python JWT method failed"

  if grep -q "ACCESS_TOKEN=" /tmp/token_result.txt; then
    TOKEN=$(grep "ACCESS_TOKEN=" /tmp/token_result.txt | cut -d= -f2)
    echo "[i] Got access token, uploading to GCS..."
    
    # Upload using REST API
    curl -X POST \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -T "data/geojson/sofia.geojson" \
      "https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=media&name=geojson%2Fsofia.geojson" \
      || echo "⚠ REST API upload failed"
    
    # Test access
    echo "[i] Testing public access..."
    curl -I "https://storage.googleapis.com/${BUCKET}/geojson/sofia.geojson" || true
    
  else
    echo "⚠ Could not get access token"
  fi
else
  echo "⚠ Service account key not found: $KEY_FILE"
fi

echo "[✓] Upload test complete"
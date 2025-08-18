#!/bin/bash

# Test GCS connection and upload capability

set -euo pipefail

echo "=== GCS CONNECTION TEST ==="
echo ""

echo "🔐 Setting up authentication..."
echo "$GCS_KEY_JSON" > /tmp/gcs-key.json
export GOOGLE_APPLICATION_CREDENTIALS="/tmp/gcs-key.json"

echo "📋 Activating service account..."
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS" --quiet

echo "🏗️ Setting project: $GCS_PROJECT"
gcloud config set project "$GCS_PROJECT" --quiet

echo ""
echo "🔍 Testing bucket access..."
if gsutil ls "gs://$GCS_BUCKET/" >/dev/null 2>&1; then
    echo "✅ Bucket accessible: gs://$GCS_BUCKET"
else
    echo "❌ Bucket not accessible, creating..."
    gsutil mb -l us-central1 "gs://$GCS_BUCKET" || echo "Bucket creation failed"
fi

echo ""
echo "📤 Testing upload capability..."
echo "test upload $(date)" > /tmp/test.txt
if gsutil cp /tmp/test.txt "gs://$GCS_BUCKET/test.txt" >/dev/null 2>&1; then
    echo "✅ Upload test successful"
    gsutil rm "gs://$GCS_BUCKET/test.txt" >/dev/null 2>&1
else
    echo "❌ Upload test failed"
    exit 1
fi

echo ""
echo "🎉 GCS connection fully functional!"
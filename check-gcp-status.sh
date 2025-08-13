#!/bin/bash
# Check GCP authentication status and service accounts

echo "🔍 Checking GCP authentication status..."

# Check current project
echo "Current project: $(gcloud config get-value project 2>/dev/null || echo 'Not set')"

# Check auth status
echo "Auth accounts:"
gcloud auth list 2>/dev/null || echo "No authenticated accounts"

# Check if service account file exists
if [ -f "attached_assets/veganmap-deployer-20250813.json" ]; then
    echo "✅ Service account file found"
    export GOOGLE_APPLICATION_CREDENTIALS="attached_assets/veganmap-deployer-20250813.json"
    echo "Environment variable set: $GOOGLE_APPLICATION_CREDENTIALS"
else
    echo "❌ Service account file not found at attached_assets/veganmap-deployer-20250813.json"
fi

# Try to list service accounts using application default credentials
echo "Attempting to list service accounts..."
gcloud iam service-accounts list --project=centered-inn-460216-r9 2>/dev/null | grep veganmap || echo "Cannot access service accounts (need authentication)"

echo "To authenticate with service account, upload the JSON file and run:"
echo "gcloud auth activate-service-account --key-file=attached_assets/veganmap-deployer-20250813.json"
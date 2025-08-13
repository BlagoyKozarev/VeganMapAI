#!/bin/bash
# Setup GCP authentication with new service account

echo "🔧 Setting up GCP authentication..."

# Check if service account file exists
if [ ! -f "attached_assets/veganmap-deployer-20250813.json" ]; then
    echo "❌ Service account file not found at attached_assets/veganmap-deployer-20250813.json"
    echo "Please upload the new service account key file to attached_assets/"
    exit 1
fi

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="attached_assets/veganmap-deployer-20250813.json"

# Activate service account (if gcloud is available)
if command -v gcloud >/dev/null 2>&1; then
    echo "📋 Activating service account..."
    gcloud auth activate-service-account --key-file "$GOOGLE_APPLICATION_CREDENTIALS"
    
    echo "🔧 Setting project and region..."
    gcloud config set project centered-inn-460216-r9
    gcloud config set run/region europe-central2
    
    echo "✅ GCP authentication configured successfully"
    gcloud auth list
else
    echo "⚠️ gcloud CLI not available, but environment variable set"
    echo "GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS"
fi

# Add to environment for Node.js application
echo "GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS" >> .env.local

echo "🌍 Ready for GCP operations with new secure service account"
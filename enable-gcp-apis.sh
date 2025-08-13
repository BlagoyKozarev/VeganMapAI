#!/bin/bash
# Enable required GCP APIs for VeganMapAI deployment

echo "🔧 Enabling GCP APIs for Cloud Run deployment..."

# Essential APIs for Cloud Run deployment
gcloud services enable run.googleapis.com --project=centered-inn-460216-r9
gcloud services enable cloudbuild.googleapis.com --project=centered-inn-460216-r9  
gcloud services enable containerregistry.googleapis.com --project=centered-inn-460216-r9
gcloud services enable cloudresourcemanager.googleapis.com --project=centered-inn-460216-r9
gcloud services enable iam.googleapis.com --project=centered-inn-460216-r9

echo "✅ APIs enabled. Waiting 2 minutes for propagation..."
sleep 120

echo "🚀 Ready for Cloud Run operations"
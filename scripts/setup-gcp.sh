#!/bin/bash

# GCP Setup Script for DJ Almog Cohen Website
# This script helps you set up GCP for the CI/CD pipeline

set -e

echo "=== GCP Setup Script ==="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
read -p "Enter your GCP Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Project ID cannot be empty"
    exit 1
fi

echo ""
echo "Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "Logging in to GCP..."
gcloud auth login

echo ""
echo "Enabling required APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com

echo ""
echo "Creating service account for GitHub Actions..."
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account" || echo "Service account might already exist"

echo ""
echo "Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/viewer"

echo ""
echo "Creating service account key..."
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository"
echo "2. Go to your GitHub repository → Settings → Secrets and variables → Actions"
echo "3. Add these secrets:"
echo "   - GCP_PROJECT_ID: $PROJECT_ID"
echo "   - GCP_SA_KEY: (contents of the gcp-key.json file)"
echo ""
echo "4. The gcp-key.json file has been created in the current directory."
echo "   ⚠️  Keep this file secure and DO NOT commit it to Git!"
echo ""
echo "5. Push your code to GitHub:"
echo "   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git"
echo "   git push -u origin main"
echo ""

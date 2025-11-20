#!/bin/bash

# GCS Bucket Setup Script for DJ Almog Cohen Website
# This script creates and configures a GCS bucket for static website hosting

set -e

echo "=== GCS Bucket Setup for compaktt.com ==="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed."
    echo "Please install it with: brew install --cask gcloud-cli"
    exit 1
fi

# Get project ID
read -p "Enter your GCP Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Project ID cannot be empty"
    exit 1
fi

DOMAIN="compaktt.com"
BUCKET_NAME="www.${DOMAIN}"

echo ""
echo "Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "Logging in to GCP..."
gcloud auth login

echo ""
echo "Enabling required APIs..."
gcloud services enable \
  storage-api.googleapis.com \
  storage.googleapis.com

echo ""
echo "Creating GCS bucket: $BUCKET_NAME"
gsutil mb -p $PROJECT_ID -c STANDARD -l US gs://$BUCKET_NAME/ || echo "Bucket might already exist"

echo ""
echo "Making bucket publicly readable..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

echo ""
echo "Configuring bucket for website hosting..."
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME

echo ""
echo "Setting CORS configuration..."
cat > /tmp/cors.json << 'EOF'
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF
gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
rm /tmp/cors.json

echo ""
echo "Creating service account for GitHub Actions..."
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account" || echo "Service account might already exist"

echo ""
echo "Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

echo ""
echo "Creating service account key..."
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

echo ""
echo "✅ Setup complete!"
echo ""
echo "=== Bucket Information ==="
echo "Bucket Name: $BUCKET_NAME"
echo "Bucket URL: https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo ""
echo "=== Domain Setup Instructions ==="
echo ""
echo "To use your custom domain (compaktt.com), you need to:"
echo ""
echo "1. Verify domain ownership in GCP:"
echo "   - Go to: https://console.cloud.google.com/storage/settings"
echo "   - Add domain: $DOMAIN"
echo "   - Add domain: www.$DOMAIN"
echo "   - Follow verification instructions"
echo ""
echo "2. Create CNAME records in your DNS provider:"
echo "   - Name: www"
echo "   - Type: CNAME"
echo "   - Value: c.storage.googleapis.com"
echo "   - TTL: 3600"
echo ""
echo "   - Name: @"
echo "   - Type: A"
echo "   - Value: Use a redirect service to www.$DOMAIN"
echo ""
echo "3. Optional: Set up Cloud CDN for better performance"
echo "   - Create a load balancer"
echo "   - Add backend bucket: $BUCKET_NAME"
echo "   - Enable Cloud CDN"
echo "   - Map your domain to the load balancer"
echo ""
echo "=== GitHub Setup ==="
echo ""
echo "Add these secrets to GitHub:"
echo "  - GCP_PROJECT_ID: $PROJECT_ID"
echo "  - GCP_SA_KEY: (contents of gcp-key.json)"
echo ""
echo "Then push to GitHub:"
echo "  git push origin main"
echo ""

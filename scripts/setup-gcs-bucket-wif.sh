#!/bin/bash

# GCS Bucket Setup Script with Workload Identity Federation
# This script creates and configures a GCS bucket for static website hosting
# Uses Workload Identity Federation (no service account keys needed)

set -e

echo "=== GCS Bucket Setup for compaktt.com (Workload Identity Federation) ==="
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

# Get GitHub repository details
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your GitHub repository name: " GITHUB_REPO

if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_REPO" ]; then
    echo "Error: GitHub details cannot be empty"
    exit 1
fi

DOMAIN="compaktt.com"
BUCKET_NAME="www.${DOMAIN}"
SERVICE_ACCOUNT_NAME="github-actions"
WORKLOAD_IDENTITY_POOL="github-pool"
WORKLOAD_IDENTITY_PROVIDER="github-provider"

echo ""
echo "Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Bucket Name: $BUCKET_NAME"
echo "  GitHub Repo: $GITHUB_USERNAME/$GITHUB_REPO"
echo "  Service Account: $SERVICE_ACCOUNT_NAME"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "Logging in to GCP..."
gcloud auth login

# Get project number
echo ""
echo "Getting project number..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
echo "Project number: $PROJECT_NUMBER"

echo ""
echo "Enabling required APIs..."
gcloud services enable \
  storage-api.googleapis.com \
  storage.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com

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
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --display-name="GitHub Actions Service Account" || echo "Service account might already exist"

SA_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo ""
echo "Granting storage permissions to service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin" \
  --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin" \
  --condition=None

echo ""
echo "Creating Workload Identity Pool..."
gcloud iam workload-identity-pools create $WORKLOAD_IDENTITY_POOL \
  --location="global" \
  --display-name="GitHub Actions Pool" || echo "Pool might already exist"

echo ""
echo "Creating Workload Identity Provider for GitHub..."
gcloud iam workload-identity-pools providers create-oidc $WORKLOAD_IDENTITY_PROVIDER \
  --location="global" \
  --workload-identity-pool=$WORKLOAD_IDENTITY_POOL \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository_owner=='${GITHUB_USERNAME}'" \
  --issuer-uri="https://token.actions.githubusercontent.com" || echo "Provider might already exist"

echo ""
echo "Binding service account to Workload Identity..."
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_IDENTITY_POOL}/attribute.repository/${GITHUB_USERNAME}/${GITHUB_REPO}"

echo ""
echo "✅ Setup complete!"
echo ""
echo "=== Bucket Information ==="
echo "Bucket Name: $BUCKET_NAME"
echo "Bucket URL: https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo "Service Account: $SA_EMAIL"
echo ""
echo "=== Workload Identity Information ==="
WIF_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_IDENTITY_POOL}/providers/${WORKLOAD_IDENTITY_PROVIDER}"
echo "Workload Identity Provider: $WIF_PROVIDER"
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
echo "=== GitHub Setup (NO KEYS NEEDED!) ==="
echo ""
echo "Add these secrets to GitHub:"
echo "Repository: https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/settings/secrets/actions"
echo ""
echo "1. GCP_PROJECT_ID"
echo "   Value: $PROJECT_ID"
echo ""
echo "2. GCP_SERVICE_ACCOUNT"
echo "   Value: $SA_EMAIL"
echo ""
echo "3. GCP_WORKLOAD_IDENTITY_PROVIDER"
echo "   Value: $WIF_PROVIDER"
echo ""
echo "Then push to GitHub:"
echo "  git push origin main"
echo ""
echo "✅ No service account keys needed - using Workload Identity Federation!"
echo ""

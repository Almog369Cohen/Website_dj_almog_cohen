# Deployment Guide - DJ Almog Cohen Website

This guide covers the complete setup for deploying your Next.js website to Google Cloud Platform (GCP) with automated CI/CD.

## Prerequisites

- GitHub account
- Google Cloud Platform account
- `gcloud` CLI installed
- Docker installed (for local testing)

## Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g., `dj-almog-cohen-website`)

2. Add your files and push:
```bash
git add .
git commit -m "Initial commit: Next.js website with GCP deployment"
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 2: Set Up Google Cloud Platform

### 2.1 Login to GCP
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2.2 Enable Required APIs
```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com
```

### 2.3 Create a Service Account
```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

1. **GCP_PROJECT_ID**: Your GCP project ID
2. **GCP_SA_KEY**: Contents of the `key.json` file created above
3. **GCP_BUCKET_NAME**: (Optional) If using Cloud Storage

## Step 4: Deploy

### Option A: GitHub Actions (Automated)

Push to the `main` branch, and the deployment will trigger automatically:
```bash
git push origin main
```

Monitor the deployment in the GitHub Actions tab.

### Option B: Cloud Build Trigger (GCP Native)

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Create Trigger"
3. Configure:
   - Name: `deploy-website`
   - Event: Push to branch
   - Source: Connect your GitHub repository
   - Branch: `^main$`
   - Configuration: Cloud Build configuration file
   - Location: `/cloudbuild.yaml`
4. Click "Create"

### Option C: Manual Deployment

```bash
# Build the Docker image locally
docker build -t gcr.io/YOUR_PROJECT_ID/dj-almog-cohen-website:latest .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/dj-almog-cohen-website:latest

# Deploy to Cloud Run
gcloud run deploy dj-almog-cohen-website \
  --image gcr.io/YOUR_PROJECT_ID/dj-almog-cohen-website:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 3000
```

## Step 5: Access Your Website

After deployment, get your website URL:
```bash
gcloud run services describe dj-almog-cohen-website \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

## Local Development

To test the Docker build locally:
```bash
# Build the image
docker build -t dj-almog-cohen-website .

# Run the container
docker run -p 3000:3000 dj-almog-cohen-website

# Visit http://localhost:3000
```

## Custom Domain (Optional)

To map a custom domain:

1. Verify domain ownership in GCP
2. Map the domain:
```bash
gcloud run domain-mappings create \
  --service dj-almog-cohen-website \
  --domain www.yourwebsite.com \
  --region us-central1
```
3. Update your DNS records as instructed

## Monitoring and Logs

View logs:
```bash
gcloud run services logs read dj-almog-cohen-website --region us-central1
```

Or visit the [Cloud Run Console](https://console.cloud.google.com/run)

## Cost Optimization

Cloud Run pricing is based on:
- Number of requests
- Compute time
- Memory allocation

Free tier includes:
- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

## Troubleshooting

### Build Fails
- Check the logs in GitHub Actions or Cloud Build
- Verify all dependencies are in `package.json`
- Test the Docker build locally

### Deployment Fails
- Verify service account permissions
- Check GCP quotas and billing
- Ensure APIs are enabled

### Application Errors
- Check Cloud Run logs
- Verify environment variables
- Test locally with Docker

## Security Notes

- Never commit `key.json` or any credentials to Git
- Rotate service account keys regularly
- Use least-privilege IAM roles
- Enable Cloud Armor for DDoS protection (production)

## Next Steps

- Set up Cloud CDN for better performance
- Configure Cloud Armor for security
- Set up monitoring and alerting
- Implement Cloud SQL if needed for database
- Configure custom domain and SSL

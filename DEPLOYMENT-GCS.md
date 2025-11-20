# GCS Bucket Deployment Guide - compaktt.com

Complete guide for deploying your Next.js website to Google Cloud Storage with custom domain.

## 🌐 Architecture

- **Hosting**: Google Cloud Storage (static website hosting)
- **Domain**: compaktt.com
- **CI/CD**: GitHub Actions
- **Distribution**: Can add Cloud CDN for global performance

## 🚀 Quick Setup

### Step 1: Install gcloud CLI

```bash
brew install --cask gcloud-cli
```

After installation, restart your terminal or run:
```bash
source ~/.zshrc
```

### Step 2: Run Setup Script

```bash
./scripts/setup-gcs-bucket.sh
```

This script will:
- Create the GCS bucket `www.compaktt.com`
- Configure it for website hosting
- Set up permissions
- Create service account for GitHub Actions
- Generate the key file

### Step 3: Configure GitHub Secrets

1. Go to: https://github.com/Almog369Cohen/Website_dj_almog_cohen/settings/secrets/actions

2. Click "New repository secret" and add:

   **GCP_PROJECT_ID**
   - Value: Your GCP project ID

   **GCP_SA_KEY**
   - Value: Contents of `gcp-key.json` file
   - Get it with: `cat gcp-key.json` and copy entire content

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Configure for GCS bucket deployment with compaktt.com"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Build your Next.js site as static HTML
2. Upload to GCS bucket
3. Set proper cache headers
4. Your site will be live!

## 🌍 Domain Configuration

### Verify Domain Ownership

1. Go to [Google Cloud Console - Storage Settings](https://console.cloud.google.com/storage/settings)
2. Under "Domain", click "Add a domain"
3. Enter: `compaktt.com` and `www.compaktt.com`
4. Follow verification steps (add TXT record to DNS)

### Configure DNS Records

In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add:

#### For www subdomain (CNAME):
```
Type: CNAME
Name: www
Value: c.storage.googleapis.com
TTL: 3600
```

#### For root domain (A record with redirect):
Most DNS providers offer a redirect/forwarding service:
```
Type: Redirect (or ALIAS/ANAME)
Name: @
Value: www.compaktt.com
```

Or use Cloud Load Balancer for root domain (see Advanced Setup below).

## 🚀 Testing

After DNS propagation (can take 5-48 hours):

```bash
# Test the bucket URL
curl -I https://storage.googleapis.com/www.compaktt.com/index.html

# Test your domain
curl -I https://www.compaktt.com
```

## 🎯 Manual Deployment (Alternative)

If you want to deploy manually:

```bash
# Navigate to the site directory
cd "Coder - 1 /docs/site"

# Build the site
npm run build

# Upload to bucket
gsutil -m rsync -r -d out gs://www.compaktt.com

# Set cache headers
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
  'gs://www.compaktt.com/_next/**'

gsutil -m setmeta -h "Cache-Control:public, max-age=0, must-revalidate" \
  'gs://www.compaktt.com/**/*.html'
```

## 📊 Bucket Information

View your bucket:
```bash
gsutil ls -L -b gs://www.compaktt.com
```

View bucket contents:
```bash
gsutil ls gs://www.compaktt.com
```

Check website configuration:
```bash
gsutil web get gs://www.compaktt.com
```

## 🔐 Security

### Current Setup (Public Bucket)
- All files are publicly readable
- Suitable for public websites
- No authentication required

### Bucket Permissions
```bash
# View bucket permissions
gsutil iam get gs://www.compaktt.com

# Make bucket public (already done by script)
gsutil iam ch allUsers:objectViewer gs://www.compaktt.com
```

## ⚡ Advanced Setup: Cloud CDN

For better global performance, add Cloud CDN:

### 1. Create Load Balancer

```bash
# Reserve static IP
gcloud compute addresses create compaktt-ip --global

# Create backend bucket
gcloud compute backend-buckets create compaktt-backend \
  --gcs-bucket-name=www.compaktt.com \
  --enable-cdn

# Create URL map
gcloud compute url-maps create compaktt-url-map \
  --default-backend-bucket=compaktt-backend

# Create HTTPS certificate
gcloud compute ssl-certificates create compaktt-cert \
  --domains=compaktt.com,www.compaktt.com

# Create target HTTPS proxy
gcloud compute target-https-proxies create compaktt-https-proxy \
  --url-map=compaktt-url-map \
  --ssl-certificates=compaktt-cert

# Create forwarding rule
gcloud compute forwarding-rules create compaktt-https-rule \
  --global \
  --target-https-proxy=compaktt-https-proxy \
  --ports=443
```

### 2. Update DNS to Load Balancer IP

Get the IP address:
```bash
gcloud compute addresses describe compaktt-ip --global
```

Update your DNS:
```
Type: A
Name: @
Value: [LOAD_BALANCER_IP]

Type: A
Name: www
Value: [LOAD_BALANCER_IP]
```

## 💰 Cost Estimation

### Basic Setup (GCS Only)
- **Storage**: ~$0.02/GB/month
- **Network Egress**: First 1GB free, then ~$0.12/GB
- **Operations**: Class A/B operations (minimal cost)

**Estimated for small website**: $1-5/month

### With Cloud CDN
- **CDN Cache Egress**: ~$0.08/GB (cheaper than direct GCS)
- **HTTP(S) Load Balancing**: ~$18/month + per-request fees

**Estimated with CDN**: $20-30/month for moderate traffic

### Free Tier
- 5GB-months of storage
- 1GB network egress per month
- 5,000 Class A operations
- 50,000 Class B operations

## 🔄 Cache Invalidation

Clear the bucket cache:
```bash
# Delete specific file
gsutil rm gs://www.compaktt.com/index.html

# Re-upload (GitHub Actions does this automatically)
gsutil cp "Coder - 1 /docs/site/out/index.html" gs://www.compaktt.com/

# If using Cloud CDN, invalidate cache
gcloud compute url-maps invalidate-cdn-cache compaktt-url-map \
  --path "/*"
```

## 📈 Monitoring

### View Logs
```bash
# Enable logging
gsutil logging set on -b gs://compaktt-logs gs://www.compaktt.com

# Download logs
gsutil ls gs://compaktt-logs
```

### Storage Metrics
View in Cloud Console:
https://console.cloud.google.com/storage/browser/www.compaktt.com

## 🐛 Troubleshooting

### 404 Errors
- Verify bucket name matches domain: `www.compaktt.com`
- Check web configuration: `gsutil web get gs://www.compaktt.com`
- Ensure 404.html exists

### Access Denied
- Check bucket permissions: `gsutil iam get gs://www.compaktt.com`
- Make bucket public: `gsutil iam ch allUsers:objectViewer gs://www.compaktt.com`

### DNS Not Resolving
- Check CNAME record: `dig www.compaktt.com`
- Wait for DNS propagation (up to 48 hours)
- Verify domain ownership in GCP

### Build Failures
- Check GitHub Actions logs
- Test build locally: `cd "Coder - 1 /docs/site" && npm run build`
- Verify `output: 'export'` in next.config.ts

### Upload Failures
- Check service account permissions
- Verify GCP_SA_KEY secret is correct
- Ensure bucket exists and is accessible

## 📚 Useful Commands

```bash
# Check bucket size
gsutil du -sh gs://www.compaktt.com

# List recent uploads
gsutil ls -lh gs://www.compaktt.com | tail -20

# Sync local to bucket (dry run)
gsutil -m rsync -r -d -n out gs://www.compaktt.com

# Check bucket website config
gsutil web get gs://www.compaktt.com

# Test website endpoint
curl -I https://storage.googleapis.com/www.compaktt.com/index.html
```

## 🎉 Success Checklist

- [ ] gcloud CLI installed
- [ ] GCS bucket created (`www.compaktt.com`)
- [ ] Bucket configured for website hosting
- [ ] Service account created with permissions
- [ ] GitHub secrets configured
- [ ] Domain verified in GCP
- [ ] DNS records created
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow succeeded
- [ ] Website accessible at https://www.compaktt.com

## 🔗 Useful Links

- [GCP Console - Storage](https://console.cloud.google.com/storage)
- [GitHub Repository](https://github.com/Almog369Cohen/Website_dj_almog_cohen)
- [GitHub Actions](https://github.com/Almog369Cohen/Website_dj_almog_cohen/actions)
- [Domain Verification](https://console.cloud.google.com/storage/settings)

---

**Need help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) or contact support.

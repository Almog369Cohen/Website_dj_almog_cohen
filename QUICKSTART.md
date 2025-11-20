# 🚀 Quick Start Guide - Deploy to compaktt.com

Follow these steps to deploy your website to Google Cloud Storage with your custom domain.

## ✅ Prerequisites Check

- [x] Git repository configured: `git@github.com:Almog369Cohen/Website_dj_almog_cohen.git`
- [x] Next.js configured for static export
- [x] GCS deployment workflow created
- [x] Domain: compaktt.com

## 📋 Step-by-Step Deployment

### Step 1: Complete gcloud CLI Installation

The installation was started but may need to complete. Check if it's installed:

```bash
gcloud --version
```

If not installed or command not found:

```bash
# Wait for any existing brew process to finish, then:
brew install --cask gcloud-cli

# Add to PATH (add this to your ~/.zshrc)
export PATH=/opt/homebrew/share/google-cloud-sdk/bin:"$PATH"

# Reload your shell
source ~/.zshrc
```

### Step 2: Login to GCP and Set Up Bucket

Run the automated setup script:

```bash
./scripts/setup-gcs-bucket.sh
```

**What this does:**
- Logs you into GCP
- Creates bucket: `www.compaktt.com`
- Configures it for website hosting
- Makes it publicly accessible
- Creates service account for GitHub Actions
- Generates credentials file: `gcp-key.json`

**You'll need to provide:**
- Your GCP Project ID (e.g., `my-project-12345`)

### Step 3: Configure GitHub Secrets

1. Go to: https://github.com/Almog369Cohen/Website_dj_almog_cohen/settings/secrets/actions

2. Click **"New repository secret"**

3. Add **GCP_PROJECT_ID**:
   - Name: `GCP_PROJECT_ID`
   - Value: Your project ID from Step 2

4. Add **GCP_SA_KEY**:
   - Name: `GCP_SA_KEY`
   - Value: Copy the entire contents of `gcp-key.json`
   
   ```bash
   # Copy this output:
   cat gcp-key.json
   ```

### Step 4: Verify Domain in GCP

1. Go to: https://console.cloud.google.com/storage/settings

2. Click **"Add a domain"**

3. Add both:
   - `compaktt.com`
   - `www.compaktt.com`

4. Follow the verification instructions (add TXT record to your DNS)

### Step 5: Configure DNS Records

In your domain registrar (where you bought compaktt.com):

#### Add CNAME record for www subdomain:
```
Type: CNAME
Name: www
Value: c.storage.googleapis.com
TTL: 3600
```

#### Redirect root domain to www:
Most registrars have a "Redirect" or "URL Forwarding" feature:
```
From: compaktt.com
To: https://www.compaktt.com
Type: 301 Permanent
```

### Step 6: Push to GitHub

```bash
# Push your code
git push origin main

# Monitor deployment
# Go to: https://github.com/Almog369Cohen/Website_dj_almog_cohen/actions
```

The GitHub Actions workflow will:
1. ✅ Build your Next.js site
2. ✅ Upload to GCS bucket
3. ✅ Set cache headers
4. ✅ Your site is live!

### Step 7: Test Your Website

After deployment completes (2-3 minutes):

```bash
# Test the bucket URL
curl -I https://storage.googleapis.com/www.compaktt.com/index.html

# After DNS propagates (can take 1-48 hours):
curl -I https://www.compaktt.com
```

Visit: **https://www.compaktt.com** 🎉

## 🔍 Verification Checklist

- [ ] gcloud CLI installed and in PATH
- [ ] Logged into GCP
- [ ] Bucket created: `www.compaktt.com`
- [ ] Service account created
- [ ] `gcp-key.json` file exists
- [ ] GitHub secrets configured (GCP_PROJECT_ID, GCP_SA_KEY)
- [ ] Domain verified in GCP
- [ ] DNS records configured
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow succeeded
- [ ] Website accessible at https://www.compaktt.com

## 📞 If You Need Help

### Can't find gcp-key.json?
```bash
# Regenerate it:
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### GitHub Actions failing?
1. Check the logs: https://github.com/Almog369Cohen/Website_dj_almog_cohen/actions
2. Verify secrets are set correctly
3. Ensure service account has permissions

### Domain not working?
1. DNS can take 24-48 hours to propagate
2. Verify CNAME record: `dig www.compaktt.com`
3. Check domain verification in GCP Console

### Build fails locally?
```bash
cd "Coder - 1 /docs/site"
npm install
npm run build
```

## 📚 Full Documentation

- **[DEPLOYMENT-GCS.md](./DEPLOYMENT-GCS.md)** - Complete detailed guide
- **[README.md](./README.md)** - Project overview

## 🎯 What Happens Next?

Every time you push to the `main` branch:
1. GitHub Actions automatically builds your site
2. Uploads it to GCS
3. Your website updates at www.compaktt.com

No manual deployment needed! 🚀

## 💰 Costs

Expected monthly cost: **$1-5** (for typical website traffic)

---

**Ready to deploy?** Start with Step 1! 🚀

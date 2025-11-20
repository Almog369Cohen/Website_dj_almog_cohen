# DJ Almog Cohen - Official Website

A modern, responsive Next.js website for DJ Almog Cohen with automated deployment to Google Cloud Storage.

**Live at**: https://www.compaktt.com

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Google Cloud Platform account
- GitHub account
- gcloud CLI

### Local Development

```bash
cd "site"
npm install
npm run dev
```

Visit `http://localhost:3000` to see your website.

## 📦 Deployment

This project includes automated CI/CD pipeline for deploying to Google Cloud Platform:
- **GitHub Actions** for CI/CD automation
- **Google Cloud Storage** for static website hosting
- **Custom Domain** (compaktt.com)
- **Optional Cloud CDN** for global performance

### Setup Instructions

#### 1. Install gcloud CLI

```bash
brew install --cask gcloud-cli
```

Restart your terminal after installation.

#### 2. Configure GCS Bucket with Workload Identity ✓

Run the automated setup script:

```bash
./scripts/setup-gcs-bucket-wif.sh
```

This will:
- Create the bucket `www.compaktt.com`
- Configure website hosting
- Set up Workload Identity Federation (no keys needed!)
- Configure permissions

Or follow the manual steps in [`DEPLOYMENT-GCS.md`](./DEPLOYMENT-GCS.md).

#### 3. Configure GitHub Secrets

Go to: https://github.com/Almog369Cohen/Website_dj_almog_cohen/settings/secrets/actions

Add these THREE secrets:
- **GCP_PROJECT_ID**: Your GCP project ID
- **GCP_SERVICE_ACCOUNT**: Service account email
- **GCP_WORKLOAD_IDENTITY_PROVIDER**: Workload Identity Provider path

(All values provided by the setup script)

#### 4. Configure DNS

Add these DNS records to your domain registrar:

```
Type: CNAME
Name: www
Value: c.storage.googleapis.com
```

#### 5. Deploy

Push to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Deploy to GCS"
git push origin main
```

Monitor the deployment in the **Actions** tab on GitHub.

Your website will be live at: https://www.compaktt.com

## 📁 Project Structure

```
.
├── site/     # Next.js application
│   ├── src/
│   │   ├── app/              # Next.js 13+ app directory
│   │   ├── components/       # React components
│   │   └── content/          # Content files
│   ├── public/               # Static assets
│   └── package.json
├── .github/
│   └── workflows/
│       └── gcs-deploy.yml    # GitHub Actions CI/CD for GCS
├── scripts/
│   ├── setup-gcp.sh          # Cloud Run setup (alternative)
│   └── setup-gcs-bucket.sh   # GCS bucket setup
├── Dockerfile                # Docker configuration (Cloud Run alternative)
├── cloudbuild.yaml           # Cloud Build configuration (alternative)
├── DEPLOYMENT.md             # Cloud Run deployment guide
├── DEPLOYMENT-GCS.md         # GCS bucket deployment guide (current)
└── README.md                 # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber
- **Audio**: Howler.js, Tone.js
- **Hosting**: Google Cloud Storage
- **CI/CD**: GitHub Actions
- **Domain**: compaktt.com

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Static Build

Test the static build locally:

```bash
cd "site"
npm run build
# Output will be in the 'out' directory
npx serve out
```

## 📚 Documentation

- **[DEPLOYMENT-GCS.md](./DEPLOYMENT-GCS.md)** - Complete GCS bucket deployment guide ⭐
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Alternative Cloud Run deployment
- [Site Architecture](./Coder%20-%201%20/docs/site-architecture.md) - Website structure
- [Creative Direction](./Coder%20-%201%20/docs/creative-direction-moodboard.md) - Design guidelines

## 🌐 Deployment Options

### Option A: GCS Bucket + GitHub Actions (Current ⭐)
- Static website hosting on Google Cloud Storage
- Automatic deployment on push to `main`
- Custom domain (compaktt.com)
- Low cost (~$1-5/month)

### Option B: Cloud Run (Alternative)
- Containerized deployment
- See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Option C: Manual Upload
Deploy manually using `gsutil`:

```bash
cd "site"
npm run build
gsutil -m rsync -r -d out gs://www.compaktt.com
```

See [`DEPLOYMENT-GCS.md`](./DEPLOYMENT-GCS.md) for detailed instructions.

## 🔒 Security

- Service account keys are stored as GitHub Secrets
- Bucket permissions configured for public read-only access
- HTTPS provided by Google Cloud Storage
- All secrets excluded from version control

## 📊 Monitoring

View bucket metrics:

```bash
# View bucket details
gsutil ls -L -b gs://www.compaktt.com

# Check website configuration
gsutil web get gs://www.compaktt.com

# View bucket contents
gsutil ls gs://www.compaktt.com
```

Or visit the [GCS Console](https://console.cloud.google.com/storage).

## 💰 Cost Optimization

GCS pricing for static website:
- **Storage**: ~$0.02/GB/month
- **Network Egress**: First 1GB free, then ~$0.12/GB
- **Operations**: Minimal cost for reads

**Estimated cost**: $1-5/month for typical website traffic

Perfect for cost-effective static website hosting!

## 🤝 Contributing

This is a personal website project. For any questions or suggestions, please reach out directly.

## 📄 License

© 2024 DJ Almog Cohen. All rights reserved.

## 🆘 Troubleshooting

### Build fails
- Check logs in GitHub Actions
- Verify `package.json` dependencies
- Test build locally: `npm run build`

### Deployment fails
- Verify GCP service account permissions
- Check bucket exists: `gsutil ls gs://www.compaktt.com`
- Ensure billing is enabled on your GCP project

### Domain not working
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check domain verification in GCP Console

### 404 errors
- Ensure `404.html` exists in public folder
- Check bucket website configuration
- Verify bucket permissions are public

For more help, see the [DEPLOYMENT-GCS.md](./DEPLOYMENT-GCS.md) troubleshooting section.

---

**Built with ❤️ using Next.js and deployed on Google Cloud Storage**

# Compakt Backoffice — Cloud Run Deployment

## Architecture
- **App**: Next.js 14 (standalone mode) in Docker
- **Hosting**: Google Cloud Run (`me-west1`)
- **CI/CD**: GitHub Actions (auto-deploy on push to `main` when `compakt/` changes)
- **DB/Auth**: Supabase (external)

## Required GitHub Secrets

Go to: https://github.com/Almog369Cohen/Website_dj_almog_cohen/settings/secrets/actions

Add these secrets (if not already set):

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_SA_KEY` | Service account JSON key (full content of `gcp-key.json`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rgfajvnkrszwksiidspm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (from `.env.local`) |

## Deploy

### Automatic (recommended)
Push to `main` — any change in `compakt/` triggers deploy:
```bash
git add .
git commit -m "Deploy Compakt Backoffice"
git push origin main
```

### Manual trigger
Go to GitHub Actions → "Deploy Compakt Backoffice to Cloud Run" → Run workflow

## After First Deploy

Get the Cloud Run URL:
```bash
gcloud run services describe compakt-backoffice \
  --platform managed --region me-west1 \
  --format 'value(status.url)'
```

### Connect Custom Domain (optional)
```bash
gcloud run domain-mappings create \
  --service compakt-backoffice \
  --domain app.compaktt.com \
  --region me-west1
```
Then add the DNS records shown in the output.

## Local Docker Test
```bash
cd compakt
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://rgfajvnkrszwksiidspm.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY \
  -t compakt-backoffice .

docker run -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY \
  -e NEXT_PUBLIC_SUPABASE_URL=https://rgfajvnkrszwksiidspm.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY \
  compakt-backoffice
```

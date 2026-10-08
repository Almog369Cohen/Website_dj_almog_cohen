#!/bin/bash

# One-time setup: serve academy-site/ at https://school.compaktt.com
# through the existing compaktt.com HTTPS load balancer (same static IP as www).
#
# Usage:
#   ./scripts/setup-school-subdomain.sh
#
# DEPLOY_SA defaults to the github-actions service account created by
# scripts/setup-gcs-bucket-wif.sh; override it if GitHub Actions uses another one.

set -euo pipefail

PROJECT_ID="project-9ed1b370-0678-4a14-b8d"
HOST="school.compaktt.com"
BUCKET_NAME="school-compaktt-com"
BACKEND_BUCKET_NAME="backend-bucket-school-compaktt"
URL_MAP_NAME="url-map-compaktt"
TARGET_HTTPS_PROXY_NAME="https-proxy-compaktt"
SSL_CERT_NAME="ssl-cert-school-compaktt"
STATIC_IP_NAME="compaktt-static-ip"
DEPLOY_SA="${DEPLOY_SA:-github-actions@${PROJECT_ID}.iam.gserviceaccount.com}"

if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed."
    exit 1
fi

gcloud config set project "$PROJECT_ID"

echo ""
echo "Step 1: Creating bucket gs://$BUCKET_NAME ..."
gsutil mb -l US -b on "gs://$BUCKET_NAME" || echo "Bucket might already exist"
gsutil web set -m index.html -e index.html "gs://$BUCKET_NAME"
gsutil iam ch allUsers:objectViewer "gs://$BUCKET_NAME"
gsutil iam ch "serviceAccount:${DEPLOY_SA}:objectAdmin" "gs://$BUCKET_NAME"

echo ""
echo "Step 2: Creating backend bucket..."
gcloud compute backend-buckets create "$BACKEND_BUCKET_NAME" \
    --gcs-bucket-name="$BUCKET_NAME" \
    --enable-cdn \
    --cache-mode=CACHE_ALL_STATIC \
    || echo "Backend bucket might already exist"

echo ""
echo "Step 3: Routing $HOST to the new backend in $URL_MAP_NAME..."
gcloud compute url-maps add-path-matcher "$URL_MAP_NAME" \
    --global \
    --path-matcher-name=school \
    --default-backend-bucket="$BACKEND_BUCKET_NAME" \
    --new-hosts="$HOST" \
    || echo "Path matcher might already exist"

echo ""
echo "Step 4: Creating managed SSL certificate for $HOST..."
gcloud compute ssl-certificates create "$SSL_CERT_NAME" \
    --domains="$HOST" \
    --global \
    || echo "SSL certificate might already exist"

echo ""
echo "Step 5: Attaching the certificate to $TARGET_HTTPS_PROXY_NAME (keeping the existing ones)..."
CURRENT_CERTS=$(gcloud compute target-https-proxies describe "$TARGET_HTTPS_PROXY_NAME" --global \
    --format="value(sslCertificates)" | tr ';' '\n' | sed 's#.*/##' | grep -v '^$' || true)
if echo "$CURRENT_CERTS" | grep -qx "$SSL_CERT_NAME"; then
    echo "Certificate already attached"
else
    ALL_CERTS=$(printf "%s\n%s\n" "$CURRENT_CERTS" "$SSL_CERT_NAME" | grep -v '^$' | paste -sd, -)
    gcloud compute target-https-proxies update "$TARGET_HTTPS_PROXY_NAME" \
        --global \
        --ssl-certificates="$ALL_CERTS"
fi

IP=$(gcloud compute addresses describe "$STATIC_IP_NAME" --global --format="value(address)" 2>/dev/null || echo "<load balancer IP>")

echo ""
echo "=== Done. Last step is DNS ==="
echo "Add this record at your DNS provider:"
echo ""
echo "  Type: A"
echo "  Name: school"
echo "  Value: $IP"
echo ""
echo "The SSL certificate turns ACTIVE 15-60 minutes after DNS points at the load balancer:"
echo "  gcloud compute ssl-certificates describe $SSL_CERT_NAME --global --format='get(managed.status)'"
echo ""
echo "Then run the 'Deploy academy site (school.compaktt.com)' workflow in GitHub Actions"
echo "(or push a change under academy-site/ to main)."

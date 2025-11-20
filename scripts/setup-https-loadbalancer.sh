#!/bin/bash

# Setup HTTPS Load Balancer for GCS Bucket
# This enables HTTPS access for www.compaktt.com

set -e

echo "=== HTTPS Load Balancer Setup for compaktt.com ==="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed."
    echo "Please install it with: brew install --cask gcloud-cli"
    exit 1
fi

# Configuration
PROJECT_ID="project-9ed1b370-0678-4a14-b8d"
DOMAIN="compaktt.com"
BUCKET_NAME="www.${DOMAIN}"
BACKEND_BUCKET_NAME="backend-bucket-compaktt"
LOAD_BALANCER_NAME="lb-compaktt"
SSL_CERT_NAME="ssl-cert-compaktt"
URL_MAP_NAME="url-map-compaktt"
TARGET_HTTPS_PROXY_NAME="https-proxy-compaktt"
FORWARDING_RULE_NAME="https-forwarding-rule-compaktt"

echo "Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Domain: www.$DOMAIN"
echo "  Bucket: $BUCKET_NAME"
echo ""

# Set project
echo "Setting project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
echo "Enabling required APIs..."
gcloud services enable compute.googleapis.com

echo ""
echo "Step 1: Creating backend bucket..."
gcloud compute backend-buckets create $BACKEND_BUCKET_NAME \
    --gcs-bucket-name=$BUCKET_NAME \
    --enable-cdn \
    --cache-mode=CACHE_ALL_STATIC \
    || echo "Backend bucket might already exist"

echo ""
echo "Step 2: Creating URL map..."
gcloud compute url-maps create $URL_MAP_NAME \
    --default-backend-bucket=$BACKEND_BUCKET_NAME \
    || echo "URL map might already exist"

echo ""
echo "Step 3: Creating managed SSL certificate..."
echo "Note: This will take 15-60 minutes to provision after DNS is updated"
gcloud compute ssl-certificates create $SSL_CERT_NAME \
    --domains=www.$DOMAIN \
    --global \
    || echo "SSL certificate might already exist"

echo ""
echo "Step 4: Creating target HTTPS proxy..."
gcloud compute target-https-proxies create $TARGET_HTTPS_PROXY_NAME \
    --url-map=$URL_MAP_NAME \
    --ssl-certificates=$SSL_CERT_NAME \
    --global \
    || echo "Target proxy might already exist"

echo ""
echo "Step 5: Creating global forwarding rule (this assigns the IP)..."
gcloud compute forwarding-rules create $FORWARDING_RULE_NAME \
    --load-balancing-scheme=EXTERNAL \
    --network-tier=PREMIUM \
    --address-region=global \
    --global \
    --target-https-proxy=$TARGET_HTTPS_PROXY_NAME \
    --ports=443 \
    || echo "Forwarding rule might already exist"

echo ""
echo "Step 6: Creating HTTP to HTTPS redirect..."
HTTP_URL_MAP_NAME="url-map-http-redirect-compaktt"
HTTP_PROXY_NAME="http-proxy-redirect-compaktt"
HTTP_FORWARDING_RULE_NAME="http-forwarding-rule-compaktt"

# Create redirect URL map
gcloud compute url-maps import $HTTP_URL_MAP_NAME \
    --global \
    --quiet \
    <<EOF || echo "HTTP redirect URL map might already exist"
name: $HTTP_URL_MAP_NAME
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
  stripQuery: false
EOF

# Create HTTP proxy
gcloud compute target-http-proxies create $HTTP_PROXY_NAME \
    --url-map=$HTTP_URL_MAP_NAME \
    --global \
    || echo "HTTP proxy might already exist"

# Create HTTP forwarding rule
gcloud compute forwarding-rules create $HTTP_FORWARDING_RULE_NAME \
    --load-balancing-scheme=EXTERNAL \
    --network-tier=PREMIUM \
    --address-region=global \
    --global \
    --target-http-proxy=$HTTP_PROXY_NAME \
    --ports=80 \
    || echo "HTTP forwarding rule might already exist"

echo ""
echo "✅ Load Balancer Setup Complete!"
echo ""
echo "=== Important: DNS Configuration Required ==="
echo ""
echo "Get the load balancer IP address:"
echo ""
LOAD_BALANCER_IP=$(gcloud compute forwarding-rules describe $FORWARDING_RULE_NAME --global --format="get(IPAddress)" 2>/dev/null || echo "NOT_CREATED_YET")

if [ "$LOAD_BALANCER_IP" != "NOT_CREATED_YET" ]; then
    echo "Load Balancer IP: $LOAD_BALANCER_IP"
    echo ""
    echo "=== UPDATE YOUR DNS ==="
    echo ""
    echo "Replace the existing CNAME record with an A record:"
    echo ""
    echo "Type: A"
    echo "Name: www"
    echo "Value: $LOAD_BALANCER_IP"
    echo "TTL: 3600"
    echo ""
    echo "After DNS update, the SSL certificate will automatically provision."
    echo "This takes 15-60 minutes. Check status with:"
    echo ""
    echo "  gcloud compute ssl-certificates describe $SSL_CERT_NAME --global"
    echo ""
else
    echo "Could not retrieve IP address. Run this command to get it:"
    echo ""
    echo "  gcloud compute forwarding-rules describe $FORWARDING_RULE_NAME --global --format='get(IPAddress)'"
    echo ""
fi

echo "=== Verification Commands ==="
echo ""
echo "# Check SSL certificate status:"
echo "gcloud compute ssl-certificates describe $SSL_CERT_NAME --global"
echo ""
echo "# Check load balancer status:"
echo "gcloud compute url-maps describe $URL_MAP_NAME --global"
echo ""
echo "# Test HTTPS (after DNS update and cert provisioning):"
echo "curl -I https://www.$DOMAIN"
echo ""
echo "✅ Your website will be available at: https://www.$DOMAIN"
echo ""

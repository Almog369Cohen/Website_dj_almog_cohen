#!/bin/bash

# Test script for setup-gcp.sh and setup-gcs-bucket.sh
# This validates the scripts without actually executing destructive commands

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== Setup Scripts E2E Validation ==="
echo ""

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

test_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

test_fail() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

test_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Test 1: Check if scripts exist
echo "📁 Checking script files..."
if [ -f "scripts/setup-gcp.sh" ]; then
    test_pass "setup-gcp.sh exists"
else
    test_fail "setup-gcp.sh not found"
fi

if [ -f "scripts/setup-gcs-bucket.sh" ]; then
    test_pass "setup-gcs-bucket.sh exists"
else
    test_fail "setup-gcs-bucket.sh not found"
fi

# Test 2: Check if scripts are executable
echo ""
echo "🔒 Checking permissions..."
if [ -x "scripts/setup-gcp.sh" ]; then
    test_pass "setup-gcp.sh is executable"
else
    test_fail "setup-gcp.sh is not executable"
fi

if [ -x "scripts/setup-gcs-bucket.sh" ]; then
    test_pass "setup-gcs-bucket.sh is executable"
else
    test_fail "setup-gcs-bucket.sh is not executable"
fi

# Test 3: Check bash syntax
echo ""
echo "📝 Validating bash syntax..."
if bash -n scripts/setup-gcp.sh 2>/dev/null; then
    test_pass "setup-gcp.sh syntax is valid"
else
    test_fail "setup-gcp.sh has syntax errors"
fi

if bash -n scripts/setup-gcs-bucket.sh 2>/dev/null; then
    test_pass "setup-gcs-bucket.sh syntax is valid"
else
    test_fail "setup-gcs-bucket.sh has syntax errors"
fi

# Test 4: Check for required tools
echo ""
echo "🔧 Checking required tools..."
if command -v gcloud &> /dev/null; then
    GCLOUD_VERSION=$(gcloud --version | head -1)
    test_pass "gcloud CLI installed: $GCLOUD_VERSION"
else
    test_fail "gcloud CLI not installed"
fi

if command -v gsutil &> /dev/null; then
    test_pass "gsutil installed"
else
    test_fail "gsutil not installed"
fi

if command -v git &> /dev/null; then
    test_pass "git installed"
else
    test_fail "git not installed"
fi

# Test 5: Validate gcloud commands in scripts
echo ""
echo "🔍 Validating gcloud commands..."

# Extract gcloud commands from setup-gcp.sh
if grep -q "gcloud services enable" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Contains API enable commands"
else
    test_fail "setup-gcp.sh: Missing API enable commands"
fi

if grep -q "gcloud iam service-accounts create" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Contains service account creation"
else
    test_fail "setup-gcp.sh: Missing service account creation"
fi

if grep -q "gcloud projects add-iam-policy-binding" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Contains IAM policy binding"
else
    test_fail "setup-gcp.sh: Missing IAM policy binding"
fi

if grep -q "gcloud iam service-accounts keys create" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Contains key creation"
else
    test_fail "setup-gcp.sh: Missing key creation"
fi

# Test 6: Validate gsutil commands in setup-gcs-bucket.sh
echo ""
echo "🪣 Validating GCS bucket commands..."

if grep -q "gsutil mb" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Contains bucket creation"
else
    test_fail "setup-gcs-bucket.sh: Missing bucket creation"
fi

if grep -q "gsutil iam ch" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Contains IAM permissions"
else
    test_fail "setup-gcs-bucket.sh: Missing IAM permissions"
fi

if grep -q "gsutil web set" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Contains website configuration"
else
    test_fail "setup-gcs-bucket.sh: Missing website configuration"
fi

if grep -q "gsutil cors set" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Contains CORS configuration"
else
    test_fail "setup-gcs-bucket.sh: Missing CORS configuration"
fi

# Test 7: Check for error handling
echo ""
echo "🛡️ Checking error handling..."

if grep -q "set -e" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Has error handling (set -e)"
else
    test_warn "setup-gcp.sh: Missing strict error handling"
fi

if grep -q "set -e" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Has error handling (set -e)"
else
    test_warn "setup-gcs-bucket.sh: Missing strict error handling"
fi

# Test 8: Check for gcloud detection
echo ""
echo "🔎 Checking gcloud CLI detection..."

if grep -q "command -v gcloud" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Checks for gcloud installation"
else
    test_fail "setup-gcp.sh: Missing gcloud check"
fi

if grep -q "command -v gcloud" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Checks for gcloud installation"
else
    test_fail "setup-gcs-bucket.sh: Missing gcloud check"
fi

# Test 9: Validate script outputs
echo ""
echo "💬 Checking user instructions..."

if grep -q "GitHub" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Contains GitHub instructions"
else
    test_warn "setup-gcp.sh: Missing GitHub instructions"
fi

if grep -q "compaktt.com" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: References compaktt.com domain"
else
    test_fail "setup-gcs-bucket.sh: Missing domain reference"
fi

# Test 10: Check for dangerous commands
echo ""
echo "⚠️  Checking for potentially dangerous commands..."

DANGEROUS=0

if grep -q "rm -rf /" scripts/*.sh; then
    test_fail "Found dangerous rm -rf / command"
    DANGEROUS=1
fi

if grep -q "sudo" scripts/setup-gcp.sh || grep -q "sudo" scripts/setup-gcs-bucket.sh; then
    test_warn "Scripts contain sudo commands (should not be needed)"
fi

if [ $DANGEROUS -eq 0 ]; then
    test_pass "No dangerous commands found"
fi

# Test 11: Validate required API services
echo ""
echo "🔌 Checking API services..."

if grep -q "cloudbuild.googleapis.com" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Enables Cloud Build API"
else
    test_warn "setup-gcp.sh: Missing Cloud Build API"
fi

if grep -q "run.googleapis.com" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Enables Cloud Run API"
else
    test_warn "setup-gcp.sh: Cloud Run API (for alternative deployment)"
fi

if grep -q "storage-api.googleapis.com\|storage.googleapis.com" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Enables Storage API"
else
    test_fail "setup-gcs-bucket.sh: Missing Storage API"
fi

# Test 12: Check IAM roles
echo ""
echo "🔐 Validating IAM roles..."

if grep -q "roles/storage.admin\|roles/storage.objectAdmin" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Grants storage admin permissions"
else
    test_fail "setup-gcs-bucket.sh: Missing storage permissions"
fi

if grep -q "roles/run.admin" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Grants Cloud Run admin permissions"
else
    test_warn "setup-gcp.sh: Missing Cloud Run permissions"
fi

# Test 13: Validate bucket naming
echo ""
echo "🪣 Checking bucket configuration..."

if grep -q "www.compaktt.com" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Uses correct bucket name (www.compaktt.com)"
else
    test_fail "setup-gcs-bucket.sh: Incorrect or missing bucket name"
fi

# Test 14: Check for service account naming
echo ""
echo "👤 Checking service account configuration..."

if grep -q "github-actions" scripts/setup-gcp.sh && grep -q "github-actions" scripts/setup-gcs-bucket.sh; then
    test_pass "Both scripts use consistent service account name (github-actions)"
else
    test_fail "Service account naming inconsistent between scripts"
fi

# Test 15: Validate key file output
echo ""
echo "🔑 Checking key file generation..."

if grep -q "gcp-key.json" scripts/setup-gcs-bucket.sh; then
    test_pass "setup-gcs-bucket.sh: Generates gcp-key.json"
else
    test_fail "setup-gcs-bucket.sh: Missing key file generation"
fi

if grep -q "key.json\|gcp-key.json" scripts/setup-gcp.sh; then
    test_pass "setup-gcp.sh: Generates key file"
else
    test_fail "setup-gcp.sh: Missing key file generation"
fi

# Summary
echo ""
echo "======================================"
echo "📊 Test Summary"
echo "======================================"
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "The scripts are ready to use. To deploy:"
    echo "1. Run: ./scripts/setup-gcs-bucket.sh"
    echo "2. Configure GitHub secrets"
    echo "3. Push to GitHub"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the scripts.${NC}"
    exit 1
fi

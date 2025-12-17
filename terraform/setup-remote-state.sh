#!/bin/bash

# Setup remote state for Terraform
# This script creates a GCS bucket for storing Terraform state

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Setting up Terraform remote state...${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project configured${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${BLUE}Project ID: ${PROJECT_ID}${NC}"

# Prompt for bucket name
read -p "Enter state bucket name (default: ${PROJECT_ID}-terraform-state): " STATE_BUCKET
STATE_BUCKET=${STATE_BUCKET:-${PROJECT_ID}-terraform-state}

echo -e "${BLUE}Creating state bucket: ${STATE_BUCKET}${NC}"

# Check if bucket already exists
if gsutil ls -b gs://${STATE_BUCKET} &>/dev/null; then
    echo -e "${YELLOW}⚠️  Bucket already exists: ${STATE_BUCKET}${NC}"
else
    # Create the bucket
    gsutil mb -p ${PROJECT_ID} -l US gs://${STATE_BUCKET}
    echo -e "${GREEN}✅ Bucket created${NC}"
fi

# Enable versioning
echo -e "${BLUE}Enabling versioning...${NC}"
gsutil versioning set on gs://${STATE_BUCKET}
echo -e "${GREEN}✅ Versioning enabled${NC}"

# Set lifecycle rule to delete old versions (optional)
echo -e "${BLUE}Setting lifecycle policy...${NC}"
cat > /tmp/lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {
          "type": "Delete"
        },
        "condition": {
          "numNewerVersions": 5
        }
      }
    ]
  }
}
EOF

gsutil lifecycle set /tmp/lifecycle.json gs://${STATE_BUCKET}
rm /tmp/lifecycle.json
echo -e "${GREEN}✅ Lifecycle policy set (keeps last 5 versions)${NC}"

# Update backend.tf
echo -e "${BLUE}Updating backend.tf...${NC}"
cat > backend.tf <<EOF
# Remote state configuration
terraform {
  backend "gcs" {
    bucket = "${STATE_BUCKET}"
    prefix = "terraform/state"
  }
}
EOF

echo -e "${GREEN}✅ backend.tf updated${NC}"

echo ""
echo -e "${GREEN}🎉 Remote state setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run: terraform init -migrate-state"
echo "2. Confirm migration when prompted"
echo "3. Delete local state files: rm terraform.tfstate*"
echo ""
echo -e "${BLUE}State bucket: gs://${STATE_BUCKET}${NC}"

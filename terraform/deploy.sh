#!/bin/bash

# Deploy script for AIT Airways to Google Cloud Storage
# Usage: ./deploy.sh [bucket-name]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment...${NC}"

# Check if bucket name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Bucket name is required${NC}"
    echo "Usage: ./deploy.sh [bucket-name]"
    exit 1
fi

BUCKET_NAME=$1
DIST_DIR="../dist"

# Check if dist directory exists
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}Error: dist directory not found. Run 'pnpm build' first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Building the project...${NC}"
cd ..
pnpm build

echo -e "${BLUE} Uploading to Cloud Storage bucket: ${BUCKET_NAME}${NC}"

# Upload all files to the bucket
gsutil -m rsync -r -d \
  -x ".*\.DS_Store$" \
  dist/ gs://${BUCKET_NAME}/

# Set cache control for static assets
echo -e "${BLUE}⚙️  Setting cache control headers...${NC}"

# Cache static assets (JS, CSS, images) for 1 year
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
  "gs://${BUCKET_NAME}/**/*.js" \
  "gs://${BUCKET_NAME}/**/*.css" \
  "gs://${BUCKET_NAME}/**/*.png" \
  "gs://${BUCKET_NAME}/**/*.jpg" \
  "gs://${BUCKET_NAME}/**/*.jpeg" \
  "gs://${BUCKET_NAME}/**/*.gif" \
  "gs://${BUCKET_NAME}/**/*.svg" \
  "gs://${BUCKET_NAME}/**/*.webp" \
  "gs://${BUCKET_NAME}/**/*.woff" \
  "gs://${BUCKET_NAME}/**/*.woff2" \
  "gs://${BUCKET_NAME}/**/*.ttf" 2>/dev/null || true

# Cache HTML files for 5 minutes (to allow quick updates)
gsutil -m setmeta -h "Cache-Control:public, max-age=300" \
  "gs://${BUCKET_NAME}/**/*.html" 2>/dev/null || true

echo -e "${GREEN} Deployment complete!${NC}"
echo -e "${BLUE} Your website should be live shortly.${NC}"

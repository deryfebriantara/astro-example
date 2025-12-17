# Remote state configuration

terraform {
  backend "gcs" {
    bucket = "ait-airways-terraform-state"  # Change this to your state bucket name
    prefix = "terraform/state"
  }
}

# How to setup remote state:
#
# 1. Create a bucket for Terraform state (one-time setup):
#    gsutil mb -p YOUR_PROJECT_ID -l US gs://ait-airways-terraform-state
#
# 2. Enable versioning (recommended):
#    gsutil versioning set on gs://ait-airways-terraform-state
#
# 3. Uncomment the backend block above
#
# 4. Run terraform init to migrate state:
#    terraform init -migrate-state
#
# Benefits:
# - ✅ State stored securely in GCS
# - ✅ State locking prevents concurrent modifications
# - ✅ Team can share the same state
# - ✅ Required for CI/CD

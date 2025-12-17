variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "ait-airways"
}

variable "region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-central1"
}

variable "bucket_name" {
  description = "Name of the Cloud Storage bucket (must be globally unique)"
  type        = string
}

variable "bucket_location" {
  description = "Location for the Cloud Storage bucket"
  type        = string
  default     = "US"
}

# variable "domain_name" {
#   description = "Custom domain name for the website"
#   type        = string
#   default     = ""
# }

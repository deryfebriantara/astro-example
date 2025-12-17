output "bucket_name" {
  description = "Name of the Cloud Storage bucket"
  value       = google_storage_bucket.website.name
}

output "bucket_url" {
  description = "URL of the Cloud Storage bucket"
  value       = google_storage_bucket.website.url
}

output "website_ip" {
  description = "Static IP address for the website"
  value       = google_compute_global_address.website_ip.address
}

output "website_url" {
  description = "Website URL (HTTP)"
  value       = "http://${google_compute_global_address.website_ip.address}"
}

output "cdn_enabled" {
  description = "CDN is enabled for this deployment"
  value       = google_compute_backend_bucket.website_backend.enable_cdn
}

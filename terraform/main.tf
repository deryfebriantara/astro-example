# Configure Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Create a storage bucket for hosting the static site
resource "google_storage_bucket" "website" {
  name          = var.bucket_name
  location      = var.bucket_location
  force_destroy = true

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Make bucket publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.website.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Reserve a static IP address for the load balancer
resource "google_compute_global_address" "website_ip" {
  name = "${var.project_name}-ip"
}

# Create backend bucket for load balancer
resource "google_compute_backend_bucket" "website_backend" {
  name        = "${var.project_name}-backend"
  bucket_name = google_storage_bucket.website.name
  enable_cdn  = true

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    default_ttl       = 3600
    max_ttl           = 86400
    client_ttl        = 3600
    negative_caching  = true
    serve_while_stale = 86400
  }
}

# Create URL map
resource "google_compute_url_map" "website" {
  name            = "${var.project_name}-url-map"
  default_service = google_compute_backend_bucket.website_backend.id
}

# Create HTTP proxy
resource "google_compute_target_http_proxy" "website" {
  name    = "${var.project_name}-http-proxy"
  url_map = google_compute_url_map.website.id
}

# Create forwarding rule
resource "google_compute_global_forwarding_rule" "http" {
  name       = "${var.project_name}-http-rule"
  target     = google_compute_target_http_proxy.website.id
  port_range = "80"
  ip_address = google_compute_global_address.website_ip.address
}

# Optional: SSL Certificate (uncomment and configure for HTTPS)
# resource "google_compute_managed_ssl_certificate" "website" {
#   name = "${var.project_name}-ssl-cert"
#
#   managed {
#     domains = [var.domain_name]
#   }
# }

# Optional: HTTPS proxy (uncomment for HTTPS)
# resource "google_compute_target_https_proxy" "website" {
#   name             = "${var.project_name}-https-proxy"
#   url_map          = google_compute_url_map.website.id
#   ssl_certificates = [google_compute_managed_ssl_certificate.website.id]
# }

# Optional: HTTPS forwarding rule (uncomment for HTTPS)
# resource "google_compute_global_forwarding_rule" "https" {
#   name       = "${var.project_name}-https-rule"
#   target     = google_compute_target_https_proxy.website.id
#   port_range = "443"
#   ip_address = google_compute_global_address.website_ip.address
# }

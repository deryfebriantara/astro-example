.PHONY: help install dev build deploy-init deploy-plan deploy-apply deploy destroy clean

# Variables (override with: make deploy BUCKET=your-bucket-name)
BUCKET ?= $(shell cd terraform && terraform output -raw bucket_name 2>/dev/null)

help: ## Show this help message
	@echo "AIT Airways - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm dev

build: ## Build for production
	pnpm build

deploy-init: ## Initialize Terraform
	cd terraform && terraform init

deploy-plan: ## Preview Terraform changes
	cd terraform && terraform plan

deploy-apply: ## Apply Terraform infrastructure
	cd terraform && terraform apply

deploy: build ## Build and deploy to GCS
	@if [ -z "$(BUCKET)" ]; then \
		echo "❌ Error: Bucket name not found. Run 'make deploy-apply' first or specify BUCKET=your-bucket-name"; \
		exit 1; \
	fi
	@echo "🚀 Deploying to bucket: $(BUCKET)"
	@cd terraform && ./deploy.sh $(BUCKET)

deploy-full: deploy-apply deploy ## Full deployment (infrastructure + website)

destroy: ## Destroy all Terraform resources
	cd terraform && terraform destroy

clean: ## Clean build artifacts
	rm -rf dist .astro node_modules/.astro

terraform-fmt: ## Format Terraform files
	cd terraform && terraform fmt

terraform-validate: ## Validate Terraform configuration
	cd terraform && terraform validate

setup-remote-state: ## Setup remote state for Terraform CI/CD
	cd terraform && ./setup-remote-state.sh

gcp-login: ## Login to Google Cloud
	gcloud auth login

gcp-setup: ## Setup GCP project (interactive)
	@echo "🔧 Setting up GCP project..."
	@read -p "Enter your GCP Project ID: " project_id; \
	gcloud config set project $$project_id; \
	gcloud services enable compute.googleapis.com storage.googleapis.com

status: ## Show deployment status
	@echo "📊 Deployment Status:"
	@echo ""
	@if [ -d "terraform/.terraform" ]; then \
		echo "✅ Terraform initialized"; \
	else \
		echo "❌ Terraform not initialized (run 'make deploy-init')"; \
	fi
	@echo ""
	@cd terraform && terraform output 2>/dev/null || echo "❌ Infrastructure not deployed"

# AIT Airways - Modern Airline Website

A modern, professional airline website built with Astro, React, Tailwind CSS, and Flowbite. Features flight search & booking, destination showcase, check-in system, and multi-language support (English & Bahasa Indonesia).

![Astro](https://img.shields.io/badge/Astro-5.16.6-FF5D01?style=flat-square&logo=astro)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=flat-square&logo=typescript)

## Live Demo

**🌐 Production Site:** [http://34.49.195.238](http://34.49.195.238)

Deployed on Google Cloud Platform with Cloud CDN and Load Balancer.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

Visit: [http://localhost:4321](http://localhost:4321)

---

## Features

### User Features
- **Flight Search & Booking** - Search flights with filters (date, class, passengers)
- **Destination Showcase** - Featured destinations with dynamic routing
- **Online Check-In** - Mock check-in system with boarding pass
- **Manage Booking** - View and manage flight reservations
- **Multi-Language** - English & Bahasa Indonesia support
- **Responsive Design** - Mobile-first, works on all devices

### Technical Features
- **Optimized Performance** - Image optimization with WebP (60-70% size reduction)
- **Modern UI/UX** - Tailwind CSS + Flowbite components
- **SEO Friendly** - Meta tags, Open Graph, structured data
- **Accessible** - ARIA labels, keyboard navigation
- **Fast Loading** - Lazy loading, code splitting
- **Optimized Build** - Static site generation with Astro

---

## Tech Stack

### Core
- **[Astro 5.16.6](https://astro.build)** - Static Site Generator
- **[React 19.2.3](https://react.dev)** - Interactive components
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling
- **[Tailwind CSS 3.4.19](https://tailwindcss.com)** - Utility-first CSS
- **[Flowbite 4.0.1](https://flowbite.com)** - UI components

### Performance
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image optimization
- **WebP format** - Modern image format

### Deployment
- **[Terraform](https://www.terraform.io/)** - Infrastructure as Code
- **Google Cloud Platform** - Cloud Storage + CDN
- **GitHub Actions** - CI/CD automation

---

## Project Structure

```
puffy-phase/
├── src/
│   ├── components/          # Reusable components
│   │   ├── layout/          # Header, Footer
│   │   ├── home/            # Hero, Features
│   │   ├── booking/         # Flight search
│   │   ├── destinations/    # Destination cards
│   │   └── shared/          # Shared components
│   │
│   ├── pages/               # File-based routing
│   ├── data/                # Mock data (JSON)
│   ├── i18n/                # Translations (EN/ID)
│   ├── types/               # TypeScript types
│   └── styles/              # Global styles
│
├── terraform/               # Infrastructure as Code
├── .github/workflows/       # CI/CD workflows
└── docs/                    # Documentation
```

---

## Documentation

Complete documentation in the **[`docs/`](docs/)** folder:

### Available Guides

| Guide | Description |
|-------|-------------|
| **[Deployment](docs/DEPLOYMENT.md)** | Quick deployment guide (5 min) |
| **[GCP Setup](docs/GCP-DEPLOYMENT-SUMMARY.md)** | Complete GCP deployment |
| **[Terraform](docs/TERRAFORM-README.md)** | Infrastructure details |
| **[CI/CD Quick Start](docs/TERRAFORM-CICD-QUICKSTART.md)** | Automation setup (10 min) |
| **[CI/CD Complete](docs/TERRAFORM-CICD.md)** | Full CI/CD guide |
| **[Image Optimization](docs/IMAGE-OPTIMIZATION.md)** | Performance guide |

**[View All Documentation](docs/README.md)**

---

## Deployment

### Option 1: Manual Deploy

```bash
pnpm build
cd terraform
./deploy.sh YOUR_BUCKET_NAME
```

### Option 2: GitHub Actions (Automated)

Push to `main` → Auto deploy to GCP

**Setup:** See [Deployment Guide](docs/DEPLOYMENT.md)

---

## Multi-Language

Supported languages:
- English
- Bahasa Indonesia

Language switcher in header. Stored in localStorage + cookie.

---

## Development

### Prerequisites
- Node.js 18+ or 20+
- pnpm (recommended)

### Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview build

# Deployment
make deploy       # Deploy website
make deploy-full  # Deploy all
make status       # Check status
```

---

## Performance

### Lighthouse Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Optimizations
- WebP images (60-70% smaller)
- Lazy loading
- Code splitting
- CDN delivery

---

## Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push and create PR

---

## License

Educational & portfolio purposes.

---

## Credits

- [Astro](https://astro.build)
- [Flowbite](https://flowbite.com)
- [Unsplash](https://unsplash.com)

---

## Support

- **Documentation:** [docs/](docs/)
- **Issues:** GitHub Issues
- **GCP Support:** [console.cloud.google.com/support](https://console.cloud.google.com/support)

---

**Built with Astro + React + Tailwind CSS**

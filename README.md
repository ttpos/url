# @ttpos/url-monorepo

A simple and efficient URL shortener.

## Services

| Service                               | Description                    | URL               |
| ------------------------------------- | ------------------------------ | ----------------- |
| [@ttpos/a-app-links](apps/links/)     | URL shortener service          | https://t.a.app   |
| [@ttpos/a-app-user](apps/user/)       | User management service        | https://xxx.a.app |
| [@ttpos/a-app-website](apps/website/) | Main website and documentation | https://web.a.app |

## Prerequisites

- Node.js (>=18.20.3 || >=20.0.0)
- pnpm (v9.9.0)

## Tech Stack

- ⚡️ [Nuxt 3](https://nuxt.com/) as the full-stack framework
- 🎨 [@nuxt/ui-pro](https://ui.nuxt.com/pro) for UI components
- 💪 [TypeScript](https://www.typescriptlang.org/) for type safety
- ☁️ [Cloudflare Pages](https://pages.cloudflare.com/) for deployment
  - 🌐 Edge Functions
  - 🔒 Access Control
  - 🚀 Global CDN
- 🔄 GitHub Actions for CI/CD

## Development

```bash
# Links service
pnpm dev:links

# User service
pnpm dev:user

# Website
pnpm dev:website
```

## Preview Production Build

```bash
# Links service
pnpm preview:links

# User service
pnpm preview:user

# Website
pnpm preview:website
```

## Available Scripts

```bash
# Development
pnpm dev:links         # Start links service
pnpm dev:user          # Start user service
pnpm dev:website       # Start website

# Preview
pnpm preview:links     # Preview links service
pnpm preview:user      # Preview user service
pnpm preview:website   # Preview website

# Build and Clean
pnpm build            # Build all packages
pnpm clean            # Clean build artifacts
pnpm prepare          # Initialize repository

# Release
pnpm release          # Publish packages with latest tag
pnpm release:beta     # Publish packages with beta tag

# Linting
pnpm lint            # Run ESLint
pnpm lint:fix        # Fix ESLint issues
```

## Release

```bash
# Release stable version
pnpm release

# Release beta version
pnpm release:beta
```

## Environment Support

```json
{
  "engines": {
    "node": ">=18.20.3 || >=20.0.0"
  }
}
```

## Package Management

Add a dependency to a specific service:

```bash
pnpm --filter <service-name> add <package-name>
```

Add a development dependency to root:

```bash
pnpm add -Dw <package-name>
```

## Repository

```bash
git clone https://github.com/ttpos/url.git
```

## Project Structure

```
.
├── .github/
│   └── workflows/          # GitHub Actions workflows
│       ├── cloudflare-links.yml
│       ├── cloudflare-site.yml
│       ├── cloudflare-user.yml
│       └── test.yml
├── apps/
│   ├── links/             # URL shortener service
│   ├── pages/             # Landing pages
│   ├── user/              # User management service
│   └── website/           # Main website
├── packages/              # Shared packages
├── scripts/              # Build and utility scripts
│   ├── clean.sh          # Clean script
│   └── init.sh           # Initialization script
├── .editorconfig         # Editor configuration
├── .npmrc               # npm configuration
├── .eslintconfig.mjs    # ESLint configuration
├── pnpm-lock.yaml       # pnpm lock file
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── tsconfig.json        # TypeScript configuration
```

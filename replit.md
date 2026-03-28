# KlikDz - Algerian E-commerce Marketplace

## Overview

KlikDz is a full-stack Algerian e-commerce marketplace with multilingual support (Arabic/French/English), RTL layout, light/dark theme, and all core marketplace features.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (Tailwind CSS, Zustand, Framer Motion, Lucide React)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── klikdz/             # React + Vite frontend (KlikDz marketplace)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Database seeding script
```

## Key Features

- **3 Languages**: Arabic (default, RTL), French, English with full translations
- **Light/Dark theme**: Toggle with localStorage persistence
- **RTL/LTR**: Automatic direction switch based on language
- **Cart**: localStorage-based cart with quantity management
- **Favorites**: localStorage-based favorites with heart toggle

## Pages

1. `/` - Homepage with hero, categories grid, featured products
2. `/products` - Product listing with advanced filters (category, price, stock, sort)
3. `/categories` - All categories grid
4. `/products/:id` - Product detail with instant order form
5. `/cart` - Shopping cart
6. `/checkout` - Full checkout with Algerian wilayas/cities
7. `/regions` - All 58 Algerian wilayas
8. `/signin` + `/signup` - Authentication forms

## Database Schema

- `categories` - Product categories (10 seeded)
- `products` - Products with multilingual names/descriptions (20 seeded)
- `orders` - Order records with items JSON
- `wilayas` - 58 Algerian provinces
- `cities` - Cities by wilaya

## API Endpoints

- `GET /api/categories` - All categories
- `GET /api/categories/:id` - Single category
- `GET /api/products` - Products (search, filter, paginate)
- `GET /api/products/featured` - Featured products
- `GET /api/products/:id` - Single product
- `GET /api/products/:id/related` - Related products
- `POST /api/orders` - Create checkout order
- `POST /api/orders/instant` - Instant order from product page
- `GET /api/regions` - All wilayas with cities
- `GET /api/regions/:code/cities` - Cities by wilaya

## Running

```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend
pnpm --filter @workspace/klikdz run dev

# Seed database
pnpm --filter @workspace/scripts run seed

# Run codegen after OpenAPI changes
pnpm --filter @workspace/api-spec run codegen
```

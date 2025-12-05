-

## Catalog Service `README.md`

# Catalog Service

## Project Overview

This is the backend service responsible for managing product catalog data. It provides APIs for listing, searching, and fetching product details. It is built with NestJS and Prisma.

**Technologies used:**

- Node.js & NestJS
- TypeScript
- Prisma ORM (PostgreSQL)
- Swagger for API documentation

---

## Features

- Get all products with pagination and search
- Fetch product details by ID
- Supports product variants and images

---

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/mini-commerce.git
cd mini-commerce/catalog-service
```

2. Environment Variables

Create a .env file:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/catalog_db"
PORT=3002

Your database name can be anything (catalog_db).
```

3. Database Setup

```bash

# Install Prisma CLI (if not installed globally)

npm install prisma -g

# Install dependencies
yarn install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
npx prisma db seed
```

4. Running the Service

```bash
# Development mode
yarn start:dev
```

```bash

click on : http://localhost:3002/api/docs
 to view in browser.
```

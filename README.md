## E-commerce Platform API

A TypeScript/Node.js backend for managing users, products, and orders in an e-commerce platform. The service exposes RESTful endpoints with JWT authentication, role-based authorization, request validation, and consistent response envelopes. Prisma ORM is used for MySQL persistence.

### Features

- User registration and login with hashed passwords and JWT authentication.
- Role-based access control (admin vs. standard user).
- Product management (create, update, list, search, get details, delete).
- Order placement with transactional stock checks and automatic inventory updates.
- Order history retrieval scoped to the authenticated user.
- In-memory caching for paginated product listings.
- Comprehensive Zod validation and consistent response structure.
- Jest + Supertest unit tests with mocked Prisma client.

### Requirements

- Node.js 18+
- npm 9+
- MySQL database

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env`**

   ```dotenv
   DATABASE_URL="mysql://user:password@localhost:3306/ecommerce"
   JWT_SECRET="your-super-secret"
   JWT_EXPIRES_IN="1h"
   PORT="3000"
   CACHE_TTL_SECONDS="60"
   ```

3. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

4. **Run migrations (after configuring the database)**

   ```bash
   npx prisma migrate dev --name init
   ```

### Scripts

- `npm run dev` – start the API with hot reload.
- `npm run build` – compile TypeScript to `dist/`.
- `npm start` – run the compiled server.
- `npm run test` – execute unit tests (database is mocked; no real DB required).

### Project Structure

```
src/
  app.ts                # Express application setup
  server.ts             # HTTP server bootstrap
  common/               # error & response utilities
  config/               # env, prisma client, cache
  middleware/           # auth, validation, error handling
  modules/
    auth/               # auth routes, controller, service, schemas
    products/           # product routes, controller, service, schemas
    orders/             # order routes, controller, service, schemas
  utils/                # JWT and password helpers
prisma/
  schema.prisma         # database schema
tests/
  *.test.ts             # Jest + Supertest suites with Prisma mocks
```

### API Overview

- `POST /auth/register` – create a new user.
- `POST /auth/login` – obtain JWT token.
- `GET /products` – public paginated list with optional `search`, `page`, `pageSize`.
- `GET /products/:id` – public product detail.
- `POST /products` – create product (admin only).
- `PUT /products/:id` – update product (admin only).
- `DELETE /products/:id` – delete product (admin only).
- `POST /orders` – place an order (authenticated user).
- `GET /orders` – view authenticated user’s orders.

All responses use the standardized envelope described in the requirements (`success`, `message`, `object`, optional pagination metadata, and `errors`).

### Notes

- Product listing responses are cached in memory for `CACHE_TTL_SECONDS`. Cache is invalidated on create/update/delete/order placement.
- Order placement uses a Prisma transaction to ensure atomic stock updates and order creation.
- Tests mock Prisma, so they run without an actual database connection.
- Remember to create an admin user manually (e.g., via direct DB insert) or adapt the registration logic if you need self-service admin provisioning.


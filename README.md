## E-commerce Platform API

A TypeScript/Node.js backend for managing users, products, and orders in an e-commerce platform. The service exposes RESTful endpoints with JWT authentication, role-based authorization, request validation, and consistent response envelopes. Prisma ORM is used for database access (MySQL in production, SQLite by default locally).

## Features
- User registration and login with hashed passwords and JWT authentication.
- Role-based access control (admin vs. standard user).
- Product management (create, update, list, search, retrieve, delete).
- Order placement with transactional stock checks and automatic inventory updates.
- Order history retrieval scoped to the authenticated user.
- In-memory caching for paginated product listings.
- Comprehensive Zod validation and consistent response structure.
- Jest + Supertest unit tests with mocked Prisma client.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- A Prisma-compatible database (MySQL in production; SQLite via Prisma for local development)

### Local Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create `.env`**
   ```dotenv
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="dev-jwt-secret"
   JWT_EXPIRES_IN="1h"
   PORT="3000"
   CACHE_TTL_SECONDS="60"
   ```
3. **Generate the Prisma client**
   ```bash
   npx prisma generate
   ```
4. **(Optional) Apply database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Run the API locally**
   ```bash
   npm run dev
   ```
6. **Execute the test suite**
   ```bash
   npm test
   ```

## Environment Variables
- `DATABASE_URL` – database connection string (SQLite path above for local development; supply your MySQL URL for production).
- `JWT_SECRET` – secret used to sign authentication tokens.
- `JWT_EXPIRES_IN` – JWT expiration window (defaults to `1h`).
- `PORT` – HTTP port for the Express server (defaults to `3000`).
- `CACHE_TTL_SECONDS` – in-memory cache duration for product listings, in seconds.
- `CLOUDINARY_API_KEY` *(optional)* – only needed if you extend the service with media uploads; not required by default.

## Database Configuration

### Local (SQLite)
- The default `.env` points `DATABASE_URL` to `file:./prisma/dev.db`.
- After generating the Prisma client, create/update the database file with:
  ```bash
  npx prisma db push
  ```
  or, if you prefer migrations:
  ```bash
  npx prisma migrate dev --name init
  ```
- Inspect the database with Prisma Studio:
  ```bash
  npx prisma studio
  ```

### Production (MySQL example)
- Update `.env` with a MySQL connection string:
  ```dotenv
  DATABASE_URL="file:/Users/sympliceintwari/Downloads/A2SV_backend/prisma/dev.db"
  ```
- Generate the Prisma client on the deployment host (`npx prisma generate`).
- Apply migrations against the production database:
  ```bash
  npx prisma migrate deploy
  ```
- Restart the service so Prisma reconnects using the new environment variables.

## Scripts
- `npm run dev` – start the API with hot reload.
- `npm run build` – compile TypeScript to `dist/`.
- `npm start` – run the compiled server.
- `npm run test` – execute unit tests (database is mocked; no real DB required).

## Project Structure
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

## API Endpoints

All endpoints return a common envelope:
```json
{
  "success": true,
  "message": "Human readable message",
  "object": {},
  "errors": null
}
```

### POST /auth/register
Create a new user account.

**Request**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john123",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "object": {
    "id": "user-1",
    "username": "john123",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2025-11-11T15:30:00.000Z"
  },
  "errors": null
}
```

### POST /auth/login
Authenticate a user and return a JWT.

**Request**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful",
  "object": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-1",
      "username": "john123",
      "email": "john@example.com",
      "role": "USER"
    }
  },
  "errors": null
}
```

### GET /products
Fetch a paginated product list (public).

**Request**
```http
GET /products?page=1&pageSize=10&search=shoe
```

**Response**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "object": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 1,
    "totalProducts": 2,
    "products": [
      {
        "id": "prod-1",
        "name": "Running Shoe",
        "description": "Lightweight running shoe",
        "price": 89.99,
        "stock": 15,
        "category": "Footwear",
        "userId": "admin-1",
        "createdAt": "2025-11-11T15:30:00.000Z",
        "updatedAt": "2025-11-11T15:30:00.000Z"
      }
    ]
  },
  "errors": null
}
```

### GET /products/:id
Retrieve details for a single product.

**Request**
```http
GET /products/prod-1
```

**Response**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "object": {
    "id": "prod-1",
    "name": "Running Shoe",
    "description": "Lightweight running shoe",
    "price": 89.99,
    "stock": 15,
    "category": "Footwear",
    "userId": "admin-1",
    "createdAt": "2025-11-11T15:30:00.000Z",
    "updatedAt": "2025-11-11T15:30:00.000Z"
  },
  "errors": null
}
```

### POST /products
Create a product (admin only).

**Request**
```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Running Shoe",
  "description": "Lightweight running shoe",
  "price": 89.99,
  "stock": 15,
  "category": "Footwear"
}
```

**Response**
```json
{
  "success": true,
  "message": "Product created successfully",
  "object": {
    "id": "prod-1",
    "name": "Running Shoe",
    "description": "Lightweight running shoe",
    "price": 89.99,
    "stock": 15,
    "category": "Footwear",
    "userId": "admin-1",
    "createdAt": "2025-11-11T15:30:00.000Z",
    "updatedAt": "2025-11-11T15:30:00.000Z"
  },
  "errors": null
}
```

### PUT /products/:id
Update a product (admin only).

**Request**
```http
PUT /products/prod-1
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "description": "Updated description",
  "price": 84.99
}
```

**Response**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "object": {
    "id": "prod-1",
    "name": "Running Shoe",
    "description": "Updated description",
    "price": 84.99,
    "stock": 15,
    "category": "Footwear",
    "userId": "admin-1",
    "createdAt": "2025-11-11T15:30:00.000Z",
    "updatedAt": "2025-11-11T16:00:00.000Z"
  },
  "errors": null
}
```

### DELETE /products/:id
Delete a product (admin only).

**Request**
```http
DELETE /products/prod-1
Authorization: Bearer <admin-token>
```

**Response**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "object": {
    "id": "prod-1"
  },
  "errors": null
}
```

### POST /orders
Place an order (authenticated user).

**Request**
```http
POST /orders
Authorization: Bearer <user-token>
Content-Type: application/json

[
  {
    "productId": "prod-1",
    "quantity": 2
  }
]
```

**Response**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "object": {
    "id": "order-1",
    "userId": "user-1",
    "status": "pending",
    "totalPrice": 169.98,
    "createdAt": "2025-11-11T15:45:00.000Z",
    "items": [
      {
        "id": "order-item-1",
        "productId": "prod-1",
        "quantity": 2,
        "price": 84.99
      }
    ]
  },
  "errors": null
}
```

### GET /orders
Retrieve the authenticated user's orders.

**Request**
```http
GET /orders
Authorization: Bearer <user-token>
```

**Response**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "object": [
    {
      "id": "order-1",
      "status": "pending",
      "totalPrice": 169.98,
      "createdAt": "2025-11-11T15:45:00.000Z",
      "items": [
        {
          "id": "order-item-1",
          "productId": "prod-1",
          "quantity": 2,
          "price": 84.99
        }
      ]
    }
  ],
  "errors": null
}
```

## Technology Choices
- **TypeScript + Express** provide a familiar, strongly-typed HTTP framework with mature ecosystem support.
- **Prisma ORM** delivers type-safe queries, schema migrations, and easy provider swaps (SQLite locally, MySQL in production).
- **JWT authentication & role-based guards** secure the REST endpoints while keeping stateless session management.
- **Zod** ensures consistent, declarative validation for request payloads.
- **In-memory caching** accelerates the frequently accessed product listing endpoint.
- **Jest + Supertest** enable fast, deterministic tests with a mocked Prisma client and full HTTP-stack coverage.


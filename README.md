# Pizzaria Backend

Backend API for a pizza restaurant management system, built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express** – HTTP server
- **Prisma** – ORM and migrations (PostgreSQL)
- **Zod** – schema validation
- **bcryptjs** – password hashing
- **jsonwebtoken** – JWT authentication
- **multer** – file upload handling
- **cloudinary** – image storage
- **CORS** – cross-origin requests
- **dotenv** – environment variables

## Prerequisites

- Node.js (LTS recommended)
- PostgreSQL
- npm or yarn
- Cloudinary account (for image uploads)

## Installation

1. Clone the repository and go to the project folder:

```bash
cd pizzaria-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the required variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
PORT=3333
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. (Optional) After changing the schema, regenerate the Prisma Client:

```bash
npx prisma generate
```

## Running the project

Development mode (with watch):

```bash
npm run dev
```

The server runs at `http://localhost:3333` (or the port set in `PORT` in `.env`).

## Project structure

```
pizzaria-api/
├── prisma/
│   ├── migrations/           # Database migrations
│   └── schema.prisma         # Schema and models
├── src/
│   ├── @types/               # Custom TypeScript types
│   ├── config/               # Configuration (multer, cloudinary)
│   ├── controllers/          # Controllers by domain
│   │   ├── category/         # Category controllers
│   │   ├── order/            # Order controllers
│   │   ├── product/          # Product controllers
│   │   └── user/             # User controllers
│   ├── generated/prisma/    # Generated Prisma client
│   ├── middlewares/         # isAuthenticated, isAdmin, validateSchema
│   ├── prisma/              # Prisma Client instance
│   ├── schemas/             # Zod schemas (user, category, product, order)
│   ├── services/            # Business logic
│   │   ├── category/        # Category services
│   │   ├── order/           # Order services
│   │   ├── product/         # Product services
│   │   └── user/            # User services
│   ├── routes.ts            # API routes
│   └── server.ts            # Application entry point
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

## Models (Prisma)

- **User** – system users (name, email, password, role: STAFF | ADMIN)
- **Category** – product categories
- **Product** – products (name, price in cents, description, banner, category, disabled)
- **Order** – orders (table, status, draft, optional name)
- **Item** – order items (amount, order, product)

## API

### Authentication

Protected routes require the header:

```
Authorization: Bearer <token>
```

- **isAuthenticated**: any logged-in user (STAFF or ADMIN)
- **isAdmin**: only users with role ADMIN

---

## Endpoints

### Users

| Method | Route       | Description           | Auth           |
|--------|-------------|-----------------------|----------------|
| POST   | `/users`    | Create user           | —              |
| POST   | `/session`  | Login (returns token) | —              |
| POST   | `/me`       | Logged-in user data   | isAuthenticated |

#### POST `/users`

Creates a new user.

**Body (JSON):**
- `name` (string) – minimum 3 characters
- `email` (string) – valid email
- `password` (string) – minimum 6 characters

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STAFF"
}
```

#### POST `/session`

Authenticates and returns the JWT token.

**Body (JSON):**
- `email` (string) – valid email
- `password` (string) – required

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/me`

Returns the authenticated user's data.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STAFF"
}
```

---

### Categories

| Method | Route       | Description      | Auth                    |
|--------|-------------|------------------|-------------------------|
| GET    | `/category` | List categories  | isAuthenticated         |
| POST   | `/category` | Create category  | isAuthenticated + isAdmin |

#### GET `/category`

Lists all registered categories (ordered by name).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Dessert Pizzas",
    "createdAt": "2025-11-11T10:30:00.000Z"
  }
]
```

#### POST `/category`

Creates a new category. Admin only.

**Body (JSON):**
- `name` (string) – minimum 3 characters

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Dessert Pizzas",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

---

### Products

| Method | Route               | Description                  | Auth                    |
|--------|---------------------|------------------------------|-------------------------|
| GET    | `/products`         | List products (with filter)  | isAuthenticated         |
| GET    | `/category/product` | List products by category    | isAuthenticated         |
| POST   | `/product`          | Create product               | isAuthenticated + isAdmin |
| DELETE | `/product`          | Disable product (soft delete)| isAuthenticated + isAdmin |

#### GET `/products`

Lists all products. Filter by disabled status.

**Query params:**
- `disabled` (optional) – "true" or "false" (default: "false")

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Margherita Pizza",
    "price": 2990,
    "description": "Classic pizza with tomato and mozzarella",
    "category_id": "uuid",
    "banner": "https://...",
    "disabled": false,
    "createdAt": "2025-11-11T10:30:00.000Z"
  }
]
```

#### GET `/category/product`

Lists all products from a specific category.

**Query params:**
- `category_id` (required) – category UUID

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Margherita Pizza",
    "price": 2990,
    "description": "Classic pizza",
    "category_id": "uuid",
    "banner": "https://...",
    "disabled": false,
    "createdAt": "2025-11-11T10:30:00.000Z"
  }
]
```

#### POST `/product`

Creates a new product with image upload. Admin only.

**Headers:**
- `Content-Type: multipart/form-data`

**Body (multipart/form-data):**
- `file` (file) – product image (required)
- `name` (string) – minimum 1 character
- `price` (string) – price in cents (e.g., "2990")
- `description` (string) – minimum 10 characters
- `category_id` (string) – category UUID

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Margherita Pizza",
  "price": 2990,
  "description": "Classic pizza",
  "category_id": "uuid",
  "banner": "https://res.cloudinary.com/...",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

#### DELETE `/product`

Disables a product (soft delete). Admin only.

**Query params:**
- `product_id` (required) – product UUID

**Response (200):**
```json
{
  "message": "Produto desabilitado com sucesso"
}
```

---

### Orders

| Method | Route            | Description                | Auth           |
|--------|------------------|----------------------------|----------------|
| POST   | `/order`         | Create order               | isAuthenticated |
| GET    | `/order`         | List orders                | isAuthenticated |
| GET    | `/order/detail`  | Get order details          | isAuthenticated |
| POST   | `/order/item`    | Add item to order          | isAuthenticated |
| DELETE | `/order/remove`  | Remove item from order     | isAuthenticated |
| PUT    | `/order/send`    | Send order (draft → false) | isAuthenticated |
| PUT    | `/order/finish`  | Finish order (status → true)| isAuthenticated |
| DELETE | `/order`         | Delete order               | isAuthenticated |

#### POST `/order`

Creates a new order.

**Body (JSON):**
- `table` (number) – table number (integer, min: 1)
- `name` (string, optional) – customer name

**Response (201):**
```json
{
  "id": "uuid",
  "table": 5,
  "name": "John Doe",
  "status": false,
  "draft": true,
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

#### GET `/order`

Lists all orders. Filter by draft status.

**Query params:**
- `draft` (optional) – "true" or "false"

**Response (200):**
```json
[
  {
    "id": "uuid",
    "table": 5,
    "status": false,
    "draft": true,
    "name": "John Doe",
    "createdAt": "2025-11-11T10:30:00.000Z",
    "items": [
      {
        "id": "uuid",
        "amount": 2,
        "product": {
          "name": "Margherita Pizza",
          "price": 2990,
          "banner": "https://...",
          "description": "Classic pizza"
        }
      }
    ]
  }
]
```

#### GET `/order/detail`

Gets detailed information about a specific order.

**Query params:**
- `order_id` (required) – order UUID

**Response (200):**
```json
{
  "id": "uuid",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "John Doe",
  "createdAt": "2025-11-11T10:30:00.000Z",
  "updatedAt": "2025-11-11T10:30:00.000Z",
  "items": [
    {
      "id": "uuid",
      "amount": 2,
      "createdAt": "2025-11-11T10:35:00.000Z",
      "product": {
        "id": "uuid",
        "name": "Margherita Pizza",
        "price": 2990,
        "description": "Classic pizza",
        "banner": "https://..."
      }
    }
  ]
}
```

#### POST `/order/item`

Adds an item to an order.

**Body (JSON):**
- `order_id` (string) – order UUID
- `product_id` (string) – product UUID
- `amount` (number) – quantity (integer, min: 1)

**Response (200):**
```json
{
  "id": "uuid",
  "amount": 2,
  "order_id": "uuid",
  "product_id": "uuid",
  "product": {
    "name": "Margherita Pizza",
    "price": 2990,
    "banner": "https://...",
    "description": "Classic pizza"
  },
  "createdAt": "2025-11-11T10:35:00.000Z"
}
```

#### DELETE `/order/remove`

Removes an item from an order.

**Query params:**
- `item_id` (required) – item UUID

**Response (200):**
```json
{
  "message": "Item removido com sucesso"
}
```

#### PUT `/order/send`

Sends an order to the kitchen (sets draft to false).

**Body (JSON):**
- `order_id` (string) – order UUID

**Response (200):**
```json
{
  "id": "uuid",
  "table": 5,
  "status": false,
  "draft": false,
  "name": "John Doe"
}
```

#### PUT `/order/finish`

Marks an order as finished (sets status to true).

**Body (JSON):**
- `order_id` (string) – order UUID

**Response (200):**
```json
{
  "id": "uuid",
  "table": 5,
  "status": true,
  "draft": false,
  "name": "John Doe"
}
```

#### DELETE `/order`

Deletes an order.

**Query params:**
- `order_id` (required) – order UUID

**Response (200):**
```json
{
  "message": "Pedido deletado com sucesso"
}
```

---

## Validation

Routes that accept a body use the `validateSchema` middleware with Zod schemas. On validation error the API responds with status `400` and an object with `error` and `details` (field and message).

## Error handling

- Known errors (e.g. `Error`): status `400` and `{ error: message }`
- Generic errors: status `500` and `{ error: "Internal server error!" }`
- Invalid or missing token: status `401`
- Insufficient permissions (e.g. not admin): status `401`

## npm scripts

| Script | Command                   | Description             |
|--------|---------------------------|-------------------------|
| `dev`  | `tsx watch src/server.ts` | Run server in dev mode  |

## Environment variables

| Variable                  | Description                      |
|---------------------------|----------------------------------|
| `DATABASE_URL`            | PostgreSQL connection URL       |
| `PORT`                    | Server port (default: 3333)     |
| `JWT_SECRET`              | Secret key for JWT tokens       |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name           |
| `CLOUDINARY_API_KEY`      | Cloudinary API key              |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret           |

## License

ISC

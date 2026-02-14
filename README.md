# Pizzaria Backend

Backend API for a pizza restaurant management system, built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express** – HTTP server
- **Prisma** – ORM and migrations (PostgreSQL)
- **Zod** – schema validation
- **bcryptjs** – password hashing
- **jsonwebtoken** – JWT authentication
- **CORS** – cross-origin requests
- **dotenv** – environment variables

## Prerequisites

- Node.js (LTS recommended)
- PostgreSQL
- npm or yarn

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
│   ├── @types/               # Custom TypeScript types (e.g. Express)
│   ├── config/               # Application configuration
│   ├── controllers/          # Controllers by domain
│   │   ├── category/         # CreateCategory, ListCategories
│   │   └── user/             # Auth, CreateUser, DetailUser
│   ├── generated/prisma/    # Generated Prisma client
│   ├── middlewares/         # isAuthenticated, isAdmin, validateSchema
│   ├── prisma/              # Prisma Client instance
│   ├── schemas/             # Zod schemas (user, category)
│   ├── services/            # Business logic
│   │   ├── catergory/       # CreateCategory, ListCategories
│   │   └── user/            # Auth, CreateUser, DetailUser
│   ├── routes.ts            # API routes
│   └── server.ts            # Application entry point
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

## Models (Prisma)

- **User** – system users (name, email, password, role: STAFF | ADMIN)
- **Category** – product categories
- **Product** – products (name, price, description, banner, category)
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

#### POST `/session`

Authenticates and returns the JWT token.

**Body (JSON):**

- `email` (string) – valid email
- `password` (string) – required

#### POST `/me`

Returns the authenticated user's data. Requires token in header.

---

### Categories

| Method | Route       | Description      | Auth                    |
|--------|-------------|------------------|-------------------------|
| GET    | `/category` | List categories  | isAuthenticated         |
| POST   | `/category` | Create category  | isAuthenticated + isAdmin |

#### GET `/category`

Lists all registered categories. Requires a logged-in user (any role).

**Response (200):** array of categories:

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

- `name` (string) – minimum 2 characters

**Response (201):**

```json
{
  "id": "uuid",
  "name": "Dessert Pizzas",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

---

### Validation

Routes that accept a body use the `validateSchema` middleware with Zod schemas. On validation error the API responds with status `400` and an object with `error` and `details` (field and message).

### Error handling

- Known errors (e.g. `Error`): status `400` and `{ error: message }`
- Generic errors: status `500` and `{ error: "Internal server error!" }`
- Invalid or missing token: status `401`
- Insufficient permissions (e.g. not admin): status `401`

## npm scripts

| Script | Command                   | Description             |
|--------|---------------------------|-------------------------|
| `dev`  | `tsx watch src/server.ts` | Run server in dev mode  |

## Environment variables

| Variable       | Description                      |
|----------------|----------------------------------|
| `DATABASE_URL` | PostgreSQL connection URL       |
| `PORT`         | Server port (default: 3333)     |
| `JWT_SECRET`   | Secret key for JWT tokens       |

## License

ISC

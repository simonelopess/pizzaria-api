# Pizzaria Backend

Backend API for a pizza delivery system, built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.

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

1. Clone the repository and go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the required variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
PORT=33333
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

The server runs at `http://localhost:33333` (or the port set in `PORT` in `.env`).

## Project structure

```
backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Schema and models
├── src/
│   ├── controllers/         # Controllers by domain
│   │   └── user/
│   ├── middlewares/         # Middlewares (e.g. validation)
│   ├── prisma/              # Generated Prisma client
│   ├── schemas/             # Zod validation schemas
│   ├── services/            # Business logic
│   │   └── user/
│   ├── routes.ts            # API routes
│   └── server.ts            # Application entry point
├── package.json
├── tsconfig.json
└── prisma.config.ts         # Prisma config (datasource, migrations)
```

## Models (Prisma)

- **User** – system users (name, email, password, role: STAFF | ADMIN)
- **Category** – product categories
- **Product** – products (name, price, description, banner, category)
- **Order** – orders (table, status, draft, optional name)
- **Item** – order items (amount, linked to order and product)

## API

### Users

| Method | Route       | Description   |
|--------|-------------|---------------|
| POST   | `/users`    | Create user   |
| POST   | `/session`  | Login (session) |

#### POST `/users`

Creates a new user.

**Body (JSON):**

- `name` (string) – minimum 3 characters
- `email` (string) – valid email
- `password` (string) – minimum 6 characters

#### POST `/session`

Authenticates and returns session (e.g. JWT token).

**Body (JSON):**

- `email` (string) – valid email
- `password` (string) – required

### Validation

User routes use the `validateSchema` middleware with Zod schemas. On validation error, the API responds with status `400` and an object with `error` and `details` (field and message).

### Error handling

- Known errors (e.g. `Error`): status `400` and `{ error: message }`
- Generic errors: status `500` and `{ error: "Internal server error!" }`

## npm scripts

| Script | Command                   | Description              |
|--------|---------------------------|--------------------------|
| `dev`  | `tsx watch src/server.ts` | Run server in dev mode   |

## Environment variables

| Variable       | Description                    |
|----------------|--------------------------------|
| `DATABASE_URL` | PostgreSQL connection URL      |
| `PORT`         | Server port (default: 33333)   |
| `JWT_SECRET`   | Secret key for JWT tokens      |

## License

ISC

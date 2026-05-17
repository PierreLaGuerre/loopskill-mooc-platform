# LoopSkill Backend

REST API for the LoopSkill MOOC platform. It handles authentication, user settings, plans, course access rules, enrollments and protected admin course management.

## Stack

- Node.js
- Express
- MySQL / MariaDB
- JWT authentication
- bcrypt password hashing
- Stripe Checkout test mode

## Local Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The API runs at:

```text
http://localhost:3000/api
```

Import the database dump before starting the API:

```text
database/mooc_db_v4.sql
```

## Scripts

```bash
npm run dev    # start with nodemon
npm start      # production start
npm test       # placeholder, API coverage is documented through Postman
```

## Environment

Use `backend/.env.example` as the template.

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port. Defaults to `3000`. |
| `NODE_ENV` | Runtime environment, usually `development` or `production`. |
| `JWT_SECRET` | Secret used to sign JWT tokens. Must be strong in production. |
| `JWT_EXPIRES_IN` | JWT lifetime, for example `1h`. |
| `DB_HOST` | MySQL/MariaDB host. |
| `DB_USER` | Database user. |
| `DB_PASSWORD` | Database password. |
| `DB_NAME` | Database name. |
| `DB_SSL` | Enables SSL for managed database connections. |
| `DB_SSL_REJECT_UNAUTHORIZED` | Controls certificate validation for SSL connections. |
| `DB_SSL_CA_PATH` | Optional CA certificate path for SSL database connections. |
| `DEFAULT_USER_PLAN_ID` | Plan assigned to new users. |
| `FRONTEND_URL` | Frontend URL used in Stripe Checkout return redirects. |
| `STRIPE_SECRET_KEY` | Stripe test secret key used to create Checkout sessions. |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret for `/api/payments/webhook`. |
| `STRIPE_CURRENCY` | Checkout currency. Defaults to `eur`. |
| `FRONTEND_ORIGIN` | Comma-separated CORS allowlist. Empty means open CORS. |

## CORS

The backend accepts all origins when `FRONTEND_ORIGIN` is empty. For production, set it to the deployed frontend origin:

```env
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

Multiple origins can be separated with commas.

## Main Endpoints

### Health

- `GET /api/health`

### Authentication And Settings

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/settings`
- `PATCH /api/auth/profile`
- `PATCH /api/auth/password`
- `PATCH /api/auth/interests`
- `PATCH /api/auth/plan` returns `403`; use Stripe Checkout for upgrades.
- `GET /api/auth/admin-access`

### Plans

- `GET /api/plans`

### Payments

- `POST /api/payments/checkout`
- `POST /api/payments/webhook`

### Courses

- `GET /api/courses`
- `GET /api/courses/popular`
- `GET /api/courses/recommended`
- `GET /api/courses/:id`
- `GET /api/courses/:id/lessons`

### Enrollments

- `POST /api/enrollments`
- `GET /api/enrollments/me`
- `GET /api/enrollments/me/in-progress`
- `GET /api/enrollments/me/completed`
- `PATCH /api/enrollments/:courseId/progress`

### Admin

All admin endpoints require a valid JWT with `role: admin`.

- `GET /api/admin/categories`
- `GET /api/admin/tags`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `GET /api/admin/courses/:id`
- `PATCH /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`

## API Coverage

Manual endpoint coverage is documented in:

```text
docs/api/loopskill-backend.postman_collection.json
```

The collection covers register/login/me, plans, course access, enrollments and protected admin CRUD. Plan upgrades now require Stripe Checkout instead of direct profile updates.

## Deployment Notes

1. Provision a MySQL or MariaDB database.
2. Import `database/mooc_db_v4.sql`.
3. Deploy the `backend` folder as a Node.js app.
4. Configure all required environment variables.
5. Set `FRONTEND_ORIGIN` to the production frontend URL.
6. Verify `GET /api/health`.
7. Run the Postman collection against the deployed `baseUrl`.

## Production Checklist

- [ ] Use a strong `JWT_SECRET`.
- [ ] Use a dedicated database user with limited privileges.
- [ ] Configure `FRONTEND_ORIGIN` with the production frontend URL.
- [ ] Enable database SSL when the provider requires it.
- [ ] Keep `.env` out of Git.
- [ ] Import the latest SQL dump before acceptance testing.
- [ ] Verify auth, plans, course access, enrollments and admin CRUD with the API collection.
- [ ] Point the Angular production environment to the deployed backend URL.

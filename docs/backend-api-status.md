# Backend API Status

This document summarizes the current backend API surface for the LoopSkill
backend delivery.

## Available Endpoints

### Health

- `GET /api/health`
  - Confirms that the Express server is running.

### Authentication

- `POST /api/auth/register`
  - Creates a new student user.
  - Stores selected interests when they match existing tags.
  - Returns the authenticated user and a JWT token.

- `POST /api/auth/login`
  - Authenticates an existing user by email and password.
  - Returns the authenticated user and a JWT token.

- `GET /api/auth/me`
  - Requires a Bearer token.
  - Returns the authenticated user.

- `PATCH /api/auth/profile`
  - Requires a Bearer token.
  - Updates the authenticated user's name and email.

- `PATCH /api/auth/password`
  - Requires a Bearer token.
  - Updates the authenticated user's password.

- `PATCH /api/auth/interests`
  - Requires a Bearer token.
  - Replaces the authenticated user's selected interests.

- `PATCH /api/auth/plan`
  - Requires a Bearer token.
  - Returns `403`; user plan upgrades must go through Stripe Checkout.

- `GET /api/auth/settings`
  - Requires a Bearer token.
  - Returns the user profile, interests, tags and available plans.

- `GET /api/auth/admin-access`
  - Requires a Bearer token with `role: admin`.
  - Confirms that the user has admin permissions.

- `GET /api/auth/tags`
  - Returns the available interest tags.

### Plans

- `GET /api/plans`
  - Returns Free, Pro and Premium plans with their features.

### Courses

- `GET /api/courses`
  - Returns the course catalog from the database.
  - Supports optional filters through query parameters:
    - `category`
    - `level`
    - `tags`
    - `search`

- `GET /api/courses/:id`
  - Returns course detail, outcomes, optional lessons and access information.

- `GET /api/courses/:id/lessons`
  - Returns course lessons only when the authenticated user's plan or individual purchase allows access.

- `GET /api/courses/popular`
  - Returns popular courses.

- `GET /api/courses/recommended`
  - Requires a Bearer token.
  - Returns recommendations based on user interests.

### Enrollments

- `POST /api/enrollments`
  - Requires a Bearer token.
  - Creates an enrollment when the user's plan or individual purchase allows access to the course.

### Payments

- `POST /api/payments/checkout`
  - Requires a Bearer token.
  - Creates a Stripe Checkout session for a plan subscription or individual course purchase.

- `POST /api/payments/webhook`
  - Receives Stripe webhook events.
  - Confirms paid Checkout sessions and unlocks the corresponding plan or course purchase.

- `GET /api/enrollments/me`
  - Requires a Bearer token.
  - Returns the authenticated user's enrollments.

- `GET /api/enrollments/me/in-progress`
  - Requires a Bearer token.
  - Returns enrollments with progress below 100.

- `GET /api/enrollments/me/completed`
  - Requires a Bearer token.
  - Returns completed enrollments.

- `PATCH /api/enrollments/:courseId/progress`
  - Requires a Bearer token.
  - Updates progress from 0 to 100.

### Admin

All admin endpoints require a Bearer token with `role: admin`.

- `GET /api/admin/categories`
- `GET /api/admin/tags`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `GET /api/admin/courses/:id`
- `PATCH /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`

## Required Environment Variables

The backend expects the following configuration values. Local values should live
in `backend/.env`; deployment values should be configured in the hosting
environment.

- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DEFAULT_USER_PLAN_ID`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY`
- `FRONTEND_ORIGIN`
- `NODE_ENV`
- `DB_SSL`
- `DB_SSL_REJECT_UNAUTHORIZED`
- `DB_SSL_CA_PATH`

See `backend/.env.example` for a safe template without real secrets.

## API Coverage

Manual endpoint coverage is available in:

```text
docs/api/loopskill-backend.postman_collection.json
```

The collection covers authentication, plans, course access, enrollments and
protected admin CRUD. Stripe Checkout should be tested with Stripe CLI in test
mode.

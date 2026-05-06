# Backend API Status

This document summarizes the current backend API surface that can already be
used during the first deployment phase of LoopSkill.

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

- `GET /api/auth/tags`
  - Returns the available interest tags.

### Courses

- `GET /api/courses`
  - Returns the course catalog from the database.
  - Supports optional filters through query parameters:
    - `category`
    - `level`
    - `tags`
    - `search`

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
- `FRONTEND_ORIGIN`

See `backend/.env.example` for a safe template without real secrets.

## Pending For Full Frontend Integration

The current backend is deployable as a minimum API, but the complete frontend
integration still needs additional endpoints for:

- Course detail.
- Course lessons.
- Course outcomes.
- Plans and plan features.
- Enrollments.
- Progress updates.
- Full admin course CRUD.

Until those endpoints are implemented, part of the Angular frontend will continue
to use mock data and `LocalStorage`.

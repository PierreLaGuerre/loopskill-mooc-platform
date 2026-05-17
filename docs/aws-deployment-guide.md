# AWS Deployment Guide

This guide describes the planned AWS deployment flow for the current LoopSkill
state: Angular frontend, Express backend and MySQL/MariaDB database.

## 1. Frontend Build

From the Angular project folder:

```bash
cd frontend/app
npm run build
```

The deployable frontend files are generated in:

```text
frontend/app/dist/app/browser
```

These are the files that must be uploaded to the static hosting service.

## 2. Frontend Hosting With S3

1. Create an S3 bucket for the frontend.
2. Enable static website hosting.
3. Upload the contents of `frontend/app/dist/app/browser`.
4. Set `index.html` as the index document.
5. Set `index.html` as the error document so Angular routes work on page reload.
6. Configure public read access or serve the bucket through CloudFront.

CloudFront is recommended for HTTPS, caching and a cleaner public URL.

## 3. Backend Database With RDS

1. Create a MySQL or MariaDB RDS instance.
2. Create the application database, using `mooc_db` as the expected name unless
   deployment configuration chooses another value.
3. Import the SQL dump:

```text
database/mooc_db_v4.sql
```

4. Verify that the main tables exist:
   - `users`
   - `tags`
   - `user_interests`
   - `courses`
   - `categories`
   - `plans`
   - `plan_features`
   - `course_tags`
   - `enrollments`
   - `lessons`
   - `course_outcomes`

5. Use a dedicated database user for the application instead of the root user.
6. Restrict database network access to the backend environment where possible.

## 4. Backend Deployment With Elastic Beanstalk

Deploy the `backend` folder as a Node.js application.

The production start command is:

```bash
npm start
```

The backend entry point is:

```text
backend/server.js
```

The backend already exposes a health endpoint:

```text
GET /api/health
```

## 5. Backend Environment Variables

Configure these variables in Elastic Beanstalk:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=replace-with-secure-secret
JWT_EXPIRES_IN=1h

DB_HOST=replace-with-rds-endpoint
DB_USER=replace-with-db-user
DB_PASSWORD=replace-with-db-password
DB_NAME=mooc_db
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA_PATH=

DEFAULT_USER_PLAN_ID=1
FRONTEND_ORIGIN=https://replace-with-frontend-url
```

For local development, see:

```text
backend/.env.example
```

## 6. Frontend Production API URL

The production Angular environment is configured in:

```text
frontend/app/src/environments/environment.prod.ts
```

Before the final frontend deployment, replace the placeholder API URL with the
Elastic Beanstalk backend URL:

```ts
apiUrl: 'https://replace-with-backend-url/api'
```

Then rebuild and upload the new frontend build to S3.

## 7. Acceptance Checks

After deployment, verify:

- The frontend loads from the public S3 or CloudFront URL.
- Reloading Angular routes does not return a 404.
- `GET /api/health` responds from the backend public URL.
- `GET /api/auth/tags` returns interest tags from RDS.
- `GET /api/courses` returns course data from RDS.
- `GET /api/plans` returns plans with features.
- Registration and login work against the deployed backend.
- The JWT token allows `GET /api/auth/me`.
- `PATCH /api/auth/plan` is disabled for direct upgrades; authenticated users
  must use Stripe Checkout.
- `GET /api/courses/:id` returns access information for the user's plan.
- `POST /api/enrollments` creates an enrollment when the plan allows it.
- Admin routes return `403` for student users.
- Admin routes work with an admin token.
- The Postman collection in `docs/api` runs against the deployed `baseUrl`.

## 8. Current Deployment Scope

This backend deployment includes authentication, settings, plans, course listing,
course detail, plan-based access, enrollments, progress updates and protected
admin course CRUD.

Before considering production ready, complete this checklist:

- Use a strong `JWT_SECRET`.
- Use a dedicated database user instead of root.
- Set `FRONTEND_ORIGIN` to the real frontend URL.
- Enable database SSL if required by RDS.
- Verify that `.env` is not committed.
- Import the latest SQL dump into RDS.
- Run the API collection against the deployed backend.
- Update `frontend/app/src/environments/environment.prod.ts` with the deployed API URL.

# AWS Deployment Guide

This guide describes the planned AWS deployment flow for the current LoopSkill
state: Angular frontend, minimum Express backend and MySQL/MariaDB database.

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
JWT_SECRET=replace-with-secure-secret
JWT_EXPIRES_IN=1h

DB_HOST=replace-with-rds-endpoint
DB_USER=replace-with-db-user
DB_PASSWORD=replace-with-db-password
DB_NAME=mooc_db

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
- Registration and login work against the deployed backend.
- The JWT token allows `GET /api/auth/me`.
- Mock-based frontend sections still work with `LocalStorage`.

## 8. Current Deployment Scope

This deployment phase is partial and intentional. The backend already supports
authentication, tags and course listing, while some frontend sections still use mock
data.

Pending backend work for full integration:

- Course detail.
- Course lessons.
- Course outcomes.
- Plans and plan features.
- Enrollments.
- Progress updates.
- Full admin course CRUD.

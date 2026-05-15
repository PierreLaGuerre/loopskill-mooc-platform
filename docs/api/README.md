# LoopSkill Backend API Collection

This folder contains the manual API coverage used for the backend delivery.

## Collection

- `loopskill-backend.postman_collection.json`

The collection covers the minimum delivery scope:

- register, login and authenticated user (`/auth/register`, `/auth/login`, `/auth/me`)
- settings and plan update (`/auth/settings`, `/auth/plan`)
- plans with features (`/plans`)
- course detail and plan access (`/courses/:id`, `/courses/:id/lessons`)
- enrollments and progress (`/enrollments`, `/enrollments/me`, `/enrollments/:courseId/progress`)
- protected admin course CRUD (`/admin/courses`)

## How To Run It

1. Start the backend locally.
2. Import `loopskill-backend.postman_collection.json` in Postman.
3. Keep `baseUrl` as `http://localhost:3000/api`, or change it for deployment.
4. Run `POST register` once, or `POST login` if the test user already exists.
5. Paste an admin JWT into the `adminToken` collection variable before running admin requests.
6. Run the folders in order: `Auth`, `Plans`, `Courses and Access`, `Enrollments`, `Admin Protected CRUD`.

The admin folder also includes a negative permission check with a normal student token.

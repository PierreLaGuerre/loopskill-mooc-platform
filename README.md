<div align="center">

<br/>

<img width="554" height="192" alt="LoopSkill" src="https://github.com/user-attachments/assets/d11417fa-addd-48ce-8910-6b058710105c" />

**Full-stack MOOC platform with recommendations, plan-based access control and test-mode payments**

<br/>

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=flat-square&logo=stripe&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Frontend-Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![AWS](https://img.shields.io/badge/Backend-AWS%20Elastic%20Beanstalk-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-1D9E75?style=flat-square)

<br/>

> Final Degree Project - Web Application Development - 2025-2026

</div>

---

## What Is LoopSkill

LoopSkill is an online learning platform developed as a final project for the Web Application Development program. Its goal is to provide a clear and personalized MOOC experience, with a technical course catalog, interest-based recommendations, progress tracking, plan-based access and purchases handled through Stripe Checkout in test mode.

The project works as a full-stack application: **Angular** on the frontend, **Node.js with Express** on the backend and **MySQL/MariaDB** as the relational database. The current version replaces the initial mock prototype with real HTTP services, JWT authentication and database persistence.

---

## Project Status

| Module | Status |
|---|---|
| Registration, login and JWT session | Completed |
| Onboarding and interest management | Completed |
| Personalized home page | Completed |
| Course exploration by category, level, tags and search | Completed |
| Course detail with outcomes, lessons and access rules | Completed |
| Course player and progress updates | Completed |
| My Learning: in-progress and completed courses | Completed |
| Free, Pro and Premium plans | Completed |
| Stripe Checkout for plans and individual purchases | Completed in test mode |
| Subscription cancellation | Completed |
| Profile, password, interests and subscription settings | Completed |
| Admin panel with course CRUD | Completed |
| REST API and Postman collection | Completed |
| Frontend/backend deployment | Documented; online demo is not currently active |

---

## Screenshots

### Home And Recommendations

| Main home | Current progress |
|---|---|
| ![Home with featured carousel and popular courses](frontend/app/src/assets/images/screenshots/Hero-Carousel.png) | ![Home with current course and progress](frontend/app/src/assets/images/screenshots/Hero-Resume.png) |

| Recommendations and categories |
|---|
| ![Recommended sections and categories](frontend/app/src/assets/images/screenshots/Home-sections.png) |

### Catalog And Learning

| Course exploration | Course detail |
|---|---|
| ![Explore page with filters and courses by category](frontend/app/src/assets/images/screenshots/Explore.png) | ![Course detail with price, plan and learning outcomes](frontend/app/src/assets/images/screenshots/course-detail.png) |

| Lesson player | My Learning |
|---|---|
| ![Course player with lesson list](frontend/app/src/assets/images/screenshots/course-lesson.png) | ![My Learning panel with in-progress courses](frontend/app/src/assets/images/screenshots/my-learning.png) |

### Plans, Payments And Account

| Plans | Stripe Checkout |
|---|---|
| ![Free, Pro and Premium plans page](frontend/app/src/assets/images/screenshots/plans.png) | ![Stripe Checkout in test mode](frontend/app/src/assets/images/screenshots/stripe-payment.png) |

| User settings |
|---|
| ![User settings page](frontend/app/src/assets/images/screenshots/user-setting.png) |

---

## Main Features

**User**
- Registration and login with JWT token.
- Initial interest selection to personalize recommendations.
- Technical course catalog organized by categories, levels and tags.
- Dynamic home page with popular courses, recommendations and current progress.
- Course detail with required plan, learning outcomes and lesson access.
- Enrollment, progress tracking and completed course view.
- Profile management, password changes, interests and subscription settings.
- Plan upgrades or individual course purchases through Stripe Checkout.

**Administrator**
- Access protected by the `admin` role.
- Full catalog listing.
- Course creation, editing and deletion.
- Management of category, level, required plan, price, instructor, image, estimated hours and tags.
- Backend validation for payloads, relationships and duplicates.

**Payments And Access**
- Direct plan changes are blocked from the API.
- Upgrades to Pro/Premium go through Stripe Checkout.
- Courses can be unlocked through an active plan or an individual purchase.
- Stripe webhooks register paid orders, course purchases and subscriptions.

---

## Tech Stack

**Frontend**
- Angular 17 with standalone architecture.
- TypeScript, RxJS, Angular Router and SCSS.
- Typed HTTP services for auth, courses, enrollments and payments.
- Local persistence only for the token and authenticated user.
- Static build prepared for Cloudflare through `wrangler.jsonc`.

**Backend**
- Node.js, Express 5 and CommonJS.
- MySQL/MariaDB with `mysql2/promise`.
- JWT authentication and role-based authorization.
- bcrypt password hashing.
- Stripe Checkout and webhooks in test mode.
- Environment-based CORS configuration.

**Database**
- Relational schema in `database/mooc_db_v4.sql`.
- Additional migrations in `database/migrations`.
- Tables for users, plans, categories, courses, lessons, outcomes, tags, interests, enrollments, payment orders, individual purchases and subscriptions.

**Documentation And Manual Testing**
- API status: `docs/backend-api-status.md`.
- AWS deployment guide: `docs/aws-deployment-guide.md`.
- Postman collection: `docs/api/loopskill-backend.postman_collection.json`.

---

## Repository Structure

```text
loopskill-mooc-platform/
|-- backend/
|   |-- app.js
|   |-- server.js
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- routes/
|   `-- utils/
|-- database/
|   |-- mooc_db_v4.sql
|   `-- migrations/
|-- docs/
|   |-- api/
|   |-- aws-deployment-guide.md
|   `-- backend-api-status.md
`-- frontend/
    `-- app/
        |-- src/
        |   |-- app/
        |   |   |-- core/
        |   |   |-- features/
        |   |   `-- shared/
        |   |-- assets/
        |   `-- environments/
        `-- wrangler.jsonc
```

---

## REST API

The API is served under `/api`.

| Area | Main endpoints |
|---|---|
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/auth/settings`, `GET /api/auth/tags` |
| Profile | `PATCH /api/auth/profile`, `PATCH /api/auth/password`, `PATCH /api/auth/interests` |
| Plans | `GET /api/plans` |
| Courses | `GET /api/courses`, `GET /api/courses/categories`, `GET /api/courses/popular`, `GET /api/courses/recommended`, `GET /api/courses/:id`, `GET /api/courses/:id/lessons` |
| Enrollments | `POST /api/enrollments`, `GET /api/enrollments/me`, `GET /api/enrollments/me/in-progress`, `GET /api/enrollments/me/completed`, `PATCH /api/enrollments/:courseId/progress` |
| Payments | `POST /api/payments/checkout`, `POST /api/payments/subscription/cancel`, `POST /api/payments/webhook` |
| Admin | `GET/POST/PATCH/DELETE /api/admin/courses`, `GET /api/admin/categories`, `GET /api/admin/tags` |

The Postman collection in `docs/api` covers the main authentication, plans, courses, enrollments and administration flows.

---

## Local Setup

### 1. Database

Create a MySQL/MariaDB database and import the main dump:

```bash
mysql -u root -p mooc_db < database/mooc_db_v4.sql
```

If you are starting from an existing database, also apply the migrations:

```bash
mysql -u root -p mooc_db < database/migrations/2026-05-15-add-general-interest-tags.sql
mysql -u root -p mooc_db < database/migrations/2026-05-17-add-category-metadata.sql
mysql -u root -p mooc_db < database/migrations/2026-05-17-add-stripe-payments.sql
```

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The local API will be available at:

```text
http://localhost:3000/api
```

Important backend variables:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=change-me-use-a-long-random-secret
JWT_EXPIRES_IN=1h
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mooc_db
DB_SSL=false
DEFAULT_USER_PLAN_ID=1
FRONTEND_URL=http://localhost:4200
FRONTEND_ORIGIN=http://localhost:4200
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=eur
```

### 3. Frontend

```bash
cd frontend/app
npm install
npm start
```

The local application will be available at:

```text
http://localhost:4200
```

The development frontend points to:

```ts
apiUrl: 'http://localhost:3000/api'
```

---

## Deployment

LoopSkill was deployed during the development and testing phase with separate frontend, backend and database infrastructure. The online demo is not currently active because of infrastructure costs after the AWS free tier ended, but the project can be run locally by following the instructions above and the deployment flow remains documented.

The project supports a separated deployment for the frontend, backend and database.

**Frontend**
- Angular build with `npm run build` from `frontend/app`.
- Output generated in `frontend/app/dist/app/browser`.
- SPA assets configuration in `frontend/app/wrangler.jsonc`.
- The current configuration allows publishing the static application to Cloudflare, with an `index.html` fallback for Angular routes.

**Backend**
- Node.js application deployable from the `backend` folder.
- Production entry point: `backend/server.js`.
- Production command: `npm start`.
- Prepared for Elastic Beanstalk through `.ebignore` and deployment ZIP packages generated at the repository root.
- Healthcheck available at `GET /api/health`.

**Database**
- Local or managed MySQL/MariaDB.
- For AWS deployment, the guide documents the use of RDS.
- The backend supports SSL connections through `DB_SSL`, `DB_SSL_REJECT_UNAUTHORIZED` and `DB_SSL_CA_PATH`.

**Environments**
- Development: `frontend/app/src/environments/environment.ts`.
- Production: `frontend/app/src/environments/environment.prod.ts`.
- The production environment keeps the configuration used during deployment testing.

For the detailed AWS flow, see `docs/aws-deployment-guide.md`.

---

## Key Technical Decisions

- Business logic is concentrated in Angular services and Express controllers, separating presentation, API and persistence.
- Course access is calculated in the backend based on plan, enrollment and individual purchase status.
- Recommendations are based on the relationship between user interests and course tags.
- The admin panel reuses the same API protected by JWT and the `admin` role.
- Payments do not modify plans directly from the client: Stripe Checkout and the webhook are the confirmation source.
- CORS is open in development and can be restricted in production with `FRONTEND_ORIGIN`.

---

## License

Project developed as a final degree project for the Web Application Development program.

<div align="center">

![MIT License](https://img.shields.io/badge/License-MIT-1D9E75?style=flat-square)
![DAW](https://img.shields.io/badge/FP-DAW-1D9E75?style=flat-square)

</div>

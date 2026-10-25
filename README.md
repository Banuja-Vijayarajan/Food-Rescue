# Food Rescue API

Express and MongoDB backend for the Food Rescue React prototype. It provides authentication, organization profiles and verification, donations, food requests, pickups, notifications, ratings, and admin statistics.

## Run locally

1. Install Node.js and start MongoDB locally, or create a MongoDB Atlas database.
2. In this folder, copy `.env.example` to `.env` and set `MONGODB_URI` and a private `JWT_SECRET`.
3. Run `npm install` and then `npm run dev`.
4. The API is available at `http://localhost:5000/api`; health check: `/api/health`.

Protected endpoints require `Authorization: Bearer <token>`. Login and registration return `{ user, token }`. Users register as unverified; an administrator account must be created out of band and can verify organizations.

## Main routes

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/donations`, `GET/PATCH /api/donations/:id`
- `GET /api/requests`, `POST /api/donations/:id/requests`, `PATCH /api/requests/:id/accept|reject`
- `GET /api/pickups`, `PATCH /api/pickups/:id/collect|complete`
- `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`
- `GET/POST /api/ratings`
- Admin: `GET /api/users`, `PATCH /api/admin/users/:id/verification|suspension`, `GET /api/admin/stats`

The current React app still imports `src/services/mockBackend.js`; this API is a separate backend and the front end will need an API client and auth token handling before it uses persistent MongoDB data.

# Neo-Jamshedpur Citizen Terminal

Neo-Jamshedpur Citizen Terminal is a full-stack civic operations platform that unifies jobs, resource trading, city pulse updates, trust scoring, notifications, and role-based governance inside one futuristic citizen dashboard.

## Project Structure

```text
neo-jamshedpur-citizen-terminal/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeds/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   └── styles/
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── README.md
```

## Feature Summary

- JWT authentication with protected routes and persistent session state
- Citizen, verified provider, and admin roles
- Employment Grid with job lifecycle, applications, assignment, lifecycle logs, disputes, and cancellation support
- Resource Exchange with offer threads, counter-offers, acceptance, dispute hooks, and transaction history
- Pulse feed with priorities, official/community posts, reactions, bookmarks scaffold, and critical alert fan-out
- Notification center with unread/read states and deep-link ready payloads
- Reputation and trust rank model with auditable reputation records
- Unified dashboard with critical alert banner, trust metrics, activity timeline, NIA assistant panel, and sector map
- Admin analytics, user management, verification flow, alert broadcasting, and dispute resolution endpoints
- Real-time notification foundation via Socket.io rooms

## Tech Stack

### Frontend

- React + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- TanStack Query
- Zustand

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- express-validator
- Helmet
- CORS
- rate limiting
- Socket.io

## Backend Modules

### Core models

- `User`
- `Job`
- `JobApplication`
- `JobStatusLog`
- `TradeListing`
- `TradeOffer`
- `TradeTransactionLog`
- `Dispute`
- `PulsePost`
- `Reaction`
- `Notification`
- `ActivityLog`
- `ReputationRecord`

### API route groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `POST /api/auth/logout`
- `GET /api/users/:id`
- `GET /api/users/:id/activity`
- `GET /api/users/:id/reputation`
- `GET /api/jobs`
- `POST /api/jobs`
- `GET /api/jobs/:id`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `POST /api/jobs/:id/apply`
- `POST /api/jobs/:id/assign`
- `POST /api/jobs/:id/status`
- `POST /api/jobs/:id/dispute`
- `POST /api/jobs/:id/cancel`
- `GET /api/trades`
- `POST /api/trades`
- `GET /api/trades/:id`
- `PUT /api/trades/:id`
- `DELETE /api/trades/:id`
- `POST /api/trades/:id/offers`
- `GET /api/trades/:id/offers/:offerId`
- `POST /api/trades/:id/offers/:offerId/counter`
- `POST /api/trades/:id/offers/:offerId/accept`
- `POST /api/trades/:id/offers/:offerId/reject`
- `POST /api/trades/:id/complete`
- `POST /api/trades/:id/dispute`
- `GET /api/pulse`
- `POST /api/pulse`
- `GET /api/pulse/:id`
- `PUT /api/pulse/:id`
- `DELETE /api/pulse/:id`
- `POST /api/pulse/:id/react`
- `POST /api/pulse/:id/bookmark`
- `GET /api/notifications`
- `POST /api/notifications/read/:id`
- `POST /api/notifications/read-all`
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `POST /api/admin/users/:id/verify`
- `POST /api/admin/alerts`
- `POST /api/admin/disputes/:id/resolve`
- `GET /api/search?q=...`

## Frontend Routes

### Public

- `/`
- `/login`
- `/register`

### Authenticated

- `/dashboard`
- `/profile`
- `/settings`
- `/notifications`
- `/search`
- `/jobs`
- `/jobs/create`
- `/jobs/mine`
- `/jobs/applications`
- `/jobs/dispute`
- `/jobs/:id`
- `/trades`
- `/trades/create`
- `/trades/mine`
- `/trades/offers`
- `/trades/history`
- `/trades/:id`
- `/pulse`
- `/pulse/create`
- `/pulse/saved`
- `/pulse/:id`

### Admin

- `/admin`
- `/admin/users`
- `/admin/verify-providers`
- `/admin/moderation`
- `/admin/disputes`
- `/admin/alerts`
- `/admin/analytics`

## Workflow Rules

### Jobs

- Only authenticated users can post and apply
- Owners or admins assign workers
- Assigned worker or admin can move work into progress/completed
- Owner or admin verifies completion
- Disputes lock the job in `disputed`
- Status transitions are guarded in the service layer and recorded in `JobStatusLog`

### Trades

- Owners cannot offer on their own listings
- Negotiation history is preserved in offer threads
- Only owners or admins can accept/reject offers
- Completion rewards reputation
- Disputes move listings into `disputed`

### Pulse

- Critical alerts are admin-only
- Priority affects UI prominence and notification urgency
- Critical posts can fan out alerts platform-wide

### Reputation

- Verified jobs and completed trades increase trust
- Dispute outcomes and other penalties can reduce trust
- Trust rank is derived from score:
  - `New`
  - `Reliable`
  - `Trusted`
  - `Elite`

## Environment Variables

### Root

No root env file is required.

### Backend `.env`

Copy `backend/.env.example` to `backend/.env` and configure:

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/neo-jamshedpur-terminal
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SEED_RESET=true
```

### Frontend `.env`

Copy `frontend/.env.example` to `frontend/.env`:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Setup

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Seed the database

Make sure MongoDB is running locally, then:

```bash
npm run seed
```

### 3. Run the app

For both frontend and backend together:

```bash
npm run dev
```

Or individually:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

### 4. Production-ish run

```bash
npm run build
npm run start
```

## Demo Credentials

- Admin: `aarav@neojam.dev` / `password123`
- Provider: `mira@neojam.dev` / `password123`
- Citizen: `kabir@neojam.dev` / `password123`
- Citizen: `riya@neojam.dev` / `password123`

## UI Notes

- Dark charcoal and deep navy base
- Neon cyan and electric blue signal accents
- Amber and red priority states
- Glassmorphism panels, subtle grid textures, and terminal typography accents
- Motion-based dashboard hero and hover states
- NIA assistant panel for navigation and summaries

## Screenshots

Add screenshots here after running locally:

- `docs/screenshots/landing.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/jobs.png`
- `docs/screenshots/trades.png`
- `docs/screenshots/pulse.png`
- `docs/screenshots/admin.png`

## Future Improvements

- Full Socket.io live boards for job/trade activity updates
- Dedicated bookmark and saved search collections
- Rich negotiation chat UI with presence
- File uploads with Cloudinary or local storage abstraction
- Sector map using Leaflet or Mapbox
- Admin charts and moderation queues with deeper analytics
- Command palette and theme switching
- Background jobs, caching, and Redis for scale


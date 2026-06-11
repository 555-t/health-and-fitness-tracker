# 🏋️ Health & Fitness Tracker

A full-stack web application for tracking workouts, nutrition, steps, and fitness progress. Built with a vanilla JavaScript frontend and a Node.js/Express backend connected to MongoDB.

---

## 🚀 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| UI Framework | Bootstrap 4, Font Awesome, Flaticon |
| Charts | Chart.js |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB, Mongoose 8 |
| Auth | Session-based (in-memory) + bcryptjs |
| Testing | Jest, Supertest, mongodb-memory-server |
| Dev Tools | nodemon, dotenv |

---

## 📁 Project Structure

```
health-and-fitness-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (auth + profile fields)
│   │   ├── Workout.js        # Workout entry schema
│   │   ├── Steps.js          # Daily step count schema (unique per user/date)
│   │   ├── Nutrition.js      # Daily nutrition log & goals schema
│   │   └── Reminder.js       # User workout reminder schema
│   ├── routes/
│   │   ├── authRoutes.js     # POST /api/auth/register, /api/auth/login
│   │   ├── trackerRoutes.js  # POST/GET/DELETE /api/tracker/workouts
│   │   ├── stepsRoutes.js    # POST /api/steps (upsert by date)
│   │   ├── nutritionRoutes.js# GET/POST /api/nutrition/:date
│   │   ├── profileRoutes.js  # GET/PUT /api/profile (with validation)
│   │   ├── progressRoutes.js # GET /api/progress/summary
│   │   └── reminderRoutes.js # GET/POST /api/reminders
│   ├── __tests__/
│   │   ├── helpers/
│   │   │   └── setup.js
│   │   ├── ft01-register.test.js       # Functional: registration flow
│   │   ├── ft02-login.test.js          # Functional: login flow
│   │   ├── ft03-workouts.test.js       # Functional: workout CRUD
│   │   ├── ft04-nutrition.test.js      # Functional: nutrition log
│   │   ├── ft05-unknown-route.test.js  # Functional: 404 handling
│   │   ├── it01-register-db.test.js    # Integration: DB persistence
│   │   ├── it02-workout-isolation.test.js  # Integration: per-user isolation
│   │   ├── it03-steps-upsert.test.js   # Integration: steps upsert logic
│   │   ├── it04-profile-update.test.js # Integration: profile updates
│   │   ├── ut01-user-schema.test.js    # Unit: User model validation
│   │   ├── ut02-profile-validation.test.js # Unit: profile input validation
│   │   ├── ut03-workout-schema.test.js # Unit: Workout model validation
│   │   └── ut04-steps-schema.test.js   # Unit: Steps model validation
│   └── server.js             # Express app entry point (port 5000)
│
├── frontend/
│   ├── index.html            # Dashboard / landing page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── profile.html          # User profile page
│   ├── tracker.html          # Workout tracker page
│   ├── nutrition.html        # Nutrition planner page
│   ├── progress.html         # Progress charts & summary page
│   ├── components/
│   │   └── navbar.html       # Shared navigation bar
│   ├── css/
│   │   └── style.css         # Custom stylesheet
│   ├── js/
│   │   ├── auth-status.js    # Auth guard / session check
│   │   ├── dashboard.js      # Dashboard data & UI logic
│   │   ├── tracker.js        # Workout logging logic
│   │   ├── nutrition.js      # Nutrition planner logic
│   │   ├── profile.js        # Profile view & update logic
│   │   ├── chart.js          # Chart.js wrappers & data viz
│   │   └── notify.js         # Reminder / notification logic
│   └── assets/
│       ├── css/              # Bootstrap, Font Awesome, template CSS
│       ├── js/               # jQuery, Bootstrap JS, plugins
│       ├── fonts/            # Font Awesome, Flaticon, Flexslider fonts
│       └── images/           # App images and background videos
│
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local instance or Atlas URI)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd health-and-fitness-tracker

# 2. Install dependencies
npm install

# 3. Create a .env file in the project root
echo "MONGO_URI=mongodb://127.0.0.1:27017/getbuffd" > backend/.env
```

### Running the App

```bash
# Production
npm run start-backend

# Development (auto-reload with nodemon)
npm run dev-backend
```

The server starts on **http://localhost:5000** and serves the frontend statically from the `/frontend` directory.

### Running Tests

```bash
npm test
```

Tests use `mongodb-memory-server` — no live database connection needed.

---

## 🔌 API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |

Auth uses in-memory sessions. After login/register, the server returns a `sessionId` and a `token`. Include `x-session-id: <sessionId>` in all subsequent requests.

> **Note:** Sessions are not persisted — a server restart clears all active sessions.

### Workouts — `/api/tracker`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tracker/workouts` | Log a new workout |
| GET | `/api/tracker/workouts` | Get all workouts for the logged-in user |
| DELETE | `/api/tracker/workouts/:id` | Delete a workout by ID |

### Steps — `/api/steps`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/steps` | Add steps for a date (upserts, increments existing) |
| GET | `/api/steps` | Get step history for the logged-in user |

### Nutrition — `/api/nutrition`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/nutrition/:date` | Get nutrition log for a specific date |
| POST | `/api/nutrition/:date` | Upsert nutrition log and goals for a date |

### Profile — `/api/profile`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get the logged-in user's profile |
| PUT | `/api/profile` | Update profile fields (name, age, weight, height, gender, bio, picture) |
| PUT | `/api/profile/password` | Change password |

### Progress — `/api/progress`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/progress/summary` | Weekly workout summary and per-day breakdown |

### Reminders — `/api/reminders`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reminders` | Get the user's active reminder setting |
| POST | `/api/reminders` | Create or update a workout reminder (delay + label) |

---

## 👥 Task Distribution

| Member | Responsibility |
|---|---|
| Member 1 | Authentication — login & registration |
| Member 2 | Dashboard & navigation |
| Member 3 | Profile management |
| Member 4 | Fitness tracker |
| Member 5 | Nutrition planner |
| Member 6 | Charts, progress & notifications |

---

## ⚠️ Collaboration Guidelines

- Each member works on their assigned files only
- Always `git pull` the latest changes before starting work
- Push to your own feature branch — **never push directly to `main`**
- Use pull requests to merge into `main`
- Avoid editing the same file simultaneously

---

## 📋 Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/getbuffd
```

The `.env` file is gitignored and should never be committed.

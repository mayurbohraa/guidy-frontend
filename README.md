# Guidy Frontend

## About the project

Guidy is an academic tracker for university students. The web app brings schedules, tasks, notes, grades, and study materials together, with dedicated dashboards for students, contributors, and administrators.

## Key features

- Login and signup for eligible university accounts, with navigation based on the account role.
- Course registration, schedules, calendar events, tasks with saved completion state, notebooks, and grade tracking.
- Resource submission for contributors, moderation for administrators, and downloads for signed-in users.

The Light workspace UI includes role-specific analytics, a review queue, notification and profile panels, and explicit loading, empty, and error states. Failed list requests offer retry, and expired sessions offer a sign-in action. My Profile stays inside the dashboard and supports saving contact details.

The header and navigation stay in place while the main dashboard content scrolls with a theme-matched scrollbar. Signup uses the original logo and approved illustration, with scrolling confined to the form panel. Field information icons show format guidance on hover or keyboard focus without a hover background; touch users can tap the icon. Validation errors remain associated with their fields.

## Live website

https://guidy-frontend-bice.vercel.app/

## GitHub repositories

- [Guidy Frontend](https://github.com/mayurbohra9/guidy_frontend)
- [Guidy Backend](https://github.com/mayurbohra9/guidy_backend)

## Tech stack

React 18, Create React App, React Router, Axios, React Calendar, Recharts, React Toastify, and CSS.

## Prerequisites

- Node.js 24 and npm.
- A running Guidy API for account and dashboard workflows. For local development, start the API using the setup instructions in the Backend repository.

## Installation and setup

1. Open a terminal in the frontend repository.
2. Install dependencies with `npm ci`.
3. Start the local Guidy API on port 4000 or configure an alternate API endpoint.
4. Run `npm start` and open `http://localhost:3000`.

## Environment configuration

Create a `.env.local` file if needed. Set `REACT_APP_API_URL` in `.env.local` or in the hosting environment to use a different API. Include the `/api/v1` suffix. With the variable unset, development requests use the local proxy on port 4000 and production uses the configured hosted default. Create React App embeds this value at build time, so use only a public API URL.

## Running locally

| Command | Purpose |
|---|---|
| `npm run lint` | Check code with ESLint. |
| `npm start` | Start the development server. |
| `npm test -- --watchAll=false --runInBand` | Run the frontend regression suite once. |
| `npm run build` | Write the production bundle to `build/`. |

## Project structure

```text
Frontend/
├── public/           HTML shell and favicon
├── src/
│   ├── Api/          Axios client and API route definitions
│   ├── assets/       App graphics and styles
│   ├── components/   Account screens and role-specific dashboards
│   ├── routes/       Dashboard routes
│   ├── service/      API helpers
│   ├── App.js        Application routes
│   └── App.test.js   Frontend regression tests
├── .gitignore
├── package.json
└── README.md
```

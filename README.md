# Guidy Frontend

## About the project

This React application was developed through a freelance engagement for a student client's academic project. It provides separate experiences for students, contributors, and administrators and connects to the independently maintained Guidy API.

## Dashboard and account features

| Role | Available features |
|---|---|
| Student | Course roadmap and registration, schedule management, calendar events, tasks, notebooks, personal grade entry, and approved resources. |
| Contributor | Resource submission, a My submissions sidebar page with review status, downloads, and pending withdrawal, and an overview of the shared approved library, including course coverage and resources by academic year. |
| Administrator | Pending resource counts, review queue, submission breakdown by term, resource approval or rejection, calendar, tasks, and a searchable student and contributor directory. |
| All roles | Login, profile viewing and contact editing, notifications, and logout. Public signup supports students and contributors. |

- Header search opens matching pages and records available to the signed-in role. Use the arrow keys and Enter, or select a result.
- Logout opens a confirmation dialog inside the dashboard. Signed-in users can change their password from My Profile.
- Route reloads show a branded loading screen, with matching inline loaders for data panels.
- Dashboard summaries use API records, with separate loading, empty, error, and expired-session states.
- Calendar selection updates the event form; events are sorted and can be filtered by the selected date.
- My Profile opens inside the dashboard and refreshes the account header after saved changes.
- The original logo and rose-and-burgundy theme are retained, with a transparent planner illustration on login and signup.
- Mobile navigation uses a hamburger drawer with close, backdrop, Escape, and focus handling. The header stays steady while dashboard content scrolls. Signup scrolls within its form panel.
- Field information icons reveal format guidance on hover, keyboard focus, or tap. Hover does not change the icon's colour or background; validation errors remain beside their fields.

Login, signup, and recovery share the same branding panel. Beside the **My Profile** heading, users can reveal and save their recovery code from their signed-in dashboard. Forgot password checks the university email format, verifies the recovery code, and then shows the new-password form. The popup includes a Copy code action. Administrators can approve recovery requests and record simulated email delivery in notifications.

## Live website

https://guidy-frontend-bice.vercel.app/

## Repositories

- [Frontend repository](https://github.com/mayurbohraa/guidy-frontend)
- [Companion backend repository and API setup](https://github.com/mayurbohraa/guidy-backend)

## Tech stack

React 18, Create React App 5, React Router 6, Axios, React Calendar, Recharts, React Toastify, Unicons, and CSS. Tests use Jest and React Testing Library; ESLint checks the source.

## Prerequisites

- Node.js 24 and npm; the latest recorded checks used Node.js 24.13.0 and npm 11.12.1.
- Git to clone the repository.
- A running Guidy backend and access to its configured MongoDB database through the API.

## Installation and setup

1. Clone and open the frontend repository:

   ```sh
   git clone https://github.com/mayurbohraa/guidy-frontend.git
   cd guidy-frontend
   ```

2. Install the locked dependencies:

   ```sh
   npm ci
   ```

3. Start the companion backend on port `4000`, or configure an alternate API URL below.
4. Start the frontend:

   ```sh
   npm start
   ```

5. Open `http://localhost:3000`. Signup requires a Qatar University email. Administrator accounts are provisioned separately.

## Environment configuration

| Variable | Purpose | Default |
|---|---|---|
| `REACT_APP_API_URL` | Public API base URL, including `/api/v1`. | Local development uses `/api/v1` through the port `4000` proxy; production uses the existing hosted API. |

For an alternate backend, create an untracked `.env.local` file:

```dotenv
REACT_APP_API_URL=http://localhost:4000/api/v1
```

Restart the development server after changing this value. Production values are embedded at build time; frontend environment files must contain only public configuration.

## Development commands

| Command | Purpose |
|---|---|
| `npm start` | Start the development server. |
| `npm run lint` | Check source files with zero permitted ESLint warnings. |
| `npm test -- --watchAll=false --runInBand` | Run the regression suite once. |
| `npm run build` | Generate the production application in `build/`. |

Latest verification on 4 November 2026 includes frontend lint, component tests, the production build, 14 backend regression checks, and 12 isolated MongoDB workflow checks. Hosted deployment and visual browser verification remain pending.

## Project structure

```text
Frontend/
├── public/                      HTML shell, manifest, and favicon
├── src/
│   ├── Api/                     Axios client and API endpoint helpers
│   ├── assets/                  Images and shared styles
│   ├── components/
│   │   ├── Admin/               Review queue and administrator dashboard
│   │   ├── Contributor/         Resource submission and library summaries
│   │   ├── User/                Student dashboard and academic workflows
│   │   ├── pages/               Supporting course, note, grade, and task views
│   │   ├── FieldHelp.jsx        Compact field-format information
│   │   └── Workspace.jsx        Shared panels, metrics, and request states
│   ├── routes/                  Role-specific dashboard routes
│   ├── service/                 Authentication and API services
│   ├── App.js                   Routes, guards, and rendering fallback
│   └── App.test.js              Application entry-point checks
├── package-lock.json
├── package.json
└── README.md
```


## Credits

Confirmed freelance responsibilities include requirements analysis, UI/UX, frontend development, API integration, testing, and deployment. The original Guidy logo and supplied project assets are retained.

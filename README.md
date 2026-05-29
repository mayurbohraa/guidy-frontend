# Guidy Frontend

## Project Overview

Guidy is an academic tracker built for university students to manage courses, schedules, notebooks, grades, and learning resources in one place. The application includes role-based access for students, contributors, and administrators, with a polished UI that emphasizes clean navigation, responsive layout, and easy content management.

This frontend was designed and developed with a focus on:
- simplicity and clean navigation
- role-specific dashboards for students, contributors, and admins
- cross-device compatibility and responsive layouts
- integration with backend APIs for authentication, tasks, notebooks, and resources

## Key Features

- User authentication with login, signup, forgot password, and reset password flows
- Student dashboard with:
  - schedule view and calendar integration
  - task creation, listing, and deletion
  - notebook entry submission and review
  - grades view and course-level performance tracking
  - learning resources browsing
- Contributor dashboard with:
  - resource upload by year, term, and subject
  - resource management via contributor workflows
- Admin dashboard with:
  - request review and approval/denial for uploaded resources
  - task and calendar oversight
- Responsive UI built using React, React Router, and modern component-driven design
- Toast notifications for success/error feedback

## Project Structure

- `src/App.js` - main application router and page entry points
- `src/routes/Sidepage.jsx` - student dashboard routing
- `src/routes/Sidepage2.jsx` - contributor dashboard routing
- `src/routes/Sidepage3.jsx` - admin dashboard routing
- `src/components` - reusable and role-specific UI components
- `src/Api` - Axios service and API route configuration
- `src/service` - authentication and registration service helpers

## Tech Stack

- React 18
- React Router DOM
- Axios
- React Toastify
- React Notifications
- Recharts
- React Calendar
- Font Awesome / Unicons

## Installation

1. Clone or open the repository in your workspace.
2. Install dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm start
```

Open the app at `http://localhost:3000`.

## Preconfigured Login Details

Use the following credentials to access each role:

- Admin: Email: `guidyadmin@qu.edu.qa` / Password: `Guidyadmin@123`
- Contributor: Email: `guidycontributor@qu.edu.qa` / Password: `Guidycontributor@123`
- Student: Email: `guidystudent@qu.edu.qa` / Password: `Guidystudent@123`

## Notes

- The app expects a backend API proxied through `http://localhost:4000/` & `https://guidy-backend.vercel.app/api/v1`.
- Authentication state is stored in `localStorage` and role-based navigation is handled through React Router.
- The signup screen supports user role selection for general registration.

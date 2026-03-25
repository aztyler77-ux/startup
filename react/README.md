# Decision Helper - CS 260 Startup DB Deliverable

Decision Helper is a startup web app for comparing options, weighting criteria, and calculating a recommendation. For the DB deliverable, the project now stores user credentials and saved decision history in MongoDB Atlas, while keeping the Node/Express backend, cookie-based authentication, bcrypt password hashing, and service endpoints from the previous deliverable.

## Service deliverable features

- Node.js + Express HTTP service in `react/service/index.js`
- Frontend React build served through Express static middleware from `react/service/public`
- Backend endpoints for:
  - service health check
  - account creation
  - login
  - logout
  - restricted session check
  - decision list/save routes
  - starter-field suggestions
- Password hashing with `bcryptjs`
- Frontend auth flow wired to backend endpoints
- Third-party-backed suggestions flow:
  - frontend sends a decision title to `/api/suggestions`
  - backend calls Datamuse
  - backend returns suggested criteria and options for the decision builder

## Third-party API note

The original mock "insight/quote" idea was replaced with a better product-aligned feature: starter criteria and option suggestions for the Decision Builder. This better matches the core purpose of Decision Helper and still satisfies the service-deliverable requirement that the frontend visibly uses a third-party-backed service flow.

## Files to inspect

- `react/service/index.js` - Express backend and API routes
- `react/src/App.jsx` - app shell and auth/session wiring
- `react/src/views/Home.jsx` - login/create-account UI wired to backend auth
- `react/src/views/Play.jsx` - decision builder + starter suggestions button
- `react/src/views/About.jsx` - third-party suggestions demo
- `../notes.md` - implementation notes and verification trail

## Prerequisite / TA-facing notes

- GitHub repository link is visible in the app UI
- Commit history was built incrementally in meaningful chunks
- Simon prerequisite was previously verified live in production
- Startup service deliverable work was implemented and tested locally before deployment

## Current limitation

Decision history and credentials are now stored in MongoDB Atlas. The main remaining future deliverable work is real-time websocket functionality.

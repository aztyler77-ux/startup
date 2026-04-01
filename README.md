# Decision Helper

[My Notes](notes.md)

Decision Helper is a web app that helps users make difficult choices by breaking decisions into options, criteria, and weighted priorities. Instead of relying on gut feeling alone, users can see a clear, ranked recommendation along with an explanation of how the decision was calculated.

> [!NOTE]
> This is a template for your startup application. You must modify this `README.md` file for each phase of your development. You only need to fill in the section for each deliverable when that deliverable is submitted in Canvas. Without completing the section for a deliverable, the TA will not know what to look for when grading your submission. Feel free to add additional information to each deliverable description, but make sure you at least have the list of rubric items and a description of what you did for each item.

> [!NOTE]
> If you are not familiar with Markdown then you should review the [documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) before continuing.

## 🚀 Specification Deliverable

> [!NOTE]
> Fill in this sections as the submission artifact for this deliverable. You can refer to this [example](https://github.com/webprogramming260/startup-example/blob/main/README.md) for inspiration.

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Decision Helper is a simple web application designed to reduce the stress of decision-making. Users enter their available options, define the criteria that matter to them, and assign weights based on importance. The app calculates a ranked outcome and explains why one option rises to the top, helping users feel confident and intentional about their choices.

### Design

![Decision Helper wireframe](DecisionHelper.png)

![Decision builder view](placeholder.png)

![Results view](placeholder.png)

**Design notes**
- Login/Register screen for returning users
- Decision Builder screen with options, criteria, and weight inputs
- Results screen showing ranked outcomes and score breakdowns

### Key features

- Create decisions with multiple options
- Define criteria and assign importance weights
- Automatically calculate and rank outcomes
- View clear explanations of how scores were computed
- Save past decisions and revisit them later

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Semantic page structure for login, decision creation, and results views using forms, inputs, lists, and buttons.
- **CSS** - Clean, minimal styling with responsive layouts using flexbox or grid, emphasizing readability and visual hierarchy.
- **React** - Single-page application with routed views (login, builder, results, history) and reusable components that update dynamically as user input changes.
- **Service** - Backend endpoints to create, update, score, and retrieve decisions, along with authentication and protected routes.
- **DB/Login** - MongoDB used to store users, hashed credentials, decisions, criteria, weights, and scores so users can access saved decisions.
- **WebSocket** - Real-time updates to decision results when values change, or shared decision sessions where updates are broadcast live.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - Server is deployed on AWS EC2 and accessible at https://tnich-startup.click (subdomains: https://startup.tnich-startup.click and https://simon.tnich-startup.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages**  
  I created individual HTML pages for Home, Play, Scores, and About views.
- [x] **Proper HTML element usage**  
  Pages use the correct semantic HTML elements including a header, nav, main, section, footer, table, and necessary headings.
- [x] **Links**  
  The navigation links allow users to move between all of the pages.
- [x] **Text**  
  Each page includes a description that explains its purpose.
- [x] **3rd party API placeholder**  
  The About page has a placeholder section ready for for third-party API data once it's implemented.
- [x] **Images**  
  The About page has an image depicting a mock-up of the application concept.
- [x] **Login placeholder**  
  The Home page has a placeholder for login functionality to be implemented in the future.
- [x] **DB data placeholder**  
  The Scores page has a placeholder table for data that will later be loaded from a database.
- [x] **WebSocket placeholder**  
  A real-time update area will be added in a future deliverable.

- Production Startup URL: https://tnich-startup.click
- Production Simon URL: https://simon.tnich-startup.click
- Notes: See `notes.md` for the steps I took, including deploying the official `simon-html` example using `deployFiles.sh`.


## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Visually appealing colors and layout. No overflowing elements.**
  I applied a consistent dark theme (background, panels, borders, and accent color) and verified the UI does not overflow on smaller screens. The Scores table is wrapped in a container that allows horizontal scrolling if needed.

- [x] **Use of a CSS framework**
  I included Bootstrap 5 via CDN and used Bootstrap utility classes alongside custom CSS in `main.css`.

- [x] **All visual elements styled using CSS**
  All pages share the same `main.css` styling for the header/nav/main/footer, cards, tables, and buttons. No inline `style=""` attributes are used.

- [x] **Responsive to window resizing using flexbox and/or grid display**
  The layout is responsive when resizing the window. The shared layout uses flexbox, the navigation wraps on small widths, and content is constrained to a max width.

- [x] **Use of an imported font**
  I imported the Inter font from Google Fonts in `main.css` using `@import` and applied it site-wide via `font-family`.

- [x] **Use of different types of selectors including element, class, ID, and pseudo selectors**
  `main.css` demonstrates element selectors (e.g., `body`, `label`, `table`), class selectors (e.g., `.app-shell`, `.cardish`, `.site-nav`), ID selectors (e.g., `#site-header`, `#site-footer`), and pseudo selectors (e.g., `a:hover`, `button:hover`).

- Production Startup URL: https://startup.tnich-startup.click
- Production Simon URL: https://simon.tnich-startup.click
- Notes: See `notes.md` for additional implementation notes.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Bundled using Vite** - Created a Vite + React project in the `react/` directory and built a production bundle (`npm run build`) for deployment.
- [x] **Components** - Converted the Startup pages into React components/views (Home, Play, Scores, About) with a shared app shell (header/nav/footer) and reusable layout/styling.
- [x] **Router** - Implemented client-side routing with React Router for `/`, `/play`, `/scores`, `/about`, plus a fallback NotFound route. Verified deep links and refresh on routes load correctly as an SPA.

- Production Startup URL: https://startup.tnich-startup.click
- Notes: The React app lives in `react/` and the built `dist/` output is what is deployed to the startup subdomain.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **All functionality implemented or mocked out** - Implemented/mocked React P2 functionality across multiple components: mock login/session state, reactive decision builder inputs/scoring/ranked results, localStorage-backed draft + history persistence, mock live updates stream, and a mocked third-party insight feature on the About page.
- [x] **Hooks** - Used React hooks across the app, including `useState` for interactive UI state and `useEffect` for localStorage sync, timed mock updates (`setInterval` / `setTimeout`), and cleanup behavior.

- Production Startup URL: https://startup.tnich-startup.click
- Notes: See `notes.md` and the detailed “React Part 2: Reactivity (Startup) - Feb 25, 2026” section below for implementation/deployment verification details.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Node.js/Express HTTP service** - Added an Express backend in `react/service/index.js` and deployed startup through a reverse proxy to the service on port 4000.
- [x] **Static middleware for frontend** - The React frontend build is copied into `react/service/public` and served by Express static middleware.
- [x] **Calls to third party endpoints** - Added a third-party-backed suggestions feature. The frontend calls `/api/suggestions`, and the backend calls Datamuse to generate starter criteria and option ideas from a decision phrase.
- [x] **Backend service endpoints** - Added backend endpoints for auth, decision saving/history, service health, and starter suggestions.
- [x] **Frontend calls service endpoints** - The frontend now calls backend endpoints for login/logout/session lookup, decision history, decision save on calculate, and starter suggestions.
- [x] **Supports registration, login, logout, and restricted endpoint** - Implemented `/api/auth/create`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me` with cookie auth.
- [x] **Uses bcrypt to hash passwords** - Passwords are hashed with `bcryptjs` before being stored in the in-memory user store for this deliverable.

Production Startup URL:
- https://startup.tnich-startup.click

TA/grading notes:
- Service health endpoint: `/api/test`
- Third-party-backed suggestions endpoint: `POST /api/suggestions`
- Decision save endpoint used by Play page: `POST /api/decisions`
- Decision history endpoint used by Scores page: `GET /api/decisions/mine`
- Startup is deployed through Caddy reverse proxy to the Node service on port 4000.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Stores data in MongoDB** - Decision Helper now stores saved decision history in MongoDB Atlas instead of keeping the deliverable data in memory or browser-only storage. The backend writes decision records into MongoDB and the Scores page loads the signed-in user's saved decisions from the database.
- [x] **Stores credentials in MongoDB** - Account credentials are now stored in MongoDB Atlas. The backend hashes passwords with `bcryptjs`, stores the hashed credentials in MongoDB, issues auth tokens, and restores sessions by looking users up from the database.

Production Startup URL:
- https://startup.tnich-startup.click

Files to inspect:
- `react/service/database.js` - MongoDB connection + collection helpers
- `react/service/index.js` - auth and decision endpoints now backed by MongoDB
- `react/src/views/Play.jsx` - decision save flow messaging updated for Mongo-backed history
- `react/src/views/Scores.jsx` - loads saved decision history from backend/MongoDB

TA/grading notes:
- MongoDB Atlas cluster is connected through `react/service/dbConfig.json` on the server, and that file is gitignored.
- Credentials are stored in the `user` collection.
- Saved decision records are stored in the `decision` collection.
- Verified locally on the server with account creation, authenticated session lookup, decision save, and decision history retrieval.
- Verified the deployed production service at `https://startup.tnich-startup.click/api/test`.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Backend listens for WebSocket connection** - Added a WebSocket server to the deployed Node/Express backend in `react/service/index.js` using the `ws` package. The backend now accepts WebSocket connections on the `/ws` path.
- [x] **Frontend makes WebSocket connection** - The React frontend now opens a live WebSocket connection from the Scores page using the current page protocol (`ws`/`wss`) and host, connecting to `/ws`.
- [x] **Data sent over WebSocket connection** - When a signed-in user saves a decision from the Play page, the backend broadcasts a `decision_saved` event containing the decision title, owner email, created timestamp, and winner name.
- [x] **WebSocket data displayed** - The Scores page displays incoming live events in a visible **Live activity** panel and updates the live connection status text in the interface.
- [x] **Application is fully functional** - Verified on the deployed production site with two browser windows: saving a decision in one window immediately displays the live decision-save event in the other window without refresh.

Production Startup URL:
- https://startup.tnich-startup.click

Production Simon URL:
- https://simon.tnich-startup.click

Files to inspect:
- `react/service/index.js` - Express + WebSocket server, `/ws` path, and `decision_saved` broadcast
- `react/src/views/Scores.jsx` - frontend WebSocket connection and live activity display
- `react/src/views/Play.jsx` - decision save flow that triggers the backend event
- `react/vite.config.js` - local dev WebSocket proxy for `/ws`

TA/grading notes:
- WebSocket endpoint path: `/ws`
- Live UI location: Scores page → **Live activity**
- Broadcast event currently implemented: `decision_saved`
- Production behavior verified by saving a decision in one logged-in window and observing the event appear instantly in another window.

## ✅ Startup HTML Deliverable

- Production Startup URL: https://tnich-startup.click
- Production Simon URL: https://simon.tnich-startup.click
- Notes: See `notes.md` for what I changed + how I deployed the official `simon-html` example using `deployFiles.sh`.


## React Part 2: Reactivity (Startup) - Feb 25, 2026

Production URL:
- https://startup.tnich-startup.click

What I added/changed for this deliverable:
- Implemented React interactivity across the Startup app using multiple components and routed views (Home, Play, Scores, About, NotFound).
- Added mock login/session behavior on the Home page using React state and browser localStorage (`decisionHelper.userName`).
- Added a reactive Decision Builder on the Play page:
  - create/edit/remove options
  - enter a decision title
  - score options (1-10)
  - calculate a winner and ranked results table
- Mocked database persistence using localStorage:
  - Play page draft persistence (`decisionHelper.playDraft`)
  - saved decision history (`decisionHelper.history`)
- Added a reactive Scores page that:
  - loads saved decision history from localStorage
  - refreshes/clears local mock history
  - displays a mock “Live Updates” feed
- Mocked WebSocket-style updates on the Scores page using `setInterval` and React `useEffect` cleanup.
- Used React `useState` and `useEffect` hooks for component state, persistence, timed updates, and lifecycle cleanup.
- Kept my name visible in the app footer and kept a prominent GitHub repo link visible on the app (home page + footer).
- Built with Vite and deployed the updated production build to the startup subdomain.
- Verified deployment with curl:
  - root and deep links (`/play`, `/scores`, `/about`) return HTTP 200
  - production HTML serves the current hashed JS/CSS bundle
  - deployed JS bundle contains the new React P2 mock-interactivity strings

Notes:
- Future deliverables will replace localStorage mocks with the real service/database/websocket implementations.

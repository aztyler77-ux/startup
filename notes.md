Startup CSS Deliverable Notes – Decision Helper

CSS framework:
This project uses the Bootstrap 5 CSS framework via the CDN. Bootstrap utility classes (such as spacing and typography helpers) are used alongside custom CSS for layout and presentation.

Custom CSS and selectors:
A shared main.css file is used across all pages. The stylesheet demonstrates multiple selector types, including element selectors (body, label, table), class selectors (.app-shell, .cardish, .site-nav, .brand), ID selectors (#site-header, #site-footer), and pseudo-class selectors (a:hover, button:hover). CSS variables are defined in :root and reused throughout the stylesheet.

Imported font:
The Inter font is imported from Google Fonts using an @import rule at the top of main.css and applied as the primary font for the site.

Layout and responsiveness:
The overall page structure uses a responsive flexbox layout on the body and navigation bar. The main content area is centered using a constrained container and flexible widths so the layout adapts to different screen sizes. Navigation links wrap automatically on smaller screens, and images scale responsively using max-width: 100% and height: auto.

Overflow handling:
Tables on the Scores page are wrapped in a container with horizontal overflow enabled so that content does not overflow the viewport on smaller devices.

Shared styling:
All pages (index, play, scores, and about) share a consistent header, navigation bar, main layout container, and footer. The same main.css file is used across all pages to ensure a unified design.

Additional CSS deliverable notes:
- Used Bootstrap 5 via CDN plus shared `main.css` for consistent styling across pages.
- Verified responsive flex layout, wrapped navigation, and table overflow handling.
- Confirmed there are no inline `style=""` attributes in HTML pages.


CSS refinement pass (Feb 4): added spacing/radius tokens, improved form focus/placeholder, button active state, card hover + reduced-motion support, mobile header tweaks, table striping + sticky header, image sizing, and print styles.

## React P1 prep (Feb 12, 2026)
- Installed Node.js 20 + npm on server for Vite/React builds.
- Migrated Caddy roots for simon/startup to /home/ubuntu/services/<service>/public (course deploy target).
- Fixed permissions on /home/ubuntu so Caddy can traverse and serve files (resolved HTTP 403).

## React P2 (Reactivity) notes - 2026-02-25

- Mocking future deliverables cleanly made React P2 much easier to reason about:
  - localStorage for user/session + persisted history
  - setInterval for fake live updates / websocket-style behavior
- `useEffect` is doing two important jobs now:
  1) sync state to localStorage
  2) manage lifecycle/timer setup + cleanup
- SPA deep links returning index.html with HTTP 200 is expected/desired behavior when React Router handles routing client-side.
- Terminal paste mistakes can look catastrophic, but `tail` + `npm run build` is the fastest sanity check for file integrity.
- Frequent small commits after each feature chunk makes recovery and TA verification much easier.

## 2026-02-26 - Simon React prerequisite polish
- Observed Simon React nav links rendering without spacing (e.g., "HomeLoginPlayScoresAbout").
- Verified Simon is serving a Vite/React build (hashed assets).
- Applied a minimal CSS override in production to add spacing/padding for `.site-nav a`:
  - File: ~/services/simon/public/assets/index-CNHYs4t-.css
  - Patch:
    - `.site-nav { display:flex; flex-wrap:wrap; gap:.6rem; align-items:center; }`
    - `.site-nav a { padding:.25rem .45rem; }`
- Verified the patch is live by fetching the deployed CSS and confirming the appended rules appear.

## 2026-02-26 - React P2 final verification (pre-submission)
- Verified git state clean before changes and commits were made incrementally today.
- Startup React build succeeds (`npm run build`) and the `dist/` output deploys to `~/services/startup/public`.
- Startup production routes respond with HTTP 200:
  - `/`, `/play`, `/scores`, `/about`
- Verified live site serves the current hashed Vite bundle and assets (DecisionHelper.png).
- Simon prerequisite verified live at https://simon.tnich-startup.click (React/Vite hashed assets).

### Curl receipts (2026-02-26)
- startup /:  200
- startup /play:  200
- startup /scores:  200
- startup /about:  200
- simon /:  200

### Startup production bundle check (2026-02-26)
- JS bundle:  /assets/index-y-VksJCk.js
- CSS bundle: /assets/index-D-Cvkrpb.css

Feb 26 2026: React P2 patch for TA feedback — removed Home hero image and updated Play to criteria + weight + scoring grid (option×criterion) with weighted totals; deployed bundle index-TgAf31x1.js.

2026-02-26 23:49 UTC: React P2 TA patch — added criteria+weight scoring grid w/ weighted totals; removed Home/About images per TA feedback; deployed /assets/index-De-VE57_.js /assets/index-D-Cvkrpb.css

## 2026-03-11 - Service deliverable work (Decision Helper)
- Added a real Express backend in `react/service/index.js`
- Added auth endpoints for create account, login, logout, and restricted session lookup
- Added password hashing with `bcryptjs`
- Updated Vite local dev proxy so frontend `/api` requests route to the service on port 4000
- Built React output into `react/service/public` so Express serves the frontend bundle
- Verified local auth flow with curl:
  - create account returned auth cookie
  - restricted `/api/auth/me` returned logged-in user
  - logout cleared access and protected route returned 401
- Replaced the old mock third-party idea with a more product-aligned service feature:
  - new endpoint: `POST /api/suggestions`
  - backend calls Datamuse
  - frontend uses the returned suggestions to seed criteria and options in the Decision Builder
- Updated About page to demo the live suggestion flow instead of the old quote concept
- Reminder for submission: deploy startup service to production, verify live routes, and push all commits before turning in

## DB deliverable work
- Created a MongoDB Atlas cluster for the Startup DB deliverable.
- Added `react/service/dbConfig.json` on the server and kept it out of Git with `.gitignore`.
- Added the MongoDB Node driver to the Startup backend service.
- Created `react/service/database.js` to connect to MongoDB Atlas and expose helpers for users and saved decisions.
- Replaced in-memory auth and decision storage with MongoDB-backed collections.
- Stored hashed credentials in MongoDB using `bcryptjs`.
- Stored and retrieved saved decision history from MongoDB.
- Verified the backend locally with create account, auth session lookup, save decision, and load decision history.
- Rebuilt the frontend bundle and redeployed the Startup app with MongoDB-backed history messaging.
- Verified the production Startup service was live and responding at `/api/test`.

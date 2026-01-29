# Startup Project Notes (CS 260)

## Startup HTML (what I did)

### Goal
Get my Startup HTML deployed and make sure the official Simon HTML example app is deployed to the simon subdomain (this was required as a prerequisite).

### What I changed in my Startup HTML
- Updated `index.html` and `scores.html` in my startup to add:
  - A basic login form placeholder (front-end only)
  - A username display placeholder after “login”
  - A WebSocket placeholder section for later deliverables

### Simon deployment (fix for TA comment)
The TA specifically wanted the actual `simon-html` example deployed, not a custom Simon page.

I deployed the official Simon HTML using the provided `deployFiles.sh` script from the `simon-html` repo.

Commands used (Git Bash):
- `git clone https://github.com/webprogramming260/simon-html.git`
- `cd simon-html`
- `chmod +x deployFiles.sh`
- `./deployFiles.sh -k "/c/Users/tyler/OneDrive/Desktop/startup-key.pem" -h tnich-startup.click -s simon`

Verified Simon is live at:
- https://simon.tnich-startup.click

### Production URLs
- Startup: https://tnich-startup.click
- Simon: https://simon.tnich-startup.click

### What I learned
- “Deployed” means the production subdomain must serve the correct files, not just that I edited something locally.
- The deploy script clears the old simon deployment, copies up the files, and ensures Caddy hosts them under the simon subdomain.

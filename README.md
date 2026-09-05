# OBK Portfolio Dashboard - Landing Page

Marketing landing page for the OBK Portfolio Dashboard, a real estate portfolio analytics platform for Jefferson County investments.

## Overview

This is a static marketing site that serves as the public entry point for the OBK Portfolio Dashboard. It provides information about the platform and directs authorized investors to the login page.

## Current status — September 5, 2026

- The application files remain the initial static landing page: HTML, CSS, and small scroll interactions. All three dashboard links still use `https://app.yourdomain.com`.
- The existing Google Sites portal is a separate template. Its screenshot tables are placeholders for actual database-backed tables, as confirmed by the project owner; they are not authoritative financial data or the intended final rendering.
- A full-site, unpublished export copy was created in the work account's My Drive, in `Obelisk Site Export 2026-09-05`. The original site remains in its Shared Drive. The copy has a distinct document ID.
- The full Takeout ZIP has **not** been requested or downloaded. The local source-assets ZIP contains eight illustrations and the `.gsite` pointer, not a complete website export. No Google Sites pages have been imported into this repository.
- The next design proposal is in [docs/design-direction.md](docs/design-direction.md). It is a discussion draft, not an implemented or approved redesign.

This GitHub repository is public. Keep raw exports, investor details, private documents, screenshots containing private data, and database extracts outside it. The current Pages workflow uploads the repository root; `.gitignore` is not an access-control mechanism.

## Structure

```
obk-landing/
├── index.html              # Main landing page
├── assets/
│   ├── css/
│   │   └── style.css       # Styles
│   └── js/
│       └── main.js         # Minimal interactions
├── docs/
│   └── design-direction.md # Proposed website and investor-portal direction
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
└── README.md
```

## Deployment

This site is automatically deployed to GitHub Pages on push to `main`.

**Live URL:** (Configure in repository settings)

## Related Projects

- **[obk-cockpit](https://github.com/xiaosongz/obk-cockpit)** - Main portfolio application (FastAPI + React); source of existing application design tokens and financial read models

## Development

1. Clone the repository
2. Open `index.html` in a browser
3. Edit files and refresh

No build process required - pure HTML/CSS/JS.

## Configuration

Update the following in `index.html`:
- Login button URLs (`https://app.yourdomain.com`)
- Domain-specific content

## License

Private - For authorized use only.

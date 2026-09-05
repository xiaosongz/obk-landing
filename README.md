# OBK Portfolio Dashboard - Landing Page

Obelisk website and investor portal prototype, alongside the original marketing landing page.

## Overview

The new website lives in `prototype/`: React + TypeScript + Vite, Ant Design components, and React Router. It preserves the partner’s homepage, portfolio showcase, investor entry/home, fund portfolio, and property reporting structure. The Google Site supplies content and reporting intent only; its markup, layout system, and technology are not the foundation for the new application.

## Current status — September 5, 2026

- The root `index.html` remains the initial static marketing page, with placeholder dashboard links. The new React prototype is a separate application in `prototype/`.
- The corrected prototype includes all six top-level source pages, the full 37-photo portfolio showcase, the original six-step illustrated business process, every investor account-field group, the five fund stages, and full property-report pages. Investor capital amounts are illustrative; property financial fields remain unfilled. There is no authentication or database integration yet.
- The existing Google Sites portal is a separate template. Its screenshot tables are placeholders for actual database-backed tables, as confirmed by the project owner; they are not authoritative financial data or the intended final rendering.
- A full-site, unpublished export copy was created in the work account's My Drive, in `Obelisk Site Export 2026-09-05`. The original site remains in its Shared Drive. The copy has a distinct document ID.
- The full Takeout ZIP has **not** been requested or downloaded. Seven reference pages and their assets were subsequently saved through Chrome outside the repository. Curated text and imagery are used in the React app; raw Google Sites pages and private investor details are excluded. The earlier source-assets ZIP remains a partial package, not a complete website archive.
- [docs/design-direction.md](docs/design-direction.md) records the corrected page coverage, design direction, and production boundaries. The complete source-aligned prototype is ready for local design review.

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
├── prototype/              # React investor portal; see its README for development
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
└── README.md
```

## Deployment

The original static site is automatically deployed to GitHub Pages on push to `main`. The existing workflow does not build the React prototype. No production deployment configuration has been changed.

**Live URL:** (Configure in repository settings)

## Related Projects

- **[obk-cockpit](https://github.com/xiaosongz/obk-cockpit)** - Main portfolio application (FastAPI + React); source of existing application design tokens and financial read models

## Development

For the investor prototype:

```sh
cd prototype
npm ci
npm run dev
```

Open [the local prototype](http://127.0.0.1:8766/). See [prototype/README.md](prototype/README.md) for its structure, review flow, and production boundaries. To view the original static landing page, open the root `index.html` directly.

## Configuration

Update the following in `index.html`:
- Login button URLs (`https://app.yourdomain.com`)
- Domain-specific content

## License

Private - For authorized use only.

# Obelisk website UI kit

Click-through recreation of the `feat/design-polish` prototype (`obk-landing/prototype/src`), retinted to the three-color system. Six routes via hash: `#/`, `#/portfolio`, `#/investor-login`, `#/investor-home`, `#/fund-iii-portfolio`, `#/property-performance` (+ `/:id`).

- `PublicScreens.jsx` — HomeScreen, PortfolioScreen, LoginScreen (PublicPages.tsx)
- `InvestorScreens.jsx` — InvestorHomeScreen, FundScreen (InvestorHome.tsx, FundPortfolio.tsx)
- `PropertyScreens.jsx` — PropertyDirectoryScreen, PropertyDetailScreen (PropertyPages.tsx)
- `data.js` — 8 of the 37 homes (real addresses/photos from `property-mapping.json`); **all money, dates, statuses and coordinates are placeholders** (not snapshot data) — the kit no longer labels them as such, per owner request.

Everything composes `components/`; no primitive is re-implemented here. Desktop layout only (the prototype's ≤1150/850/600px breakpoints are documented in readme.md but not reproduced).

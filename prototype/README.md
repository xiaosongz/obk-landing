# Obelisk website prototype

The partner’s Google Site is the source for page structure, content, photography, and illustrations. This application implements that experience with React, TypeScript, Vite, Ant Design, and React Router. It imports no Google Sites markup, JavaScript, or layout machinery.

## Local review

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:8766/](http://127.0.0.1:8766/). The server binds only to loopback. Port 8765 was occupied by a separate local service, so this revision uses 8766.

- `npm run build`: TypeScript check and production build into `dist/`.
- `npm run preview`: serve the build on the same port after stopping development.
- `npm run format`: apply consistent Prettier formatting.

## Source structure preserved

| Page | Route | Included content |
|---|---|---|
| Home | `#/` | Affordable-housing platform introduction, Acquire/Improve/Operate strategy, eight source photographs, portfolio/investor links, featured-video slot, original disclosure |
| Portfolio | `#/portfolio` | Original portfolio introduction and all 37 showcase photographs, with a working image viewer |
| Investor Login | `#/investor-login` | Investor entry page and an explicitly labeled demo entry; no credential collection |
| Investor Home | `#/investor-home` | Investor-relations contact, both fund links, all subscription/capital/preferred-return/promote field groups, legal-document placeholder, original process overview and six illustrated process sections |
| Fund III Portfolio | `#/fund-iii-portfolio` | All six summary measures, Buy/Rehab/Rent/Refinance/Repeat stages, searchable acquisition directory, stabilized and stabilizing reporting layouts, manager-note areas |
| Property Performance | `#/property-performance` | Source current/sold property gallery and routes to property details |
| Property detail | `#/property-performance/2-4401-avenue-i` | Source property photo, performance-at-a-glance fields, asset overview, lease, T-12 and cumulative financial layouts, calculation rules, original map |

The full business-process copy is retained in expandable reading sections. Illustrations can be opened at full size. The first property’s detailed-page photograph takes precedence over the directory’s generic placeholder photograph.

## Content and data boundaries

- Curated business copy and images are in `src/reference-content.ts` and `public/images/`. Seven reference pages were saved through the authenticated browser outside this public repository; they include six top-level pages and the one linked property-detail template. This is not a complete Takeout archive.
- The portfolio showcase has 37 photographs. The separate property-performance directory has 36 current-image entries and one sold-image entry. These are source-page counts, not verified fund metrics.
- Only four current entries have source addresses. Other captions remain generic and do not imply database IDs. Operating stage, lease, financial values, and reporting dates are not inferred from photographs.
- The investor account uses a fictional identity and illustrative capital amounts. Preferred-return/promote values and property financial cells remain unfilled. No personal investor record, tenant record, legal agreement, or screenshot financial table is imported.
- The source login page was blank. The featured-video slot and subscription-agreement link had no supplied content. These omissions are labeled rather than filled with invented material.
- Production must use authenticated server-side investor/fund authorization and the existing cockpit’s approved financial read models. Source narrative definitions need reconciliation with those models before displaying calculated results.

## Maintenance

`App.tsx` owns navigation and page routes. `PublicPages.tsx`, `InvestorHome.tsx`, `FundPortfolio.tsx`, and `PropertyPages.tsx` own their respective page content. `site-data.ts` contains typed source-directory metadata and the explicitly fictional account fixture. Shared theme and responsive layout live in `main.tsx` and `styles.css`.

The old generic dashboard and unrelated distribution chart have been removed. The root repository’s original static page and Pages workflow remain separate; the workflow does not build this prototype. No changes have been pushed or deployed.

Validation: TypeScript and production build pass. Browser checks covered all six navigation destinations, the 37-image viewer, expanded process copy, fund-directory search, property-report sections, and the loaded map. The final homepage reload reported no new browser errors. All 46 deduplicated image files and source-content coverage checks passed. Mobile styles are implemented but have not been independently browser-tested.

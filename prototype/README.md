# Obelisk investor portal prototype

The Google Site is a nontechnical content reference. This application uses React, TypeScript, Vite, Ant Design, React Router, and ECharts. It does not import Google Sites markup or use screenshots as tables.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:8765/. The development server binds to loopback only. `npm run build` type-checks and produces `dist/`; `npm run preview` serves that build on the same port after stopping the development server. `npm run format` applies consistent source formatting with Prettier.

## Review

- Overview: switch between Q1 and Q2, inspect the capital summary and distribution chart, and open a quarterly update.
- Fund portfolio: search, sort, filter stages, open a property's detail drawer, or export the sample CSV. Export includes the entire selected-period sample dataset, regardless of table filters.
- Documents: open sample reading views and the definitions guide.
- Use the prototype control at the bottom to see the unavailable-data state and retry. Maple House demonstrates missing NOI; missing does not mean zero.

All properties, amounts, statuses, and commentary are fictional. The fixture periods demonstrate presentation changes, not an actual performance history. NOI is a partial subtotal covering seven of eight properties. Income distributions exclude returned capital. The sample remaining-capital calculation is not a valuation.

## Source

- `src/App.tsx`: routes and page composition using Ant Design tables, menus, controls, drawers, and modals.
- `src/data.ts`: typed synthetic fixtures, formatting, and sample CSV export.
- `src/DistributionChart.tsx`: ECharts lifecycle and distribution chart.
- `src/main.tsx` and `src/styles.css`: shared theme and responsive layout.

## Production boundary

The UI is ready for design review, not production investor access. Next, map the approved fields to the existing cockpit FastAPI/read models, add server-enforced investor and fund authorization, and replace the fixtures with a typed API data layer. Financial calculations and document entitlements must remain authoritative on the server. Verify investor capital-account coverage before promising integration.

There is no backend, login, persistent storage, or real investor document in this prototype. The existing root GitHub Pages workflow does not build this application; deployment must be chosen deliberately after review. Google Sites export completeness is separate from the new application's technical architecture.

Validation: TypeScript and the production build pass; the local Vite route responds. Chrome was launched at the local URL. Automated browser interaction and visual testing have not been performed.

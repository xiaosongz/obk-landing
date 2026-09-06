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
- Only four current entries have source addresses. Other captions explicitly say “Unlabeled property” and do not imply database IDs. Operating stage, lease, financial values, and reporting dates are not inferred from photographs.
- The investor account uses a fictional identity and illustrative capital amounts. Preferred-return/promote values and property financial cells remain unfilled. No personal investor record, tenant record, legal agreement, or screenshot financial table is imported.
- The source login page was blank. The featured-video slot and subscription-agreement link had no supplied content. These omissions are labeled rather than filled with invented material.
- Production must use authenticated server-side investor/fund authorization and the existing cockpit’s approved financial read models. Source narrative definitions need reconciliation with those models before displaying calculated results.

## Maintenance

`App.tsx` owns navigation and page routes. `PublicPages.tsx`, `InvestorHome.tsx`, `FundPortfolio.tsx`, and `PropertyPages.tsx` own their respective page content. `site-data.ts` contains typed source-directory metadata and the explicitly fictional account fixture. Shared theme and responsive layout live in `main.tsx` and `styles.css`.

The old generic dashboard and unrelated distribution chart have been removed. The root repository’s original static page and Pages workflow remain separate; the workflow does not build this prototype. The prototype is maintained on `feat/investor-portal-prototype`; the root deployment remains separate.

Validation: TypeScript and production build pass. Browser checks covered all six navigation destinations, the 37-image viewer, expanded process copy, fund-directory search, property-report sections, and the loaded map. The final homepage reload reported no new browser errors. All 46 deduplicated image files and source-content coverage checks passed. Mobile styles are implemented but have not been independently browser-tested.

## Canonical property/photo mapping

Edit `src/property-mapping.json`: one explicit row per source-directory property,
shared by the public Portfolio, Fund III Portfolio, and property-detail routes.
`photo` is the local image path; `address` and `location` are confirmed source
captions or `null`. Keep `id` stable so existing report links continue to work.
`status` preserves the source template's `current`/`sold` grouping, not live
ownership. Do not derive status, fund membership, or an address from image order.
`cockpitAddress` is reserved for an owner-confirmed exact database address match;
leave it `null` until verified. It never supplies a photo address by itself.

Four existing captions are retained; 33 properties remain explicitly unlabeled.
The first property's confirmed detailed-page photo is now used in both tabs.
The source arrays were not actually identical: the public gallery also used
`portfolio-03.png` and `portfolio-37.png`, while the rendered property directory
used `home-03.png` and `property-detail-01.png`. Those two displaced public assets
remain on disk with no assigned address; the owner must verify their relationship
before adding them to the canonical mapping. No visual similarity is treated as
an address match. There are no longer separately maintained portfolio photo arrays.

## Fund III: private read-only export

The LP prototype never calls the GP cockpit API or uses a GP session. A small
Node exporter runs `psql` through an explicitly configured **dedicated read-only
libpq service**, filters by `funds.fund_name = 'Fund III'`, validates an exact LP
field allowlist, and atomically writes a mode-0600 JSON snapshot **outside this
repository**. No snapshot, credential, or connection setting is bundled by the
production build. The Vite dev/preview server exposes the validated file at
`/lp-data/fund-iii.json` only to loopback requests with a local Host and matching
Origin, with `Cache-Control: no-store`. The browser uses this route without
credentials or redirects. Missing files, malformed reports, and HTML fallbacks
are never treated as financial reports.

### Owner setup — remains for the owner to fill in

Requires Node 22.18+ (native TypeScript stripping) and `psql` on PATH. Configure a
private libpq service outside repositories for `memini.lan:5433`, database `obk`,
using a dedicated LP reader and the normal private libpq password file. Role
provisioning remains an owner/DBA step: grant CONNECT, schema USAGE, and SELECT on
only the columns below. Column-level grants suffice. Do not use a GP/developer
account. The role must have no write privileges, superuser, role/database creation,
replication, or RLS bypass. The exporter checks role attributes and write privileges
on the two source tables. All queries run in one repeatable-read, read-only
transaction with timeouts, no psqlrc, no password prompts, and a final rollback.
Failures preserve the previous snapshot and do not print database error details.

After configuring a private service named `obk_lp` and creating a private output
directory, run from `prototype/`. The output path below is a placeholder:

```sh
export PGSERVICE=obk_lp
export OBK_LP_DATA_FILE=/absolute/private/directory/fund-iii.json
npm run export:fund-iii
npm run dev
# Or run npm run build, then npm run preview with the same OBK_LP_DATA_FILE.
```

The exporter refuses destinations inside this repository. Never place actual
reports in `src/`, `public/`, or another public repo. Refresh the export for each
reporting update. The UI displays export time separately from the summary's as-of
date; export time does not establish freshness of the underlying database records.

### Exact acquisition columns

Traced against the adjacent cockpit's `pipeline/sql/001_create_schema.sql` and
portfolio read service. No real records were copied from that checkout.
`scripts/fund-iii.sql` selects only:

| Source | Purpose / JSON field |
|---|---|
| `funds.fund_id`, `funds.fund_name` | Join and exact Fund III filter; require one matching fund |
| `properties.fund_id` | Actual fund membership join |
| `properties.property_id` | `propertyId`; row key, never a photo ID |
| `properties.address` | `address` |
| `properties.status` | `status`, displayed verbatim |
| `properties.purchase_date` | `purchaseDate`, ISO date |
| `properties.purchase_price` | `purchasePrice`; Acquisition cost means purchase price, excluding separate closing costs |
| `properties.total_renovation_cost` | `renovationCost` |
| `properties.total_capitalization` | `totalCapitalization`; Total cost, never an inferred sum |

The query follows cockpit exclusions `property_id < 9001` and status distinct
from `Acquisition Terminated`. Sold properties remain acquisition history; this
is not a definition of the denominator for current-home metrics. A fund with no
properties gives an empty directory; a missing fund fails export. No investor,
tenant, lease, transaction, bank, or GP-only fields are selected. Amounts are USD;
SQL null stays null and zero stays zero. Extra JSON fields fail validation.

### Six summary measures — explicit source stub

**No approved source for all six summary measures was present in the referenced
schema/service. No live LP credentials were configured or used.** The cockpit's
`occupancy` is `collection_rate` (rent collected / potential rent), not physical
occupied-home occupancy. It is not relabeled here. Photo counts, `Rented` status,
cap-rate thresholds, and stabilized-home counts are not substituted for the
requested metrics.

The exporter supports an optional owner-provided view,
`public.lp_fund_iii_summary`. **This is a new contract, not an existing cockpit
view; this change does not create it.** The owner must supply approved database
source queries, period, current-home denominator, and classification rules. Grant
the reader SELECT on its five columns:

| Column | Required contract |
|---|---|
| `fund_name` | Exact `Fund III` |
| `as_of_date` | DATE; same non-null reporting date on all six rows |
| `metric` | One unique key below; exactly six rows for Fund III |
| `state` | `reported`, `missing`, or `not_reported` |
| `value` | Numeric; non-null only for `reported`; zero is valid |

| Metric key | Meaning / units |
|---|---|
| `capital_recycling_rate` | Recycled capital / initial equity × 100; percentage points, may exceed 100 |
| `occupied_homes` | Physically occupied-home count; integer |
| `occupancy` | Occupied homes / approved total homes × 100; 0–100 |
| `stabilized_homes` | Count under owner-approved stabilization rules; integer |
| `stabilization_rate` | Stabilized homes / approved total homes × 100; 0–100 |
| `refinance_pipeline` | Appraised homes ready for long-term debt; integer |

An absent view gives all six `not_reported` states with null values and summary
date. Once the view is supplied, all six values flow into the UI. `missing` means
an expected source value is absent; `not_reported` means no report yet supplies
the measure. Undefined ratios, including zero denominators, should be `missing`,
not fabricated 0%. Partial/duplicate/mismatched-period reports fail export. The
live export and these approved sources remain **for the owner to fill in**.

### Photo matching and production handoff

After verifying a photo's identity, fill its `cockpitAddress` in
`src/property-mapping.json` with the exact database address and ensure `address`
is confirmed. All join keys currently remain null. Matching must be exact and
unique; no fuzzy/address-normalization or row-order match is used. Matched rows
use the same photo and caption as the public Portfolio. Unmatched database rows
keep their real address and say “Photo unconfirmed.” Without an export, the source
photo directory remains explicitly labeled as unverified Fund III membership.

Production hosting/authentication is not added by this task. Before serving real
financial data beyond local review, the owner must provide a dedicated
LP-authorized same-origin endpoint with this JSON contract and fund authorization,
and adapt the currently credential-free client to that LP session. Never put the
snapshot on a public static deployment. The demo login is not authorization;
the local Vite file route is not part of the production build.

`npm run test:fund-data` verifies synthetic value states, rejected/extra fields,
exact photo matching, exporter subprocess behavior and atomic preservation, and
the actual local HTTP route (success, absent/invalid report, cross-origin denial).
`npm run build` checks TypeScript and builds production assets. Tests use no real
DB connection or real records and are not bundled. The remaining stage and
property-detail financial templates are outside these two tasks.

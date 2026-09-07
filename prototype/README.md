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
| Home | `#/` | Affordable-housing platform introduction, Acquire/Improve/Operate strategy, eight canonically mapped property photographs, portfolio/investor links, original disclosure |
| Portfolio | `#/portfolio` | Original portfolio introduction and all 37 showcase photographs, with a working image viewer |
| Investor Login | `#/investor-login` | Investor entry page and an explicitly labeled demo entry; no credential collection |
| Investor Home | `#/investor-home` | Investor-relations contact, both fund links, provided subscription/capital/preferred-return/promote rows, legal-document placeholder, six native process overview cards and six illustrated process sections |
| Fund III Portfolio | `#/fund-iii-portfolio` | Sourced fund snapshot and TTM window, Buy/Rehab/Rent/Refinance/Repeat stages, searchable acquisition directory, stabilized and stabilizing reporting layouts, manager-note areas |
| Property Performance | `#/property-performance` | Source current/sold property gallery and routes to property details |
| Property detail | `#/property-performance/4401-avenue-i` | Source property photo, performance-at-a-glance fields, asset overview, lease, T-12 and cumulative financial layouts, calculation rules, original map |

The full business-process copy is retained in expandable reading sections. Illustrations can be opened at full size. The first property’s detailed-page photograph takes precedence over the directory’s generic placeholder photograph.

## Content and data boundaries

- Curated business copy and process illustrations are in `src/reference-content.ts` and `public/images/`. Property photographs are in `public/images/properties/`, one per home, converted to 1600px JPEG from the owner's address-named photo library (shared drive `OBK Portal/Property Photos`). `src/property-mapping.json` links each photograph to its database record by address and property ID.
- Funds I and II merged into Fund III; every current home is Fund III. The database's per-property fund column is the historical acquisition vehicle and is not shown to investors. One photo file (named 328 Valley Crest) was matched by street name to the database address 329 Valley Crest Drive; the owner should confirm which number is correct.
- The investor account uses a fictional identity and illustrative capital amounts. Preferred-return/promote values and property financial cells remain unfilled. No personal investor record, tenant record, legal agreement, or screenshot financial table is imported.
- The source login page was blank. The unsupplied featured-video slot is removed. The subscription-agreement link remains explicitly labeled as unsupplied.
- Production must use authenticated server-side investor/fund authorization and the website’s own snapshot database, populated from approved cockpit financial read models by a GP-side job. Source narrative definitions need reconciliation with those models before displaying calculated results.

## Maintenance

`App.tsx` owns navigation and page routes. `PublicPages.tsx`, `InvestorHome.tsx`, `FundPortfolio.tsx`, and `PropertyPages.tsx` own their respective page content. `site-data.ts` contains typed source-directory metadata and the explicitly fictional account fixture. Shared theme and responsive layout live in `main.tsx` and `styles.css`.

The old generic dashboard and unrelated distribution chart have been removed. The root repository’s original static page and Pages workflow remain separate; the workflow does not build this prototype. The prototype is maintained on `feat/investor-portal-prototype`; the root deployment remains separate.

Validation: TypeScript and production build pass. Browser checks covered all six navigation destinations, the 37-image viewer, expanded process copy, fund-directory search, property-report sections, and the loaded map. The final homepage reload reported no new browser errors. All 46 deduplicated image files and source-content coverage checks passed. Mobile styles are implemented but have not been independently browser-tested.

## Design polish review (2026-09-06)

Task 5 sections A–D are implemented. The process overview descriptions and taglines
are transcribed verbatim from `public/images/business-process.png`; the raster and
all original detailed process text remain on disk. Home gallery photos and captions
now come together from the first eight entries in `portfolioProperties`.

Build and worker typecheck pass; all 12 fund-data tests pass, including the grouped
fund summary and empty/partially provided investor-account rendering. The data tests
use synthetic fixtures and a stubbed `psql`; no database connection is needed.

Visual acceptance remains **pending**: the requested Chrome headless launch aborted
with exit 134 / SIGABRT in macOS `_RegisterApplication` before loading a page. The
browser connector also reported Chrome unavailable. Preview served HTTP 200, but
no screenshots or measured document widths were obtained. Run the following from
`prototype/` once Chrome can launch (no database or environment-file loading):

```sh
npm run preview
# In a second terminal:
mkdir -p .wrangler/tmp-shots
for width in 1440 390; do
  for page in home portfolio fund-iii-portfolio investor-home; do
    route="$page"
    if [ "$page" = home ]; then route=""; fi
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --headless=new --disable-gpu --hide-scrollbars \
      --virtual-time-budget=6000 --window-size="$width,2400" \
      --screenshot="$PWD/.wrangler/tmp-shots/$page-$width.png" \
      "http://127.0.0.1:8766/#/$route"
  done
 done
```

Manual acceptance checklist for the PR (screenshots stay gitignored):

- [ ] Capture all four routes at 1440×2400 and 390×2400, then inspect sections below
  the screenshot fold too.
- [ ] At 390px, confirm `window.innerWidth` and
  `document.documentElement.scrollWidth` are both 390 on every route. Repeat with
  the menu open and “About these figures” expanded; record actual widths.
- [ ] Nav toggles and closes after navigation; keyboard links work; Escape from the
  menu returns focus to its toggle. Intro text and footnotes wrap without clipping.
- [ ] Phone metric groups are one column and BRRRR stages stack. Acquisition and
  performance tables scroll inside their containers without widening the page.
- [ ] Desktop metric rows contain 4/3/3 tiles; reported values are navy, pending
  states grey. Dates appear once and definitions open from the closed panel.
- [ ] Home/Portfolio captions match their shared photo records; cards use 4:3 crops;
  current status labels and the featured-video placeholder are absent.
- [ ] Investor Home shows six native overview cards with the source wording, no
  overview raster, and one sentence for the empty preferred-return/promote groups.

The sandbox makes `.git` read-only, so changes are left uncommitted. Owner handoff:
complete the visual checklist, commit sections A/B/C/D separately with messages
ending in `Claude-Session: https://claude.ai/code/session_01VD7qUYJqtrzS7ANe1L7bUT`,
and push `feat/design-polish`. The existing 328 vs 329 Valley Crest confirmation
remains with the owner; the mapping is unchanged.

## Canonical property/photo mapping

`src/property-mapping.json` has one row per home, shared by the public Portfolio,
Fund III Portfolio, and property-detail routes. `photo` is the local image path
under `public/images/properties/`; `address` and `location` are display values
derived from the database address; `propertyId` and `cockpitAddress` are the
exact database record the photograph belongs to, and the Fund III table joins on
`cockpitAddress`. Keep `id` stable so report links continue to work. `status` is
`current` for every home today; the database records no sales. When a home is
added, add its photograph to the shared-drive library, convert it, and add a row.

Four existing captions are retained; 33 properties remain explicitly unlabeled.
The first property's confirmed detailed-page photo is now used in both tabs.
The source arrays were not actually identical: the public gallery also used
`portfolio-03.png` and `portfolio-37.png`, while the rendered property directory
used `home-03.png` and `property-detail-01.png`. Those two displaced public assets
remain on disk with no assigned address; the owner must verify their relationship
before adding them to the canonical mapping. No visual similarity is treated as
an address match. There are no longer separately maintained portfolio photo arrays.

## Preview deployment (Cloudflare)

`landing.obelisk-gp.com` is served by a Cloudflare Worker (`wrangler.jsonc`,
`worker/gate.ts`) that delivers `dist/` as static assets behind a shared-password
gate. Every request, including data files, gets the password page until the
correct password sets a signed HttpOnly cookie (30 days). The password and the
cookie-signing key are Worker secrets, never committed. Changing the password
signs everyone out. Responses carry `X-Robots-Tag: noindex`.

```sh
npx wrangler login                     # once per machine
npx wrangler secret put SITE_PASSWORD  # once; paste when prompted
npx wrangler secret put GATE_SECRET    # once; any long random string
npm run deploy                         # build, typecheck the worker, deploy
```

`npx wrangler dev --port 8790` runs the gate locally with values from the
gitignored `.dev.vars`. Deployment ships whatever is in `public/lp-data/` at
build time, so run the snapshot load and publish steps first when the data should be current.

## Snapshot database

**The website never connects to the cockpit database.** A GP-side load job reads
only the allowlisted cockpit columns below and copies a validated v2 snapshot
into the separate `obk_lp` database. The publisher connects only to `obk_lp` and
rebuilds the website JSON from normalized tables. The browser and preview worker
serve the published file; neither has database credentials or a GP session.
Investor-account tables are deferred. No raw JSON payload, investor identities,
tenants, transactions, or credentials are stored in these tables or committed.

| `obk_lp` table / view | Columns and purpose |
|---|---|
| `public.fund_snapshots` | `snapshot_id` (bigserial PK), `fund_name`, `exported_at`, `summary_as_of`, `source_label`, `loaded_at` (defaults to now); v2 header and load metadata |
| `public.fund_snapshot_metrics` | `snapshot_id` (FK), `metric`, `state`, `value_number`, `value_date`; PK `(snapshot_id, metric)`; exactly the 10 numeric and 3 date v2 measures |
| `public.fund_snapshot_properties` | `snapshot_id` (FK), `property_id`, `address`, `status`, `purchase_date`, `purchase_price`, `renovation_cost`, `total_capitalization`, `cost_from_merger_model`; PK `(snapshot_id, property_id)` |
| `public.fund_snapshot_latest` (view) | Newest `exported_at` per fund, breaking ties by descending `snapshot_id`; loading an older export does not replace a newer one |

`public.load_fund_snapshot(payload jsonb) RETURNS bigint` validates exact v2 keys
at every level, reporting states, types, dates, amounts, counts and TTM windows,
then inserts the header, metrics and properties atomically. A rejection rolls
back all rows for that load. It returns the new `snapshot_id`. The function uses
invoker privileges and is not executable by PUBLIC; the database owner can run
it. `source_label` is fixed load metadata, not an extra payload field. The
publisher reconstructs `schemaVersion: 2` and does not expose load metadata.
Applying the DDL again preserves existing rows and replaces the view/function.

### Owner setup and two-step run

Requires Node 22.18+ (native TypeScript stripping) and `psql` on PATH. Run from
`prototype/`. The private `.env.lp-snapshot` file contains **target** settings only.
The scripts do not open env files; source them into the owner's shell without
printing them. Do not enable shell tracing. Vite env-file loading is disabled,
so builds and local route tests do not read `.env*` files.

```sh
# One-time schema apply: owner action, target is obk_lp.
set -a
. ./.env.lp-snapshot
set +a
psql -X -w -v ON_ERROR_STOP=1 -f scripts/lp-snapshot-schema.sql

# Step 1: GP-side load. Configure/export OBK_COCKPIT_PGSERVICE for an existing
# read-only cockpit service, OR the five OBK_COCKPIT_PG* settings listed below
# from a separate private source. Keep the target PG* settings above in place.
npm run snapshot:load

# Step 2: publish only from obk_lp. Can run separately with just target PG*.
mkdir -p public/lp-data
export OBK_LP_DATA_FILE="$PWD/public/lp-data/fund-iii.json"
npm run snapshot:publish
npm run build
# After reviewing the snapshot, redeploy through the existing preview gate:
# npm run deploy
```

### Exact script environment inputs

| Script | Environment variables |
|---|---|
| `lp-snapshot-load.mjs` — cockpit source | `OBK_COCKPIT_PGHOST`, `OBK_COCKPIT_PGPORT`, `OBK_COCKPIT_PGUSER`, `OBK_COCKPIT_PGDATABASE`, `OBK_COCKPIT_PGPASSWORD`, or `OBK_COCKPIT_PGSERVICE`; `OBK_LP_ALLOW_ADMIN_ROLE` bypasses only the source role gate when exactly `1`, with a warning |
| `lp-snapshot-load.mjs` — snapshot target | `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, or `PGSERVICE` |
| `lp-snapshot-publish.mjs` | Target `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, or `PGSERVICE`; required `OBK_LP_DATA_FILE`. No cockpit settings or admin override are used |
| `lp-snapshot-lib.mjs` | Shared helpers read the same six connection variables (source-prefixed when requested); other helpers receive their inputs as arguments |
| `lp-snapshot-schema.sql`, `fund-iii.sql` | No environment variables read by the SQL itself; `psql` uses the supplied connection environment |

For each connection, require a service or explicit host, user and database;
port/password are optional according to libpq authentication. The source's six
variables are mapped onto its child's `PG*`; target settings never fill missing
source settings. Only those six libpq variables are forwarded: inherited
`PGOPTIONS`, `PGSERVICEFILE`, `PGPASSFILE`, SSL variables and other `PG*` settings
are not passed through. Use a default libpq service file for additional connection
options and a default password file or the password variable for authentication.
Non-connection process environment (including `PATH` and `HOME`, which locate
`psql` and default libpq files) is inherited; `OBK_COCKPIT_*` is stripped from both
children. Each child gets `PGCONNECT_TIMEOUT=5` and a controlled `PGOPTIONS`:
`-c default_transaction_read_only=on` for reads, `off` for the target load.
No connection settings or database error details are logged.

Cockpit reads retain the existing role gate: no superuser, role/database creation,
replication, RLS bypass, or table/column writes on the five source tables. The
existing `obk_reader` kind of role needs CONNECT, USAGE on `public` and
`obk_merger`, and SELECT on the columns below. The source-only admin override is
for local demos. Publishing refuses superusers even with the override set, and
permits the `obk_lp` owner with INSERT/UPDATE/DELETE privileges. Both reads use a
repeatable-read READ ONLY transaction, 15-second statement timeout, UTC/ISO dates,
and a final rollback. All psql calls ignore psqlrc, refuse password prompts, and
have a 30-second process timeout. The target load uses a separate write transaction
and a random dollar-quote tag checked against the validated payload.

Publishing accepts an existing parent directory outside the repository, or the
exact gitignored `public/lp-data/` directory (resolved through symlinks). It writes
a mode-0600 temporary file and atomically renames it only after v2 validation;
failures preserve the previous file. Snapshots are never committed. Builds include
the file only when the owner publishes it into `public/lp-data/`.

For local dev/preview, `OBK_LP_DATA_FILE` takes precedence over that demo file.
`/lp-data/fund-iii.json` serves validated JSON only to loopback requests with a
local Host and matching Origin, with `Cache-Control: no-store`. The browser uses
this route without credentials or redirects. Missing files, malformed reports,
and HTML fallbacks are never treated as financial reports.

### Summary measures

Task 3 replaces the optional `public.lp_fund_iii_summary` view with a SQL rollup
of the same active property set used for the acquisition directory. The query
keeps `property_id < 9001` and status distinct from `Acquisition Terminated`,
regardless of historical `fund_id`. It does not add a sold-status exclusion.
Costs come from `obk_merger.property_capitalization`, with the requested
column-wise `COALESCE` to legacy property costs/date; a property with no merger
row has `costFromMergerModel: false` and displays “cost basis pending.” Acquisition
cost means **purchase price including closing costs** for merger-model rows.

| Summary field | SQL source / definition |
|---|---|
| `homes` | Count of active properties |
| `occupiedHomes` | Count with `status = 'Rented'` |
| `occupancy` | `100 × occupiedHomes / homes`; physical status occupancy, not collection rate |
| `totalAcquisitionCost` | Sum of `COALESCE(c.purchase_price, p.purchase_price)` |
| `totalRenovationCost` | Sum of `COALESCE(c.renovation_cost, p.total_renovation_cost)` |
| `totalCapitalization` | Sum of `COALESCE(c.total_cost, p.total_capitalization)` |
| `ttmRentCollected` | Sum of `m.rent_egi_collected` (EGI) |
| `ttmNoi` | Sum of `m.noi` |
| `ttmNoiYield` | `100 × sum(m.noi) / totalCapitalization`, including the same cost fallback |
| `ttmCollectionRate` | `100 × sum(m.collection_rate × m.potential_rent) / sum(m.potential_rent)` (rent collected recovered per home, since `rent_collected` is not a column in every merger schema revision); can exceed 100% when arrears are collected |
| `ttmPeriodStart`, `ttmPeriodEnd` | Common window from the joined metrics rows' `period_start` / `period_end` |
| `costAsOf` | Latest merger run's `as_of_date`, ordered by `run_id DESC` |

`m` is LEFT JOINed on `property_id` with `period_label = 'trailing_12_mo'` in
the join condition, so homes without TTM data remain in the directory and cost
and home-count totals. SQL sums use available non-null inputs, matching the
cockpit rollup; a home without TTM data contributes no operating amount, rather
than an invented zero. All-null sums and zero-denominator ratios are `missing`.
Differing TTM windows withhold the TTM measures and dates as `missing` instead of
combining periods. Occupancy is rounded to one decimal point; yield and collection
rate to two. The UI displays percentages to one decimal and USD to whole dollars.

The caption shows the TTM window and cost as-of date. `summaryAsOf` uses the latest
merger run's `as_of_date`, falling back to `max(period_end)`; it is never the export
date. Recorded property statuses are read at export time. Capital recycling rate,
stabilized homes, stabilization rate, and refinance pipeline have no approved
source and appear together in one source-note sentence, outside the summary grid.
No per-property operating fields are exported.

### Exact acquisition columns

Read-only source review: the adjacent cockpit's `pipeline/merger_model/schema.py`,
`apps/cockpit_api/app/sql/read_models.py` (`LATEST_KPIS`), and
`apps/cockpit_api/app/features/portfolio/service.py`. No database was queried for
task 3. These are **every application column read** by `scripts/fund-iii.sql`,
including joins, filters, and ordering:

| Schema / table | Column | Purpose / JSON field |
|---|---|---|
| `public.funds` | `fund_name` | Require exactly one `Fund III` row; internal `fundCount` is not exported |
| `public.properties` | `property_id` | Active filter, joins, ordering, `propertyId` |
| `public.properties` | `address` | `address`, directory ordering |
| `public.properties` | `status` | Active filter, occupied count, `status` |
| `public.properties` | `purchase_date` | Legacy fallback for `purchaseDate` |
| `public.properties` | `purchase_price` | Legacy fallback for `purchasePrice` and acquisition total |
| `public.properties` | `total_renovation_cost` | Legacy fallback for `renovationCost` and renovation total |
| `public.properties` | `total_capitalization` | Legacy fallback for `totalCapitalization` and fund capitalization / yield denominator |
| `obk_merger.property_capitalization` | `property_id` | Join; presence determines `costFromMergerModel` |
| `obk_merger.property_capitalization` | `purchase_date` | Primary `purchaseDate` |
| `obk_merger.property_capitalization` | `purchase_price` | Primary `purchasePrice` and acquisition total; includes closing costs |
| `obk_merger.property_capitalization` | `renovation_cost` | Primary `renovationCost` and renovation total |
| `obk_merger.property_capitalization` | `total_cost` | Primary `totalCapitalization`, fund capitalization / yield denominator |
| `obk_merger.property_period_metrics` | `property_id` | Join to the same active property set |
| `obk_merger.property_period_metrics` | `period_label` | Exact `trailing_12_mo` filter |
| `obk_merger.property_period_metrics` | `period_start` | `ttmPeriodStart`, consistent-window check |
| `obk_merger.property_period_metrics` | `period_end` | `ttmPeriodEnd`, consistent-window check, fallback `summaryAsOf` |
| `obk_merger.property_period_metrics` | `rent_egi_collected` | `ttmRentCollected` numerator / sum |
| `obk_merger.property_period_metrics` | `collection_rate` | `ttmCollectionRate` numerator |
| `obk_merger.property_period_metrics` | `potential_rent` | `ttmCollectionRate` denominator |
| `obk_merger.property_period_metrics` | `noi` | `ttmNoi` sum and `ttmNoiYield` numerator |
| `obk_merger.merger_run_log` | `run_id` | Select latest run; not exported |
| `obk_merger.merger_run_log` | `as_of_date` | `costAsOf`, primary `summaryAsOf` |

The loader's source role check also reads `pg_catalog.pg_roles` columns
`rolname`, `rolsuper`, `rolcreatedb`, `rolcreaterole`, `rolreplication`, and
`rolbypassrls`, and checks table/column write privileges on all five application
tables with `has_table_privilege` and `has_any_column_privilege`. These role
attributes never enter the snapshot. Neither `fund_id`, `computed_at`, nor stored
`noi_yield` is read: fund ratios are calculated from sums (the per-home
`collection_rate` is only used to recover rent collected). No investor, tenant, lease, transaction, bank, or GP-only fields are
selected; no `SELECT *` is used. The database name comes solely from the owner's
source connection (`OBK_COCKPIT_PGDATABASE` or `OBK_COCKPIT_PGSERVICE`), never a hard-coded database name.

### Snapshot schema v2

- Top level: `schemaVersion` (literal `2`), `fundName` (literal `Fund III`),
  `exportedAt` (UTC timestamp), `summaryAsOf` (ISO date or null), `properties`, `summary`.
- Each `properties` row: `propertyId`, `address`, `status`, `purchaseDate`,
  `purchasePrice`, `renovationCost`, `totalCapitalization`, `costFromMergerModel`.
  Status, date, and amounts may be null; cost source is a required boolean.
- `summary`: `homes`, `occupiedHomes`, `occupancy`, `totalAcquisitionCost`,
  `totalRenovationCost`, `totalCapitalization`, `ttmRentCollected`, `ttmNoi`,
  `ttmNoiYield`, `ttmCollectionRate`, `ttmPeriodStart`, `ttmPeriodEnd`, `costAsOf`.
  Every field is `{state, value}`: `reported` carries a finite nonnegative number
  (ISO date for the three date fields), while `missing` and `not_reported` carry
  null. Zero remains a reported value. Home counts are integers; occupancy is
  capped at 100 and collection rate at 200, in percentage points. Reported TTM
  measures require an ordered date window; reported summaries require `summaryAsOf`.

Unknown or missing fields fail closed at every report level. Version-1 snapshots
are rejected: the owner must regenerate the private snapshot with
`npm run snapshot:load` and `npm run snapshot:publish`, then rebuild and redeploy
(`npm run deploy`) through the existing password-gated preview. Do not commit the
snapshot, credentials, or investor data. Task 4 validation uses synthetic records,
DDL text inspection and a fake `psql` executable only; no database was connected.
Schema application, live load/publish and deployment remain owner actions.

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
exact photo matching, loader/publisher subprocess behavior and atomic preservation, and
the actual local HTTP route (success, absent/invalid report, cross-origin denial).
It also covers schema v2, a synthetic PID 38 fallback, >100% collection rates,
TTM dates, connection isolation, source-only role override, publisher superuser
rejection, dollar-quote guard, DDL/parser allowlist parity, and rendering the sourced summary grid and fallback hint.
`npm run build` checks TypeScript and builds production assets. Tests use no real
DB connection or real records and are not bundled. The remaining stage and
property-detail financial templates are outside task 3. `npm run check:worker`
typechecks the existing preview gate.

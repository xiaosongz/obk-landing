# Codex tasks — investor site

Owner instructions recorded 2026-09-06. Implement in `prototype/`.

**Status 2026-09-06:** tasks 1 and 2 implemented on `feat/investor-portal-prototype`
(commits `1559304`, `54137f6`, `ba4867a`). The Fund III tab is driven by a read-only
export of the cockpit database; see `prototype/README.md`. All 38 photographs are
matched to database records. Funds I and II merged into Fund III, so the export covers
every current home. Task 3 (below) is implemented: the export reads the cockpit's
merger-model cost basis and emits a sourced fund-level snapshot (schema v2). Task 4 (below) is implemented: the website reads only the `obk_lp` snapshot
database (`npm run snapshot:load`, then `npm run snapshot:publish`). Task 5 (below) is implemented on branch `feat/design-polish` (phone layout verified
with DevTools mobile emulation: document width 390px on all routes).
**Resolved 2026-09-07:** the address is 329 Valley Crest Drive; the photo file name
"328 Valley Crest.png" is a typo. Confirmed against the August 2024 property-manager
owner statement and the cockpit database records (address, aliases, bank review sheet,
manager notes), all of which say 329. Evidence is held outside this repository.

## 1. Portfolio tab and Fund III Portfolio tab: consistent photos and addresses

Problem stated by the owner:

- The Portfolio tab (`src/PublicPages.tsx`, `PortfolioPage`) shows sample photographs
  with no addresses.
- The Fund III Portfolio tab (`src/FundPortfolio.tsx`) partly duplicates it. It does
  show property addresses, but the Portfolio tab does not. That inconsistency is not
  acceptable.

Code facts:

- Both tabs draw from the same 37 image files. `reference.photos.portfolio` and
  `reference.photos["property-performance"]` in `src/reference-content.ts` are the same
  set in a different order.
- Only four entries carry an address, hard-coded in the `captions` array in
  `src/site-data.ts`. The other 33 fall back to generic "Portfolio home NN" names.
- The cockpit database has no photo column, so photo-to-address matching cannot come
  from the database. It has to be an explicit mapping table maintained in this repo.

Required outcome:

- One canonical property list, each entry holding photo file, address, and any status,
  used by both the Portfolio tab and the Fund III Portfolio tab. Stop maintaining two
  separately ordered photo arrays.
- Wherever a photo has a matching address, show that address consistently in both tabs.
- Do not invent addresses. Entries without a confirmed match stay clearly unlabeled
  until the owner supplies the mapping. Make the mapping file easy for the owner to fill.

## 2. Fund III Portfolio data from the cockpit database

The owner confirmed the Fund III Portfolio tab's data can be obtained from the cockpit
database (`obk-cockpit` repo, Postgres on `memini.lan:5433`, database `obk`).

Code facts in the cockpit:

- `apps/cockpit_api/app/features/portfolio/service.py` (`_PORTFOLIO_SQL`) already selects
  per-property `address`, `status`, `fund_id`, `fund_name`, `capitalization`, `occupancy`,
  and TTM figures, grouped by fund.
- `properties` columns of interest (pipeline `sql/001_create_schema.sql`): `address`,
  `fund_id`, `status`, `purchase_date`, `purchase_price`, `total_renovation_cost`,
  `total_capitalization`.
- Funds are rows in `funds` (`fund_id`, `fund_name`). Filter to Fund III by name.
- The cockpit API itself is GP-only and session-gated; the LP site must not call it
  with a GP session.

Required outcome:

- Replace the placeholder "pending" cells in the Fund III acquisition directory and the
  six fund summary measures with values sourced from the cockpit database.
- Use a read-only path and expose only LP-appropriate fields. Prefer a dedicated
  read-only database role or a small export step over reusing GP endpoints. Document the
  chosen mechanism and the exact columns in `prototype/README.md`.
- Keep zero, missing, and not-yet-reported values distinct in the UI.

## 3. Real cost basis and fund snapshot from the merger model

Owner request 2026-09-06: the Fund III Portfolio tab must show the acquisition and
renovation costs the cockpit has already calculated, plus a fund-level snapshot with
real figures, instead of "Report pending" / "Not yet reported" cells.

### Facts verified against the cockpit database (read-only, 2026-09-06)

- `public.properties.purchase_price / total_renovation_cost / total_capitalization` are
  the retired Excel-derived columns. They are NULL for property IDs 33–37 and are not
  the cockpit's source of truth any more. Do not read them, except as a fallback for
  a property with no merger row (today only PID 38, 4401 Avenue I, purchased 2026-06-22).
- The computed cost basis is `obk_merger.property_capitalization` (schema in the cockpit
  repo `pipeline/merger_model/schema.py`, computed by `pipeline/merger_model/compute.py`
  from reviewed bank and owner transactions). Columns: `property_id`, `purchase_price`
  (acquisition wire **plus closing costs** from the bank rail), `renovation_cost`,
  `total_cost` (generated = purchase + renovation), `purchase_date`, `computed_at`.
  37 rows, one per property 1–37, all populated. The cockpit's own portfolio page uses
  `total_cost` as "capitalization" (`apps/cockpit_api/app/sql/read_models.py`,
  `LATEST_KPIS`).
- Fund-level operating figures: `obk_merger.property_period_metrics` with
  `period_label = 'trailing_12_mo'` (one row per property): `period_start`,
  `period_end` (currently 2025-07-01 → 2026-06-30), `rent_egi_collected`,
  `rent_collected`, `potential_rent`, `collection_rate`, `noi`, `noi_yield`.
  The cockpit's fund rollup (`features/portfolio/service.py`, `get_portfolio`) sums
  capitalization, EGI, NOI across the fund's properties and computes occupancy as
  `sum(rent_collected) / sum(potential_rent)`.
- `obk_merger.merger_run_log` records the run's `as_of_date` (`as_of_date` column,
  latest row) — use it, or `max(period_end)`, as the snapshot as-of date.
- `collection_rate` can exceed 1.0 for a period (arrears caught up), so a fund-level
  collection rate above 100% is legitimate; the parser must not reject it.
- Both `obk_test` and `obk` hold the same 37 capitalization rows. The exporter is
  pointed at a database through `PGDATABASE`; nothing in the code should name either.

### Required outcome

1. `prototype/scripts/fund-iii.sql`: per-property rows become
   `properties p LEFT JOIN obk_merger.property_capitalization c USING (property_id)`,
   keeping the existing active filter. Emit
   `purchasePrice = COALESCE(c.purchase_price, p.purchase_price)`,
   `renovationCost = COALESCE(c.renovation_cost, p.total_renovation_cost)`,
   `totalCapitalization = COALESCE(c.total_cost, p.total_capitalization)`,
   `purchaseDate = COALESCE(c.purchase_date, p.purchase_date)`, and a boolean
   `costFromMergerModel` (true when `c.property_id IS NOT NULL`) so the UI can mark
   the one fallback row. Still no `SELECT *`, no tenants, investors, transactions.
2. Add a fund-level block to the snapshot, all computed in SQL over the same active
   property set (LEFT JOIN the `trailing_12_mo` metrics row):
   `homes` (count), `occupiedHomes` (status = 'Rented'), `occupancy` (%),
   `totalAcquisitionCost`, `totalRenovationCost`, `totalCapitalization` (sums of the
   merger columns, with the same COALESCE fallback), `ttmRentCollected`
   (sum `rent_egi_collected`), `ttmNoi` (sum `noi`), `ttmNoiYield`
   (`sum(noi) / sum(total_cost)`, %), `ttmCollectionRate`
   (`sum(rent_collected) / sum(potential_rent)`, %), `ttmPeriodStart`, `ttmPeriodEnd`,
   `costAsOf` (merger run `as_of_date`). Each value keeps the existing
   `{state, value}` reporting shape so zero, missing and not-reported stay distinct.
3. Bump `schemaVersion` to 2 in `src/fund-data.ts`; extend `parseFundSnapshot` and
   the allowlists (`exactKeys`) for the new fields; percentage checks: occupancy ≤ 100,
   collection rate ≤ 200; money ≥ 0. Update `tests/fund-data.test.mjs` fixtures and
   add cases for the fallback row and the >100% collection rate. Keep the
   fail-closed behaviour (unknown fields rejected).
4. UI (`src/FundPortfolio.tsx`, `src/site-data.ts`): the summary grid shows the sourced
   measures above (label "Acquisition cost" as "purchase price including closing
   costs"; show the TTM window and cost as-of date in the caption). Move the four
   measures that still have no approved source (capital recycling rate, stabilized
   homes, stabilization rate, refinance pipeline) out of the grid into one source
   note sentence, so the demo does not show a wall of "Not yet reported". Per-property
   columns stay as they are (no per-home operating figures for LPs); mark the fallback
   row (PID 38) with a small "cost basis pending" hint instead of "Report pending".
5. `README.md`: update the "Summary measures" and "Exact acquisition columns" sections
   to the new sources (table of every column read, in both schemas). Note that the
   exporter now needs SELECT on schema `obk_merger` for the LP reader role.
6. Do not run the exporter against a database, and do not commit any JSON snapshot.
   The owner runs `npm run export:fund-iii` and redeploys. `npm run build`,
   `npm run test:fund-data` and `npm run check:worker` must pass.

## 4. Snapshot database for the website (`obk_lp`)

Owner decision 2026-09-06: the website must read from its own minimal snapshot
database that holds only the information the site needs, never from the cockpit
database. A GP-side job copies the allowlisted data into it; the site (and later the
per-investor dashboards) read only the snapshot database. Nothing should wait on a
cockpit read-only role for the website.

### Infrastructure already in place (do not touch, do not connect)

- Postgres database `obk_lp` exists on the same server as the cockpit, empty, owned by
  login role `obk_lp`, which cannot connect to `obk`, `obk_test`, `obk_app` or
  `obk_pipeline`. The owner keeps its connection settings in the gitignored file
  `prototype/.env.lp-snapshot` (standard `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`,
  `PGPASSWORD`). Never read that file, never print it, never commit anything like it.
- The cockpit already has a read-only role `obk_reader` with SELECT on `public` and
  `obk_merger` (cockpit `deploy/DEPLOYMENT.md`). The load job runs with that kind of
  role; the existing role gate in the exporter already accepts it.

### Required outcome

1. `scripts/lp-snapshot-schema.sql` — idempotent DDL for `obk_lp` (run by the owner with
   `psql -f`): tables `fund_snapshots` (`snapshot_id bigserial`, `fund_name`,
   `exported_at timestamptz`, `summary_as_of date`, `source_label text`,
   `loaded_at timestamptz default now()`), `fund_snapshot_metrics` (`snapshot_id`,
   `metric text`, `state text check in (reported, missing, not_reported)`,
   `value_number numeric`, `value_date date`, PK (snapshot_id, metric)), and
   `fund_snapshot_properties` (`snapshot_id`, `property_id`, `address`, `status`,
   `purchase_date`, `purchase_price`, `renovation_cost`, `total_capitalization`,
   `cost_from_merger_model boolean`, PK (snapshot_id, property_id)). Add a view
   `fund_snapshot_latest` (the newest snapshot per fund) and a plpgsql function
   `load_fund_snapshot(payload jsonb) RETURNS bigint` that checks the payload has
   exactly the v2 keys and inserts one snapshot atomically. Put a comment block at
   the top stating the allowlist and that investor-account tables come later.
   Column set must equal the v2 snapshot schema in `src/fund-data.ts`, nothing more.
2. Split `scripts/export-fund-iii.mjs` into:
   - `scripts/lp-snapshot-lib.mjs` — shared helpers (psql runner with the existing
     read-only transaction + role gate, `makeSnapshot`, the atomic file writer,
     destination rules).
   - `scripts/lp-snapshot-load.mjs` — reads the cockpit through `scripts/fund-iii.sql`
     exactly as today (source connection from `OBK_COCKPIT_PGHOST`, `OBK_COCKPIT_PGPORT`,
     `OBK_COCKPIT_PGUSER`, `OBK_COCKPIT_PGDATABASE`, `OBK_COCKPIT_PGPASSWORD`, mapped
     onto the psql child's `PG*` environment; or `OBK_COCKPIT_PGSERVICE`), validates
     it with `parseFundSnapshot`, then inserts it into the snapshot database
     (target connection = the process's own `PG*` variables) with
     `SELECT load_fund_snapshot($<tag>$ ... $<tag>$::jsonb)` using a random dollar-quote
     tag that is asserted absent from the payload. Prints the new `snapshot_id`.
     Keep `OBK_LP_ALLOW_ADMIN_ROLE` for the source connection only, with its warning.
   - `scripts/lp-snapshot-publish.mjs` — connects to the snapshot database only (`PG*`),
     rebuilds the v2 JSON from the tables with SQL `json_build_object` (tables are the
     truth; do not store or reuse the raw payload), validates it with
     `parseFundSnapshot`, and writes `OBK_LP_DATA_FILE` with the existing atomic
     write and path rules. Also gate this connection: refuse superusers and any role
     with INSERT/UPDATE/DELETE on the three tables is fine here (the owner role writes),
     but require a READ ONLY transaction.
   Package scripts: `snapshot:load`, `snapshot:publish`; drop `export:fund-iii`.
3. Tests (`tests/fund-data.test.mjs`): move the `makeSnapshot` import to the lib; keep
   the destination-rule and route tests against the publish script; add a unit test
   that the dollar-tag guard rejects a payload containing the tag; add a test that the
   schema SQL and `fund-data.ts` name the same property and metric fields (parse the
   DDL text, no database). Keep the fail-closed behaviour.
4. `README.md`: replace the export instructions with a "Snapshot database" section:
   one-time schema apply, the two-step run (load with cockpit read-only credentials,
   publish with `.env.lp-snapshot`), and a table of the `obk_lp` tables. State plainly
   that the website never connects to the cockpit database.
5. Do not connect to any database. `npm run build`, `npm run test:fund-data` and
   `npm run check:worker` must pass.

## 5. Design polish from the 2026-09-06 review

Findings from rendering the built site at 1440px and 390px wide. Keep the existing
typography, palette (navy ink, tan accent, off-white ground) and page structure; these
are corrections, not a redesign. No content invention: addresses come only from
`src/property-mapping.json`; do not add copy that states facts about the business.

### A. Phone layout overflows (bug, do first)

At 390px the header nav, the page intro sentence, the fund metric grid, the BRRRR stage
strip and the footnotes run past the right edge and the body scrolls sideways. Required:
below 600px the nav collapses to a compact menu (Ant Design `Drawer` or a simple
toggle), the metric grid is one column, the stage strip stacks, long text wraps, and
tables scroll inside their own `overflow-x: auto` container. Add a test that the
built CSS contains no fixed pixel width wider than 390px on those containers, or at
least a manual checklist in the PR message. Verify with Chrome headless at
`--window-size=390,2400` (see `README.md` for the preview command).

### B. Fund III Portfolio page (`src/FundPortfolio.tsx`, `src/styles.css`)

1. Headline figures currently render in light grey `IBM Plex Mono`, the same look as
   "Not yet reported". Set reported values in the navy ink colour, in the body typeface
   with `font-variant-numeric: tabular-nums`, weight 500, about 2rem. Keep grey only for
   `missing` / `not_reported` states. Monospace stays only in the dark investor hero.
2. Replace the single 10-tile grid with three labelled groups, each its own row:
   "Portfolio" (homes, occupied homes, occupancy, TTM collection rate),
   "Cost basis" (acquisition, renovation, total capitalization), "Trailing twelve
   months" (rent collected, NOI, NOI yield). Four, three, three tiles; equal widths
   within a row.
3. State the dates once in the section header line, e.g. "Cost basis as of
   2026-06-30 · TTM 2025-07-01 to 2026-06-30", and remove the per-tile "Snapshot as of"
   captions and the per-tile info icons. Keep each tile's short caption only where it
   adds meaning (acquisition cost: "including closing costs"; collection rate: "can
   exceed 100% when arrears are collected").
4. Move the metric definitions and the three footnote paragraphs into one Ant Design
   `Collapse` panel titled "About these figures", closed by default. Leave one visible
   line: "Source: portfolio snapshot, exported {date}." The sentence about the four
   unsourced measures goes inside the panel.

### C. Home and Portfolio pages (`src/PublicPages.tsx`, `src/site-data.ts`)

5. Home page grid captions read "Obelisk Residential 01" through 08. Use the same
   caption as the Portfolio page: street on the first line, "City, AL zip" on the
   second, from the shared `portfolioProperties` list.
6. Portfolio cards show "Current" on every card. Show a status label only when the
   status is not "current" (e.g. Sold). Keep the layout height stable.
7. The "Featured video" section is a grey "coming soon" box. Remove the section
   entirely (and its nav anchor if any). Do not replace it with new copy.
8. Crop all card photos to a fixed 4:3 frame with `object-fit: cover` so the grid is
   uniform; no photo edits on disk.

### D. Investor Home (`src/InvestorHome.tsx` or wherever the section lives)

9. The "Obelisk business process" section embeds a raster image of the partner's
   template with its own fonts and a duplicate "Section II" heading. Rebuild the six
   steps as native cards in site typography (number, title, two-line description,
   short tagline already present in the source content), using the existing step text
   verbatim. Remove the raster image from the section (leave the file in place).
10. In the capital account block, hide rows whose value is "Not provided" and collapse
    the "Preferred return" and "Promote" panels to a single line "Preferred return and
    promote figures are not yet provided" when all their rows are empty.

### E. Not in scope

- Leave the "Design preview" banner and the "illustrative" wording; the owner removes
  them before an investor showing. Leave the investor relations email as is.
- No photo re-shoots, no changes to the snapshot scripts or data schema.

### Process for this task

- Work on branch `feat/design-polish` (already created from `f213aa9` and pushed).
- `npm run build`, `npm run test:fund-data`, `npm run check:worker` must pass.
- Render `/`, `/portfolio`, `/fund-iii-portfolio`, `/investor-home` at 1440 and 390
  wide with Chrome headless and describe what changed in each.

## Process

- Commit and push the current stage before starting.
- Keep commits small and push after each task.
- `npm run build` must pass before each push.
- No investor identities, raw exports, or credentials in this public repository.

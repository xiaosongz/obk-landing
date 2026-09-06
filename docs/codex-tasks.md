# Codex tasks — investor site

Owner instructions recorded 2026-09-06. Implement in `prototype/`.

**Status 2026-09-06:** tasks 1 and 2 implemented on `feat/investor-portal-prototype`
(commits `1559304`, `54137f6`, `ba4867a`). The Fund III tab is driven by a read-only
export of the cockpit database; see `prototype/README.md`. All 38 photographs are
matched to database records. Funds I and II merged into Fund III, so the export covers
every current home. **Task 3 (below) is open:** switch the export to the cockpit's
computed cost basis and add a sourced fund-level snapshot. Open owner inputs: confirm
328 vs 329 Valley Crest, a dedicated LP reader role.

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

## Process

- Commit and push the current stage before starting.
- Keep commits small and push after each task.
- `npm run build` must pass before each push.
- No investor identities, raw exports, or credentials in this public repository.

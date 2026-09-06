# Codex tasks — investor site

Owner instructions recorded 2026-09-06. Implement in `prototype/`.

**Status 2026-09-06:** both tasks implemented on `feat/investor-portal-prototype`
(commits `1559304`, `54137f6`, and the demo-readiness follow-up). The Fund III tab
is driven by a read-only export of the cockpit database; see `prototype/README.md`.
Open owner inputs: photo-to-address matches for 33 photographs, a dedicated LP
reader role, and an approved source for the four non-derivable summary measures.

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

## Process

- Commit and push the current stage before starting.
- Keep commits small and push after each task.
- `npm run build` must pass before each push.
- No investor identities, raw exports, or credentials in this public repository.

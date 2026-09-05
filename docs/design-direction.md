# Obelisk website — source-aligned prototype

Updated September 5, 2026.

The first React preview narrowed the partner’s site to a reporting dashboard. The owner rejected that scope: the homepage, portfolio showcase, investor-home information, and illustrations were essential. This revision supersedes the earlier proposal to move the business-process content away from Investor Home.

## Design contract

Keep the partner’s information architecture and content intent. Improve presentation, navigation, accessibility, and maintainability using modern components. Google Sites is a content reference only; none of its implementation constrains the new application.

The local prototype uses React + TypeScript + Vite, Ant Design, and React Router. The original site remains untouched. No database integration or production deployment is included.

## Page coverage

| Reference page | Prototype treatment |
|---|---|
| Home | Firm introduction, affordable-housing positioning, Acquire/Improve/Operate strategy, eight original photographs, portfolio and investor entry links, featured-video slot, source disclosure |
| Portfolio | Original introduction and the entire 37-photo gallery with image preview |
| Investor Login | Investor entry page with an explicit demo action; source had no working login content |
| Investor Home | Welcome/contact, Fund III Portfolio and Properties links, all account-field groups, original process overview, all six process illustrations and full written explanations |
| Fund III Portfolio | Capital recycling, occupied homes, occupancy, stabilized homes, stabilization rate, refinance pipeline; Buy, Rehab, Rent & Stabilization, Refinance, Repeat & Scale sections |
| Property Performance | Current and sold galleries, supplied addresses, working detail routes |
| 4401 Avenue I detail | Performance summary, asset overview, lease, T-12 and cumulative financial sections, reporting definitions, original location map |

The source process remains on Investor Home. Each step shows its illustration and opening explanation, with the rest of the original text available through a standard expandable section. This preserves content while making the long page easier to scan.

## Visual direction

Warm white, navy, ink, thin rules, and restrained gold accents. Archivo for interface/prose and IBM Plex Mono for financial values. Large property photographs and a clear reading hierarchy distinguish the public pages from investor reporting. Responsive grids collapse on smaller screens; tables retain a contained horizontal viewport.

Use the supplied photographs and original business-process illustrations. Do not replace them with generic stock imagery or recreate screenshot tables. Correct the source’s placeholder image association when a property’s detailed page supplies a specific photograph.

## Reporting boundaries

The source’s screenshots describe the desired tables, not authoritative financial data. The prototype includes their reporting sections and fields while leaving financial cells unfilled. The investor capital account uses clearly labeled fictional amounts and a demo identity.

- Do not invent reporting dates, property economics, tenant records, ownership status, or missing preferred-return/promote values.
- Source gallery counts are not fund-size, occupancy, or stabilization metrics.
- Keep zero, missing, and incomplete data distinct. A missing financial report must not appear as zero performance.
- Reconcile cap-rate denominators, stabilization rules, cash-flow definitions, and reporting periods against the cockpit’s canonical read models before calculating anything.
- Investor/fund entitlements and documents require server-side authorization. The demo entry is not authentication.
- No private source capture, investor identity, or financial-table screenshot belongs in this public repository.

## Evidence and remaining inputs

Seven reference pages and their loaded assets were saved locally through the authenticated Chrome session: the six top-level pages and the linked property-detail template. Curated prose, 37 showcase photographs, and seven original process figures are now represented in the app. Duplicate images are stored once. Raw browser captures remain outside Git.

The source supplied four current-property addresses; other gallery entries lack captions. The login page, video slot, subscription-agreement destination, reporting dates, and most property fields remain placeholders. These gaps are visible in the prototype and must be completed from approved sources.

This is a page-by-page browser capture, not a full Google Takeout export. Do not claim archive completeness or retire the source site on this basis.

Next: review this full-site structure and visual treatment, then map approved fields to existing API/read models and verify one authorized investor/fund/property path. Public publication scope and deployment configuration remain separate decisions.

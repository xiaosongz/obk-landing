# Obelisk website — proposed design direction

Date: September 5, 2026

Status: Investor-portal prototype implemented for local review in `prototype/`. Database integration and production deployment remain pending.

## What we are designing

An Obelisk investment-firm website with a coherent investor experience. The public pages should explain the strategy, operating approach, and team. The authenticated portal should help an investor understand their capital, the fund's performance, and the properties behind it.

The owner confirmed that the Google Site is a nontechnical partner's content template and its tables are screenshots standing in for database-backed tables. Preserve its ideas and reporting intent only. Do not carry forward Google Sites technology or structure, transcribe screenshot figures, infer formulas from images, or treat the screenshots as the eventual UI.

The prototype uses React + TypeScript + Vite, Ant Design for standard interface components, React Router for navigation, and ECharts for charts. This replaces the initial hand-written HTML/JavaScript prototype approach. Typed fictional fixtures are separate from page composition so the reviewed UI can later consume the existing authenticated API and canonical financial read models.

The page observations below come from the Investor Home published page and Fund III Portfolio editor inspected during this session. A full page/assets export is still pending, so this is not a complete site audit. See the [current status](../README.md#current-status--september-5-2026).

## Recommended visual direction

Use a restrained investment-report style with editorial spacing and real property photography. The strongest existing reference is our own cockpit, whose current `apps/cockpit_web/src/styles/tokens.css` already defines warm paper, ink, navy, Archivo, and IBM Plex Mono.

Carry those colors and type families across the website. Adapt the density for investors and public visitors; do not simply copy the internal application's small type and dense controls.

| Element | Proposed treatment | Purpose |
|---|---|---|
| Palette | Warm white `#FAF9F6`, ink `#16181D`, navy `#1E3A5F`; thin neutral rules | Consistency with the existing cockpit and clear hierarchy |
| Type | Archivo for navigation and prose; IBM Plex Mono/tabular numerals for financial values | Readable content and easy numeric comparison |
| Scale | Approximately 44–56px public headline, 28–36px portal title, 16–18px prose, 14–16px investor tables | Give the investor experience more space than an operations grid |
| Layout | Left-aligned sections, consistent grid, 1120–1280px reading surface; wider tables where needed | A clear reading order without oversized empty sections |
| Components | Flat surfaces, restrained 2–4px corners, thin dividers; one clear primary action per section | Keep attention on content and next steps |
| Imagery | Actual portfolio photography with consistent cropping and useful captions | Show the assets and operating work behind the strategy |
| Status | Color plus a text label; neutral treatment for unknown or unavailable data | Distinguish performance, lifecycle, and data quality |
| Motion | Short hover/focus transitions; respect reduced-motion preferences | Preserve clarity and responsiveness |

Avoid making every paragraph a card. Use typography, whitespace, and rules to organize most content. The current business-process illustrations can remain reference material; a compact, consistent process diagram would better fit the proposed site.

## Page structure

Use two navigation contexts with shared branding:

| Context | Navigation | Main job |
|---|---|---|
| Public website | Strategy · Portfolio · About · Contact · Investor sign-in | Establish what Obelisk does and provide a clear route to the investor portal |
| Investor portal | Overview · Fund portfolio · Properties · Documents | Explain the investor's position and allow progressively deeper review |

These are proposed sections, not claims that all source pages or supporting data already exist. Public portfolio content requires an explicitly selected public subset. Investor-scoped financial views and documents need server-side authorization; the public static site should link to the authenticated application.

### Public home

Lead with the business: affordable single-family housing and the operating approach. Use a concise headline, a short explanation, and one real property image. Follow with strategy, selected property stories, a short process overview, and team/contact information. Show scale or performance figures only when their source, period, and publication scope have been established.

The current repo's copy leads with generic dashboard capabilities. The proposed public page should explain why the investment approach is credible, while the portal demonstrates the reporting capabilities.

### Investor overview

Order the page around the investor's questions:

1. **Where do I stand?** Fund and reporting-period context, then capital contributed, capital returned, remaining invested capital, and distributions. Confirm precise definitions and data availability before finalizing these labels.
2. **What changed?** A short dated manager update and material changes since the prior report, where comparable periods exist.
3. **How is the fund operating?** A compact operating summary with occupancy, stabilization, and the refinancing pipeline, linked to the fund portfolio.
4. **Where can I go deeper?** A visible latest report/document area and a concise investor-relations contact.

Move the long six-step business-process explanation to Strategy. Keep a short contextual link on the overview so recurring visits prioritize the investor's current position.

### Fund portfolio

Start with the reporting period and a focused set of operating measures. Replace the long sequence of screenshot tables with a single property table and lifecycle filters. Keep the BRRRR process as a useful summary, while allowing the underlying status model to distinguish acquisition, renovation, leasing, stabilization, and refinancing when the database supports it.

Do not assume those stages are mutually exclusive or derive stabilization from a new browser-side threshold. Use the approved business definitions and surface any missing status mapping.

Suggested default columns: property, operating status, total cost, T-12 NOI, defined cap-rate measure, and latest update. Confirm that each field exists and what denominator/period it uses. Put secondary columns in property detail rather than squeezing every possible field onto the first screen.

### Property detail

Use a property image and concise facts, followed by operating status, capital invested, performance trend, a readable monthly financial table, and a short manager note. Keep a breadcrumb back to the selected fund and preserve the reporting period when navigating.

## Replacing the screenshot tables

The screenshots are a starting point for information requirements. Replace them with semantic, selectable tables using the existing financial application as the data source.

- Use consistent currency, percentage, date, and negative-value formatting. Right-align financial values and give totals a clear visual boundary.
- Keep property identifiers stable; allow sorting and only the filters needed for the screen. Default to a readable table rather than recreating spreadsheet screenshots pixel for pixel.
- Show the reporting period and last successful data update separately. Avoid the phrase "real-time" unless the refresh behavior supports it.
- Distinguish zero, unknown, unavailable, and incomplete-period values. A failed refresh must not leave old figures looking current.
- Keep denominator and accounting definitions available beside unfamiliar measures. Do not relabel an existing yield as a different kind of cap rate or combine investor distributions with property operating returns.
- Provide keyboard access, visible focus, proper table headers, and readable contrast. On mobile, keep the key identifier visible in a contained horizontal table viewport, with a clear route to full details.
- Put downloads behind the same investor/fund authorization as the on-screen data. The first preview can use a small, explicitly synthetic fixture.

The adjacent cockpit's current `docs/ARCHITECTURE.md` identifies FastAPI + React and canonical financial read models. Reuse applicable presentation components and server-side metrics there. Investor capital-account fields and investor-specific entitlements have not been verified; database availability must be checked before promising those integrations. Do not introduce a second financial-calculation pipeline in this landing-page repository.

## Current prototype and next step

The local prototype provides an investor overview, linked fund table, property detail, and sample document library using clearly labeled synthetic data. It applies the proposed palette/type and revised content order using Ant Design table and dialog components. Review this experience before a site-wide rebuild or backend work.

Review evidence should be visible in the browser:

- The reporting period, capital summary, manager update, and next destination are easy to find without reading the strategy essay.
- The fund-table view has one working filter, sort behavior, and a route to a sample property detail or a clearly marked unavailable action.
- A narrow mobile viewport remains readable, and key controls work with a keyboard.
- A missing-value row and an unavailable-data state are understandable; no screenshot figures are presented as live data.

After that review, map the chosen table fields to existing API/read models and verify one authorized fund view against its source. Complete the full Google Sites export before asserting migration completeness or retiring the original site.

## References and limits

- Existing OBK implementation: `obk-cockpit/apps/cockpit_web/src/styles/tokens.css` and `obk-cockpit/docs/ARCHITECTURE.md`, inspected September 5, 2026. The historical June mockups provide design context; the current implementation takes precedence.
- [BREIT](https://www.breit.com/): its public navigation separates strategy, portfolio, resources, and investor login; performance figures carry a reporting date. These are useful information-architecture references, not a proposed copy of its branding, claims, or investment products.
- [Google whole-site copy instructions](https://support.google.com/sites/answer/98081?hl=en) and [U-M Google Sites HTML export instructions](https://teamdynamix.umich.edu/TDClient/30/Portal/KB/Article/15738/Google-Download-Site-as-HTML-File): migration references, separate from the design proposal.

Open decisions after prototype review: approve or revise the investor experience; confirm available logo/photo assets; verify investor capital-account data and permissions; then scope the public homepage. No Google Sites implementation detail constrains the production stack.

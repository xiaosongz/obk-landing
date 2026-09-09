# Obelisk Design System

**Obelisk** (Obelisk Fund Management / Obelisk Fund Manager LLC) acquires, owns and manages single-family rental homes, with a focus on providing well-maintained, attainable housing. Operations are concentrated in the Birmingham, Alabama metro; the model is BRRRR (Buy → Rehab → Rent → Refinance → Repeat), with strong Section 8 / Housing Choice Voucher orientation. Fund I and II merged into **Fund III**; 37–38 homes today.

Tagline direction from the owner: **"Disciplined ownership. Enduring value."**

## Sources

- Codebase `obk-landing/` (mounted read-only). Branch of record: `feat/design-polish`.
  - `prototype/` — React + TypeScript + Vite + Ant Design + React Router investor-site prototype. Source of truth for layout, type, spacing, page structure (`src/styles.css`, `src/main.tsx` theme, `src/App.tsx`, `src/PublicPages.tsx`, `src/InvestorHome.tsx`, `src/FundPortfolio.tsx`, `src/PropertyPages.tsx`, `src/site-data.ts`, `src/reference-content.ts`).
  - `docs/design-direction.md`, `docs/codex-tasks.md` (task 5 = design polish review), `prototype/README.md`.
  - `index.html` + `assets/css/style.css` at repo root — the **older** static "OBK Portfolio Dashboard" landing page (Inter, dark blue/red). Superseded; not used here.
  - Related repo (not attached): `github.com/xiaosongz/obk-cockpit` — GP-side FastAPI/React app and source of financial read models.
- Owner brief (chat): move from the prototype's navy/gold/off-white to a **three-color system**: Obelisk Charcoal `#202321`, Warm Ivory `#F7F5EF`, Aged Bronze `#A28258`. Ivory replaces pure white.

## Products / surfaces

One product with two faces, one codebase:

1. **Public website** — Home, Portfolio (37-photo gallery), Investor Login.
2. **Investor portal** — Investor Home (capital account + 6-step business process), Fund III Portfolio (metric groups, BRRRR stages, acquisition table), Property Performance (directory + per-property report with OSM map).

## What this design system changes vs. the prototype

The prototype's structure, type, spacing and component vocabulary are kept exactly. Only the palette is re-mapped:

| Prototype | Design system | Role |
|---|---|---|
| navy `#1e3a5f` (primary, headings, callout bg) | Charcoal `#202321` | ink, primary action, inverse panels |
| `#faf9f6` paper | Ivory `#F7F5EF` | page ground |
| `#fff` card | `#FCFBF8` (ivory-50) | card/panel surface — no pure white |
| gold `#8b7554` / `#927d5b` / `#a77c3d` | Bronze `#A28258` (text: `#7E6340`) | em, taglines, step numbers, focus ring |
| `#626d75` muted | `#5F655F` | secondary text |
| `#dcded8` rule | `#DAD6CB` | hairlines |
| `#f0f0eb`/`#f2f3ed` tinted | `#EFECE3` | footer, portal links, table header |
| green-grey manager note (`#eceee7`, `#99a187`) | ivory-200 + bronze rule | manager notes |

## CONTENT FUNDAMENTALS

**Voice.** Institutional, calm, declarative. Short sentences; frequent one-word or two-word fragments as punctuation: *"Occupied. Maintained. Predictable. Cash-flowing."* Antithesis pairs are the signature rhetorical device: *"We don't renovate to impress. We renovate to perform."* / *"We don't just lease the house. We stabilize the asset."*

**Person.** First-person plural for the firm (*we*, *our*, *Obelisk*); second person for investors (*your investment*, *your capital account*). Never "I".

**Casing.**
- Eyebrows: ALL CAPS with 0.13em tracking — `OUR STRATEGY`, `SECTION I`, `01 / BUY`, `STEP 3 · LEASING`.
- Headings: sentence case, ending in a period. *"Our portfolio."* *"Welcome, investor."* *"Portfolio at a glance."* *"Fund III Portfolio."*
- Stacked three-line headlines with the last word in bronze `<em>`: *Acquire. / Improve. / **Operate.***
- Taglines: two capitalized words with a period: *Buy Right. Improve Smart. Lease Well. Stabilize Value. Recycle Capital. Scale Impact.*
- Buttons/links: sentence case + arrow: *Explore our portfolio →*, *Investor login →*.
- Section numbering uses Roman numerals for page sections (SECTION I, II, III, IV) and zero-padded Arabic for steps/stages (01–06).

**Numbers & data honesty.** Distinguish *zero*, *Missing*, *Not yet reported*, *Not provided*, *cost basis pending*. Never invent figures. The "DESIGN PREVIEW" bar and "illustrative" labels from the prototype are dropped in this system (owner decision, 2026-09-09). Currency: USD, no cents (`$250,000`). Percentages one decimal. Dates ISO (`2026-06-30`). Separator between facts: ` · ` (middle dot).

**No emoji, ever.** No exclamation marks. Disclosure text is always present in the footer.

**Vocabulary.** *homes* (not units/properties when speaking to public), *residents* (public) / *tenants* (process copy), *attainable / affordable housing*, *stewardship*, *disciplined*, *stabilize*, *recycle capital*, *density*.

## VISUAL FOUNDATIONS

**Palette.** Exactly three brand colors — Charcoal, Ivory, Bronze — plus tints/shades of each. No white; the lightest surface is `#FCFBF8`. Bronze is an accent only: emphasized words, step numerals, taglines, focus rings, 2px accent rules. Charcoal panels (`.investor-callout`, `.capital-strip`) are the only "dark mode" moments and use ivory text with an 18% ivory hairline.

**Type.** Archivo (variable, 400/500/600) for everything; IBM Plex Mono 400 only for large money figures on dark panels (capital strip) with −0.05em tracking. Headings are weight 500 with tight negative tracking (h1 −0.045em, h2 −0.035em). Body 1rem/1.75. Eyebrow 0.75rem, 500, +0.13em, uppercase. Metric values 2rem, 500, tabular-nums, in charcoal; pending values in muted grey at 1.1rem.

**Spacing & layout.** Content column 88% / max 1320px; header 92% / max 1440px, 104px tall with a bottom hairline. Section rhythm 80px (50px on phone). Panels padded 1.75rem (cards) / 2.5rem (large); callouts 48px. Grids: 4-up home gallery (gap 1.5rem), 3-up portfolio/property (gap 2rem), 2-up process cards; all photos cropped 4:3 `object-fit: cover`. Metric tiles are equal-width cells divided by hairlines inside a single bordered box (4 / 3 / 3).

**Backgrounds.** Flat ivory. No gradients except the protection gradient over photography (`transparent → rgba(32,35,33,.92)`) in the login panel. No patterns, no textures, no illustrations drawn in code — the six business-process figures are supplied PNG infographics (`assets/illustrations/`), shown as images.

**Corners.** Square. Cards, photos, panels, tables: 0 radius. Form controls and buttons: 2px (prototype used Ant Design's 4px; the system tightens to 2px to read squarer). Tags: 0.

**Borders & shadows.** 1px hairline `#DAD6CB` does all the work: card outlines, table rows, section dividers, `border-block` toolbars, left rule on the contact panel. Accent rules are 2px bronze on the left (preview notice, manager note). **No box shadows on cards.** Only floating layers (menu drawer, modal, image preview) get one soft shadow `0 12px 32px rgba(32,35,33,.14)`.

**Motion.** Minimal. Background/color transitions 200ms ease; photo zoom `scale(1.03)` over 250ms on card hover; no bounces, no fades on load. `prefers-reduced-motion` disables all.

**Hover / press.** Links: underline (text-link) or color shift to bronze-700. Tinted panels darken one step (`#EFECE3 → #E4E0D4`). Cards: border turns bronze. Primary button: charcoal → charcoal-700. Press: no scale; slight darkening.

**Imagery.** Real MLS-style exterior photography of modest single-family homes in Birmingham — green lawns, mature trees, porches. Warm natural daylight; never black-and-white, never filtered. Captions are two lines: street, then "City, AL zip", in 0.875rem with muted second line.

**Transparency & blur.** None, except the 18% ivory hairline on dark panels and the protection gradient. No glass/blur.

**Buttons.** Primary: charcoal fill, ivory text, 40px tall, 500 weight, 0.875rem, arrow suffix. Default: hairline outline, charcoal text. Bronze fill is available for a single hero CTA. Text link: 0.875rem 500 with `→` and 1rem gap.

**Tables.** Header `#EFECE3` bg, muted 0.875rem labels; cells 18px block padding; money right-aligned tabular. Contained horizontal scroll on small screens.

## ICONOGRAPHY

The prototype uses **Ant Design Icons (outlined set)** sparingly: `ArrowRightOutlined` (every CTA and link suffix), `ArrowLeftOutlined`, `LockOutlined` (login), `MailOutlined`, `FileTextOutlined`, `HomeOutlined` (photo-unmatched placeholder), `SearchOutlined` (input prefix), `EnvironmentOutlined` (location). Icons are 1em, inherit color, and never appear without an adjacent label except the arrow suffix. There is no icon font, no PNG icons, no emoji, no unicode glyphs as icons (the ` · ` middle-dot is a text separator, not an icon).

In this system the arrow is the only icon the components need; it is drawn inline as the Ant Design `arrow-right` outlined path in `components/core/Icon.jsx` (bundled — no CDN). For anything else, use `@ant-design/icons` (outlined) in production, or the `Icon` component's `name` prop (`arrow-right`, `arrow-left`, `lock`, `mail`, `search`, `environment`, `home`, `file-text`) here.

**Logo.** No logo file exists in the sources. The brand mark is the wordmark `OBELISK` set in Archivo 600, 0.14em tracking, with `FUND MANAGEMENT` beneath in 0.75rem/0.16em. Do not draw a mark.

**Illustrations.** Six owner-supplied process infographics (Acquisition, Renovation, Leasing, Stabilization, Refinancing, Scaling) plus the overview `business-process.png` are in `assets/illustrations/`. They carry their own navy/green palette — display them as framed images, don't recolor.

## Intentional additions

- `Icon` — a wrapper for the handful of Ant Design outlined glyphs the UI uses, so components don't depend on the `@ant-design/icons` package.

## Index

- `styles.css` — entry; imports `tokens/*.css`.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `assets/fonts/` — Archivo.ttf, IBMPlexMono-Regular/Medium.ttf (+ OFL licenses).
- `assets/photos/` — 8 property exteriors + `home-02.png` hero.
- `assets/illustrations/` — 6 process figures + overview.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand groups).
- `ui_kits/website/` — Home, Portfolio, Investor Login, Investor Home, Fund III Portfolio, Property Performance directory + detail (`index.html` click-through; see its README).

## Components

Inventory = the Ant Design components and custom blocks the prototype actually uses (`window.ObeliskDesignSystem_227ca9.<Name>`):

- `components/core/` — Wordmark, Eyebrow, Button, TextLink, Icon, Tag, Input, Breadcrumb
- `components/data/` — MetricTile, MetricGroup, CapitalStrip, DataTable, Descriptions
- `components/content/` — PhotoCard, ProcessCard, PortalLink, ManagerNote, PreviewNotice, SourceNote, Collapse, StageJumps, Alert, Modal
- `components/layout/` — SiteHeader, SiteFooter, PageTitle, SectionHeading, InvestorCallout

Not built (used by the prototype but implementation-specific): Ant `Image.PreviewGroup` lightbox, mobile `Drawer` menu, `Table` pagination/sorting.
- `thumbnail.html`, `SKILL.md`.

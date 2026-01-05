# CLAUDE.md - OBK Landing Page

Static marketing landing page for OBK Portfolio Dashboard.

## Quick Info

- **Type:** Static HTML/CSS/JS site
- **Deployment:** GitHub Pages (auto-deploy on push to main)
- **Related:** `obk-cockpit` repo (main Shiny app)

## Structure

- `index.html` - Main landing page
- `assets/css/style.css` - All styles (CSS custom properties)
- `assets/js/main.js` - Minimal JS for scroll effects

## Common Tasks

**Update login URL:** Search and replace `app.yourdomain.com` in `index.html`

**Add new section:** Follow existing pattern in `index.html`

**Modify colors:** Edit CSS custom properties in `:root` block of `style.css`

## Design Notes

- Professional, understated palette (dark blues, white)
- Inter font family
- Mobile-responsive
- No external dependencies (except Google Fonts)

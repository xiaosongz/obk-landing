# OBK Portfolio Dashboard - Landing Page

Marketing landing page for the OBK Portfolio Dashboard, a real estate portfolio analytics platform for Jefferson County investments.

## Overview

This is a static marketing site that serves as the public entry point for the OBK Portfolio Dashboard. It provides information about the platform and directs authorized investors to the login page.

## Structure

```
obk-landing/
├── index.html              # Main landing page
├── assets/
│   ├── css/
│   │   └── style.css       # Styles
│   ├── js/
│   │   └── main.js         # Minimal interactions
│   └── images/             # Logo and assets
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
└── README.md
```

## Deployment

This site is automatically deployed to GitHub Pages on push to `main`.

**Live URL:** (Configure in repository settings)

## Related Projects

- **[obk-cockpit](https://github.com/xiaosongz/obk-cockpit)** - Main Shiny dashboard application

## Development

1. Clone the repository
2. Open `index.html` in a browser
3. Edit files and refresh

No build process required - pure HTML/CSS/JS.

## Configuration

Update the following in `index.html`:
- Login button URLs (`https://app.yourdomain.com`)
- Domain-specific content

## License

Private - For authorized use only.

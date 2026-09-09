import React from "react";
import { Wordmark } from "../core/Wordmark.jsx";
import { TextLink } from "../core/TextLink.jsx";
const DISCLOSURE = "The information contained on this website is provided for informational purposes only and does not constitute an offer to sell, or a solicitation of an offer to purchase, any security, investment product, or investment advisory service. Any such offer or solicitation will be made only through applicable offering documents and only to qualified investors in jurisdictions where permitted by law. Investments involve risk, including the possible loss of principal. Past performance is not indicative of future results.";
export function SiteFooter({ tagline = "A full-service affordable housing platform.", portalHref = "#/investor-login", onNavigate, contactHref = "mailto:szhang@obeliskfunds.com", status = null, year = 2026, style }) {
  return React.createElement("footer", { style: { background: "var(--surface-tint)", padding: "3rem max(6%, calc((100vw - 1320px) / 2))", borderTop: "1px solid var(--rule)", ...style } },
    React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", paddingBottom: "2rem", flexWrap: "wrap" } },
      React.createElement(Wordmark, { href: "#/" }), React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0 } }, tagline), React.createElement(TextLink, { href: portalHref, onClick: (e) => { if (onNavigate) { e.preventDefault(); onNavigate("/investor-login"); } } }, "Investor portal")),
    React.createElement("div", { style: { borderTop: "1px solid var(--rule)", paddingTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.75rem", maxWidth: 1100 } },
      React.createElement("p", { style: { lineHeight: 1.8, margin: "0 0 1rem" } }, "© " + year + " Obelisk Fund Manager LLC. All rights reserved."), React.createElement("p", { style: { lineHeight: 1.8, margin: 0 } }, DISCLOSURE)),
    React.createElement("div", { style: { display: "flex", justifyContent: status ? "space-between" : "flex-end", gap: "2rem", fontSize: "0.75rem", color: "var(--text-secondary)", paddingTop: "1rem", flexWrap: "wrap" } }, status && React.createElement("span", null, status), React.createElement("a", { href: contactHref, style: { color: "var(--text-secondary)" } }, "Investor relations")));
}

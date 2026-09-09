import React from "react";
import { Wordmark } from "../core/Wordmark.jsx";
export function SiteHeader({ items = [], active, onNavigate, previewBar = false, style }) {
  return React.createElement(React.Fragment, null,
    previewBar && React.createElement("div", { style: { display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", background: "var(--surface-tint)", color: "var(--text-secondary)", fontSize: "0.75rem", minHeight: 32, padding: "0.35rem 1rem", flexWrap: "wrap" } }, React.createElement("span", { style: { fontWeight: 600, letterSpacing: "0.1em" } }, "DESIGN PREVIEW"), React.createElement("span", null, "Original site content & imagery · Investor figures are illustrative or pending")),
    React.createElement("header", { style: { maxWidth: 1440, width: "92%", margin: "auto", display: "flex", alignItems: "center", gap: "2rem", minHeight: 104, borderBottom: "1px solid var(--rule)", ...style } },
      React.createElement(Wordmark, { href: "#/", onClick: (e) => { if (onNavigate) { e.preventDefault(); onNavigate("/"); } } }),
      React.createElement("nav", { "aria-label": "Main navigation", style: { flex: 1, minWidth: 0, display: "flex", justifyContent: "flex-end", flexWrap: "wrap", alignSelf: "stretch", alignItems: "center", rowGap: 0 } },
        items.map((it) => { const on = it.key === active; return React.createElement("a", { key: it.key, href: "#" + it.key, "aria-current": on ? "page" : undefined, onClick: (e) => { if (onNavigate) { e.preventDefault(); onNavigate(it.key); } }, style: { padding: "0 1rem", lineHeight: "40px", alignSelf: "center", fontSize: "0.875rem", color: "var(--charcoal-900)", textDecoration: "none", borderBottom: on ? "2px solid var(--charcoal-900)" : "2px solid transparent", fontWeight: on ? 500 : 400, whiteSpace: "nowrap" } }, it.label); }))));
}

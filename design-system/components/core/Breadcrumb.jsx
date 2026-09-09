import React from "react";
export function Breadcrumb({ items = [], style }) {
  return React.createElement("nav", { "aria-label": "Breadcrumb", style: { fontSize: "0.875rem", color: "var(--text-secondary)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", ...style } },
    items.map((it, i) => React.createElement(React.Fragment, { key: i }, i > 0 && React.createElement("span", { "aria-hidden": true }, "/"), it.href && i < items.length - 1 ? React.createElement("a", { href: it.href, style: { color: "var(--text-secondary)" } }, it.label) : React.createElement("span", { style: { color: "var(--text-primary)" } }, it.label))));
}

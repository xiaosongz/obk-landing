import React from "react";
import { Eyebrow } from "../core/Eyebrow.jsx";
export function ProcessCard({ number, title, description, tagline, href, style }) {
  const [h, setH] = React.useState(false);
  return React.createElement("a", { href, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false), style: { display: "flex", flexDirection: "column", padding: "1.75rem", border: "1px solid " + (h ? "var(--bronze-500)" : "var(--rule)"), background: "var(--surface-card)", color: "var(--text-primary)", textDecoration: "none", transition: "border-color var(--duration-base)", ...style } },
    React.createElement(Eyebrow, { accent: true, as: "span", style: { marginBottom: "0.75rem" } }, String(number).padStart(2, "0")),
    React.createElement("h3", { style: { fontSize: "1.45rem", margin: "0 0 0.75rem", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.3 } }, title),
    React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.75, margin: "0 0 1rem" } }, description),
    React.createElement("span", { style: { marginTop: "auto", color: "var(--text-accent)", fontWeight: 500 } }, tagline));
}

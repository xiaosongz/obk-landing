import React from "react";
import { Icon } from "../core/Icon.jsx";
export function PortalLink({ eyebrow, title, href = "#", style }) {
  const [h, setH] = React.useState(false);
  return React.createElement("a", { href, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false), style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", border: "1px solid var(--rule)", padding: "1.7rem 2rem", background: h ? "var(--surface-tint-hover)" : "var(--surface-tint)", color: "var(--text-primary)", textDecoration: "none", transition: "background var(--duration-base)", ...style } },
    React.createElement("span", null, React.createElement("small", { style: { display: "block", fontSize: "0.75rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.6rem" } }, eyebrow), React.createElement("strong", { style: { fontSize: "1.35rem", fontWeight: 500, letterSpacing: "-0.02em" } }, title)),
    React.createElement(Icon, { name: "arrow-right" }));
}

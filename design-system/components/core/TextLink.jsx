import React from "react";
import { Icon } from "./Icon.jsx";
export function TextLink({ children, href = "#", arrow = true, inverse = false, underline = false, onClick, style }) {
  const [h, setH] = React.useState(false);
  return React.createElement("a", { href, onClick, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false), style: { color: inverse ? "var(--on-charcoal)" : "var(--charcoal-900)", display: "inline-flex", gap: "1rem", alignItems: "center", fontSize: "0.875rem", fontWeight: 500, textDecoration: h || underline ? "underline" : "none", textUnderlineOffset: 3, ...style } }, children, arrow && React.createElement(Icon, { name: "arrow-right" }));
}

import React from "react";
export function Eyebrow({ children, accent = false, inverse = false, style, as = "p" }) {
  return React.createElement(as, { style: { fontSize: "0.75rem", letterSpacing: "0.13em", fontWeight: 500, textTransform: "uppercase", lineHeight: 1.5, margin: "0 0 1.2rem", color: inverse ? "var(--on-charcoal-muted)" : accent ? "var(--text-accent)" : "var(--text-secondary)", ...style } }, children);
}

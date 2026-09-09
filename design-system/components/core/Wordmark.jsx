import React from "react";
export function Wordmark({ inverse = false, small = true, size = "1.75rem", href = "#/", as = "a", onClick, style }) {
  const T = as;
  return React.createElement(T, { href: T === "a" ? href : undefined, onClick, "aria-label": "Obelisk homepage", style: { display: "inline-block", fontFamily: "var(--font-sans)", fontSize: size, fontWeight: 600, letterSpacing: "0.14em", lineHeight: 1, color: inverse ? "var(--on-charcoal)" : "var(--charcoal-900)", textDecoration: "none", flexShrink: 0, ...style } },
    "OBELISK", small && React.createElement("small", { style: { display: "block", fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.16em", marginTop: "0.7rem" } }, "FUND MANAGEMENT"));
}

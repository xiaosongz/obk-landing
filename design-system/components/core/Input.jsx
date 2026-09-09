import React from "react";
import { Icon } from "./Icon.jsx";
export function Input({ value, onChange, placeholder, search = false, ariaLabel, style }) {
  const [f, setF] = React.useState(false);
  return React.createElement("label", { style: { display: "flex", alignItems: "center", gap: "0.5rem", height: 40, padding: "0 11px", background: "var(--surface-card)", border: "1px solid " + (f ? "var(--charcoal-900)" : "var(--rule)"), borderRadius: "var(--radius-control)", maxWidth: 320, width: "100%", boxShadow: f ? "0 0 0 2px var(--bronze-100)" : "none", transition: "border-color var(--duration-base)", ...style } },
    search && React.createElement(Icon, { name: "search", style: { color: "var(--text-secondary)" } }),
    React.createElement("input", { value, onChange: (e) => onChange && onChange(e.target.value), placeholder, "aria-label": ariaLabel || placeholder, onFocus: () => setF(true), onBlur: () => setF(false), style: { flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", font: "inherit", fontSize: "0.875rem", color: "var(--text-primary)" } }));
}

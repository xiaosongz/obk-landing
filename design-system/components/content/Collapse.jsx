import React from "react";
export function Collapse({ label, children, ghost = false, defaultOpen = false, style }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const chev = React.createElement("svg", { viewBox: "0 0 1024 1024", width: 12, height: 12, fill: "currentColor", "aria-hidden": true, style: { transition: "transform var(--duration-base)", transform: open ? "rotate(90deg)" : "none", flexShrink: 0 } }, React.createElement("path", { d: "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" }));
  return React.createElement("div", { style: { border: ghost ? 0 : "1px solid var(--rule)", background: ghost ? "transparent" : "var(--surface-card)", ...style } },
    React.createElement("button", { type: "button", "aria-expanded": open, onClick: () => setOpen(!open), style: { display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", textAlign: "left", background: "transparent", border: 0, padding: ghost ? "0.5rem 0" : "12px 16px", font: "inherit", fontSize: "0.9375rem", fontWeight: 500, color: "var(--charcoal-900)", cursor: "pointer" } }, chev, label),
    open && React.createElement("div", { style: { padding: ghost ? "0.5rem 0 0" : "4px 16px 16px", color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 } }, children));
}

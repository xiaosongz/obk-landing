import React from "react";
export function Alert({ title, description, type = "info", style }) {
  return React.createElement("div", { role: "status", style: { display: "flex", gap: "0.75rem", padding: "12px 16px", background: "var(--surface-card)", border: "1px solid " + (type === "error" ? "var(--bronze-500)" : "var(--rule)"), fontSize: "0.875rem", lineHeight: 1.6, margin: "1rem 0", ...style } },
    React.createElement("span", { "aria-hidden": true, style: { width: 8, height: 8, marginTop: 7, flexShrink: 0, background: type === "error" ? "var(--bronze-500)" : "var(--charcoal-300)" } }),
    React.createElement("div", null, React.createElement("strong", { style: { fontWeight: 500, display: "block" } }, title), description && React.createElement("span", { style: { color: "var(--text-secondary)" } }, description)));
}

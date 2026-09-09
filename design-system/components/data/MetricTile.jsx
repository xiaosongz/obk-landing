import React from "react";
export function MetricTile({ label, value, caption, pending = false, style }) {
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.8rem", padding: "1.6rem 1.25rem", borderRight: "1px solid var(--rule)", minWidth: 0, ...style } },
    React.createElement("span", { style: { fontSize: "0.875rem" } }, label),
    React.createElement("strong", { style: pending ? { color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.5, fontWeight: 500 } : { fontSize: "2rem", fontVariantNumeric: "tabular-nums", fontWeight: 500, color: "var(--charcoal-900)", overflowWrap: "anywhere", lineHeight: 1.1 } }, value),
    caption && React.createElement("small", { style: { fontSize: "0.75rem", color: "var(--text-secondary)" } }, caption));
}

import React from "react";
export function Descriptions({ items = [], bordered = false, columns = 1, style }) {
  if (!bordered) return React.createElement("dl", { style: { margin: 0, display: "grid", gridTemplateColumns: "repeat(" + columns + ", minmax(0,1fr))", gap: "0 2rem", fontSize: "0.875rem", ...style } },
    items.map((it) => React.createElement("div", { key: it.label, style: { display: "flex", gap: "1rem", padding: "0 0 1rem" } }, React.createElement("dt", { style: { color: "var(--text-secondary)", flexShrink: 0 } }, it.label, ":"), React.createElement("dd", { style: { margin: 0, fontVariantNumeric: "tabular-nums" } }, it.value))));
  const cells = [];
  items.forEach((it) => cells.push(React.createElement("div", { key: it.label + "l", style: { background: "var(--surface-tint)", color: "var(--text-secondary)", padding: "16px 24px", borderBottom: "1px solid var(--rule)", borderRight: "1px solid var(--rule)" } }, it.label), React.createElement("div", { key: it.label + "v", style: { padding: "16px 24px", borderBottom: "1px solid var(--rule)", borderRight: "1px solid var(--rule)", fontVariantNumeric: "tabular-nums" } }, it.value)));
  return React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(" + columns + ", auto minmax(0,1fr))", fontSize: "0.875rem", background: "var(--surface-card)", border: "1px solid var(--rule)", borderRight: 0, borderBottom: 0, ...style } }, cells);
}

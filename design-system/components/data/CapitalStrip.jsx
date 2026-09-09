import React from "react";
export function CapitalStrip({ items = [], note = null, style }) {
  return React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(" + items.length + ", minmax(0,1fr))", background: "var(--surface-inverse)", color: "var(--on-charcoal)", padding: "2rem 0", ...style } },
    items.map((it, i) => React.createElement("div", { key: it.label, style: { display: "flex", flexDirection: "column", gap: "1rem", padding: "0 2rem", borderRight: i < items.length - 1 ? "1px solid var(--on-charcoal-rule)" : 0, minWidth: 0 } },
      React.createElement("span", { style: { fontSize: "0.875rem", color: "var(--on-charcoal-muted)" } }, it.label),
      React.createElement("strong", { style: { fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: "clamp(1.65rem,3vw,2.6rem)", letterSpacing: "-0.05em", lineHeight: 1.1 } }, it.value),
      note && React.createElement("small", { style: { fontSize: "0.75rem", color: "var(--on-charcoal-muted)" } }, it.note || note))));
}

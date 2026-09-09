import React from "react";
import { MetricTile } from "./MetricTile.jsx";
export function MetricGroup({ title, metrics = [], style }) {
  return React.createElement("section", { "aria-label": title, style: { marginTop: "1.5rem", ...style } },
    title && React.createElement("h3", { style: { fontSize: "1rem", margin: "0 0 0.75rem", fontWeight: 500, letterSpacing: "-0.02em" } }, title),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(" + metrics.length + ", minmax(0,1fr))", background: "var(--surface-card)", border: "1px solid var(--rule)" } },
      metrics.map((m, i) => React.createElement(MetricTile, { key: m.label, ...m, style: i === metrics.length - 1 ? { borderRight: 0 } : undefined }))));
}

import React from "react";
import { Icon } from "../core/Icon.jsx";
export function StageJumps({ stages = [], hrefBase = "#stage-", style }) {
  return React.createElement("div", { style: { display: "flex", marginTop: "2rem", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", ...style } },
    stages.map((s, i) => React.createElement("a", { key: s, href: hrefBase + (i + 1), style: { flex: 1, display: "flex", flexDirection: "column", gap: "0.7rem", padding: "1.5rem 1rem", paddingLeft: i === 0 ? 0 : "1rem", borderRight: i < stages.length - 1 ? "1px solid var(--rule)" : 0, fontSize: "0.875rem", color: "var(--charcoal-900)", textDecoration: "none", minWidth: 0 } },
      React.createElement("span", { style: { fontSize: "1.5rem", fontVariantNumeric: "tabular-nums", color: "var(--text-accent)" } }, "0" + (i + 1)), s, React.createElement(Icon, { name: "arrow-right", size: "0.75rem", style: { alignSelf: "flex-end" } }))));
}

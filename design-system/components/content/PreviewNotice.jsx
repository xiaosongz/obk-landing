import React from "react";
export function PreviewNotice({ title = "Design preview", children, style }) {
  return React.createElement("div", { style: { borderLeft: "2px solid var(--bronze-500)", padding: "0.25rem 1.25rem", margin: "2rem 0", color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.75, ...style } },
    React.createElement("strong", { style: { color: "var(--text-accent)", fontWeight: 500 } }, title),
    React.createElement("p", { style: { margin: "0.5rem 0 0" } }, children));
}

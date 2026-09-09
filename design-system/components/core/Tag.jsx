import React from "react";
export function Tag({ children, style }) {
  return React.createElement("span", { style: { display: "inline-block", fontSize: "0.75rem", lineHeight: "20px", padding: "0 7px", color: "var(--text-secondary)", background: "var(--surface-tint)", border: "1px solid var(--rule)", borderRadius: 0, whiteSpace: "nowrap", ...style } }, children);
}

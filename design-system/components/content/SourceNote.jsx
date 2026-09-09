import React from "react";
export function SourceNote({ children, style }) {
  return React.createElement("p", { style: { fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: "1.2rem 0 0", ...style } }, children);
}

import React from "react";
import { Eyebrow } from "../core/Eyebrow.jsx";
export function ManagerNote({ eyebrow = "Manager notes · Template content", title, children, style }) {
  return React.createElement("aside", { style: { background: "var(--surface-tint)", borderLeft: "2px solid var(--bronze-500)", padding: "1.5rem 1.75rem", marginTop: "1.5rem", ...style } },
    React.createElement(Eyebrow, { style: { marginBottom: "0.8rem" } }, eyebrow),
    title && React.createElement("h3", { style: { fontSize: "1.125rem", margin: "0 0 0.7rem", fontWeight: 500, letterSpacing: "-0.02em" } }, title),
    React.createElement("p", { style: { color: "var(--text-secondary)", margin: 0, fontSize: "0.9375rem", lineHeight: 1.75 } }, children));
}

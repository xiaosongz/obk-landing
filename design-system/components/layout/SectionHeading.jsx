import React from "react";
import { Eyebrow } from "../core/Eyebrow.jsx";
export function SectionHeading({ eyebrow, title, intro, level = 2, action, style }) {
  const H = "h" + level;
  return React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap", ...style } },
    React.createElement("div", { style: { minWidth: 0 } }, eyebrow && React.createElement(Eyebrow, null, eyebrow), React.createElement(H, { style: level === 2 ? { fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: 1.16, letterSpacing: "-0.035em", fontWeight: 500, margin: 0 } : { fontSize: "1.45rem", lineHeight: 1.3, letterSpacing: "-0.02em", fontWeight: 500, margin: 0 } }, title), intro && React.createElement("p", { style: { margin: "1rem 0 0", color: "var(--text-secondary)", lineHeight: 1.75 } }, intro)),
    action);
}

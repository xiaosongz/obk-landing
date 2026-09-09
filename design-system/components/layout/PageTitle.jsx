import React from "react";
import { Eyebrow } from "../core/Eyebrow.jsx";
export function PageTitle({ eyebrow, title, intro, aside, style }) {
  return React.createElement("div", { style: { padding: "60px 0 40px", display: "flex", gap: "3rem", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", ...style } },
    React.createElement("div", { style: { minWidth: 0 } }, eyebrow && React.createElement(Eyebrow, null, eyebrow), React.createElement("h1", { style: { fontSize: "clamp(2.5rem,4.8vw,4.6rem)", lineHeight: 1.05, letterSpacing: "-0.045em", fontWeight: 500, margin: "0 0 1.5rem" } }, title), intro && React.createElement("p", { style: { maxWidth: 900, fontSize: "1.0625rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.75 } }, intro)),
    aside);
}

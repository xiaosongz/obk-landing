import React from "react";
import { Eyebrow } from "../core/Eyebrow.jsx";
import { Button } from "../core/Button.jsx";
export function InvestorCallout({ eyebrow = "For our investors", title = "Your investment. Every stage.", text = "Explore your capital account, fund portfolio, and property-level reporting.", cta = "Investor portal", href = "#/investor-login", onClick, style }) {
  return React.createElement("section", { style: { marginTop: 75, background: "var(--surface-inverse)", color: "var(--on-charcoal)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", padding: 48, flexWrap: "wrap", ...style } },
    React.createElement("div", null, React.createElement(Eyebrow, { inverse: true }, eyebrow), React.createElement("h2", { style: { fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: 1.16, letterSpacing: "-0.035em", fontWeight: 500, margin: "0 0 0.8rem" } }, title), React.createElement("p", { style: { color: "var(--on-charcoal-muted)", margin: 0, lineHeight: 1.75 } }, text)),
    React.createElement(Button, { variant: "inverse", size: "lg", arrow: true, href, onClick }, cta));
}

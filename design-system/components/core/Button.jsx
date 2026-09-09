import React from "react";
import { Icon } from "./Icon.jsx";
export function Button({ children, variant = "default", size = "md", block = false, arrow = false, icon, href, onClick, disabled = false, style, type = "button" }) {
  const h = size === "lg" ? 48 : 40;
  const v = { primary: { background: "var(--action-primary-bg)", color: "var(--action-primary-fg)", border: "1px solid var(--action-primary-bg)" }, bronze: { background: "var(--action-bronze-bg)", color: "var(--on-charcoal)", border: "1px solid var(--action-bronze-bg)" }, default: { background: "var(--surface-card)", color: "var(--charcoal-900)", border: "1px solid var(--rule)" }, inverse: { background: "transparent", color: "var(--on-charcoal)", border: "1px solid var(--on-charcoal)" }, link: { background: "transparent", color: "var(--charcoal-900)", border: "1px solid transparent", padding: 0, height: "auto" } }[variant];
  const hov = { primary: "var(--action-primary-hover)", bronze: "var(--action-bronze-hover)", default: "var(--surface-tint)", inverse: "rgba(247,245,239,.12)" }[variant];
  const [h2, setH] = React.useState(false);
  const base = { display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined, alignItems: "center", justifyContent: "center", gap: "0.6rem", height: h, padding: size === "lg" ? "0 1.5rem" : "0 1.1rem", fontFamily: "var(--font-sans)", fontSize: size === "lg" ? "1rem" : "0.875rem", fontWeight: 500, lineHeight: 1, borderRadius: "var(--radius-control)", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, textDecoration: variant === "link" && h2 ? "underline" : "none", transition: "background var(--duration-base) var(--ease-standard)", whiteSpace: "nowrap", ...v, ...(h2 && !disabled && hov ? { background: hov } : {}), ...style };
  const T = href ? "a" : "button";
  return React.createElement(T, { href, onClick, disabled: T === "button" ? disabled : undefined, type: T === "button" ? type : undefined, style: base, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }, icon, children, arrow && React.createElement(Icon, { name: "arrow-right" }));
}

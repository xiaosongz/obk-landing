import React from "react";
import { Tag } from "../core/Tag.jsx";
import { TextLink } from "../core/TextLink.jsx";
export function PhotoCard({ src, address, location, status, rent, href, framed = false, cta, style }) {
  const [h, setH] = React.useState(false);
  const img = React.createElement("img", { src, alt: address ? "Photograph of " + address : "Property photograph", loading: "lazy", style: { width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block", transition: "transform var(--duration-photo)", transform: h ? "scale(1.03)" : "none" } });
  const photo = React.createElement(href ? "a" : "div", { href, style: { display: "block", overflow: "hidden" }, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }, img);
  if (!framed) return React.createElement("figure", { style: { margin: 0, ...style } }, photo,
    React.createElement("figcaption", { style: { display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.875rem", color: "var(--text-primary)", padding: "0.9rem 0" } },
      React.createElement("span", null, address || "Unlabeled property", React.createElement("small", { style: { display: "block", marginTop: "0.35rem", color: "var(--text-secondary)", fontSize: "0.75rem" } }, location || "Address unconfirmed")),
      React.createElement("span", { style: { flex: "0 0 2.5rem", minHeight: "1.5em", fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "right" } }, status)));
  return React.createElement("article", { style: { background: "var(--surface-card)", border: "1px solid var(--rule)", ...style } }, photo,
    React.createElement("div", { style: { padding: "1.5rem" } },
      status && React.createElement(Tag, { style: { marginBottom: "1rem" } }, status),
      React.createElement("h3", { style: { fontSize: "1.35rem", margin: "0 0 0.5rem", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.3 } }, href ? React.createElement("a", { href, style: { color: "inherit" } }, address) : address),
      React.createElement("p", { style: { fontSize: "0.875rem", color: "var(--text-secondary)", margin: "0 0 1.25rem", lineHeight: 1.6 } }, location || "Address not provided", rent && React.createElement(React.Fragment, null, React.createElement("br"), "Current rent: ", rent)),
      href && React.createElement(TextLink, { href }, cta || "View property details")));
}

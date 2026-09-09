import React from "react";
import { Button } from "../core/Button.jsx";
export function Modal({ open, title, children, onClose, closeLabel = "Close" }) {
  if (!open) return null;
  return React.createElement("div", { onClick: onClose, style: { position: "fixed", inset: 0, background: "rgba(32,35,33,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" } },
    React.createElement("div", { role: "dialog", "aria-modal": true, onClick: (e) => e.stopPropagation(), style: { background: "var(--surface-card)", border: "1px solid var(--rule)", boxShadow: "var(--shadow-float)", width: "min(520px,100%)", padding: "1.5rem 1.75rem" } },
      React.createElement("h3", { style: { fontSize: "1.125rem", margin: "0 0 1rem", fontWeight: 500 } }, title),
      React.createElement("div", { style: { fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text-secondary)" } }, children),
      React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" } }, React.createElement(Button, { onClick: onClose }, closeLabel))));
}

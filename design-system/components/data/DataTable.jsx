import React from "react";
export function DataTable({ columns = [], rows = [], rowKey = "id", emptyText = "No data", footer, style }) {
  const th = { textAlign: "left", background: "var(--surface-tint)", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.875rem", padding: "14px 16px", borderBottom: "1px solid var(--rule)", whiteSpace: "nowrap" };
  return React.createElement("div", { style: { overflowX: "auto", background: "var(--surface-card)", border: "1px solid var(--rule)", maxWidth: "100%", ...style } },
    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" } },
      React.createElement("thead", null, React.createElement("tr", null, columns.map((c) => React.createElement("th", { key: c.key, style: { ...th, textAlign: c.align || "left", width: c.width } }, c.title)))),
      React.createElement("tbody", null, rows.length === 0 ? React.createElement("tr", null, React.createElement("td", { colSpan: columns.length, style: { padding: "2.5rem 1rem", textAlign: "center", color: "var(--text-secondary)" } }, emptyText)) :
        rows.map((r, i) => React.createElement("tr", { key: r[rowKey] ?? i }, columns.map((c) => React.createElement("td", { key: c.key, style: { padding: "18px 16px", borderBottom: i < rows.length - 1 ? "1px solid var(--rule)" : 0, textAlign: c.align || "left", fontVariantNumeric: c.align === "right" ? "tabular-nums" : undefined, verticalAlign: "middle" } }, c.render ? c.render(r) : r[c.key])))))),
    footer && React.createElement("div", { style: { padding: "12px 16px", borderTop: "1px solid var(--rule)", fontSize: "0.875rem", color: "var(--text-secondary)" } }, footer));
}

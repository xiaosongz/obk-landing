/* @ds-bundle: {"format":4,"namespace":"ObeliskDesignSystem_227ca9","components":[{"name":"Alert","sourcePath":"components/content/Alert.jsx"},{"name":"Collapse","sourcePath":"components/content/Collapse.jsx"},{"name":"ManagerNote","sourcePath":"components/content/ManagerNote.jsx"},{"name":"Modal","sourcePath":"components/content/Modal.jsx"},{"name":"PhotoCard","sourcePath":"components/content/PhotoCard.jsx"},{"name":"PortalLink","sourcePath":"components/content/PortalLink.jsx"},{"name":"PreviewNotice","sourcePath":"components/content/PreviewNotice.jsx"},{"name":"ProcessCard","sourcePath":"components/content/ProcessCard.jsx"},{"name":"SourceNote","sourcePath":"components/content/SourceNote.jsx"},{"name":"StageJumps","sourcePath":"components/content/StageJumps.jsx"},{"name":"Breadcrumb","sourcePath":"components/core/Breadcrumb.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"TextLink","sourcePath":"components/core/TextLink.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"},{"name":"CapitalStrip","sourcePath":"components/data/CapitalStrip.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"Descriptions","sourcePath":"components/data/Descriptions.jsx"},{"name":"MetricGroup","sourcePath":"components/data/MetricGroup.jsx"},{"name":"MetricTile","sourcePath":"components/data/MetricTile.jsx"},{"name":"InvestorCallout","sourcePath":"components/layout/InvestorCallout.jsx"},{"name":"PageTitle","sourcePath":"components/layout/PageTitle.jsx"},{"name":"SectionHeading","sourcePath":"components/layout/SectionHeading.jsx"},{"name":"SiteFooter","sourcePath":"components/layout/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/layout/SiteHeader.jsx"}],"sourceHashes":{"components/content/Alert.jsx":"f38dfe463316","components/content/Collapse.jsx":"d3f325866068","components/content/ManagerNote.jsx":"893b1d006f98","components/content/Modal.jsx":"36446c4f31c2","components/content/PhotoCard.jsx":"5fac69e46d98","components/content/PortalLink.jsx":"30b4b161a1cb","components/content/PreviewNotice.jsx":"35da7f7c55a4","components/content/ProcessCard.jsx":"a2a962851eac","components/content/SourceNote.jsx":"3721c89be73c","components/content/StageJumps.jsx":"02efa86fefeb","components/core/Breadcrumb.jsx":"5faf83f31b9c","components/core/Button.jsx":"b681c7ad41c8","components/core/Eyebrow.jsx":"2e4533b55fb6","components/core/Icon.jsx":"4c90ea8afb58","components/core/Input.jsx":"5aebbfc7d084","components/core/Tag.jsx":"f2155f8b5455","components/core/TextLink.jsx":"1454a3801f84","components/core/Wordmark.jsx":"474f5452ae85","components/data/CapitalStrip.jsx":"98ac303d93d9","components/data/DataTable.jsx":"fec6bb65deb1","components/data/Descriptions.jsx":"7ac1a0ff56db","components/data/MetricGroup.jsx":"329c8d6ab6c7","components/data/MetricTile.jsx":"197da95505cb","components/layout/InvestorCallout.jsx":"84fa878b4427","components/layout/PageTitle.jsx":"26f37bce9a24","components/layout/SectionHeading.jsx":"834bf95b41f3","components/layout/SiteFooter.jsx":"8c14c8858e2b","components/layout/SiteHeader.jsx":"512a62e3699d","ui_kits/website/InvestorScreens.jsx":"ff98c8fe8feb","ui_kits/website/PropertyScreens.jsx":"6f17939783ff","ui_kits/website/PublicScreens.jsx":"04e42ba8b3e9","ui_kits/website/data.js":"93c93cd3309a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ObeliskDesignSystem_227ca9 = window.ObeliskDesignSystem_227ca9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/Alert.jsx
try { (() => {
function Alert({
  title,
  description,
  type = "info",
  style
}) {
  return React.createElement("div", {
    role: "status",
    style: {
      display: "flex",
      gap: "0.75rem",
      padding: "12px 16px",
      background: "var(--surface-card)",
      border: "1px solid " + (type === "error" ? "var(--bronze-500)" : "var(--rule)"),
      fontSize: "0.875rem",
      lineHeight: 1.6,
      margin: "1rem 0",
      ...style
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 8,
      height: 8,
      marginTop: 7,
      flexShrink: 0,
      background: type === "error" ? "var(--bronze-500)" : "var(--charcoal-300)"
    }
  }), React.createElement("div", null, React.createElement("strong", {
    style: {
      fontWeight: 500,
      display: "block"
    }
  }, title), description && React.createElement("span", {
    style: {
      color: "var(--text-secondary)"
    }
  }, description)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Alert.jsx", error: String((e && e.message) || e) }); }

// components/content/Collapse.jsx
try { (() => {
function Collapse({
  label,
  children,
  ghost = false,
  defaultOpen = false,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const chev = React.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: 12,
    height: 12,
    fill: "currentColor",
    "aria-hidden": true,
    style: {
      transition: "transform var(--duration-base)",
      transform: open ? "rotate(90deg)" : "none",
      flexShrink: 0
    }
  }, React.createElement("path", {
    d: "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
  }));
  return React.createElement("div", {
    style: {
      border: ghost ? 0 : "1px solid var(--rule)",
      background: ghost ? "transparent" : "var(--surface-card)",
      ...style
    }
  }, React.createElement("button", {
    type: "button",
    "aria-expanded": open,
    onClick: () => setOpen(!open),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      width: "100%",
      textAlign: "left",
      background: "transparent",
      border: 0,
      padding: ghost ? "0.5rem 0" : "12px 16px",
      font: "inherit",
      fontSize: "0.9375rem",
      fontWeight: 500,
      color: "var(--charcoal-900)",
      cursor: "pointer"
    }
  }, chev, label), open && React.createElement("div", {
    style: {
      padding: ghost ? "0.5rem 0 0" : "4px 16px 16px",
      color: "var(--text-secondary)",
      fontSize: "1rem",
      lineHeight: 1.7
    }
  }, children));
}
Object.assign(__ds_scope, { Collapse });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Collapse.jsx", error: String((e && e.message) || e) }); }

// components/content/PreviewNotice.jsx
try { (() => {
function PreviewNotice({
  title = "Design preview",
  children,
  style
}) {
  return React.createElement("div", {
    style: {
      borderLeft: "2px solid var(--bronze-500)",
      padding: "0.25rem 1.25rem",
      margin: "2rem 0",
      color: "var(--text-secondary)",
      fontSize: "0.875rem",
      lineHeight: 1.75,
      ...style
    }
  }, React.createElement("strong", {
    style: {
      color: "var(--text-accent)",
      fontWeight: 500
    }
  }, title), React.createElement("p", {
    style: {
      margin: "0.5rem 0 0"
    }
  }, children));
}
Object.assign(__ds_scope, { PreviewNotice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PreviewNotice.jsx", error: String((e && e.message) || e) }); }

// components/content/SourceNote.jsx
try { (() => {
function SourceNote({
  children,
  style
}) {
  return React.createElement("p", {
    style: {
      fontSize: "0.8125rem",
      color: "var(--text-secondary)",
      lineHeight: 1.7,
      margin: "1.2rem 0 0",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { SourceNote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SourceNote.jsx", error: String((e && e.message) || e) }); }

// components/core/Breadcrumb.jsx
try { (() => {
function Breadcrumb({
  items = [],
  style
}) {
  return React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      fontSize: "0.875rem",
      color: "var(--text-secondary)",
      paddingTop: "2rem",
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      ...style
    }
  }, items.map((it, i) => React.createElement(React.Fragment, {
    key: i
  }, i > 0 && React.createElement("span", {
    "aria-hidden": true
  }, "/"), it.href && i < items.length - 1 ? React.createElement("a", {
    href: it.href,
    style: {
      color: "var(--text-secondary)"
    }
  }, it.label) : React.createElement("span", {
    style: {
      color: "var(--text-primary)"
    }
  }, it.label))));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children,
  accent = false,
  inverse = false,
  style,
  as = "p"
}) {
  return React.createElement(as, {
    style: {
      fontSize: "0.75rem",
      letterSpacing: "0.13em",
      fontWeight: 500,
      textTransform: "uppercase",
      lineHeight: 1.5,
      margin: "0 0 1.2rem",
      color: inverse ? "var(--on-charcoal-muted)" : accent ? "var(--text-accent)" : "var(--text-secondary)",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/content/ManagerNote.jsx
try { (() => {
function ManagerNote({
  eyebrow = "Manager notes · Template content",
  title,
  children,
  style
}) {
  return React.createElement("aside", {
    style: {
      background: "var(--surface-tint)",
      borderLeft: "2px solid var(--bronze-500)",
      padding: "1.5rem 1.75rem",
      marginTop: "1.5rem",
      ...style
    }
  }, React.createElement(__ds_scope.Eyebrow, {
    style: {
      marginBottom: "0.8rem"
    }
  }, eyebrow), title && React.createElement("h3", {
    style: {
      fontSize: "1.125rem",
      margin: "0 0 0.7rem",
      fontWeight: 500,
      letterSpacing: "-0.02em"
    }
  }, title), React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      margin: 0,
      fontSize: "0.9375rem",
      lineHeight: 1.75
    }
  }, children));
}
Object.assign(__ds_scope, { ManagerNote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ManagerNote.jsx", error: String((e && e.message) || e) }); }

// components/content/ProcessCard.jsx
try { (() => {
function ProcessCard({
  number,
  title,
  description,
  tagline,
  href,
  style
}) {
  const [h, setH] = React.useState(false);
  return React.createElement("a", {
    href,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      flexDirection: "column",
      padding: "1.75rem",
      border: "1px solid " + (h ? "var(--bronze-500)" : "var(--rule)"),
      background: "var(--surface-card)",
      color: "var(--text-primary)",
      textDecoration: "none",
      transition: "border-color var(--duration-base)",
      ...style
    }
  }, React.createElement(__ds_scope.Eyebrow, {
    accent: true,
    as: "span",
    style: {
      marginBottom: "0.75rem"
    }
  }, String(number).padStart(2, "0")), React.createElement("h3", {
    style: {
      fontSize: "1.45rem",
      margin: "0 0 0.75rem",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      lineHeight: 1.3
    }
  }, title), React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.9375rem",
      lineHeight: 1.75,
      margin: "0 0 1rem"
    }
  }, description), React.createElement("span", {
    style: {
      marginTop: "auto",
      color: "var(--text-accent)",
      fontWeight: 500
    }
  }, tagline));
}
Object.assign(__ds_scope, { ProcessCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ProcessCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
// Ant Design outlined glyphs used by the prototype (1024 viewBox), so components don't depend on @ant-design/icons.
const P = {
  "arrow-right": "M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z",
  "arrow-left": "M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z",
  lock: "M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z",
  mail: "M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z",
  search: "M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z",
  environment: "M854.6 289.1a362.49 362.49 0 00-79.9-115.7 370.83 370.83 0 00-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 00169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0022.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z",
  home: "M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z",
  "file-text": "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"
};
function Icon({
  name = "arrow-right",
  size = "1em",
  style,
  ...rest
}) {
  return React.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: size,
    height: size,
    fill: "currentColor",
    "aria-hidden": true,
    focusable: "false",
    style: {
      display: "inline-block",
      verticalAlign: "-0.125em",
      flexShrink: 0,
      ...style
    },
    ...rest
  }, React.createElement("path", {
    d: P[name] || P["arrow-right"]
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/PortalLink.jsx
try { (() => {
function PortalLink({
  eyebrow,
  title,
  href = "#",
  style
}) {
  const [h, setH] = React.useState(false);
  return React.createElement("a", {
    href,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      border: "1px solid var(--rule)",
      padding: "1.7rem 2rem",
      background: h ? "var(--surface-tint-hover)" : "var(--surface-tint)",
      color: "var(--text-primary)",
      textDecoration: "none",
      transition: "background var(--duration-base)",
      ...style
    }
  }, React.createElement("span", null, React.createElement("small", {
    style: {
      display: "block",
      fontSize: "0.75rem",
      letterSpacing: "0.09em",
      textTransform: "uppercase",
      color: "var(--text-secondary)",
      marginBottom: "0.6rem"
    }
  }, eyebrow), React.createElement("strong", {
    style: {
      fontSize: "1.35rem",
      fontWeight: 500,
      letterSpacing: "-0.02em"
    }
  }, title)), React.createElement(__ds_scope.Icon, {
    name: "arrow-right"
  }));
}
Object.assign(__ds_scope, { PortalLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PortalLink.jsx", error: String((e && e.message) || e) }); }

// components/content/StageJumps.jsx
try { (() => {
function StageJumps({
  stages = [],
  hrefBase = "#stage-",
  style
}) {
  return React.createElement("div", {
    style: {
      display: "flex",
      marginTop: "2rem",
      borderTop: "1px solid var(--rule)",
      borderBottom: "1px solid var(--rule)",
      ...style
    }
  }, stages.map((s, i) => React.createElement("a", {
    key: s,
    href: hrefBase + (i + 1),
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "0.7rem",
      padding: "1.5rem 1rem",
      paddingLeft: i === 0 ? 0 : "1rem",
      borderRight: i < stages.length - 1 ? "1px solid var(--rule)" : 0,
      fontSize: "0.875rem",
      color: "var(--charcoal-900)",
      textDecoration: "none",
      minWidth: 0
    }
  }, React.createElement("span", {
    style: {
      fontSize: "1.5rem",
      fontVariantNumeric: "tabular-nums",
      color: "var(--text-accent)"
    }
  }, "0" + (i + 1)), s, React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: "0.75rem",
    style: {
      alignSelf: "flex-end"
    }
  }))));
}
Object.assign(__ds_scope, { StageJumps });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StageJumps.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = "default",
  size = "md",
  block = false,
  arrow = false,
  icon,
  href,
  onClick,
  disabled = false,
  style,
  type = "button"
}) {
  const h = size === "lg" ? 48 : 40;
  const v = {
    primary: {
      background: "var(--action-primary-bg)",
      color: "var(--action-primary-fg)",
      border: "1px solid var(--action-primary-bg)"
    },
    bronze: {
      background: "var(--action-bronze-bg)",
      color: "var(--on-charcoal)",
      border: "1px solid var(--action-bronze-bg)"
    },
    default: {
      background: "var(--surface-card)",
      color: "var(--charcoal-900)",
      border: "1px solid var(--rule)"
    },
    inverse: {
      background: "transparent",
      color: "var(--on-charcoal)",
      border: "1px solid var(--on-charcoal)"
    },
    link: {
      background: "transparent",
      color: "var(--charcoal-900)",
      border: "1px solid transparent",
      padding: 0,
      height: "auto"
    }
  }[variant];
  const hov = {
    primary: "var(--action-primary-hover)",
    bronze: "var(--action-bronze-hover)",
    default: "var(--surface-tint)",
    inverse: "rgba(247,245,239,.12)"
  }[variant];
  const [h2, setH] = React.useState(false);
  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    height: h,
    padding: size === "lg" ? "0 1.5rem" : "0 1.1rem",
    fontFamily: "var(--font-sans)",
    fontSize: size === "lg" ? "1rem" : "0.875rem",
    fontWeight: 500,
    lineHeight: 1,
    borderRadius: "var(--radius-control)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: variant === "link" && h2 ? "underline" : "none",
    transition: "background var(--duration-base) var(--ease-standard)",
    whiteSpace: "nowrap",
    ...v,
    ...(h2 && !disabled && hov ? {
      background: hov
    } : {}),
    ...style
  };
  const T = href ? "a" : "button";
  return React.createElement(T, {
    href,
    onClick,
    disabled: T === "button" ? disabled : undefined,
    type: T === "button" ? type : undefined,
    style: base,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, icon, children, arrow && React.createElement(__ds_scope.Icon, {
    name: "arrow-right"
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/Modal.jsx
try { (() => {
function Modal({
  open,
  title,
  children,
  onClose,
  closeLabel = "Close"
}) {
  if (!open) return null;
  return React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(32,35,33,.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }
  }, React.createElement("div", {
    role: "dialog",
    "aria-modal": true,
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--rule)",
      boxShadow: "var(--shadow-float)",
      width: "min(520px,100%)",
      padding: "1.5rem 1.75rem"
    }
  }, React.createElement("h3", {
    style: {
      fontSize: "1.125rem",
      margin: "0 0 1rem",
      fontWeight: 500
    }
  }, title), React.createElement("div", {
    style: {
      fontSize: "0.9375rem",
      lineHeight: 1.7,
      color: "var(--text-secondary)"
    }
  }, children), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1.5rem"
    }
  }, React.createElement(__ds_scope.Button, {
    onClick: onClose
  }, closeLabel))));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Modal.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  value,
  onChange,
  placeholder,
  search = false,
  ariaLabel,
  style
}) {
  const [f, setF] = React.useState(false);
  return React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      height: 40,
      padding: "0 11px",
      background: "var(--surface-card)",
      border: "1px solid " + (f ? "var(--charcoal-900)" : "var(--rule)"),
      borderRadius: "var(--radius-control)",
      maxWidth: 320,
      width: "100%",
      boxShadow: f ? "0 0 0 2px var(--bronze-100)" : "none",
      transition: "border-color var(--duration-base)",
      ...style
    }
  }, search && React.createElement(__ds_scope.Icon, {
    name: "search",
    style: {
      color: "var(--text-secondary)"
    }
  }), React.createElement("input", {
    value,
    onChange: e => onChange && onChange(e.target.value),
    placeholder,
    "aria-label": ariaLabel || placeholder,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: "transparent",
      font: "inherit",
      fontSize: "0.875rem",
      color: "var(--text-primary)"
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children,
  style
}) {
  return React.createElement("span", {
    style: {
      display: "inline-block",
      fontSize: "0.75rem",
      lineHeight: "20px",
      padding: "0 7px",
      color: "var(--text-secondary)",
      background: "var(--surface-tint)",
      border: "1px solid var(--rule)",
      borderRadius: 0,
      whiteSpace: "nowrap",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/TextLink.jsx
try { (() => {
function TextLink({
  children,
  href = "#",
  arrow = true,
  inverse = false,
  underline = false,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  return React.createElement("a", {
    href,
    onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      color: inverse ? "var(--on-charcoal)" : "var(--charcoal-900)",
      display: "inline-flex",
      gap: "1rem",
      alignItems: "center",
      fontSize: "0.875rem",
      fontWeight: 500,
      textDecoration: h || underline ? "underline" : "none",
      textUnderlineOffset: 3,
      ...style
    }
  }, children, arrow && React.createElement(__ds_scope.Icon, {
    name: "arrow-right"
  }));
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/content/PhotoCard.jsx
try { (() => {
function PhotoCard({
  src,
  address,
  location,
  status,
  rent,
  href,
  framed = false,
  cta,
  style
}) {
  const [h, setH] = React.useState(false);
  const img = React.createElement("img", {
    src,
    alt: address ? "Photograph of " + address : "Property photograph",
    loading: "lazy",
    style: {
      width: "100%",
      aspectRatio: "4 / 3",
      objectFit: "cover",
      display: "block",
      transition: "transform var(--duration-photo)",
      transform: h ? "scale(1.03)" : "none"
    }
  });
  const photo = React.createElement(href ? "a" : "div", {
    href,
    style: {
      display: "block",
      overflow: "hidden"
    },
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, img);
  if (!framed) return React.createElement("figure", {
    style: {
      margin: 0,
      ...style
    }
  }, photo, React.createElement("figcaption", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      fontSize: "0.875rem",
      color: "var(--text-primary)",
      padding: "0.9rem 0"
    }
  }, React.createElement("span", null, address || "Unlabeled property", React.createElement("small", {
    style: {
      display: "block",
      marginTop: "0.35rem",
      color: "var(--text-secondary)",
      fontSize: "0.75rem"
    }
  }, location || "Address unconfirmed")), React.createElement("span", {
    style: {
      flex: "0 0 2.5rem",
      minHeight: "1.5em",
      fontSize: "0.75rem",
      color: "var(--text-secondary)",
      textAlign: "right"
    }
  }, status)));
  return React.createElement("article", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--rule)",
      ...style
    }
  }, photo, React.createElement("div", {
    style: {
      padding: "1.5rem"
    }
  }, status && React.createElement(__ds_scope.Tag, {
    style: {
      marginBottom: "1rem"
    }
  }, status), React.createElement("h3", {
    style: {
      fontSize: "1.35rem",
      margin: "0 0 0.5rem",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      lineHeight: 1.3
    }
  }, href ? React.createElement("a", {
    href,
    style: {
      color: "inherit"
    }
  }, address) : address), React.createElement("p", {
    style: {
      fontSize: "0.875rem",
      color: "var(--text-secondary)",
      margin: "0 0 1.25rem",
      lineHeight: 1.6
    }
  }, location || "Address not provided", rent && React.createElement(React.Fragment, null, React.createElement("br"), "Current rent: ", rent)), href && React.createElement(__ds_scope.TextLink, {
    href
  }, cta || "View property details")));
}
Object.assign(__ds_scope, { PhotoCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PhotoCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
function Wordmark({
  inverse = false,
  small = true,
  size = "1.75rem",
  href = "#/",
  as = "a",
  onClick,
  style
}) {
  const T = as;
  return React.createElement(T, {
    href: T === "a" ? href : undefined,
    onClick,
    "aria-label": "Obelisk homepage",
    style: {
      display: "inline-block",
      fontFamily: "var(--font-sans)",
      fontSize: size,
      fontWeight: 600,
      letterSpacing: "0.14em",
      lineHeight: 1,
      color: inverse ? "var(--on-charcoal)" : "var(--charcoal-900)",
      textDecoration: "none",
      flexShrink: 0,
      ...style
    }
  }, "OBELISK", small && React.createElement("small", {
    style: {
      display: "block",
      fontSize: "0.75rem",
      fontWeight: 400,
      letterSpacing: "0.16em",
      marginTop: "0.7rem"
    }
  }, "FUND MANAGEMENT"));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/data/CapitalStrip.jsx
try { (() => {
function CapitalStrip({
  items = [],
  note = null,
  style
}) {
  return React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(" + items.length + ", minmax(0,1fr))",
      background: "var(--surface-inverse)",
      color: "var(--on-charcoal)",
      padding: "2rem 0",
      ...style
    }
  }, items.map((it, i) => React.createElement("div", {
    key: it.label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      padding: "0 2rem",
      borderRight: i < items.length - 1 ? "1px solid var(--on-charcoal-rule)" : 0,
      minWidth: 0
    }
  }, React.createElement("span", {
    style: {
      fontSize: "0.875rem",
      color: "var(--on-charcoal-muted)"
    }
  }, it.label), React.createElement("strong", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 400,
      fontSize: "clamp(1.65rem,3vw,2.6rem)",
      letterSpacing: "-0.05em",
      lineHeight: 1.1
    }
  }, it.value), note && React.createElement("small", {
    style: {
      fontSize: "0.75rem",
      color: "var(--on-charcoal-muted)"
    }
  }, it.note || note))));
}
Object.assign(__ds_scope, { CapitalStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CapitalStrip.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  emptyText = "No data",
  footer,
  style
}) {
  const th = {
    textAlign: "left",
    background: "var(--surface-tint)",
    color: "var(--text-secondary)",
    fontWeight: 500,
    fontSize: "0.875rem",
    padding: "14px 16px",
    borderBottom: "1px solid var(--rule)",
    whiteSpace: "nowrap"
  };
  return React.createElement("div", {
    style: {
      overflowX: "auto",
      background: "var(--surface-card)",
      border: "1px solid var(--rule)",
      maxWidth: "100%",
      ...style
    }
  }, React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.875rem"
    }
  }, React.createElement("thead", null, React.createElement("tr", null, columns.map(c => React.createElement("th", {
    key: c.key,
    style: {
      ...th,
      textAlign: c.align || "left",
      width: c.width
    }
  }, c.title)))), React.createElement("tbody", null, rows.length === 0 ? React.createElement("tr", null, React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: "2.5rem 1rem",
      textAlign: "center",
      color: "var(--text-secondary)"
    }
  }, emptyText)) : rows.map((r, i) => React.createElement("tr", {
    key: r[rowKey] ?? i
  }, columns.map(c => React.createElement("td", {
    key: c.key,
    style: {
      padding: "18px 16px",
      borderBottom: i < rows.length - 1 ? "1px solid var(--rule)" : 0,
      textAlign: c.align || "left",
      fontVariantNumeric: c.align === "right" ? "tabular-nums" : undefined,
      verticalAlign: "middle"
    }
  }, c.render ? c.render(r) : r[c.key])))))), footer && React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderTop: "1px solid var(--rule)",
      fontSize: "0.875rem",
      color: "var(--text-secondary)"
    }
  }, footer));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/Descriptions.jsx
try { (() => {
function Descriptions({
  items = [],
  bordered = false,
  columns = 1,
  style
}) {
  if (!bordered) return React.createElement("dl", {
    style: {
      margin: 0,
      display: "grid",
      gridTemplateColumns: "repeat(" + columns + ", minmax(0,1fr))",
      gap: "0 2rem",
      fontSize: "0.875rem",
      ...style
    }
  }, items.map(it => React.createElement("div", {
    key: it.label,
    style: {
      display: "flex",
      gap: "1rem",
      padding: "0 0 1rem"
    }
  }, React.createElement("dt", {
    style: {
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, it.label, ":"), React.createElement("dd", {
    style: {
      margin: 0,
      fontVariantNumeric: "tabular-nums"
    }
  }, it.value))));
  const cells = [];
  items.forEach(it => cells.push(React.createElement("div", {
    key: it.label + "l",
    style: {
      background: "var(--surface-tint)",
      color: "var(--text-secondary)",
      padding: "16px 24px",
      borderBottom: "1px solid var(--rule)",
      borderRight: "1px solid var(--rule)"
    }
  }, it.label), React.createElement("div", {
    key: it.label + "v",
    style: {
      padding: "16px 24px",
      borderBottom: "1px solid var(--rule)",
      borderRight: "1px solid var(--rule)",
      fontVariantNumeric: "tabular-nums"
    }
  }, it.value)));
  return React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(" + columns + ", auto minmax(0,1fr))",
      fontSize: "0.875rem",
      background: "var(--surface-card)",
      border: "1px solid var(--rule)",
      borderRight: 0,
      borderBottom: 0,
      ...style
    }
  }, cells);
}
Object.assign(__ds_scope, { Descriptions });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Descriptions.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricTile.jsx
try { (() => {
function MetricTile({
  label,
  value,
  caption,
  pending = false,
  style
}) {
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.8rem",
      padding: "1.6rem 1.25rem",
      borderRight: "1px solid var(--rule)",
      minWidth: 0,
      ...style
    }
  }, React.createElement("span", {
    style: {
      fontSize: "0.875rem"
    }
  }, label), React.createElement("strong", {
    style: pending ? {
      color: "var(--text-secondary)",
      fontSize: "1.1rem",
      lineHeight: 1.5,
      fontWeight: 500
    } : {
      fontSize: "2rem",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 500,
      color: "var(--charcoal-900)",
      overflowWrap: "anywhere",
      lineHeight: 1.1
    }
  }, value), caption && React.createElement("small", {
    style: {
      fontSize: "0.75rem",
      color: "var(--text-secondary)"
    }
  }, caption));
}
Object.assign(__ds_scope, { MetricTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricTile.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricGroup.jsx
try { (() => {
function MetricGroup({
  title,
  metrics = [],
  style
}) {
  return React.createElement("section", {
    "aria-label": title,
    style: {
      marginTop: "1.5rem",
      ...style
    }
  }, title && React.createElement("h3", {
    style: {
      fontSize: "1rem",
      margin: "0 0 0.75rem",
      fontWeight: 500,
      letterSpacing: "-0.02em"
    }
  }, title), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(" + metrics.length + ", minmax(0,1fr))",
      background: "var(--surface-card)",
      border: "1px solid var(--rule)"
    }
  }, metrics.map((m, i) => React.createElement(__ds_scope.MetricTile, {
    key: m.label,
    ...m,
    style: i === metrics.length - 1 ? {
      borderRight: 0
    } : undefined
  }))));
}
Object.assign(__ds_scope, { MetricGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricGroup.jsx", error: String((e && e.message) || e) }); }

// components/layout/InvestorCallout.jsx
try { (() => {
function InvestorCallout({
  eyebrow = "For our investors",
  title = "Your investment. Every stage.",
  text = "Explore your capital account, fund portfolio, and property-level reporting.",
  cta = "Investor portal",
  href = "#/investor-login",
  onClick,
  style
}) {
  return React.createElement("section", {
    style: {
      marginTop: 75,
      background: "var(--surface-inverse)",
      color: "var(--on-charcoal)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2rem",
      padding: 48,
      flexWrap: "wrap",
      ...style
    }
  }, React.createElement("div", null, React.createElement(__ds_scope.Eyebrow, {
    inverse: true
  }, eyebrow), React.createElement("h2", {
    style: {
      fontSize: "clamp(1.8rem,3vw,2.8rem)",
      lineHeight: 1.16,
      letterSpacing: "-0.035em",
      fontWeight: 500,
      margin: "0 0 0.8rem"
    }
  }, title), React.createElement("p", {
    style: {
      color: "var(--on-charcoal-muted)",
      margin: 0,
      lineHeight: 1.75
    }
  }, text)), React.createElement(__ds_scope.Button, {
    variant: "inverse",
    size: "lg",
    arrow: true,
    href,
    onClick
  }, cta));
}
Object.assign(__ds_scope, { InvestorCallout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/InvestorCallout.jsx", error: String((e && e.message) || e) }); }

// components/layout/PageTitle.jsx
try { (() => {
function PageTitle({
  eyebrow,
  title,
  intro,
  aside,
  style
}) {
  return React.createElement("div", {
    style: {
      padding: "60px 0 40px",
      display: "flex",
      gap: "3rem",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      ...style
    }
  }, React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, eyebrow && React.createElement(__ds_scope.Eyebrow, null, eyebrow), React.createElement("h1", {
    style: {
      fontSize: "clamp(2.5rem,4.8vw,4.6rem)",
      lineHeight: 1.05,
      letterSpacing: "-0.045em",
      fontWeight: 500,
      margin: "0 0 1.5rem"
    }
  }, title), intro && React.createElement("p", {
    style: {
      maxWidth: 900,
      fontSize: "1.0625rem",
      color: "var(--text-secondary)",
      margin: 0,
      lineHeight: 1.75
    }
  }, intro)), aside);
}
Object.assign(__ds_scope, { PageTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/PageTitle.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  intro,
  level = 2,
  action,
  style
}) {
  const H = "h" + level;
  return React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "2rem",
      marginBottom: "2rem",
      flexWrap: "wrap",
      ...style
    }
  }, React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, eyebrow && React.createElement(__ds_scope.Eyebrow, null, eyebrow), React.createElement(H, {
    style: level === 2 ? {
      fontSize: "clamp(1.8rem,3vw,2.8rem)",
      lineHeight: 1.16,
      letterSpacing: "-0.035em",
      fontWeight: 500,
      margin: 0
    } : {
      fontSize: "1.45rem",
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
      fontWeight: 500,
      margin: 0
    }
  }, title), intro && React.createElement("p", {
    style: {
      margin: "1rem 0 0",
      color: "var(--text-secondary)",
      lineHeight: 1.75
    }
  }, intro)), action);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/layout/SiteFooter.jsx
try { (() => {
const DISCLOSURE = "The information contained on this website is provided for informational purposes only and does not constitute an offer to sell, or a solicitation of an offer to purchase, any security, investment product, or investment advisory service. Any such offer or solicitation will be made only through applicable offering documents and only to qualified investors in jurisdictions where permitted by law. Investments involve risk, including the possible loss of principal. Past performance is not indicative of future results.";
function SiteFooter({
  tagline = "A full-service affordable housing platform.",
  portalHref = "#/investor-login",
  onNavigate,
  contactHref = "mailto:szhang@obeliskfunds.com",
  status = null,
  year = 2026,
  style
}) {
  return React.createElement("footer", {
    style: {
      background: "var(--surface-tint)",
      padding: "3rem max(6%, calc((100vw - 1320px) / 2))",
      borderTop: "1px solid var(--rule)",
      ...style
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2rem",
      paddingBottom: "2rem",
      flexWrap: "wrap"
    }
  }, React.createElement(__ds_scope.Wordmark, {
    href: "#/"
  }), React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.875rem",
      margin: 0
    }
  }, tagline), React.createElement(__ds_scope.TextLink, {
    href: portalHref,
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate("/investor-login");
      }
    }
  }, "Investor portal")), React.createElement("div", {
    style: {
      borderTop: "1px solid var(--rule)",
      paddingTop: "1.5rem",
      color: "var(--text-secondary)",
      fontSize: "0.75rem",
      maxWidth: 1100
    }
  }, React.createElement("p", {
    style: {
      lineHeight: 1.8,
      margin: "0 0 1rem"
    }
  }, "© " + year + " Obelisk Fund Manager LLC. All rights reserved."), React.createElement("p", {
    style: {
      lineHeight: 1.8,
      margin: 0
    }
  }, DISCLOSURE)), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: status ? "space-between" : "flex-end",
      gap: "2rem",
      fontSize: "0.75rem",
      color: "var(--text-secondary)",
      paddingTop: "1rem",
      flexWrap: "wrap"
    }
  }, status && React.createElement("span", null, status), React.createElement("a", {
    href: contactHref,
    style: {
      color: "var(--text-secondary)"
    }
  }, "Investor relations")));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/layout/SiteHeader.jsx
try { (() => {
function SiteHeader({
  items = [],
  active,
  onNavigate,
  previewBar = false,
  style
}) {
  return React.createElement(React.Fragment, null, previewBar && React.createElement("div", {
    style: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--surface-tint)",
      color: "var(--text-secondary)",
      fontSize: "0.75rem",
      minHeight: 32,
      padding: "0.35rem 1rem",
      flexWrap: "wrap"
    }
  }, React.createElement("span", {
    style: {
      fontWeight: 600,
      letterSpacing: "0.1em"
    }
  }, "DESIGN PREVIEW"), React.createElement("span", null, "Original site content & imagery · Investor figures are illustrative or pending")), React.createElement("header", {
    style: {
      maxWidth: 1440,
      width: "92%",
      margin: "auto",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      minHeight: 104,
      borderBottom: "1px solid var(--rule)",
      ...style
    }
  }, React.createElement(__ds_scope.Wordmark, {
    href: "#/",
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate("/");
      }
    }
  }), React.createElement("nav", {
    "aria-label": "Main navigation",
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      alignSelf: "stretch",
      alignItems: "center",
      rowGap: 0
    }
  }, items.map(it => {
    const on = it.key === active;
    return React.createElement("a", {
      key: it.key,
      href: "#" + it.key,
      "aria-current": on ? "page" : undefined,
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(it.key);
        }
      },
      style: {
        padding: "0 1rem",
        lineHeight: "40px",
        alignSelf: "center",
        fontSize: "0.875rem",
        color: "var(--charcoal-900)",
        textDecoration: "none",
        borderBottom: on ? "2px solid var(--charcoal-900)" : "2px solid transparent",
        fontWeight: on ? 500 : 400,
        whiteSpace: "nowrap"
      }
    }, it.label);
  }))));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/InvestorScreens.jsx
try { (() => {
const {
  Eyebrow,
  Button,
  TextLink,
  Icon,
  Tag,
  Input,
  PortalLink,
  CapitalStrip,
  Descriptions,
  MetricGroup,
  ProcessCard,
  Collapse,
  SourceNote,
  StageJumps,
  DataTable,
  ManagerNote,
  Modal,
  PageTitle,
  SectionHeading
} = window.ObeliskDesignSystem_227ca9;
const h2 = {
  fontSize: "clamp(1.8rem,3vw,2.8rem)",
  lineHeight: 1.16,
  letterSpacing: "-0.035em",
  fontWeight: 500,
  margin: "0 0 1.5rem"
};
const h3 = {
  fontSize: "1.45rem",
  lineHeight: 1.3,
  letterSpacing: "-0.02em",
  fontWeight: 500,
  margin: "0 0 1rem"
};
function InvestorHomeScreen({
  go
}) {
  const [legal, setLegal] = React.useState(false);
  const steps = window.OBK.steps;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageTitle, {
    eyebrow: "Obelisk Fund III, LLC \xB7 Investor Home",
    title: "Welcome, investor.",
    intro: "Welcome back to your investor portal. Review your investment, portfolio, and property-level performance.",
    aside: /*#__PURE__*/React.createElement("aside", {
      style: {
        flexShrink: 0,
        borderLeft: "1px solid var(--rule)",
        paddingLeft: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        color: "var(--text-secondary)",
        margin: 0,
        textTransform: "uppercase"
      }
    }, "Your investor relations manager"), /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: "1.125rem",
        fontWeight: 500
      }
    }, "Sy Zhang"), /*#__PURE__*/React.createElement("a", {
      href: "mailto:szhang@obeliskfunds.com",
      style: {
        fontSize: "0.875rem",
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mail"
    }), " szhang@obeliskfunds.com"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem"
    }
  }, /*#__PURE__*/React.createElement(PortalLink, {
    eyebrow: "Fund-level reporting",
    title: "Fund III Portfolio",
    href: "#/fund-iii-portfolio"
  }), /*#__PURE__*/React.createElement(PortalLink, {
    eyebrow: "Property-level reporting",
    title: "Fund III Properties",
    href: "#/property-performance"
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 50
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Section I",
    title: "Investment at a glance.",
    action: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "0.8125rem",
        color: "var(--text-accent)"
      }
    }, "As of 2026-06-30")
  }), /*#__PURE__*/React.createElement(CapitalStrip, {
    items: [{
      label: "Total contribution",
      value: "$250,000"
    }, {
      label: "Returned initial capital",
      value: "$40,000"
    }, {
      label: "Remaining capital",
      value: "$210,000"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "2.5rem",
      background: "var(--surface-card)",
      border: "1px solid var(--rule)",
      borderTop: 0,
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr)",
      gap: "1.5rem"
    }
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      ...h3,
      fontSize: "1.25rem",
      marginBottom: "1.5rem"
    }
  }, "Investor & commitment"), /*#__PURE__*/React.createElement(Descriptions, {
    columns: 2,
    items: [{
      label: "Name",
      value: "Demo investor"
    }, {
      label: "Fund",
      value: "Obelisk Fund III, LLC"
    }, {
      label: "Legal documents",
      value: /*#__PURE__*/React.createElement(Button, {
        variant: "link",
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "file-text"
        }),
        onClick: () => setLegal(true)
      }, "Subscription agreement")
    }, {
      label: "Total subscription",
      value: "$250,000"
    }, {
      label: "Total contribution",
      value: "$250,000"
    }, {
      label: "Callable capital",
      value: "$0"
    }, {
      label: "Returned initial capital",
      value: "$40,000"
    }, {
      label: "Remaining capital",
      value: "$210,000"
    }]
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--state-pending)",
      fontSize: "0.875rem",
      margin: 0,
      paddingTop: "1.5rem",
      borderTop: "1px solid var(--rule)"
    }
  }, "Preferred return and promote figures are not yet provided")), /*#__PURE__*/React.createElement(SourceNote, null, "Remaining capital is not a valuation. Preferred-return and promote figures appear once provided.")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80
    },
    id: "business-process"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Section II",
    title: "Obelisk business process.",
    intro: "A disciplined, repeatable process\u2014from acquisition to scale."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2,minmax(0,1fr))",
      gap: "1.5rem"
    }
  }, steps.map(s => /*#__PURE__*/React.createElement(ProcessCard, {
    key: s.id,
    number: s.id,
    title: s.name,
    description: s.overview,
    tagline: s.tagline,
    href: "#/investor-home#process-" + s.id
  }))), steps.map(s => /*#__PURE__*/React.createElement("article", {
    key: s.id,
    id: "process-" + s.id,
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: "3.5rem",
      alignItems: "start",
      padding: "3rem 0",
      borderBottom: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: s.image,
    alt: "Original Obelisk " + s.name.toLowerCase() + " illustration",
    loading: "lazy",
    style: {
      width: "100%",
      display: "block",
      border: "1px solid var(--rule)"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Step ", s.id, " \xB7 ", s.name), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...h3,
      fontSize: "1.65rem"
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      lineHeight: 1.75
    }
  }, s.lead), /*#__PURE__*/React.createElement(Collapse, {
    ghost: true,
    label: "Read the full " + s.name.toLowerCase() + " approach"
  }, "The remaining paragraphs of the original process text are retained in the source (reference-content.ts) and expand here."))))), /*#__PURE__*/React.createElement(Modal, {
    open: legal,
    title: "Subscription agreement",
    onClose: () => setLegal(false)
  }, "The source template includes a subscription-agreement link. No agreement has been supplied for this demo account. Production agreements will be available only to the authorized investor."));
}
function FundScreen({
  go
}) {
  const [q, setQ] = React.useState("");
  const rows = window.OBK.photos.filter(p => (p.address + " " + p.location).toLowerCase().includes(q.toLowerCase()));
  const pend = t => /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--state-pending)"
    }
  }, t);
  const cols = [{
    key: "property",
    title: "Property",
    width: 280,
    render: p => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "0.8rem",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: p.image,
      alt: "",
      style: {
        width: 64,
        height: 48,
        objectFit: "cover"
      }
    }), /*#__PURE__*/React.createElement("span", null, p.address, /*#__PURE__*/React.createElement("small", {
      style: {
        display: "block",
        marginTop: "0.3rem",
        fontSize: "0.75rem",
        color: "var(--text-secondary)"
      }
    }, p.location)))
  }, {
    key: "status",
    title: "Status"
  }, {
    key: "acq",
    title: "Acquisition date"
  }, {
    key: "cost",
    title: "Acquisition cost",
    align: "right"
  }, {
    key: "reno",
    title: "Renovation cost",
    align: "right",
    render: p => p.reno ?? pend("Missing")
  }, {
    key: "total",
    title: "Total cost",
    align: "right",
    render: p => p.total ?? pend("Missing")
  }, {
    key: "report",
    title: "Report",
    render: p => p.pending ? /*#__PURE__*/React.createElement("small", {
      style: {
        color: "var(--state-pending)"
      }
    }, "cost basis pending") : /*#__PURE__*/React.createElement("a", {
      href: "#/property-performance/" + p.id,
      "aria-label": "View " + p.address + " report",
      onClick: e => {
        e.preventDefault();
        go("/property-performance/" + p.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    }))
  }];
  const perf = ["Property", "Total cost", "T-12 income", "T-12 OpEx", "T-12 NOI", "Cap rate"].map(t => ({
    key: t,
    title: t
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageTitle, {
    eyebrow: "Investor reporting \xB7 Obelisk Fund III",
    title: "Fund III Portfolio.",
    intro: "From acquisition to capital recycling\u2014a view of each stage of the portfolio."
  }), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Section I",
    title: "Portfolio at a glance.",
    intro: "Cost basis as of 2026-06-30 \xB7 TTM 2025-07-01 to 2026-06-30",
    action: /*#__PURE__*/React.createElement(Tag, null, "Portfolio snapshot")
  }), /*#__PURE__*/React.createElement(MetricGroup, {
    title: "Portfolio",
    metrics: [{
      label: "Homes",
      value: "37"
    }, {
      label: "Occupied homes",
      value: "34"
    }, {
      label: "Occupancy",
      value: "91.9%"
    }, {
      label: "TTM collection rate",
      value: "97.8%",
      caption: "can exceed 100% when arrears are collected"
    }]
  }), /*#__PURE__*/React.createElement(MetricGroup, {
    title: "Cost basis",
    metrics: [{
      label: "Acquisition cost",
      value: "$2,146,300",
      caption: "including closing costs"
    }, {
      label: "Renovation cost",
      value: "$731,900"
    }, {
      label: "Total capitalization",
      value: "$2,878,200"
    }]
  }), /*#__PURE__*/React.createElement(MetricGroup, {
    title: "Trailing twelve months",
    metrics: [{
      label: "TTM rent collected (EGI)",
      value: "$483,600"
    }, {
      label: "TTM NOI",
      value: "$301,150"
    }, {
      label: "TTM NOI yield",
      value: "10.5%"
    }]
  }), /*#__PURE__*/React.createElement(SourceNote, null, "Source: portfolio snapshot, exported 2026-07-01."), /*#__PURE__*/React.createElement(Collapse, {
    style: {
      marginTop: "1rem"
    },
    label: "About these figures"
  }, /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      fontWeight: 500,
      color: "var(--text-primary)"
    }
  }, "Occupancy"), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: "0.35rem 0 1rem"
    }
  }, "Occupied homes \xF7 homes in the fund \xD7 100%."), /*#__PURE__*/React.createElement("dt", {
    style: {
      fontWeight: 500,
      color: "var(--text-primary)"
    }
  }, "TTM NOI yield"), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: "0.35rem 0 0"
    }
  }, "TTM NOI \xF7 total capitalization \xD7 100%.")), /*#__PURE__*/React.createElement(SourceNote, null, "Capital recycling rate, stabilized homes, stabilization rate, and refinance pipeline await an approved source. Zero is a reported value; \u201CMissing\u201D means the source lacks a value; \u201CNot yet reported\u201D means no approved report has supplied it."))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Section II"), /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Portfolio stages under the BRRRR model."), /*#__PURE__*/React.createElement(StageJumps, {
    stages: ["Buy", "Rehab", "Rent & stabilization", "Refinance", "Repeat & scale"],
    hrefBase: "#/fund-iii-portfolio#stage-"
  }), /*#__PURE__*/React.createElement("article", {
    id: "stage-1",
    style: {
      padding: "3rem 0",
      borderBottom: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "01 / Buy",
    level: 3,
    title: "Acquisitions & capital deployed",
    action: /*#__PURE__*/React.createElement(Input, {
      search: true,
      placeholder: "Search the property directory",
      value: q,
      onChange: setQ
    })
  }), /*#__PURE__*/React.createElement(DataTable, {
    columns: cols,
    rows: rows,
    footer: rows.length + " Fund III properties"
  }), /*#__PURE__*/React.createElement(SourceNote, null, "Following the merger of Funds I and II into Fund III, every current home in the portfolio database appears here. Acquisition cost is purchase price including closing costs from the merger model; rows with a legacy cost basis are marked pending. Total cost is reported capitalization."), /*#__PURE__*/React.createElement(ManagerNote, {
    title: "Acquisitions, dispositions & capital returned"
  }, "The source includes a manager-note area for a sold home, the replacement acquisition, and proceeds distributed to investors. An approved period update will populate this section.")), /*#__PURE__*/React.createElement("article", {
    id: "stage-2",
    style: {
      padding: "3rem 0",
      borderBottom: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "02 / Rehab"), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...h3,
      fontSize: "1.75rem"
    }
  }, "Renovation progress"), /*#__PURE__*/React.createElement(ManagerNote, {
    title: "Renovation status"
  }, "The reference template states: \u201CNo property is under renovation.\u201D This is retained as template commentary, not a verified current status."), /*#__PURE__*/React.createElement("p", {
    style: {
      paddingTop: "1.5rem",
      fontSize: "0.9375rem",
      color: "var(--text-secondary)",
      margin: 0
    }
  }, "Renovation scope, budget, spend, and completion dates will appear with the property report.")), /*#__PURE__*/React.createElement("article", {
    id: "stage-3",
    style: {
      padding: "3rem 0",
      borderBottom: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "03 / Rent & stabilization"), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...h3,
      fontSize: "1.75rem"
    }
  }, "Operating performance"), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: "1.125rem",
      fontWeight: 500,
      margin: "2rem 0 1rem"
    }
  }, "3.1 Stabilized homes \xB7 T-12 performance"), /*#__PURE__*/React.createElement(DataTable, {
    columns: perf,
    rows: [],
    emptyText: "Stabilized-property classification and financial data have not been connected."
  }), /*#__PURE__*/React.createElement(ManagerNote, {
    title: "Stabilization criteria"
  }, "The source template describes stabilization as a T-12 cap rate sustainably above 7%, or a Manager determination. The approved definition and cap-rate denominator must be confirmed before calculating or assigning status.")), /*#__PURE__*/React.createElement("article", {
    id: "stage-4",
    style: {
      padding: "3rem 0",
      borderBottom: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "04 / Refinance"), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...h3,
      fontSize: "1.75rem"
    }
  }, "Capital recycling"), /*#__PURE__*/React.createElement(ManagerNote, {
    title: "Financing update"
  }, "The source template notes that the Manager is exploring refinancing options and seeking quotes from lenders.")), /*#__PURE__*/React.createElement("article", {
    id: "stage-5",
    style: {
      padding: "3rem 0"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "05 / Repeat & scale"), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...h3,
      fontSize: "1.75rem"
    }
  }, "The next investment cycle"), /*#__PURE__*/React.createElement(ManagerNote, {
    title: "Scaling update"
  }, "The source template notes that scaling work will be initiated after refinancing is executed."), /*#__PURE__*/React.createElement(Button, {
    style: {
      marginTop: "1.5rem"
    },
    arrow: true,
    onClick: () => go("/investor-home")
  }, "Read the scaling approach"))));
}
Object.assign(window, {
  InvestorHomeScreen,
  FundScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/InvestorScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/PropertyScreens.jsx
try { (() => {
const {
  Eyebrow,
  Button,
  Icon,
  Input,
  PhotoCard,
  Descriptions,
  Collapse,
  SourceNote,
  DataTable,
  Breadcrumb,
  PageTitle,
  SectionHeading,
  Alert
} = window.ObeliskDesignSystem_227ca9;
const h2p = {
  fontSize: "2rem",
  lineHeight: 1.16,
  letterSpacing: "-0.035em",
  fontWeight: 500,
  margin: "0 0 1.5rem"
};
const np = /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--state-pending)"
  }
}, "Not provided");
function PropertyDirectoryScreen({
  go
}) {
  const [q, setQ] = React.useState("");
  const rows = window.OBK.photos.filter(p => (p.address + " " + p.location).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageTitle, {
    eyebrow: "Obelisk Fund III \xB7 Property performance",
    title: "The properties.",
    intro: "Explore the homes in the Fund III portfolio, then open a property for asset, lease, and financial reporting."
  }), /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Current portfolio",
    action: /*#__PURE__*/React.createElement(Input, {
      search: true,
      placeholder: "Search by address",
      value: q,
      onChange: setQ
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "2rem"
    }
  }, rows.map(p => /*#__PURE__*/React.createElement(PhotoCard, {
    key: p.id,
    framed: true,
    src: p.image,
    address: p.address,
    location: p.location,
    status: p.status,
    rent: p.rent || "Not provided",
    href: "#/property-performance/" + p.id
  }))), rows.length === 0 && /*#__PURE__*/React.createElement(Alert, {
    title: "No properties match your search"
  }), /*#__PURE__*/React.createElement(SourceNote, null, "Each photograph is linked to its recorded address. Status and rent come from the portfolio snapshot; unknown values remain Not provided."));
}
function FinancialTable({
  period,
  window: w,
  values
}) {
  const lines = [["Effective gross income (EGI)", "egi"], ["Property tax", "tax"], ["Insurance", "ins"], ["Variable operating expenses", "opex"], ["Net operating income (NOI)", "noi"], ["Capital expenditures (CapEx)", "capex"], ["NOI less CapEx", "nac"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--rule)",
      background: "var(--surface-card)"
    }
  }, /*#__PURE__*/React.createElement(SourceNote, {
    style: {
      margin: 0,
      padding: "1rem"
    }
  }, period, ": ", w), /*#__PURE__*/React.createElement(DataTable, {
    style: {
      border: 0
    },
    columns: [{
      key: "m",
      title: "Financial measure"
    }, {
      key: "v",
      title: period,
      align: "right"
    }],
    rows: lines.map(([m, k]) => ({
      id: k,
      m,
      v: values[k] ?? np
    }))
  }), values.extra && /*#__PURE__*/React.createElement(SourceNote, {
    style: {
      margin: 0,
      padding: "1rem"
    }
  }, values.extra));
}
function PropertyDetailScreen({
  go,
  id
}) {
  const p = window.OBK.photos.find(x => x.id === id) || window.OBK.photos[0];
  const full = p.address + ", " + p.location;
  const lat = 33.5907,
    lon = -86.7325;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Investor Home",
      href: "#/investor-home"
    }, {
      label: "Property Performance",
      href: "#/property-performance"
    }, {
      label: p.address
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2rem",
      padding: "2.5rem 0 2rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Property report"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(2rem,4vw,3.5rem)",
      lineHeight: 1.05,
      letterSpacing: "-0.045em",
      fontWeight: 500,
      margin: "0 0 1rem"
    }
  }, p.address), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      margin: 0,
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "environment"
  }), " ", p.location)), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left"
    }),
    onClick: () => go("/property-performance")
  }, "All properties")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      background: "var(--surface-card)",
      border: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: "Photograph of " + p.address,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      minHeight: 380,
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "2.5rem"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Performance at a glance"), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...h2p,
      fontSize: "1.7rem"
    }
  }, "The asset, in perspective."), /*#__PURE__*/React.createElement(Descriptions, {
    items: [{
      label: "Status",
      value: p.status
    }, {
      label: "Current occupancy",
      value: p.status === "Rented" ? "Occupied" : p.status
    }, {
      label: "Current monthly rent",
      value: p.rent || np
    }, {
      label: "Total cost basis",
      value: p.total || np
    }, {
      label: "Annualized NOI yield since acquisition",
      value: p.total ? "9.8%" : np
    }]
  }), /*#__PURE__*/React.createElement(SourceNote, null, "Cost basis as of 2026-06-30 \xB7 TTM 2025-07-01 to 2026-06-30"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1.5rem",
      padding: "1.5rem 0",
      borderBottom: "1px solid var(--rule)",
      fontSize: "0.875rem"
    }
  }, ["Asset overview", "Lease", "Financial performance", "Location & map"].map((n, i) => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#detail-" + (i + 1)
  }, String(i + 1).padStart(2, "0"), " / ", n))), /*#__PURE__*/React.createElement("section", {
    id: "detail-1",
    style: {
      paddingTop: "3rem"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Section I"), /*#__PURE__*/React.createElement("h2", {
    style: h2p
  }, "Asset overview"), /*#__PURE__*/React.createElement(Descriptions, {
    bordered: true,
    columns: 2,
    items: [{
      label: "Address",
      value: full
    }, {
      label: "Floor plan",
      value: "3 bd · 2 ba"
    }, {
      label: "Vintage",
      value: "1955"
    }, {
      label: "Square footage",
      value: "1,240 sq ft"
    }, {
      label: "Acquisition date",
      value: p.acq
    }, {
      label: "Total acquisition",
      value: p.cost
    }, {
      label: "Total renovation",
      value: p.reno || np
    }, {
      label: "Total cost",
      value: p.total || np
    }, {
      label: "Owner",
      value: "Obelisk Fund III LLC"
    }, {
      label: "Hold period",
      value: "3.2 years"
    }]
  })), /*#__PURE__*/React.createElement("section", {
    id: "detail-2",
    style: {
      paddingTop: "3rem"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Section II"), /*#__PURE__*/React.createElement("h2", {
    style: h2p
  }, "Lease"), /*#__PURE__*/React.createElement(Descriptions, {
    bordered: true,
    columns: 2,
    items: [{
      label: "Monthly rent",
      value: p.rent || np
    }, {
      label: "Lease start",
      value: p.rent ? "2025-04-01" : np
    }, {
      label: "Lease end",
      value: p.rent ? "2026-03-31" : np
    }, {
      label: "Lease term",
      value: p.rent ? "Expired 2026-03-31; renewal not yet recorded" : np
    }]
  }), /*#__PURE__*/React.createElement(SourceNote, null, "Resident information is not shown. Rent is from the latest recorded lease; the lease term is assessed as of 2026-06-30.")), /*#__PURE__*/React.createElement("section", {
    id: "detail-3",
    style: {
      paddingTop: "3rem"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Section III"), /*#__PURE__*/React.createElement("h2", {
    style: h2p
  }, "Financial performance"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "1.45rem",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      margin: "2rem 0 1rem"
    }
  }, "3.1 Trailing 12-month financials"), /*#__PURE__*/React.createElement(FinancialTable, {
    period: "Trailing 12 months",
    window: "2025-07-01 to 2026-06-30",
    values: p.rent ? {
      egi: "$13,200",
      tax: "$1,180",
      ins: "$1,420",
      opex: "$1,190",
      noi: "$9,410",
      capex: "$800",
      nac: "$8,610",
      extra: "Potential rent: $13,800 / Collection rate: 95.7% / NOI yield: 11.8%"
    } : {}
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "1.45rem",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      margin: "2rem 0 1rem"
    }
  }, "3.2 Cumulative performance \xB7 since acquisition"), /*#__PURE__*/React.createElement(FinancialTable, {
    period: "Since acquisition",
    window: p.acq + " to 2026-06-30",
    values: {}
  }), /*#__PURE__*/React.createElement(SourceNote, null, "Monthly history is not part of the snapshot."), /*#__PURE__*/React.createElement(Collapse, {
    style: {
      marginTop: "2rem"
    },
    label: "Calculation rules"
  }, "NOI = EGI \u2212 property tax \u2212 insurance \u2212 variable operating expenses. NOI less CapEx = NOI \u2212 capital expenditures. The periods come from the cockpit\u2019s merger model.")), /*#__PURE__*/React.createElement("section", {
    id: "detail-4",
    style: {
      paddingTop: "3rem"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Section IV"), /*#__PURE__*/React.createElement("h2", {
    style: h2p
  }, "Location & map"), /*#__PURE__*/React.createElement("figure", null, /*#__PURE__*/React.createElement("iframe", {
    title: "Location of " + full,
    loading: "lazy",
    referrerPolicy: "no-referrer",
    style: {
      border: "1px solid var(--rule)",
      width: "100%",
      height: 400
    },
    src: "https://www.openstreetmap.org/export/embed.html?bbox=" + (lon - 0.004) + "," + (lat - 0.003) + "," + (lon + 0.004) + "," + (lat + 0.003) + "&layer=mapnik&marker=" + lat + "," + lon
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontSize: "0.75rem",
      color: "var(--text-secondary)",
      padding: "0.9rem 0"
    }
  }, full, " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.openstreetmap.org/?mlat=" + lat + "&mlon=" + lon + "#map=17/" + lat + "/" + lon,
    style: {
      textDecoration: "underline"
    }
  }, "View on OpenStreetMap")))));
}
Object.assign(window, {
  PropertyDirectoryScreen,
  PropertyDetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/PropertyScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/PublicScreens.jsx
try { (() => {
const {
  Eyebrow,
  Button,
  TextLink,
  PhotoCard,
  PageTitle,
  SectionHeading,
  InvestorCallout,
  SourceNote,
  Icon,
  Input
} = window.ObeliskDesignSystem_227ca9;
const h2Style = {
  fontSize: "clamp(1.8rem,3vw,2.8rem)",
  lineHeight: 1.16,
  letterSpacing: "-0.035em",
  fontWeight: 500,
  margin: "0 0 1.5rem"
};
function HomeScreen({
  go
}) {
  const P = window.OBK.photos;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.02fr 1fr",
      gap: "3rem",
      alignItems: "center",
      padding: "65px 0 55px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Obelisk Fund Management"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(2.75rem,4.5vw,4.35rem)",
      lineHeight: 1.05,
      letterSpacing: "-0.045em",
      fontWeight: 500,
      margin: "0 0 1.5rem"
    }
  }, "A full-service", /*#__PURE__*/React.createElement("br", null), "affordable housing", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "platform.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "1.125rem",
      lineHeight: 1.65,
      color: "var(--text-secondary)",
      margin: "0 0 2rem"
    }
  }, "Quality homes. Thoughtful ownership.", /*#__PURE__*/React.createElement("br", null), "Long-term stewardship."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "1.75rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => go("/portfolio")
  }, "Explore our portfolio"), /*#__PURE__*/React.createElement(TextLink, {
    href: "#/investor-login",
    onClick: e => {
      e.preventDefault();
      go("/investor-login");
    }
  }, "Investor login"))), /*#__PURE__*/React.createElement("figure", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/photos/home-02.png",
    alt: "Single-family home featured in the Obelisk portfolio",
    style: {
      width: "100%",
      height: 440,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      fontSize: "0.75rem",
      color: "var(--text-secondary)",
      padding: "0.9rem 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: "0.1em"
    }
  }, "THE OBELISK PORTFOLIO"), /*#__PURE__*/React.createElement("span", null, "Affordable single-family housing")))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1.6fr",
      gap: "5rem",
      borderTop: "1px solid var(--rule)",
      paddingTop: 65,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Our strategy"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "3.6rem",
      lineHeight: 1.07,
      letterSpacing: "-0.035em",
      fontWeight: 500,
      margin: 0
    }
  }, "Acquire.", /*#__PURE__*/React.createElement("br", null), "Improve.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "Operate."))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: "2rem",
      maxWidth: 750
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "1.65rem",
      color: "var(--charcoal-700)",
      lineHeight: 1.5,
      letterSpacing: "-0.02em",
      margin: "0 0 1.5rem"
    }
  }, "Obelisk acquires, owns and manages single-family rental homes, with a focus on providing well-maintained, attainable housing."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "1.0625rem",
      color: "var(--text-secondary)",
      lineHeight: 1.75,
      margin: "0 0 1.5rem"
    }
  }, "We invest in homes and communities where thoughtful capital investment and hands-on management can improve the resident experience while supporting the long-term quality and value of our properties."), /*#__PURE__*/React.createElement(TextLink, {
    href: "#/investor-home",
    onClick: e => {
      e.preventDefault();
      go("/investor-home");
    }
  }, "Explore our business process"))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Obelisk portfolio",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Quality homes.", /*#__PURE__*/React.createElement("br", null), "Long-term stewardship."),
    action: /*#__PURE__*/React.createElement(TextLink, {
      href: "#/portfolio",
      onClick: e => {
        e.preventDefault();
        go("/portfolio");
      }
    }, "View the full portfolio")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "1.5rem"
    }
  }, P.map(p => /*#__PURE__*/React.createElement(PhotoCard, {
    key: p.id,
    src: p.image,
    address: p.address,
    location: p.location
  })))), /*#__PURE__*/React.createElement(InvestorCallout, {
    onClick: e => {
      e.preventDefault();
      go("/investor-login");
    }
  }));
}
function PortfolioScreen({
  go
}) {
  const P = window.OBK.photos;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageTitle, {
    eyebrow: "The homes behind the platform",
    title: "Our portfolio.",
    intro: "Our portfolio consists of affordable single-family rental homes located in established working-class neighborhoods. Through targeted renovations and disciplined property management, we transform underutilized housing into safe, habitable homes that generate stable cash flow and long-term value for both residents and investors."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "2rem",
      borderTop: "1px solid var(--rule)",
      borderBottom: "1px solid var(--rule)",
      padding: "1.25rem 0",
      margin: "0 0 2rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "0.875rem",
      color: "var(--text-secondary)"
    }
  }, "37 homes in the Fund III portfolio"), /*#__PURE__*/React.createElement(Button, {
    arrow: true,
    onClick: () => go("/investor-login")
  }, "See property performance details")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "2rem"
    }
  }, P.map(p => /*#__PURE__*/React.createElement(PhotoCard, {
    key: p.id,
    src: p.image,
    address: p.address,
    location: p.location
  }))), /*#__PURE__*/React.createElement(SourceNote, null, "Photographs are from Obelisk\u2019s property library and are labeled with each home\u2019s recorded address. Operating data is available to investors through the investor portal."));
}
function LoginScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      maxWidth: 1100,
      margin: "65px auto 15px",
      background: "var(--surface-card)",
      border: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: 650,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/photos/4617-n-richard-arrington-jr-blvd-n.jpg",
    alt: "Home from the Obelisk portfolio",
    style: {
      height: "100%",
      width: "100%",
      objectFit: "cover",
      position: "absolute",
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: "auto 0 0",
      padding: "4rem 2.5rem 2rem",
      background: "var(--gradient-protect)",
      color: "var(--on-charcoal)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    inverse: true
  }, "Obelisk investor partnership"), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...h2Style,
      margin: 0
    }
  }, "Connected to", /*#__PURE__*/React.createElement("br", null), "your investment."))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "3.5rem",
      alignSelf: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: "1.65rem",
    style: {
      color: "var(--bronze-500)",
      marginBottom: "2rem",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement(Eyebrow, null, "Investor portal"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "3rem",
      lineHeight: 1.05,
      letterSpacing: "-0.045em",
      fontWeight: 500,
      margin: "0 0 1.5rem"
    }
  }, "Welcome back."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      lineHeight: 1.75,
      margin: 0
    }
  }, "Your investment at a glance, the fund\u2019s progress, and the properties behind it."), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "2rem 0"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Email address",
    style: {
      maxWidth: "none"
    }
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Password",
    style: {
      maxWidth: "none",
      marginTop: 12
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    arrow: true,
    onClick: () => go("/investor-home")
  }, "Sign in"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.875rem",
      margin: "2rem 0 0",
      lineHeight: 1.75
    }
  }, "Need assistance?", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "mailto:szhang@obeliskfunds.com",
    style: {
      textDecoration: "underline",
      textUnderlineOffset: 3
    }
  }, "Contact Sy Zhang, Investor Relations"))));
}
Object.assign(window, {
  HomeScreen,
  PortfolioScreen,
  LoginScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/PublicScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
window.OBK = {
  nav: [{
    key: "/",
    label: "Home"
  }, {
    key: "/portfolio",
    label: "Portfolio"
  }, {
    key: "/investor-login",
    label: "Investor Login"
  }, {
    key: "/investor-home",
    label: "Investor Home"
  }, {
    key: "/fund-iii-portfolio",
    label: "Fund III Portfolio"
  }, {
    key: "/property-performance",
    label: "Property Performance"
  }],
  photos: [{
    id: "9645-9th-ave-n",
    pid: 1,
    address: "9645 9th Ave N",
    location: "Birmingham, AL 35217",
    status: "Rented",
    rent: "$1,150",
    acq: "2022-03-14",
    cost: "$61,400",
    reno: "$18,200",
    total: "$79,600"
  }, {
    id: "213-22nd-st-sw",
    pid: 2,
    address: "213 22nd St SW",
    location: "Birmingham, AL 35211",
    status: "Rented",
    rent: "$1,095",
    acq: "2022-05-02",
    cost: "$54,900",
    reno: "$21,750",
    total: "$76,650"
  }, {
    id: "4129-avenue-q",
    pid: 3,
    address: "4129 Avenue Q",
    location: "Birmingham, AL 35208",
    status: "Rented",
    rent: "$1,200",
    acq: "2022-06-21",
    cost: "$58,300",
    reno: "$16,900",
    total: "$75,200"
  }, {
    id: "4011-43rd-ave-n",
    pid: 4,
    address: "4011 43rd Ave N",
    location: "Birmingham, AL 35217",
    status: "Leasing",
    rent: null,
    acq: "2022-09-08",
    cost: "$49,800",
    reno: "$24,100",
    total: "$73,900"
  }, {
    id: "7809-vienna-avenue",
    pid: 5,
    address: "7809 Vienna Avenue",
    location: "Birmingham, AL 35206",
    status: "Rented",
    rent: "$1,250",
    acq: "2023-01-17",
    cost: "$66,000",
    reno: "$14,300",
    total: "$80,300"
  }, {
    id: "4617-n-richard-arrington-jr-blvd-n",
    pid: 6,
    address: "4617 N Richard Arrington Jr Blvd N.",
    location: "Birmingham, AL 35212",
    status: "Rented",
    rent: "$1,100",
    acq: "2023-02-28",
    cost: "$52,500",
    reno: "$19,600",
    total: "$72,100"
  }, {
    id: "1444-30th-street-ensley",
    pid: 7,
    address: "1444 30th Street Ensley",
    location: "Birmingham, AL 35218",
    status: "Pending Sec 8",
    rent: null,
    acq: "2023-04-11",
    cost: "$47,200",
    reno: "$22,800",
    total: "$70,000"
  }, {
    id: "4401-avenue-i",
    pid: 38,
    address: "4401 Avenue I",
    location: "Birmingham, AL 35218",
    status: "Rented",
    rent: "$1,175",
    acq: "2026-06-22",
    cost: "$71,000",
    reno: null,
    total: null,
    pending: true
  }].map(p => ({
    ...p,
    image: "../../assets/photos/" + p.id + ".jpg"
  })),
  steps: [{
    id: "1",
    name: "Acquisition",
    overview: "Identify and acquire undervalued, affordable single-family homes in strong rental markets.",
    tagline: "Buy Right.",
    title: "Acquisition of Undervalued Affordable Single Family Homes",
    lead: "Obelisk specializes in acquiring undervalued affordable single-family homes in select U.S. markets where replacement costs significantly exceed acquisition costs and long-term rental demand remains durable. Our acquisition strategy is designed to create value at the point of purchase rather than relying on market appreciation alone.",
    image: "../../assets/illustrations/process-acquisition.png"
  }, {
    id: "2",
    name: "Renovation",
    overview: "Execute cost-effective renovations to meet Section 8 standards with durability and tenant appeal.",
    tagline: "Improve Smart.",
    title: "Renovation: Compliance-Led, Value-Engineered",
    lead: "Our objective is not to maximize renovation spend or create luxury homes. It is to deliver safe, durable, attractive housing that performs above Section 8 requirements—without over-improving the asset.",
    image: "../../assets/illustrations/process-renovation.png"
  }, {
    id: "3",
    name: "Leasing",
    overview: "Rigorous tenant screening and expert handling of government procedures to secure qualified tenants quickly.",
    tagline: "Lease Well.",
    title: "Leasing: Disciplined Screening, Expert Execution",
    lead: "Leasing affordable housing requires more than filling vacancies. Obelisk combines rigorous tenant screening with deep proficiency in government housing programs to convert renovated properties into stable, cash-flowing assets.",
    image: "../../assets/illustrations/process-leasing.png"
  }, {
    id: "4",
    name: "Stabilization",
    overview: "Deliver responsive maintenance, manage expectations, and drive properties to stable, predictable NOI.",
    tagline: "Stabilize Value.",
    title: "Stabilize: From Occupancy to Durable Cash Flow",
    lead: "Leasing a home is only the beginning of the operating cycle. Obelisk treats the post-leasing period as a critical stabilization phase—where we address the realities of living in the home, establish a productive relationship with the tenant, and bring the property to a predictable and sustainable NOI level.",
    image: "../../assets/illustrations/process-stabilization.png"
  }, {
    id: "5",
    name: "Refinance",
    overview: "Refinance stabilized assets to recycle capital and compound portfolio growth at investors’ discretion.",
    tagline: "Recycle Capital.",
    title: "Refinance: Recycle Capital, Compound Scale",
    lead: "Once a property has been renovated, leased, and stabilized, Obelisk evaluates refinancing opportunities based on the property's stabilized cash flow, market value, and prudent leverage capacity. Refinancing serves an important purpose in our investment model: capital recycling.",
    image: "../../assets/illustrations/process-refinancing.png"
  }, {
    id: "6",
    name: "Scaling",
    overview: "Reinvest capital and repeat the cycle to build a concentrated, high-quality portfolio.",
    tagline: "Scale Impact.",
    title: "Scale: Build Density, Replicate the Model",
    lead: "Once Obelisk has established a proven operating model in Birmingham, we seek to scale the platform through greater portfolio density and selective expansion into additional markets.",
    image: "../../assets/illustrations/process-scaling.png"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Collapse = __ds_scope.Collapse;

__ds_ns.ManagerNote = __ds_scope.ManagerNote;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.PhotoCard = __ds_scope.PhotoCard;

__ds_ns.PortalLink = __ds_scope.PortalLink;

__ds_ns.PreviewNotice = __ds_scope.PreviewNotice;

__ds_ns.ProcessCard = __ds_scope.ProcessCard;

__ds_ns.SourceNote = __ds_scope.SourceNote;

__ds_ns.StageJumps = __ds_scope.StageJumps;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.CapitalStrip = __ds_scope.CapitalStrip;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.Descriptions = __ds_scope.Descriptions;

__ds_ns.MetricGroup = __ds_scope.MetricGroup;

__ds_ns.MetricTile = __ds_scope.MetricTile;

__ds_ns.InvestorCallout = __ds_scope.InvestorCallout;

__ds_ns.PageTitle = __ds_scope.PageTitle;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

})();

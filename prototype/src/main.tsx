import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// Ant Design theme mapped to the Obelisk design system (design-system/tokens/colors.css).
// Keep these values in sync with the CSS custom properties in styles.css.
const charcoal = "#202321";
const charcoal700 = "#3A3E3B";
const charcoal500 = "#5F655F";
const ivory50 = "#FCFBF8";
const ivory100 = "#F7F5EF";
const ivory200 = "#EFECE3";
const rule = "#DAD6CB";
const bronze700 = "#7E6340";
const bronze300 = "#C8B393";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: charcoal,
          colorPrimaryHover: charcoal700,
          colorPrimaryActive: charcoal,
          colorText: charcoal,
          colorTextSecondary: charcoal500,
          colorTextTertiary: charcoal500,
          colorLink: charcoal,
          colorLinkHover: bronze700,
          colorLinkActive: bronze700,
          colorBgLayout: ivory100,
          colorBgContainer: ivory50,
          colorBgElevated: ivory50,
          colorBorder: rule,
          colorBorderSecondary: rule,
          colorSplit: rule,
          colorFillAlter: ivory200,
          borderRadius: 2,
          borderRadiusSM: 2,
          borderRadiusLG: 2,
          boxShadow: "0 12px 32px rgba(32,35,33,.14)",
          boxShadowSecondary: "0 12px 32px rgba(32,35,33,.14)",
          fontFamily: 'Archivo, "Helvetica Neue", Arial, sans-serif',
          fontSize: 16,
          controlHeight: 40,
        },
        components: {
          Table: {
            headerBg: ivory200,
            headerColor: charcoal500,
            cellPaddingBlock: 18,
            borderColor: rule,
            rowHoverBg: ivory200,
          },
          Menu: {
            // The header is charcoal; the stylesheet sets the ivory item colors.
            horizontalItemSelectedColor: bronze300,
            horizontalItemHoverColor: bronze300,
            itemBg: "transparent",
            colorSplit: "transparent",
          },
          Button: {
            fontWeight: 500,
            primaryShadow: "none",
            defaultShadow: "none",
          },
          Tag: { borderRadiusSM: 0 },
          Card: { borderRadiusLG: 0 },
          Collapse: { borderRadiusLG: 0, headerBg: ivory200 },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
);

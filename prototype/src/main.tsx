import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1e3a5f",
          colorText: "#16181d",
          colorTextSecondary: "#656b75",
          colorBgLayout: "#faf9f6",
          colorBorder: "#dcdedc",
          borderRadius: 4,
          fontFamily: "Archivo, sans-serif",
          fontSize: 15,
          controlHeight: 40,
        },
        components: {
          Table: {
            headerBg: "#f5f5f1",
            headerColor: "#656b75",
            cellPaddingBlock: 18,
          },
          Menu: {
            horizontalItemSelectedColor: "#1e3a5f",
            itemBg: "transparent",
          },
          Button: { fontWeight: 500 },
        },
      }}
    >
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </React.StrictMode>,
);

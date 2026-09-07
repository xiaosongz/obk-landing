import { useEffect, useState } from "react";
import { Button, Menu } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { HomePage, InvestorLoginPage, PortfolioPage } from "./PublicPages";
import InvestorHome from "./InvestorHome";
import FundPortfolio from "./FundPortfolio";
import { PropertyDetail, PropertyDirectory } from "./PropertyPages";
import { navigation } from "./site-data";
import { reference } from "./reference-content";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.startsWith("/property-performance")
    ? "/property-performance"
    : location.pathname;
  useEffect(() => {
    setMenuOpen(false);
    document.title = `${navigation.find((page) => page.key === active)?.label ?? "Obelisk"} · Obelisk Fund Management`;
    if (location.hash) {
      document
        .getElementById(decodeURIComponent(location.hash.slice(1)))
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [location.pathname, location.hash, active]);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="preview-bar">
        <span>DESIGN PREVIEW</span>
        <span>
          Original site content & imagery · Investor figures are illustrative or
          pending
        </span>
      </div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Obelisk homepage">
          OBELISK<small>FUND MANAGEMENT</small>
        </Link>
        <Button
          className="mobile-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close menu" : "Menu"}
        </Button>
        <nav className="desktop-navigation" aria-label="Main navigation">
          <Menu
            mode="horizontal"
            selectedKeys={[active]}
            items={navigation}
            onClick={({ key }) => navigate(key)}
          />
        </nav>
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Main navigation"
          hidden={!menuOpen}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenuOpen(false);
              document
                .querySelector<HTMLButtonElement>(".mobile-menu-toggle")
                ?.focus();
            }
          }}
        >
          {navigation.map((page) => (
            <Link
              key={page.key}
              to={page.key}
              aria-current={active === page.key ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {page.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/investor-login" element={<InvestorLoginPage />} />
          <Route path="/investor-home" element={<InvestorHome />} />
          <Route path="/fund-iii-portfolio" element={<FundPortfolio />} />
          <Route path="/property-performance" element={<PropertyDirectory />} />
          <Route
            path="/property-performance/:propertyId"
            element={<PropertyDetail />}
          />
          <Route
            path="*"
            element={
              <div className="page-title">
                <h1>Page not found.</h1>
                <Button href="#/">Return to the homepage</Button>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <Link className="brand" to="/">
            OBELISK<small>FUND MANAGEMENT</small>
          </Link>
          <p>A full-service affordable housing platform.</p>
          <Link className="text-link" to="/investor-login">
            Investor portal <ArrowRightOutlined />
          </Link>
        </div>
        <div className="footer-disclosure">
          <p>© 2026 Obelisk Fund Manager LLC. All rights reserved.</p>
          <p>{reference.disclosure.replace(/^Disclosure:\s*/, "")}</p>
        </div>
        <div className="footer-bottom">
          <span>
            Local design prototype · Authentication and financial reporting are
            not connected
          </span>
          <a href="mailto:szhang@obeliskfunds.com">Investor relations</a>
        </div>
      </footer>
    </>
  );
}

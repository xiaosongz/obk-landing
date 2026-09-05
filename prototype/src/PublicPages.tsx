import { Button, Image } from "antd";
import { ArrowRightOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { reference } from "./reference-content";

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">OBELISK FUND MANAGEMENT</p>
          <h1>
            A full-service
            <br />
            affordable housing
            <br />
            <em>platform.</em>
          </h1>
          <p>
            Quality homes. Thoughtful ownership.
            <br />
            Long-term stewardship.
          </p>
          <div className="actions">
            <Button type="primary" size="large" href="#/portfolio">
              Explore our portfolio <ArrowRightOutlined />
            </Button>
            <Link className="text-link" to="/investor-login">
              Investor login <ArrowRightOutlined />
            </Link>
          </div>
        </div>
        <figure className="hero-photo">
          <img
            src={reference.photos.home[1]}
            alt="Single-family home featured in the Obelisk portfolio"
            fetchPriority="high"
          />
          <figcaption>
            <span>THE OBELISK PORTFOLIO</span>
            <span>Affordable single-family housing</span>
          </figcaption>
        </figure>
      </section>
      <section className="strategy-section section-space" id="strategy">
        <div>
          <p className="eyebrow">OUR STRATEGY</p>
          <h2>
            Acquire.
            <br />
            Improve.
            <br />
            <em>Operate.</em>
          </h2>
        </div>
        <div className="strategy-copy">
          <p className="large-copy">
            Obelisk acquires, owns and manages single-family rental homes, with
            a focus on providing well-maintained, attainable housing.
          </p>
          <p>
            We invest in homes and communities where thoughtful capital
            investment and hands-on management can improve the resident
            experience while supporting the long-term quality and value of our
            properties.
          </p>
          <Link className="text-link" to="/investor-home#business-process">
            Explore our business process <ArrowRightOutlined />
          </Link>
        </div>
      </section>
      <section className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OBELISK PORTFOLIO</p>
            <h2>
              Quality homes.
              <br />
              Long-term stewardship.
            </h2>
          </div>
          <Link className="text-link" to="/portfolio">
            View the full portfolio <ArrowRightOutlined />
          </Link>
        </div>
        <Image.PreviewGroup>
          <div className="home-gallery">
            {reference.photos.home.map((src, index) => (
              <figure key={src}>
                <Image
                  src={src}
                  alt={`Obelisk portfolio photograph ${index + 1}`}
                  loading="lazy"
                />
                <figcaption>
                  <span>OBELISK RESIDENTIAL</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Image.PreviewGroup>
      </section>
      <section className="film-section section-space">
        <div>
          <p className="eyebrow">FEATURED VIDEO</p>
          <h2>
            A closer look
            <br />
            at the platform.
          </h2>
          <p>
            The partner’s template reserves this space for a featured film. The
            video has not been supplied yet.
          </p>
          <Link className="text-link" to="/portfolio">
            Explore the homes in pictures <ArrowRightOutlined />
          </Link>
        </div>
        <div className="film-placeholder">
          <span>OBELISK</span>
          <p>Featured video coming soon</p>
        </div>
      </section>
      <section className="investor-callout">
        <div>
          <p className="eyebrow">FOR OUR INVESTORS</p>
          <h2>Your investment. Every stage.</h2>
          <p>
            Explore your capital account, fund portfolio, and property-level
            reporting.
          </p>
        </div>
        <Button size="large" href="#/investor-login">
          Investor portal <ArrowRightOutlined />
        </Button>
      </section>
    </>
  );
}

export function PortfolioPage() {
  return (
    <>
      <div className="page-title">
        <p className="eyebrow">THE HOMES BEHIND THE PLATFORM</p>
        <h1>Our portfolio.</h1>
        <p className="page-intro">
          Our portfolio consists of affordable single-family rental homes
          located in established working-class neighborhoods. Through targeted
          renovations and disciplined property management, we transform
          underutilized housing into safe, habitable homes that generate stable
          cash flow and long-term value for both residents and investors.
        </p>
      </div>
      <div className="gallery-toolbar">
        <p>
          {reference.photos.portfolio.length} photographs from the partner’s
          portfolio showcase
        </p>
        <Button href="#/investor-login">
          See property performance details <ArrowRightOutlined />
        </Button>
      </div>
      <Image.PreviewGroup>
        <div className="portfolio-gallery">
          {reference.photos.portfolio.map((src, index) => (
            <figure key={`${src}-${index}`}>
              <Image
                src={src}
                alt={`Home shown in the original Obelisk portfolio gallery, photograph ${index + 1}`}
                loading={index < 3 ? "eager" : "lazy"}
              />
              <figcaption>
                <span>OBELISK RESIDENTIAL</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Image.PreviewGroup>
      <p className="source-note">
        Photography is from the supplied site. Current ownership and operating
        status are shown separately in investor reporting.
      </p>
    </>
  );
}

export function InvestorLoginPage() {
  return (
    <section className="login-page">
      <div className="login-photo">
        <img
          src={reference.photos.home[5]}
          alt="Home from the Obelisk portfolio"
        />
        <div>
          <p className="eyebrow">OBELISK INVESTOR PARTNERSHIP</p>
          <h2>
            Connected to
            <br />
            your investment.
          </h2>
        </div>
      </div>
      <div className="login-content">
        <LockOutlined className="login-icon" />
        <p className="eyebrow">INVESTOR PORTAL</p>
        <h1>Welcome back.</h1>
        <p>
          Your investment at a glance, the fund’s progress, and the properties
          behind it.
        </p>
        <div className="preview-notice">
          <strong>Design preview</strong>
          <p>
            Sign-in is not connected yet. Explore a demo investor account; no
            credentials are required.
          </p>
        </div>
        <Button type="primary" size="large" block href="#/investor-home">
          Explore investor home <ArrowRightOutlined />
        </Button>
        <p className="login-contact">
          Need assistance?
          <br />
          <a href="mailto:szhang@obeliskfunds.com">
            Contact Sy Zhang, Investor Relations
          </a>
        </p>
      </div>
    </section>
  );
}

import { Alert, Button, Image, Input } from "antd";
import { ArrowRightOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { useGateStatus } from "./useGateStatus";
import { fullSize, responsive } from "./images";
import { reference } from "./reference-content";
import { portfolioProperties } from "./site-data";

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
            <Button type="primary" size="large" href="/portfolio">
              Explore our portfolio <ArrowRightOutlined />
            </Button>
            <Link className="text-link" to="/investor-login">
              Investor login <ArrowRightOutlined />
            </Link>
          </div>
        </div>
        <figure className="hero-photo">
          <img
            {...responsive(
              reference.photos.home[1],
              "(max-width: 850px) 100vw, 45vw",
            )}
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
            {portfolioProperties.slice(0, 8).map((property) => (
              <figure key={property.id}>
                <Image
                  {...responsive(
                    property.image,
                    "(max-width: 1100px) 50vw, 22vw",
                  )}
                  preview={{ src: fullSize(property.image) }}
                  alt={
                    property.addressProvided
                      ? `Property at ${property.name}, ${property.location}`
                      : "Property photograph · address unconfirmed"
                  }
                  loading="lazy"
                />
                <figcaption>
                  <span>
                    {property.name}
                    <small>{property.location ?? "Address unconfirmed"}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Image.PreviewGroup>
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
        <Button size="large" href="/investor-login">
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
        <p>{portfolioProperties.length} homes in the Fund III portfolio</p>
        <Button href="/investor-login">
          See property performance details <ArrowRightOutlined />
        </Button>
      </div>
      <Image.PreviewGroup>
        <div className="portfolio-gallery">
          {portfolioProperties.map((property, index) => (
            <figure key={property.id}>
              <Image
                {...responsive(property.image, "(max-width: 850px) 50vw, 29vw")}
                preview={{ src: fullSize(property.image) }}
                alt={
                  property.addressProvided
                    ? `Property at ${property.name}, ${property.location}`
                    : "Property photograph · address unconfirmed"
                }
                loading={index < 3 ? "eager" : "lazy"}
              />
              <figcaption>
                <span>
                  {property.name}
                  <small>{property.location ?? "Address unconfirmed"}</small>
                </span>
                <span className="property-status">
                  {property.sold ? "Sold" : null}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Image.PreviewGroup>
      <p className="source-note">
        Photographs are from Obelisk’s property library and are labeled with
        each home’s recorded address. Operating data is available to investors
        through the investor portal.
      </p>
    </>
  );
}

export function InvestorLoginPage() {
  const [params] = useSearchParams();
  const gate = useGateStatus();
  const next = params.get("next") ?? "/investor-home";
  const failed = params.get("error") === "1";
  return (
    <section className="login-page">
      <div className="login-photo">
        <img
          {...responsive(
            reference.photos.home[5],
            "(max-width: 850px) 100vw, 50vw",
          )}
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
        {gate === "in" ? (
          <Button type="primary" size="large" block href={next}>
            Continue to investor home <ArrowRightOutlined />
          </Button>
        ) : (
          <form className="login-form" method="post" action="/__gate">
            <input type="hidden" name="next" value={next} />
            <label htmlFor="access-password">Access password</label>
            <Input.Password
              id="access-password"
              name="password"
              size="large"
              autoComplete="current-password"
              autoFocus
              required
            />
            {failed ? (
              <Alert
                type="error"
                showIcon={false}
                message="That password was not recognized."
              />
            ) : null}
            <Button type="primary" size="large" block htmlType="submit">
              Sign in <ArrowRightOutlined />
            </Button>
          </form>
        )}
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

import { Button, Collapse, Descriptions, Image, Modal } from "antd";
import {
  ArrowRightOutlined,
  FileTextOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { reference } from "./reference-content";
import { currency, investorExample } from "./site-data";

const amountRows = (
  rows: { key: string; label: string; amount: number | null }[],
) =>
  rows
    .filter((row) => row.amount !== null)
    .map((row) => ({
      key: row.key,
      label: row.label,
      children: <span className="number">{currency(row.amount!)}</span>,
    }));

export default function InvestorHome() {
  const [legalOpen, setLegalOpen] = useState(false);
  const account = investorExample;
  const preferredRows = amountRows([
    {
      key: "total",
      label: "Total preferred return",
      amount: account.preferredTotal,
    },
    {
      key: "distributed",
      label: "Distributed preferred return",
      amount: account.preferredDistributed,
    },
    {
      key: "accrued",
      label: "Accrued preferred return",
      amount: account.preferredAccrued,
    },
  ]);
  const promoteRows = amountRows([
    { key: "total", label: "Total promote", amount: account.promoteTotal },
    {
      key: "distributed",
      label: "Distributed promote",
      amount: account.promoteDistributed,
    },
    {
      key: "remaining",
      label: "Remaining promote",
      amount: account.promoteRemaining,
    },
  ]);
  const returnsEmpty = preferredRows.length === 0 && promoteRows.length === 0;
  return (
    <>
      <div className="page-title investor-welcome">
        <div>
          <p className="eyebrow">OBELISK FUND III, LLC · INVESTOR HOME</p>
          <h1>Welcome, investor.</h1>
          <p className="page-intro">
            Welcome back to your investor portal. Review your investment,
            portfolio, and property-level performance.
          </p>
        </div>
        <aside className="contact-panel">
          <p>YOUR INVESTOR RELATIONS MANAGER</p>
          <strong>Sy Zhang</strong>
          <a href="mailto:szhang@obeliskfunds.com">
            <MailOutlined /> szhang@obeliskfunds.com
          </a>
        </aside>
      </div>
      <div className="portal-links">
        <Link to="/fund-iii-portfolio">
          <span>
            <small>FUND-LEVEL REPORTING</small>
            <strong>Fund III Portfolio</strong>
          </span>
          <ArrowRightOutlined />
        </Link>
        <Link to="/property-performance">
          <span>
            <small>PROPERTY-LEVEL REPORTING</small>
            <strong>Fund III Properties</strong>
          </span>
          <ArrowRightOutlined />
        </Link>
      </div>
      <section className="section-space investment-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SECTION I</p>
            <h2>Investment at a glance.</h2>
          </div>
          <span className="data-label">Illustrative capital account</span>
        </div>
        <div className="capital-strip">
          {[
            { label: "Total contribution", amount: account.contribution },
            { label: "Returned initial capital", amount: account.returned },
            { label: "Remaining capital", amount: account.remaining },
          ].map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{currency(item.amount)}</strong>
              <small>Demo account · USD</small>
            </div>
          ))}
        </div>
        <div
          className={`account-grid${returnsEmpty ? " account-grid-empty-returns" : ""}`}
        >
          <section>
            <h3>Investor & commitment</h3>
            <Descriptions
              column={1}
              items={[
                { key: "name", label: "Name", children: account.name },
                {
                  key: "fund",
                  label: "Fund",
                  children: "Obelisk Fund III, LLC",
                },
                {
                  key: "legal",
                  label: "Legal documents",
                  children: (
                    <Button
                      className="inline-button"
                      type="link"
                      icon={<FileTextOutlined />}
                      onClick={() => setLegalOpen(true)}
                    >
                      Subscription agreement
                    </Button>
                  ),
                },
                ...amountRows([
                  {
                    key: "subscription",
                    label: "Total subscription",
                    amount: account.subscription,
                  },
                  {
                    key: "contribution",
                    label: "Total contribution",
                    amount: account.contribution,
                  },
                  {
                    key: "callable",
                    label: "Callable capital",
                    amount: account.callable,
                  },
                  {
                    key: "returned",
                    label: "Returned initial capital",
                    amount: account.returned,
                  },
                  {
                    key: "remaining",
                    label: "Remaining capital",
                    amount: account.remaining,
                  },
                ]),
              ]}
            />
          </section>
          {returnsEmpty ? (
            <p className="pending account-returns-note">
              Preferred return and promote figures are not yet provided
            </p>
          ) : (
            <section>
              {preferredRows.length > 0 && (
                <>
                  <h3>Preferred return</h3>
                  <Descriptions column={1} items={preferredRows} />
                </>
              )}
              {promoteRows.length > 0 && (
                <>
                  <h3
                    className={
                      preferredRows.length ? "promote-heading" : undefined
                    }
                  >
                    Promote
                  </h3>
                  <Descriptions column={1} items={promoteRows} />
                </>
              )}
            </section>
          )}
        </div>
        <p className="source-note">
          The capital account uses fictional figures for review. Unprovided
          preferred-return and promote figures remain unfilled. Remaining
          capital is not a valuation. No live investor record is connected.
        </p>
      </section>
      <section className="section-space business-process" id="business-process">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SECTION II</p>
            <h2>Obelisk business process.</h2>
            <p className="section-intro">
              A disciplined, repeatable process—from acquisition to scale.
            </p>
          </div>
        </div>
        <div className="process-cards">
          {reference.processSteps.map((step) => (
            <a
              className="process-card"
              key={step.id}
              href={`#/investor-home#process-${step.id}`}
            >
              <span className="eyebrow">{step.id.padStart(2, "0")}</span>
              <h3>{step.name}</h3>
              <p>{step.overview}</p>
              <span className="process-tagline">{step.tagline}</span>
            </a>
          ))}
        </div>
        {reference.processSteps.map((step) => (
          <article
            className="process-step"
            id={`process-${step.id}`}
            key={step.id}
          >
            <div className="process-illustration">
              <Image
                src={step.image}
                alt={`Original Obelisk ${step.name.toLowerCase()} illustration`}
                loading="lazy"
              />
            </div>
            <div className="process-copy">
              <p className="eyebrow">
                STEP {step.id} · {step.name.toUpperCase()}
              </p>
              <h3>{step.title.replace(/^Step \d\.\s*/, "")}</h3>
              <p>{step.paragraphs[0]}</p>
              <Collapse
                ghost
                items={[
                  {
                    key: step.id,
                    label: `Read the full ${step.name.toLowerCase()} approach`,
                    children: (
                      <div className="process-detail">
                        {step.paragraphs.slice(1).map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </article>
        ))}
      </section>
      <Modal
        title="Subscription agreement"
        open={legalOpen}
        onCancel={() => setLegalOpen(false)}
        footer={<Button onClick={() => setLegalOpen(false)}>Close</Button>}
      >
        <p>
          The source template includes a subscription-agreement link. No
          agreement has been supplied for this demo account.
        </p>
        <p>
          Production agreements will be available only to the authorized
          investor.
        </p>
      </Modal>
    </>
  );
}

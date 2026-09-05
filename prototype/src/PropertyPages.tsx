import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Breadcrumb,
  Button,
  Collapse,
  Descriptions,
  Image,
  Input,
  Table,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { financialLines, portfolioProperties } from "./site-data";
import type { PortfolioProperty } from "./site-data";
import { reference } from "./reference-content";

const notProvided = <span className="pending">Not provided</span>;

function PropertyCards({ properties }: { properties: PortfolioProperty[] }) {
  return (
    <div className="property-grid">
      {properties.map((p) => (
        <article key={p.id}>
          <Link
            to={`/property-performance/${p.id}`}
            className="property-card-photo"
          >
            <img
              src={p.image}
              alt={
                p.addressProvided
                  ? `Source property photograph for ${p.name}`
                  : p.name
              }
              loading="lazy"
            />
          </Link>
          <div className="property-card-content">
            <Tag>
              {p.sold
                ? "Sold · source template"
                : "Current portfolio · source template"}
            </Tag>
            <h3>
              <Link to={`/property-performance/${p.id}`}>{p.name}</Link>
            </h3>
            <p>{p.location ?? "Address not provided in the reference"}</p>
            <Link className="text-link" to={`/property-performance/${p.id}`}>
              View property details <ArrowRightOutlined />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PropertyDirectory() {
  const [search, setSearch] = useState("");
  const matches = portfolioProperties.filter((p) =>
    `${p.name} ${p.location ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-title">
        <p className="eyebrow">OBELISK FUND III · PROPERTY PERFORMANCE</p>
        <h1>The properties.</h1>
        <p className="page-intro">
          Explore the homes in the source portfolio, then open a property for
          asset, lease, and financial reporting.
        </p>
      </div>
      <div className="section-heading">
        <h2>Current portfolio</h2>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          aria-label="Search properties"
          placeholder="Search by address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <PropertyCards properties={matches.filter((p) => !p.sold)} />
      {matches.length === 0 && (
        <Alert title="No properties match your search" type="info" showIcon />
      )}
      <section className="section-space">
        <h2 className="standalone-heading">Sold properties</h2>
        <PropertyCards properties={matches.filter((p) => p.sold)} />
      </section>
      <p className="source-note">
        Current/sold grouping follows the source template. Four current entries
        include addresses; the remaining captions and all operating data await
        completion. Photos are not assigned to invented financial records.
      </p>
    </>
  );
}

function FinancialTable({ cumulative = false }: { cumulative?: boolean }) {
  const period = cumulative ? "Since acquisition" : "Trailing 12 months";
  return (
    <div className="financial-report">
      <Table
        dataSource={financialLines}
        rowKey="key"
        pagination={false}
        columns={[
          { title: "Financial measure", dataIndex: "label", key: "label" },
          {
            title: period,
            key: "amount",
            align: "right",
            render: () => (
              <span
                className="pending"
                aria-label="Financial value not provided"
              >
                —
              </span>
            ),
          },
        ]}
      />
      <div className="history-pending">
        <p className="eyebrow">
          {cumulative ? "CUMULATIVE PERFORMANCE" : "MONTHLY FINANCIAL HISTORY"}
        </p>
        <h4>Financial history pending</h4>
        <p>
          The source chart is a screenshot placeholder. This area will show the
          reported income, operating expenses, NOI, and cash flow when the
          financial data is connected.
        </p>
        <span>No values are treated as zero.</span>
      </div>
    </div>
  );
}

export function PropertyDetail() {
  const { propertyId } = useParams();
  const property = portfolioProperties.find((p) => p.id === propertyId);
  if (!property)
    return (
      <div className="page-title">
        <h1>Property not found.</h1>
        <Button href="#/property-performance">Return to properties</Button>
      </div>
    );
  const isSourceDetail = property.id === "2-4401-avenue-i";
  const fields = (labels: string[]) =>
    labels.map((label) => ({ key: label, label, children: notProvided }));
  return (
    <>
      <Breadcrumb
        className="property-breadcrumb"
        items={[
          { title: <Link to="/investor-home">Investor Home</Link> },
          {
            title: <Link to="/property-performance">Property Performance</Link>,
          },
          { title: property.name },
        ]}
      />
      <div className="property-title">
        <div>
          <p className="eyebrow">PROPERTY REPORT</p>
          <h1>{property.name}</h1>
          <p>
            <EnvironmentOutlined />{" "}
            {property.location ?? "Location not provided"}
          </p>
        </div>
        <Button icon={<ArrowLeftOutlined />} href="#/property-performance">
          All properties
        </Button>
      </div>
      <div className="property-summary">
        <Image
          src={
            isSourceDetail
              ? reference.photos["property-detail"][0]
              : property.image
          }
          alt={`Source photograph for ${property.name}`}
        />
        <div>
          <p className="eyebrow">PERFORMANCE AT A GLANCE</p>
          <h2>The asset, in perspective.</h2>
          <Descriptions
            column={1}
            items={[
              {
                key: "status",
                label: "Status",
                children: property.sold
                  ? "Sold property · source template"
                  : "Current portfolio · source template",
              },
              ...fields([
                "Current occupancy",
                "Current monthly rent",
                "Total cost basis",
                "Cumulative cash-on-cash return",
              ]),
            ]}
          />
          <p className="source-note">
            Report date and last data update: not yet provided.
          </p>
        </div>
      </div>
      <div className="detail-jumps">
        {[
          "Asset overview",
          "Lease",
          "Financial performance",
          "Location & map",
        ].map((name, i) => (
          <a
            key={name}
            href={`#/property-performance/${property.id}#detail-${i + 1}`}
          >
            {String(i + 1).padStart(2, "0")} / {name}
          </a>
        ))}
      </div>
      <section className="detail-section" id="detail-1">
        <p className="eyebrow">SECTION I</p>
        <h2>Asset overview</h2>
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          items={[
            {
              key: "address",
              label: "Address",
              children: property.addressProvided
                ? `${property.name}, ${property.location}`
                : notProvided,
            },
            ...fields([
              "Floor plan",
              "Property type",
              "Vintage",
              "Square footage",
              "Acquisition date",
              "Total acquisition",
              "Total renovation",
              "Total cost",
            ]),
            {
              key: "owner",
              label: "Owner",
              children: isSourceDetail
                ? "Obelisk Fund III LLC · source template"
                : notProvided,
            },
          ]}
        />
      </section>
      <section className="detail-section" id="detail-2">
        <p className="eyebrow">SECTION II</p>
        <h2>Lease</h2>
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          items={fields([
            "Tenant(s)",
            "Monthly rent",
            "Lease type",
            "Security deposit",
            "Lease start date",
            "Lease end date",
            "Section 8 amount",
            "Tenant portion",
          ])}
        />
        <p className="source-note">
          Lease and resident information is not included in this preview.
          Production access will be restricted to authorized users.
        </p>
      </section>
      <section className="detail-section" id="detail-3">
        <p className="eyebrow">SECTION III</p>
        <h2>Financial performance</h2>
        <h3>3.1 Trailing 12-month financials</h3>
        <FinancialTable />
        <h3 className="cumulative-heading">
          3.2 Cumulative performance · since acquisition
        </h3>
        <FinancialTable cumulative />
        <Collapse
          className="calculation-rules"
          items={[
            {
              key: "rules",
              label: "Calculation rules from the reporting template",
              children: (
                <div className="prose">
                  <p>
                    T-12 spans the first day of the starting month through the
                    last day of the ending month. The source anticipates monthly
                    reporting. Cumulative performance runs from acquisition
                    through the report date.
                  </p>
                  <p>
                    The template’s EGI definition includes rent, subsidy income,
                    applicable fees, forfeitures, interest, and reimbursements.
                    Variable operating expenses include management, utilities,
                    repairs, maintenance, and turnover.
                  </p>
                  <p>
                    NOI = EGI − property tax − insurance − variable operating
                    expenses.
                    <br />
                    FCF = NOI − capital expenditures.
                  </p>
                  <p>
                    These are the partner’s reporting requirements. Accounting
                    treatment and period definitions must be reconciled with the
                    existing financial read models before production
                    calculations are displayed.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </section>
      <section className="detail-section" id="detail-4">
        <p className="eyebrow">SECTION IV</p>
        <h2>Location & map</h2>
        {isSourceDetail ? (
          <iframe
            className="property-map"
            title="Location of 4401 Avenue I, Birmingham"
            loading="lazy"
            referrerPolicy="no-referrer"
            src="https://www.google.com/maps/embed?origin=mfe&pb=!1m12!1m8!1m3!1d3327.4428890579893!2d-86.903352!3d33.48985!3m2!1i1024!2i768!4f13.1!2m1!1s33.489848,-86.903228!6i17!3m1!1sen!5m1!1sen"
          />
        ) : (
          <div className="location-pending">
            <EnvironmentOutlined />
            <p>
              {property.location
                ? `${property.name}, ${property.location}`
                : "Property location pending"}
            </p>
            <span>A verified map has not been supplied for this entry.</span>
          </div>
        )}
      </section>
    </>
  );
}

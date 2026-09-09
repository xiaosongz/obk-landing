import { useState } from "react";
import { fullSize, previewImageRender, responsive } from "./images";
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
import { currency, financialLines, portfolioProperties } from "./site-data";
import type { PortfolioProperty } from "./site-data";

import { useFundSnapshot } from "./useFundSnapshot";
import type { PropertyPeriod } from "./fund-data";

const notProvided = <span className="pending">Not provided</span>;

const amount = (value: number | null | undefined) =>
  value == null ? notProvided : currency(value);
const percent = (value: number | null | undefined) =>
  value == null
    ? notProvided
    : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)}%`;
const windowLabel = (row: PropertyPeriod | undefined) =>
  `${row?.periodStart ?? "Not provided"} to ${row?.periodEnd ?? "Not provided"}`;

function PropertyCards({ properties }: { properties: PortfolioProperty[] }) {
  const { data } = useFundSnapshot();
  return (
    <div className="property-grid">
      {properties.map((p) => (
        <article key={p.id}>
          <Link
            to={`/property-performance/${p.id}`}
            className="property-card-photo"
          >
            <img
              {...responsive(p.image, "(max-width: 850px) 50vw, 29vw")}
              alt={p.addressProvided ? `Photograph of ${p.name}` : p.name}
              loading="lazy"
            />
          </Link>
          <div className="property-card-content">
            <Tag>
              {data
                ? (data.properties.find(
                    (row) => row.propertyId === p.propertyId,
                  )?.status ?? "Not provided")
                : p.sold
                  ? "Sold"
                  : "Current portfolio"}
            </Tag>
            <h3>
              <Link to={`/property-performance/${p.id}`}>{p.name}</Link>
            </h3>
            <p>{p.location ?? "Address not provided in the reference"}</p>
            {data && (
              <p>
                Current rent:{" "}
                {amount(
                  data.propertyDetails.find(
                    (row) => row.propertyId === p.propertyId,
                  )?.currentMonthlyRent,
                )}
              </p>
            )}
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
          Explore the homes in the Fund III portfolio, then open a property for
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
      {matches.some((p) => p.sold) && (
        <section className="section-space">
          <h2 className="standalone-heading">Sold properties</h2>
          <PropertyCards properties={matches.filter((p) => p.sold)} />
        </section>
      )}
      <p className="source-note">
        Each photograph is linked to its recorded address. Status and rent come
        from the portfolio snapshot; unknown values remain Not provided.
      </p>
    </>
  );
}

function FinancialTable({
  row,
  cumulative = false,
}: {
  row?: PropertyPeriod;
  cumulative?: boolean;
}) {
  const period = cumulative ? "Since acquisition" : "Trailing 12 months";
  const extras = [
    row?.potentialRent != null ? (
      <>Potential rent: {amount(row.potentialRent)}</>
    ) : null,
    row?.collectionRate != null ? (
      <>Collection rate: {percent(row.collectionRate)}</>
    ) : null,
    row?.noiYield != null ? <>NOI yield: {percent(row.noiYield)}</> : null,
  ].filter((item) => item !== null);
  return (
    <div className="financial-report">
      <p className="source-note">
        {period}: {windowLabel(row)}
      </p>
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
            render: (_, line) => amount(row?.[line.key]),
          },
        ]}
      />
      {extras.length > 0 && (
        <p className="source-note">
          {extras.map((item, index) => (
            <span key={index}>
              {index > 0 ? " / " : ""}
              {item}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export function PropertyDetail() {
  const { propertyId } = useParams();
  const report = useFundSnapshot();
  const data = report.data;
  const property = portfolioProperties.find((p) => p.id === propertyId);
  if (!property)
    return (
      <div className="page-title">
        <h1>Property not found.</h1>
        <Button href="/property-performance">Return to properties</Button>
      </div>
    );
  const asset = data?.properties.find(
    (row) => row.propertyId === property.propertyId,
  );
  const details = data?.propertyDetails.find(
    (row) => row.propertyId === property.propertyId,
  );
  const ttm = data?.propertyPeriods.find(
    (row) =>
      row.propertyId === property.propertyId && row.period === "trailing_12_mo",
  );
  const cumulative = data?.propertyPeriods.find(
    (row) =>
      row.propertyId === property.propertyId && row.period === "since_acquired",
  );
  const fullAddress =
    asset?.address ??
    (property.addressProvided
      ? [property.name, property.location].filter(Boolean).join(", ")
      : "Not provided");
  const leaseTerm =
    details?.monthToMonth === true
      ? "Month-to-month"
      : details?.leaseCurrent === true && details.leaseEnd
        ? `Current through ${details.leaseEnd}`
        : details?.leaseEnd &&
            data?.summaryAsOf &&
            details.leaseEnd < data.summaryAsOf
          ? `Expired ${details.leaseEnd}; renewal not yet recorded`
          : notProvided;
  const lat = details?.lat;
  const lon = details?.lon;
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
        <Button icon={<ArrowLeftOutlined />} href="/property-performance">
          All properties
        </Button>
      </div>
      {report.state !== "ready" && (
        <p className="source-note" role="status">
          {report.state === "loading"
            ? "Loading property snapshot…"
            : "Property snapshot unavailable. Unknown values are Not provided."}
        </p>
      )}
      {data && !asset && (
        <p className="source-note">
          This property is not included in the current snapshot.
        </p>
      )}
      <div className="property-summary">
        <Image
          {...responsive(property.image, "(max-width: 850px) 100vw, 34vw")}
          preview={{
            src: fullSize(property.image),
            imageRender: previewImageRender,
          }}
          alt={`Photograph of ${property.name}`}
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
                children: asset?.status ?? notProvided,
              },
              {
                key: "occupancy",
                label: "Current occupancy",
                children:
                  asset?.status === "Rented"
                    ? "Occupied"
                    : (asset?.status ?? notProvided),
              },
              {
                key: "rent",
                label: "Current monthly rent",
                children: amount(details?.currentMonthlyRent),
              },
              {
                key: "cost",
                label: "Total cost basis",
                children: amount(asset?.totalCapitalization),
              },
              {
                key: "yield",
                label: "Annualized NOI yield since acquisition",
                children: percent(cumulative?.annualizedYield),
              },
            ]}
          />
          <p className="source-note">
            Cost basis as of {data?.summary.costAsOf.value ?? "Not provided"} ·
            TTM {windowLabel(ttm)}
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
            href={`/property-performance/${property.id}#detail-${i + 1}`}
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
              children: fullAddress,
            },
            {
              key: "plan",
              label: "Floor plan",
              children:
                details?.bedrooms != null && details?.bathrooms != null
                  ? `${details.bedrooms} bd · ${details.bathrooms} ba`
                  : notProvided,
            },
            {
              key: "vintage",
              label: "Vintage",
              children: details?.yearBuilt ?? notProvided,
            },
            {
              key: "sqft",
              label: "Square footage",
              children:
                details?.sqft == null
                  ? notProvided
                  : `${details.sqft.toLocaleString("en-US")} sq ft`,
            },
            {
              key: "acquired",
              label: "Acquisition date",
              children: asset?.purchaseDate ?? notProvided,
            },
            {
              key: "purchase",
              label: "Total acquisition",
              children: amount(asset?.purchasePrice),
            },
            {
              key: "renovation",
              label: "Total renovation",
              children: amount(asset?.renovationCost),
            },
            {
              key: "total",
              label: "Total cost",
              children: amount(asset?.totalCapitalization),
            },
            {
              key: "owner",
              label: "Owner",
              children: !property.sold ? "Obelisk Fund III LLC" : notProvided,
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
          items={[
            {
              key: "rent",
              label: "Monthly rent",
              children: amount(details?.currentMonthlyRent),
            },
            {
              key: "start",
              label: "Lease start",
              children: details?.leaseStart ?? notProvided,
            },
            {
              key: "end",
              label: "Lease end",
              children: details?.leaseEnd ?? notProvided,
            },
            { key: "term", label: "Lease term", children: leaseTerm },
          ]}
        />
        <p className="source-note">
          Resident information is not shown. Rent is from the latest recorded
          lease; the lease term is assessed as of{" "}
          {data?.summaryAsOf ?? "Not provided"}.
        </p>
      </section>
      <section className="detail-section" id="detail-3">
        <p className="eyebrow">SECTION III</p>
        <h2>Financial performance</h2>
        <h3>3.1 Trailing 12-month financials</h3>
        <FinancialTable row={ttm} />
        <h3 className="cumulative-heading">
          3.2 Cumulative performance · since acquisition
        </h3>
        <FinancialTable row={cumulative} cumulative />
        <p className="source-note">
          Monthly history is not part of the snapshot.
        </p>
        <Collapse
          className="calculation-rules"
          items={[
            {
              key: "rules",
              label: "Calculation rules",
              children: (
                <div className="prose">
                  <p>
                    The periods come from the cockpit’s merger model: TTM{" "}
                    {windowLabel(ttm)}; since acquisition{" "}
                    {windowLabel(cumulative)}.
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
                    NOI less CapEx = NOI − capital expenditures.
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
        {lat != null && lon != null ? (
          <figure>
            <iframe
              className="property-map"
              title={`Location of ${fullAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.004},${lat - 0.003},${lon + 0.004},${lat + 0.003}&layer=mapnik&marker=${lat},${lon}`}
            />
            <figcaption>
              {fullAddress} ·{" "}
              <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`}
              >
                View on OpenStreetMap
              </a>
            </figcaption>
          </figure>
        ) : (
          <div className="location-pending">
            <EnvironmentOutlined />
            <p>{fullAddress}</p>
            <span>Map pending geocoding</span>
          </div>
        )}
      </section>
    </>
  );
}

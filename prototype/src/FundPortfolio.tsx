import { useState } from "react";
import { Alert, Button, Input, Table, Tooltip, Tag } from "antd";
import type { TableColumnsType } from "antd";
import {
  ArrowRightOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { currency, fundMetrics, portfolioProperties } from "./site-data";
import propertyMapping from "./property-mapping.json";
import { formatMetric, matchPropertyPhoto } from "./fund-data";
import type { FundProperty } from "./fund-data";
import { useFundSnapshot } from "./useFundSnapshot";
import type { PortfolioProperty } from "./site-data";

interface DirectoryRow {
  id: string;
  name: string;
  location: string | null;
  photo?: PortfolioProperty;
  data?: FundProperty;
}
const amount = (value: number | null | undefined) =>
  value === undefined
    ? "Not yet reported"
    : value === null
      ? "Missing"
      : currency(value);

const note = (title: string, children: string) => (
  <aside className="manager-note">
    <p className="eyebrow">MANAGER NOTES · TEMPLATE CONTENT</p>
    <h3>{title}</h3>
    <p>{children}</p>
  </aside>
);

export default function FundPortfolio() {
  const [search, setSearch] = useState("");
  const report = useFundSnapshot();
  const rows: DirectoryRow[] = report.data
    ? report.data.properties.map((data) => {
        const mapping = matchPropertyPhoto(data.address, propertyMapping);
        const photo = portfolioProperties.find((p) => p.id === mapping?.id);
        return {
          id: `db-${data.propertyId}`,
          name: photo?.name ?? data.address,
          location: photo?.location ?? null,
          photo,
          data,
        };
      })
    : portfolioProperties
        .filter((p) => !p.sold)
        .map((photo) => ({
          id: photo.id,
          name: photo.name,
          location: photo.location,
          photo,
        }));
  const current = rows.filter((p) =>
    `${p.name} ${p.location ?? ""} ${p.data?.address ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const columns: TableColumnsType<DirectoryRow> = [
    {
      title: "Property",
      key: "property",
      fixed: "left",
      width: 280,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, p) => (
        <div className="table-property">
          {p.photo ? (
            <img src={p.photo.image} alt="" />
          ) : (
            <span className="photo-unmatched">Photo unconfirmed</span>
          )}
          <span>
            {p.name}
            <small>
              {p.location ??
                (p.photo ? "Address unconfirmed" : "Database address")}
            </small>
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, p) =>
        p.data ? (p.data.status ?? "Missing") : "Source template only",
    },
    {
      title: "Acquisition date",
      key: "acquired",
      render: (_, p) =>
        p.data ? (p.data.purchaseDate ?? "Missing") : "Not yet reported",
    },
    {
      title: "Acquisition cost",
      key: "acquisition",
      align: "right",
      render: (_, p) => amount(p.data?.purchasePrice),
    },
    {
      title: "Renovation cost",
      key: "renovation",
      align: "right",
      render: (_, p) => amount(p.data?.renovationCost),
    },
    {
      title: "Total cost",
      key: "total",
      align: "right",
      render: (_, p) => amount(p.data?.totalCapitalization),
    },
    {
      title: "Report",
      key: "details",
      render: (_, p) =>
        p.photo ? (
          <Link
            aria-label={`View ${p.name} report`}
            to={`/property-performance/${p.photo.id}`}
          >
            <ArrowRightOutlined />
          </Link>
        ) : (
          <span className="pending">Not linked</span>
        ),
    },
  ];
  const performanceColumns = [
    "Property",
    "Total cost",
    "T-12 income",
    "T-12 OpEx",
    "T-12 NOI",
    "Cap rate",
  ].map((title) => ({ title, key: title, dataIndex: title }));
  return (
    <>
      <div className="page-title">
        <p className="eyebrow">INVESTOR REPORTING · OBELISK FUND III</p>
        <h1>Fund III Portfolio.</h1>
        <p className="page-intro">
          From acquisition to capital recycling—a view of each stage of the
          portfolio.
        </p>
      </div>
      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">SECTION I</p>
            <h2>Portfolio at a glance.</h2>
          </div>
          <Tag>{report.data ? "Cockpit export" : "Report unavailable"}</Tag>
        </div>
        {report.state !== "ready" && (
          <Alert
            showIcon
            type={report.state === "error" ? "error" : "info"}
            title={
              report.state === "loading"
                ? "Loading Fund III report…"
                : report.state === "error"
                  ? "The Fund III report could not be loaded"
                  : "Fund III report not yet supplied"
            }
            description="The photographs below are the source directory; Fund III membership and financial values are unverified until a report is available."
          />
        )}
        <div className="fund-metrics">
          {fundMetrics.map((metric) => (
            <div key={metric.label}>
              <span>
                {metric.label}{" "}
                <Tooltip title={metric.definition}>
                  <button
                    className="info-button"
                    aria-label={`${metric.label} definition`}
                  >
                    <InfoCircleOutlined />
                  </button>
                </Tooltip>
              </span>
              <strong
                className={
                  report.data?.summary[metric.key].state === "reported"
                    ? ""
                    : "metric-unreported"
                }
              >
                {formatMetric(
                  metric.key,
                  report.data?.summary[metric.key] ?? {
                    state: "not_reported",
                    value: null,
                  },
                )}
              </strong>
              <small>
                {report.data?.summaryAsOf
                  ? `As of ${report.data.summaryAsOf}`
                  : "Reporting date not supplied"}
              </small>
            </div>
          ))}
        </div>
        <p className="source-note">
          {report.data
            ? `Exported ${new Date(report.data.exportedAt).toLocaleString()}. Acquisition values reflect the database at export time.`
            : "No financial snapshot is available."}{" "}
          Zero is a reported value; “Missing” means the source lacks a value;
          “Not yet reported” means no approved report has supplied it. Photo
          counts do not determine fund metrics.
        </p>
      </section>
      <section className="section-space">
        <p className="eyebrow">SECTION II</p>
        <h2>Portfolio stages under the BRRRR model.</h2>
        <div className="stage-jumps">
          {[
            "Buy",
            "Rehab",
            "Rent & stabilization",
            "Refinance",
            "Repeat & scale",
          ].map((label, i) => (
            <a href={`#/fund-iii-portfolio#stage-${i + 1}`} key={label}>
              <span>0{i + 1}</span>
              {label}
              <ArrowRightOutlined />
            </a>
          ))}
        </div>
        <article className="fund-stage" id="stage-1">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / BUY</p>
              <h3>Acquisitions & capital deployed</h3>
            </div>
            <Input
              prefix={<SearchOutlined />}
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the property directory"
              aria-label="Search fund properties"
            />
          </div>
          <Table<DirectoryRow>
            rowKey="id"
            columns={columns}
            dataSource={current}
            scroll={{ x: 1250 }}
            pagination={{
              pageSize: 6,
              showSizeChanger: false,
              showTotal: (total) =>
                `${total} ${report.data ? "Fund III properties" : "source directory entries"}`,
            }}
          />
          <p className="source-note">
            {report.data
              ? "Only properties assigned to Fund III in the export appear here. Acquisition cost is purchase price; total cost is reported capitalization, not an inferred sum. Sold properties remain acquisition history."
              : "This source photo directory does not establish Fund III membership."}{" "}
            Both tabs share the canonical photo mapping. Database properties
            without an explicit photo match show “Photo unconfirmed”; no photo
            is assigned by row order.
          </p>
          {note(
            "Acquisitions, dispositions & capital returned",
            "The source includes a manager-note area for a sold home, the replacement acquisition, and proceeds distributed to investors. An approved period update will populate this section.",
          )}
        </article>
        <article className="fund-stage" id="stage-2">
          <p className="eyebrow">02 / REHAB</p>
          <h3>Renovation progress</h3>
          {note(
            "Renovation status",
            "The reference template states: “No property is under renovation.” This is retained as template commentary, not a verified current status.",
          )}
          <div className="stage-data-note">
            Renovation scope, budget, spend, and completion dates will appear
            with the property report.
          </div>
        </article>
        <article className="fund-stage" id="stage-3">
          <p className="eyebrow">03 / RENT & STABILIZATION</p>
          <h3>Operating performance</h3>
          <div className="stage-subsection">
            <h4>3.1 Stabilized homes · T-12 performance</h4>
            <Table
              columns={performanceColumns}
              dataSource={[]}
              rowKey="Property"
              pagination={false}
              scroll={{ x: 850 }}
              locale={{
                emptyText:
                  "Stabilized-property classification and financial data have not been connected.",
              }}
            />
            {note(
              "Stabilization criteria",
              "The source template describes stabilization as a T-12 cap rate sustainably above 7%, or a Manager determination. The approved definition and cap-rate denominator must be confirmed before calculating or assigning status.",
            )}
          </div>
          <div className="stage-subsection">
            <h4>3.2 Stabilizing homes · T-12 performance</h4>
            <Table
              columns={performanceColumns}
              dataSource={[]}
              rowKey="Property"
              pagination={false}
              scroll={{ x: 850 }}
              locale={{
                emptyText:
                  "Stabilizing-property classification and financial data have not been connected.",
              }}
            />
            {note(
              "Progress toward stabilization",
              "The template distinguishes homes still stabilizing from homes that have met the Manager’s stabilization criteria. Neither group is inferred from missing data.",
            )}
          </div>
        </article>
        <article className="fund-stage" id="stage-4">
          <p className="eyebrow">04 / REFINANCE</p>
          <h3>Capital recycling</h3>
          {note(
            "Financing update",
            "The source template notes that the Manager is exploring refinancing options and seeking quotes from lenders.",
          )}
          <div className="stage-data-note">
            Appraisal, lender terms, debt service, and capital-recycling figures
            await the approved report.
          </div>
        </article>
        <article className="fund-stage" id="stage-5">
          <p className="eyebrow">05 / REPEAT & SCALE</p>
          <h3>The next investment cycle</h3>
          {note(
            "Scaling update",
            "The source template notes that scaling work will be initiated after refinancing is executed.",
          )}
          <Button href="#/investor-home#process-6">
            Read the scaling approach <ArrowRightOutlined />
          </Button>
        </article>
      </section>
    </>
  );
}

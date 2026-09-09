import { useState } from "react";
import { thumbnail } from "./images";
import { Alert, Button, Input, Table, Collapse, Tag } from "antd";
import type { TableColumnsType } from "antd";
import {
  ArrowRightOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { currency, fundMetrics, portfolioProperties } from "./site-data";
import propertyMapping from "./property-mapping.json";
import {
  formatMetric,
  formatReportDate,
  matchPropertyPhoto,
} from "./fund-data";
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
            <img src={thumbnail(p.photo.image, 64)} alt="" />
          ) : (
            <span
              className="photo-unmatched"
              role="img"
              aria-label="Photo unconfirmed"
              title="Photo unconfirmed"
            >
              <HomeOutlined />
            </span>
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
        p.data?.costFromMergerModel === false ? (
          <small className="pending">cost basis pending</small>
        ) : p.photo ? (
          <Link
            aria-label={`View ${p.name} report`}
            to={`/property-performance/${p.photo.id}`}
          >
            <ArrowRightOutlined />
          </Link>
        ) : (
          <span className="pending">Report pending</span>
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
            {report.data && (
              <p className="section-intro">
                Cost basis as of{" "}
                {formatReportDate(report.data.summary.costAsOf)}
                {" · TTM "}
                {formatReportDate(report.data.summary.ttmPeriodStart)}
                {" to "}
                {formatReportDate(report.data.summary.ttmPeriodEnd)}
              </p>
            )}
          </div>
          <Tag>{report.data ? "Portfolio snapshot" : "Report unavailable"}</Tag>
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
            description="The photographs below are the property directory; status and financial values appear once the database export is available."
          />
        )}
        {["Portfolio", "Cost basis", "Trailing twelve months"].map((group) => (
          <section className="fund-metric-group" key={group} aria-label={group}>
            <h3>{group}</h3>
            <div
              className={`fund-metrics${group === "Portfolio" ? " fund-metrics-four" : ""}`}
            >
              {fundMetrics
                .filter((metric) => metric.group === group)
                .map((metric) => (
                  <div key={metric.key}>
                    <span>{metric.label}</span>
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
                    {metric.caption && <small>{metric.caption}</small>}
                  </div>
                ))}
            </div>
          </section>
        ))}
        <p className="source-note">
          {report.data
            ? `Source: portfolio snapshot, exported ${report.data.exportedAt.slice(0, 10)}.`
            : "No financial snapshot is available."}
        </p>
        <Collapse
          className="fund-figure-notes"
          items={[
            {
              key: "about",
              label: "About these figures",
              children: (
                <>
                  <dl className="metric-definitions">
                    {fundMetrics.map((metric) => (
                      <div key={metric.key}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.definition}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="source-note">
                    Capital recycling rate, stabilized homes, stabilization
                    rate, and refinance pipeline await an approved source.
                  </p>
                  <p className="source-note">
                    Occupied homes and occupancy use recorded property status at
                    export. Costs use the merger model with legacy fallback
                    where cost basis is pending; TTM totals sum available model
                    values, so homes without TTM data do not contribute
                    operating figures.
                  </p>
                  <p className="source-note">
                    Zero is a reported value; “Missing” means the source lacks a
                    value; “Not yet reported” means no approved report has
                    supplied it. Photo counts do not determine fund metrics.
                  </p>
                </>
              ),
            },
          ]}
        />
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
            <a href={`/fund-iii-portfolio#stage-${i + 1}`} key={label}>
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
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) =>
                `${total} ${report.data ? "Fund III properties" : "source directory entries"}`,
            }}
          />
          <p className="source-note">
            {report.data
              ? "Following the merger of Funds I and II into Fund III, every current home in the portfolio database appears here. Acquisition cost is purchase price including closing costs from the merger model; rows with a legacy cost basis are marked pending. Total cost is reported capitalization."
              : "This photo directory is shown until the database export is available."}{" "}
            Photographs are linked to database records by recorded address; a
            home without a confirmed photograph shows a placeholder.
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
          <Button href="/investor-home#process-6">
            Read the scaling approach <ArrowRightOutlined />
          </Button>
        </article>
      </section>
    </>
  );
}

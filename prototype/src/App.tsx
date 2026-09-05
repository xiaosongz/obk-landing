import { useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Alert,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Menu,
  Modal,
  Progress,
  Segmented,
  Select,
  Table,
  Tag,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  ArrowRightOutlined,
  DownloadOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { DistributionChart } from "./DistributionChart";
import {
  exportPortfolio,
  money,
  percent,
  periods,
  propertiesForPeriod,
} from "./data";
import type { PeriodKey, Property } from "./data";

const statusColors = {
  Stabilized: "green",
  Leasing: "blue",
  Renovating: "gold",
  Stabilizing: "default",
};
const Status = ({ value }: { value: Property["status"] }) => (
  <Tag color={statusColors[value]}>{value}</Tag>
);

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

export default function App() {
  const [periodKey, setPeriodKey] = useState<PeriodKey>("jun");
  const [unavailable, setUnavailable] = useState(false);
  const [propertyId, setPropertyId] = useState<string>();
  const [document, setDocument] = useState<string>();
  const period = periods[periodKey];
  const rows = propertiesForPeriod(periodKey);
  const selected = rows.find((row) => row.id === propertyId);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All properties");
  const shown = rows.filter(
    (p) =>
      (status === "All properties" ||
        (status === "In progress"
          ? p.status !== "Stabilized"
          : p.status === status)) &&
      `${p.name} ${p.district}`.toLowerCase().includes(search.toLowerCase()),
  );
  const noiRows = rows.filter((p) => p.noi !== null);
  const noi = noiRows.reduce((sum, p) => sum + p.noi!, 0);
  const columns: TableColumnsType<Property> = [
    {
      title: "Property",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, p) => (
        <button className="property-link" onClick={() => setPropertyId(p.id)}>
          {p.name}
          <small>
            {p.district} · {p.beds} bd / {p.baths} ba
          </small>
        </button>
      ),
    },
    {
      title: "Stage",
      dataIndex: "status",
      filters: Object.keys(statusColors).map((value) => ({
        text: value,
        value,
      })),
      onFilter: (value, p) => p.status === value,
      render: (value) => <Status value={value} />,
    },
    {
      title: "Total cost",
      dataIndex: "cost",
      align: "right",
      sorter: (a, b) => a.cost - b.cost,
      render: (value) => <span className="number">{money(value)}</span>,
    },
    {
      title: "TTM NOI",
      dataIndex: "noi",
      align: "right",
      sorter: (a, b, order) =>
        a.noi === null
          ? order === "ascend"
            ? 1
            : -1
          : b.noi === null
            ? order === "ascend"
              ? -1
              : 1
            : a.noi - b.noi,
      render: (value) =>
        value === null ? (
          <span className="missing">Pending</span>
        ) : (
          <span className={`number ${value < 0 ? "negative" : ""}`}>
            {money(value)}
          </span>
        ),
    },
    {
      title: "NOI yield on cost",
      key: "yield",
      align: "right",
      render: (_, p) => (
        <span className="number">
          {p.noi === null ? "—" : percent(p.noi / p.cost)}
        </span>
      ),
    },
    {
      title: "Occupancy",
      key: "occupied",
      render: (_, p) => (
        <span className="occupancy">
          <i className={p.occupied ? "occupied" : ""} />
          {p.occupied ? "Occupied" : "Vacant"}
        </span>
      ),
    },
    {
      title: <span className="sr-only">Details</span>,
      key: "detail",
      width: 48,
      render: (_, p) => (
        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          aria-label={`View ${p.name}`}
          onClick={() => setPropertyId(p.id)}
        />
      ),
    },
  ];
  const docs = [
    {
      title: `${period.label} investor letter`,
      subtitle: "Portfolio update & manager commentary",
      kind: "SAMPLE REPORT",
    },
    {
      title: "Property performance data",
      subtitle: "Eight fictional properties · editable table export",
      kind: "CSV",
    },
    {
      title: "Understanding your statement",
      subtitle: "Capital, distributions & reporting definitions",
      kind: "GUIDE",
    },
  ];
  function documentList() {
    return (
      <div className="document-list">
        {docs.map((doc, i) => (
          <button
            key={doc.title}
            onClick={() =>
              i === 1
                ? exportPortfolio(rows, period.date)
                : setDocument(doc.title)
            }
          >
            <span className="file-icon">
              <FileTextOutlined />
            </span>
            <span className="document-text">
              <strong>{doc.title}</strong>
              <small>{doc.subtitle}</small>
            </span>
            <span className="document-kind">{doc.kind}</span>
            {i === 1 ? <DownloadOutlined /> : <ArrowRightOutlined />}
          </button>
        ))}
      </div>
    );
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          window.document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="preview-bar">
        <span className="preview-dot" />
        DESIGN PREVIEW<span className="preview-separator">/</span>
        <span>All figures and properties are illustrative</span>
      </div>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Obelisk investor overview">
          <span className="brand-mark" aria-hidden="true">
            O<span>/</span>
          </span>
          <span>
            OBELISK<small>INVESTOR PARTNERSHIP</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={[
              { key: "/", label: "Overview" },
              { key: "/portfolio", label: "Fund portfolio" },
              { key: "/documents", label: "Documents" },
            ]}
          />
        </nav>
        <div className="account">
          <span className="avatar">
            <UserOutlined />
          </span>
          <span>
            Demo investor<small>Investor portal</small>
          </span>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <div className="page-context">
          <span>
            OBELISK FUND III <b>/</b> SAMPLE PORTFOLIO
          </span>
          <div className="period-control">
            <label htmlFor="period">Reporting period</label>
            <Select
              id="period"
              value={periodKey}
              onChange={setPeriodKey}
              options={Object.entries(periods).map(([value, p]) => ({
                value,
                label: `${p.label} · ${p.date.split(",")[0]}`,
              }))}
            />
          </div>
        </div>
        {unavailable ? (
          <section className="unavailable">
            <Alert
              title="Reporting data is temporarily unavailable"
              description="Your investment figures cannot be loaded. Try again to return to the sample report."
              type="warning"
              showIcon
            />
            <Button type="primary" onClick={() => setUnavailable(false)}>
              Try again
            </Button>
          </section>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="page-heading">
                    <div>
                      <p className="eyebrow">YOUR INVESTMENT AT A GLANCE</p>
                      <h1>
                        Your investment,
                        <br />
                        <span>in perspective.</span>
                      </h1>
                      <p className="lede">
                        A clear view of your capital, income, and the properties
                        behind them.
                      </p>
                    </div>
                    <div className="report-meta">
                      <span className="status-label">
                        <i />
                        Quarterly reporting
                      </span>
                      <strong>As of {period.date}</strong>
                      <small>Report updated {period.updated}</small>
                      <Button
                        icon={<FileTextOutlined />}
                        onClick={() =>
                          setDocument(`${period.label} investor letter`)
                        }
                      >
                        Read quarterly update
                      </Button>
                    </div>
                  </div>
                  <section
                    className="capital-strip"
                    aria-label="Your capital position"
                  >
                    <Metric
                      label="Capital contributed"
                      value={money(period.contribution)}
                      note="Since inception"
                    />
                    <Metric
                      label="Capital returned"
                      value={money(period.returned)}
                      note={`${percent(period.returned / period.contribution)} of contributed capital`}
                    />
                    <Metric
                      label="Remaining capital"
                      value={money(period.contribution - period.returned)}
                      note="Contributed less returned"
                    />
                    <Metric
                      label="Income distributions"
                      value={money(period.income)}
                      note="Cumulative · excludes returned capital"
                    />
                  </section>
                  <div className="overview-grid">
                    <section className="panel chart-panel">
                      <div className="section-heading">
                        <div>
                          <p className="eyebrow">INCOME OVER TIME</p>
                          <h2>Steady progress, clearly measured.</h2>
                        </div>
                        <Tag>Since inception</Tag>
                      </div>
                      <div className="chart-total">
                        {money(period.income)}
                        <span>income distributed</span>
                      </div>
                      <DistributionChart months={period.months} />
                      <p className="chart-caption">
                        Cumulative cash income distributions · illustrative
                        figures, not a return forecast.
                      </p>
                    </section>
                    <aside className="manager-note">
                      <p className="eyebrow">THE QUARTER IN FOCUS</p>
                      <span className="note-index">
                        {periodKey === "jun" ? "02" : "01"}
                        <small> / 2026</small>
                      </span>
                      <h2>
                        Building income.
                        <br />
                        Protecting the foundation.
                      </h2>
                      <p>
                        Our focus remains on the work at property level:
                        finishing renovations, placing residents, and moving
                        homes toward stable operations.
                      </p>
                      <div className="note-bottom">
                        <span>Illustrative manager commentary</span>
                        <Button
                          shape="circle"
                          icon={<ArrowRightOutlined />}
                          aria-label="Read sample manager update"
                          onClick={() =>
                            setDocument(`${period.label} investor letter`)
                          }
                        />
                      </div>
                    </aside>
                  </div>
                  <section className="operations-section">
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">
                          THE PROPERTIES BEHIND YOUR INVESTMENT
                        </p>
                        <h2>Fund portfolio, at a glance.</h2>
                      </div>
                      <Link className="text-link" to="/portfolio">
                        Explore the portfolio <ArrowRightOutlined />
                      </Link>
                    </div>
                    <div className="operations-grid">
                      <div>
                        <strong>08</strong>
                        <span>Homes in the portfolio</span>
                        <small>One focused residential strategy</small>
                      </div>
                      <div>
                        <strong>
                          75<span>%</span>
                        </strong>
                        <span>Occupancy</span>
                        <small>6 of 8 homes occupied</small>
                      </div>
                      <div>
                        <strong>
                          05<span> / 08</span>
                        </strong>
                        <span>Stabilized homes</span>
                        <Progress
                          percent={62.5}
                          showInfo={false}
                          strokeColor="#1e3a5f"
                          size="small"
                        />
                      </div>
                      <div>
                        <strong>03</strong>
                        <span>Homes refinanced</span>
                        <small>Part of the capital recycling process</small>
                      </div>
                    </div>
                  </section>
                  <div className="bottom-grid">
                    <section>
                      <div className="section-heading">
                        <h2>Your latest documents</h2>
                        <Link className="text-link" to="/documents">
                          View all <ArrowRightOutlined />
                        </Link>
                      </div>
                      {documentList()}
                    </section>
                    <section className="strategy-note">
                      <p className="eyebrow">OUR APPROACH</p>
                      <h2>
                        A disciplined cycle.
                        <br />A long-term perspective.
                      </h2>
                      <p>
                        Acquire thoughtfully. Improve the asset. Stabilize
                        income. Refinance when appropriate. Repeat with
                        discipline.
                      </p>
                      <Button
                        type="link"
                        onClick={() => setDocument("Our investment approach")}
                      >
                        Understand the strategy <ArrowRightOutlined />
                      </Button>
                    </section>
                  </div>
                </>
              }
            />
            <Route
              path="/portfolio"
              element={
                <>
                  <div className="page-heading compact">
                    <div>
                      <p className="eyebrow">LOOK THROUGH TO THE ASSETS</p>
                      <h1>Fund portfolio.</h1>
                      <p className="lede">
                        Track each home from acquisition to stabilized income.
                      </p>
                    </div>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => exportPortfolio(rows, period.date)}
                    >
                      Export sample CSV
                    </Button>
                  </div>
                  <div className="portfolio-metrics">
                    <Metric
                      label="Total property cost"
                      value={money(rows.reduce((s, p) => s + p.cost, 0))}
                      note="8 properties · illustrative"
                    />
                    <Metric
                      label="Reported TTM NOI"
                      value={money(noi)}
                      note="Partial total · 7 of 8 properties"
                    />
                    <Metric
                      label="Occupancy"
                      value="75.0%"
                      note="6 of 8 homes occupied"
                    />
                  </div>
                  <div className="table-toolbar">
                    <Segmented
                      value={status}
                      onChange={setStatus}
                      options={["All properties", "Stabilized", "In progress"]}
                    />
                    <Input
                      allowClear
                      prefix={<SearchOutlined />}
                      placeholder="Search properties or districts"
                      aria-label="Search properties or districts"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Table<Property>
                    columns={columns}
                    dataSource={shown}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 980 }}
                    locale={{
                      emptyText: (
                        <Empty description="No properties match your filters" />
                      ),
                    }}
                  />
                  <div className="table-footnote">
                    <span>
                      {shown.length} of {rows.length} properties · sample data
                      as of {period.date}
                    </span>
                    <Button
                      type="link"
                      icon={<InfoCircleOutlined />}
                      onClick={() => setDocument("Reporting definitions")}
                    >
                      Reporting definitions
                    </Button>
                  </div>
                  <Alert
                    type="info"
                    showIcon
                    title="One property report is pending"
                    description="Maple House has no reported NOI. Its value is shown as pending and excluded from the NOI subtotal. Fund-level NOI yield is withheld until reporting is complete."
                  />
                </>
              }
            />
            <Route
              path="/documents"
              element={
                <>
                  <div className="page-heading compact">
                    <div>
                      <p className="eyebrow">YOUR REPORTING LIBRARY</p>
                      <h1>Documents & updates.</h1>
                      <p className="lede">
                        The context behind your numbers, in one place.
                      </p>
                    </div>
                    <Tag>{period.label}</Tag>
                  </div>
                  <Alert
                    type="info"
                    showIcon
                    title="Preview library"
                    description="Reports below demonstrate the reading experience. The CSV contains fictional portfolio data; investor statements and tax documents are not connected."
                  />
                  <div className="documents-page">{documentList()}</div>
                </>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
        <div className="preview-controls">
          <span>Prototype controls</span>
          <Select
            aria-label="Preview data availability"
            value={unavailable ? "unavailable" : "available"}
            onChange={(value) => setUnavailable(value === "unavailable")}
            options={[
              { value: "available", label: "Sample data available" },
              { value: "unavailable", label: "Simulate unavailable data" },
            ]}
          />
        </div>
      </main>
      <footer className="site-footer">
        <Link to="/">OBELISK</Link>
        <span>Built on discipline. Measured in results.</span>
        <small>Local prototype · No live financial data</small>
      </footer>
      <Drawer
        title={selected?.name ?? "Property details"}
        open={!!selected}
        onClose={() => setPropertyId(undefined)}
        size={540}
      >
        {selected && (
          <>
            <p className="eyebrow">
              FICTIONAL PROPERTY · {selected.district.toUpperCase()}
            </p>
            <Status value={selected.status} />
            <h2 className="drawer-title">The asset, in detail.</h2>
            <Descriptions
              column={1}
              items={[
                {
                  key: "home",
                  label: "Home",
                  children: `${selected.beds} bedrooms · ${selected.baths} bathrooms · ${selected.area.toLocaleString()} sq ft`,
                },
                { key: "date", label: "Reporting date", children: period.date },
                {
                  key: "cost",
                  label: "Total property cost",
                  children: money(selected.cost),
                },
                {
                  key: "noi",
                  label: "Trailing 12-month NOI",
                  children:
                    selected.noi === null
                      ? "Pending report"
                      : money(selected.noi),
                },
                {
                  key: "yield",
                  label: "NOI yield on cost",
                  children:
                    selected.noi === null
                      ? "Unavailable"
                      : percent(selected.noi / selected.cost),
                },
                {
                  key: "occupied",
                  label: "Occupancy",
                  children: selected.occupied ? "Occupied" : "Vacant",
                },
                {
                  key: "refinance",
                  label: "Refinancing",
                  children: selected.refinanced ? "Completed" : "Not completed",
                },
              ]}
            />
            <div className="drawer-note">
              <Alert
                showIcon
                type={selected.noi === null ? "warning" : "info"}
                title={
                  selected.noi === null
                    ? "NOI is not yet available"
                    : "About these figures"
                }
                description={
                  selected.noi === null
                    ? "Pending values are not treated as zero. Yield will be available when NOI is reported."
                    : "NOI yield on cost is trailing 12-month net operating income divided by total property cost. It is not the investor’s total return."
                }
              />
            </div>
          </>
        )}
      </Drawer>
      <Modal
        title={document}
        open={!!document}
        onCancel={() => setDocument(undefined)}
        footer={<Button onClick={() => setDocument(undefined)}>Close</Button>}
        width={680}
      >
        <div className="report-content">
          <Tag>ILLUSTRATIVE CONTENT</Tag>
          {document === "Our investment approach" ? (
            <>
              <h2>Value is created at the property level.</h2>
              <p>
                Acquire homes with a clear improvement plan. Complete
                renovations, place residents, and build a stable operating
                history before evaluating refinancing.
              </p>
              <p>
                Recycled capital can support the next acquisition. Each decision
                should balance income, financing costs, and property needs.
              </p>
            </>
          ) : document?.includes("investor letter") ? (
            <>
              <p className="eyebrow">
                {period.label} · AS OF {period.date.toUpperCase()}
              </p>
              <h2>A focused portfolio. Measurable progress.</h2>
              <p>
                This sample portfolio contains eight homes. Five are stabilized,
                one is leasing, one is under renovation, and one is stabilizing.
                Six homes are occupied.
              </p>
              <p>
                Sample cumulative income distributions are{" "}
                {money(period.income)}, separate from {money(period.returned)}{" "}
                of capital returned. One property’s NOI remains pending and is
                excluded from the subtotal.
              </p>
              <p>
                Next quarter’s illustrative priorities: complete renovation
                work, lease the vacant home, and close the remaining reporting
                gap.
              </p>
            </>
          ) : (
            <>
              <h2>Know what each number means.</h2>
              <Descriptions
                column={1}
                items={[
                  {
                    key: "capital",
                    label: "Remaining capital",
                    children:
                      "Capital contributed less capital returned. This is not an estimate of current investment value.",
                  },
                  {
                    key: "income",
                    label: "Income distributions",
                    children:
                      "Cumulative cash income paid to the investor, excluding returned capital. Not an annualized return.",
                  },
                  {
                    key: "noi",
                    label: "TTM NOI",
                    children:
                      "Trailing 12-month property net operating income. Missing values are excluded and coverage is disclosed.",
                  },
                  {
                    key: "yield",
                    label: "NOI yield on cost",
                    children:
                      "TTM NOI divided by total property cost. Does not represent investor return or a market-value cap rate.",
                  },
                ]}
              />
            </>
          )}
          <p className="report-disclaimer">
            All names, figures, and commentary in this prototype are fictional.
            Production reporting will use authenticated database records and
            approved investor documents.
          </p>
        </div>
      </Modal>
    </>
  );
}

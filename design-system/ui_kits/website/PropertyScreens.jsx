const { Eyebrow, Button, Icon, Input, PhotoCard, Descriptions, Collapse, SourceNote, DataTable, Breadcrumb, PageTitle, SectionHeading, Alert } = window.ObeliskDesignSystem_227ca9;
const h2p = { fontSize: "2rem", lineHeight: 1.16, letterSpacing: "-0.035em", fontWeight: 500, margin: "0 0 1.5rem" };
const np = <span style={{ color: "var(--state-pending)" }}>Not provided</span>;
function PropertyDirectoryScreen({ go }) {
  const [q, setQ] = React.useState("");
  const rows = window.OBK.photos.filter((p) => (p.address + " " + p.location).toLowerCase().includes(q.toLowerCase()));
  return <>
    <PageTitle eyebrow="Obelisk Fund III · Property performance" title="The properties." intro="Explore the homes in the Fund III portfolio, then open a property for asset, lease, and financial reporting." />
    <SectionHeading title="Current portfolio" action={<Input search placeholder="Search by address" value={q} onChange={setQ} />} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2rem" }}>{rows.map((p) => <PhotoCard key={p.id} framed src={p.image} address={p.address} location={p.location} status={p.status} rent={p.rent || "Not provided"} href={"#/property-performance/" + p.id} />)}</div>
    {rows.length === 0 && <Alert title="No properties match your search" />}
    <SourceNote>Each photograph is linked to its recorded address. Status and rent come from the portfolio snapshot; unknown values remain Not provided.</SourceNote>
  </>;
}
function FinancialTable({ period, window: w, values }) {
  const lines = [["Effective gross income (EGI)", "egi"], ["Property tax", "tax"], ["Insurance", "ins"], ["Variable operating expenses", "opex"], ["Net operating income (NOI)", "noi"], ["Capital expenditures (CapEx)", "capex"], ["NOI less CapEx", "nac"]];
  return <div style={{ border: "1px solid var(--rule)", background: "var(--surface-card)" }}>
    <SourceNote style={{ margin: 0, padding: "1rem" }}>{period}: {w}</SourceNote>
    <DataTable style={{ border: 0 }} columns={[{ key: "m", title: "Financial measure" }, { key: "v", title: period, align: "right" }]} rows={lines.map(([m, k]) => ({ id: k, m, v: values[k] ?? np }))} />
    {values.extra && <SourceNote style={{ margin: 0, padding: "1rem" }}>{values.extra}</SourceNote>}
  </div>;
}
function PropertyDetailScreen({ go, id }) {
  const p = window.OBK.photos.find((x) => x.id === id) || window.OBK.photos[0];
  const full = p.address + ", " + p.location;
  const lat = 33.5907, lon = -86.7325;
  return <>
    <Breadcrumb items={[{ label: "Investor Home", href: "#/investor-home" }, { label: "Property Performance", href: "#/property-performance" }, { label: p.address }]} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", padding: "2.5rem 0 2rem", flexWrap: "wrap" }}>
      <div><Eyebrow>Property report</Eyebrow><h1 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", lineHeight: 1.05, letterSpacing: "-0.045em", fontWeight: 500, margin: "0 0 1rem" }}>{p.address}</h1><p style={{ color: "var(--text-secondary)", margin: 0, display: "flex", gap: 8, alignItems: "center" }}><Icon name="environment" /> {p.location}</p></div>
      <Button icon={<Icon name="arrow-left" />} onClick={() => go("/property-performance")}>All properties</Button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", background: "var(--surface-card)", border: "1px solid var(--rule)" }}>
      <img src={p.image} alt={"Photograph of " + p.address} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 380, display: "block" }} />
      <div style={{ padding: "2.5rem" }}>
        <Eyebrow>Performance at a glance</Eyebrow>
        <h2 style={{ ...h2p, fontSize: "1.7rem" }}>The asset, in perspective.</h2>
        <Descriptions items={[{ label: "Status", value: p.status }, { label: "Current occupancy", value: p.status === "Rented" ? "Occupied" : p.status }, { label: "Current monthly rent", value: p.rent || np }, { label: "Total cost basis", value: p.total || np }, { label: "Annualized NOI yield since acquisition", value: p.total ? "9.8%" : np }]} />
        <SourceNote>Cost basis as of 2026-06-30 · TTM 2025-07-01 to 2026-06-30</SourceNote>
      </div>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", padding: "1.5rem 0", borderBottom: "1px solid var(--rule)", fontSize: "0.875rem" }}>{["Asset overview", "Lease", "Financial performance", "Location & map"].map((n, i) => <a key={n} href={"#detail-" + (i + 1)}>{String(i + 1).padStart(2, "0")} / {n}</a>)}</div>
    <section id="detail-1" style={{ paddingTop: "3rem" }}>
      <Eyebrow>Section I</Eyebrow><h2 style={h2p}>Asset overview</h2>
      <Descriptions bordered columns={2} items={[{ label: "Address", value: full }, { label: "Floor plan", value: "3 bd · 2 ba" }, { label: "Vintage", value: "1955" }, { label: "Square footage", value: "1,240 sq ft" }, { label: "Acquisition date", value: p.acq }, { label: "Total acquisition", value: p.cost }, { label: "Total renovation", value: p.reno || np }, { label: "Total cost", value: p.total || np }, { label: "Owner", value: "Obelisk Fund III LLC" }, { label: "Hold period", value: "3.2 years" }]} />
    </section>
    <section id="detail-2" style={{ paddingTop: "3rem" }}>
      <Eyebrow>Section II</Eyebrow><h2 style={h2p}>Lease</h2>
      <Descriptions bordered columns={2} items={[{ label: "Monthly rent", value: p.rent || np }, { label: "Lease start", value: p.rent ? "2025-04-01" : np }, { label: "Lease end", value: p.rent ? "2026-03-31" : np }, { label: "Lease term", value: p.rent ? "Expired 2026-03-31; renewal not yet recorded" : np }]} />
      <SourceNote>Resident information is not shown. Rent is from the latest recorded lease; the lease term is assessed as of 2026-06-30.</SourceNote>
    </section>
    <section id="detail-3" style={{ paddingTop: "3rem" }}>
      <Eyebrow>Section III</Eyebrow><h2 style={h2p}>Financial performance</h2>
      <h3 style={{ fontSize: "1.45rem", fontWeight: 500, letterSpacing: "-0.02em", margin: "2rem 0 1rem" }}>3.1 Trailing 12-month financials</h3>
      <FinancialTable period="Trailing 12 months" window="2025-07-01 to 2026-06-30" values={p.rent ? { egi: "$13,200", tax: "$1,180", ins: "$1,420", opex: "$1,190", noi: "$9,410", capex: "$800", nac: "$8,610", extra: "Potential rent: $13,800 / Collection rate: 95.7% / NOI yield: 11.8%" } : {}} />
      <h3 style={{ fontSize: "1.45rem", fontWeight: 500, letterSpacing: "-0.02em", margin: "2rem 0 1rem" }}>3.2 Cumulative performance · since acquisition</h3>
      <FinancialTable period="Since acquisition" window={p.acq + " to 2026-06-30"} values={{}} />
      <SourceNote>Monthly history is not part of the snapshot.</SourceNote>
      <Collapse style={{ marginTop: "2rem" }} label="Calculation rules">NOI = EGI − property tax − insurance − variable operating expenses. NOI less CapEx = NOI − capital expenditures. The periods come from the cockpit’s merger model.</Collapse>
    </section>
    <section id="detail-4" style={{ paddingTop: "3rem" }}>
      <Eyebrow>Section IV</Eyebrow><h2 style={h2p}>Location &amp; map</h2>
      <figure><iframe title={"Location of " + full} loading="lazy" referrerPolicy="no-referrer" style={{ border: "1px solid var(--rule)", width: "100%", height: 400 }} src={"https://www.openstreetmap.org/export/embed.html?bbox=" + (lon - 0.004) + "," + (lat - 0.003) + "," + (lon + 0.004) + "," + (lat + 0.003) + "&layer=mapnik&marker=" + lat + "," + lon} />
        <figcaption style={{ fontSize: "0.75rem", color: "var(--text-secondary)", padding: "0.9rem 0" }}>{full} · <a href={"https://www.openstreetmap.org/?mlat=" + lat + "&mlon=" + lon + "#map=17/" + lat + "/" + lon} style={{ textDecoration: "underline" }}>View on OpenStreetMap</a></figcaption></figure>
    </section>
  </>;
}
Object.assign(window, { PropertyDirectoryScreen, PropertyDetailScreen });

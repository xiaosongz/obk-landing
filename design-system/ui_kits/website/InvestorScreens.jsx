const { Eyebrow, Button, TextLink, Icon, Tag, Input, PortalLink, CapitalStrip, Descriptions, MetricGroup, ProcessCard, Collapse, SourceNote, StageJumps, DataTable, ManagerNote, Modal, PageTitle, SectionHeading } = window.ObeliskDesignSystem_227ca9;
const h2 = { fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: 1.16, letterSpacing: "-0.035em", fontWeight: 500, margin: "0 0 1.5rem" };
const h3 = { fontSize: "1.45rem", lineHeight: 1.3, letterSpacing: "-0.02em", fontWeight: 500, margin: "0 0 1rem" };
function InvestorHomeScreen({ go }) {
  const [legal, setLegal] = React.useState(false);
  const steps = window.OBK.steps;
  return <>
    <PageTitle eyebrow="Obelisk Fund III, LLC · Investor Home" title="Welcome, investor." intro="Welcome back to your investor portal. Review your investment, portfolio, and property-level performance."
      aside={<aside style={{ flexShrink: 0, borderLeft: "1px solid var(--rule)", paddingLeft: "2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.05em", color: "var(--text-secondary)", margin: 0, textTransform: "uppercase" }}>Your investor relations manager</p>
        <strong style={{ fontSize: "1.125rem", fontWeight: 500 }}>Sy Zhang</strong>
        <a href="mailto:szhang@obeliskfunds.com" style={{ fontSize: "0.875rem", display: "flex", gap: 8, alignItems: "center" }}><Icon name="mail" /> szhang@obeliskfunds.com</a>
      </aside>} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
      <PortalLink eyebrow="Fund-level reporting" title="Fund III Portfolio" href="#/fund-iii-portfolio" />
      <PortalLink eyebrow="Property-level reporting" title="Fund III Properties" href="#/property-performance" />
    </div>
    <section style={{ marginTop: 50 }}>
      <SectionHeading eyebrow="Section I" title="Investment at a glance." action={<span style={{ fontSize: "0.8125rem", color: "var(--text-accent)" }}>As of 2026-06-30</span>} />
      <CapitalStrip items={[{ label: "Total contribution", value: "$250,000" }, { label: "Returned initial capital", value: "$40,000" }, { label: "Remaining capital", value: "$210,000" }]} />
      <div style={{ padding: "2.5rem", background: "var(--surface-card)", border: "1px solid var(--rule)", borderTop: 0, display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "1.5rem" }}>
        <section>
          <h3 style={{ ...h3, fontSize: "1.25rem", marginBottom: "1.5rem" }}>Investor &amp; commitment</h3>
          <Descriptions columns={2} items={[{ label: "Name", value: "Demo investor" }, { label: "Fund", value: "Obelisk Fund III, LLC" }, { label: "Legal documents", value: <Button variant="link" icon={<Icon name="file-text" />} onClick={() => setLegal(true)}>Subscription agreement</Button> }, { label: "Total subscription", value: "$250,000" }, { label: "Total contribution", value: "$250,000" }, { label: "Callable capital", value: "$0" }, { label: "Returned initial capital", value: "$40,000" }, { label: "Remaining capital", value: "$210,000" }]} />
        </section>
        <p style={{ color: "var(--state-pending)", fontSize: "0.875rem", margin: 0, paddingTop: "1.5rem", borderTop: "1px solid var(--rule)" }}>Preferred return and promote figures are not yet provided</p>
      </div>
      <SourceNote>Remaining capital is not a valuation. Preferred-return and promote figures appear once provided.</SourceNote>
    </section>
    <section style={{ marginTop: 80 }} id="business-process">
      <SectionHeading eyebrow="Section II" title="Obelisk business process." intro="A disciplined, repeatable process—from acquisition to scale." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "1.5rem" }}>{steps.map((s) => <ProcessCard key={s.id} number={s.id} title={s.name} description={s.overview} tagline={s.tagline} href={"#/investor-home#process-" + s.id} />)}</div>
      {steps.map((s) => <article key={s.id} id={"process-" + s.id} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "3.5rem", alignItems: "start", padding: "3rem 0", borderBottom: "1px solid var(--rule)" }}>
        <img src={s.image} alt={"Original Obelisk " + s.name.toLowerCase() + " illustration"} loading="lazy" style={{ width: "100%", display: "block", border: "1px solid var(--rule)" }} />
        <div>
          <Eyebrow>Step {s.id} · {s.name}</Eyebrow>
          <h3 style={{ ...h3, fontSize: "1.65rem" }}>{s.title}</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>{s.lead}</p>
          <Collapse ghost label={"Read the full " + s.name.toLowerCase() + " approach"}>The remaining paragraphs of the original process text are retained in the source (reference-content.ts) and expand here.</Collapse>
        </div>
      </article>)}
    </section>
    <Modal open={legal} title="Subscription agreement" onClose={() => setLegal(false)}>The source template includes a subscription-agreement link. No agreement has been supplied for this demo account. Production agreements will be available only to the authorized investor.</Modal>
  </>;
}
function FundScreen({ go }) {
  const [q, setQ] = React.useState("");
  const rows = window.OBK.photos.filter((p) => (p.address + " " + p.location).toLowerCase().includes(q.toLowerCase()));
  const pend = (t) => <span style={{ color: "var(--state-pending)" }}>{t}</span>;
  const cols = [
    { key: "property", title: "Property", width: 280, render: (p) => <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}><img src={p.image} alt="" style={{ width: 64, height: 48, objectFit: "cover" }} /><span>{p.address}<small style={{ display: "block", marginTop: "0.3rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{p.location}</small></span></div> },
    { key: "status", title: "Status" }, { key: "acq", title: "Acquisition date" },
    { key: "cost", title: "Acquisition cost", align: "right" },
    { key: "reno", title: "Renovation cost", align: "right", render: (p) => p.reno ?? pend("Missing") },
    { key: "total", title: "Total cost", align: "right", render: (p) => p.total ?? pend("Missing") },
    { key: "report", title: "Report", render: (p) => p.pending ? <small style={{ color: "var(--state-pending)" }}>cost basis pending</small> : <a href={"#/property-performance/" + p.id} aria-label={"View " + p.address + " report"} onClick={(e) => { e.preventDefault(); go("/property-performance/" + p.id); }}><Icon name="arrow-right" /></a> },
  ];
  const perf = ["Property", "Total cost", "T-12 income", "T-12 OpEx", "T-12 NOI", "Cap rate"].map((t) => ({ key: t, title: t }));
  return <>
    <PageTitle eyebrow="Investor reporting · Obelisk Fund III" title="Fund III Portfolio." intro="From acquisition to capital recycling—a view of each stage of the portfolio." />
    <section>
      <SectionHeading eyebrow="Section I" title="Portfolio at a glance." intro="Cost basis as of 2026-06-30 · TTM 2025-07-01 to 2026-06-30" action={<Tag>Portfolio snapshot</Tag>} />
      <MetricGroup title="Portfolio" metrics={[{ label: "Homes", value: "37" }, { label: "Occupied homes", value: "34" }, { label: "Occupancy", value: "91.9%" }, { label: "TTM collection rate", value: "97.8%", caption: "can exceed 100% when arrears are collected" }]} />
      <MetricGroup title="Cost basis" metrics={[{ label: "Acquisition cost", value: "$2,146,300", caption: "including closing costs" }, { label: "Renovation cost", value: "$731,900" }, { label: "Total capitalization", value: "$2,878,200" }]} />
      <MetricGroup title="Trailing twelve months" metrics={[{ label: "TTM rent collected (EGI)", value: "$483,600" }, { label: "TTM NOI", value: "$301,150" }, { label: "TTM NOI yield", value: "10.5%" }]} />
      <SourceNote>Source: portfolio snapshot, exported 2026-07-01.</SourceNote>
      <Collapse style={{ marginTop: "1rem" }} label="About these figures">
        <dl style={{ margin: 0 }}><dt style={{ fontWeight: 500, color: "var(--text-primary)" }}>Occupancy</dt><dd style={{ margin: "0.35rem 0 1rem" }}>Occupied homes ÷ homes in the fund × 100%.</dd><dt style={{ fontWeight: 500, color: "var(--text-primary)" }}>TTM NOI yield</dt><dd style={{ margin: "0.35rem 0 0" }}>TTM NOI ÷ total capitalization × 100%.</dd></dl>
        <SourceNote>Capital recycling rate, stabilized homes, stabilization rate, and refinance pipeline await an approved source. Zero is a reported value; “Missing” means the source lacks a value; “Not yet reported” means no approved report has supplied it.</SourceNote>
      </Collapse>
    </section>
    <section style={{ marginTop: 80 }}>
      <Eyebrow>Section II</Eyebrow>
      <h2 style={h2}>Portfolio stages under the BRRRR model.</h2>
      <StageJumps stages={["Buy", "Rehab", "Rent & stabilization", "Refinance", "Repeat & scale"]} hrefBase="#/fund-iii-portfolio#stage-" />
      <article id="stage-1" style={{ padding: "3rem 0", borderBottom: "1px solid var(--rule)" }}>
        <SectionHeading eyebrow="01 / Buy" level={3} title="Acquisitions & capital deployed" action={<Input search placeholder="Search the property directory" value={q} onChange={setQ} />} />
        <DataTable columns={cols} rows={rows} footer={rows.length + " Fund III properties"} />
        <SourceNote>Following the merger of Funds I and II into Fund III, every current home in the portfolio database appears here. Acquisition cost is purchase price including closing costs from the merger model; rows with a legacy cost basis are marked pending. Total cost is reported capitalization.</SourceNote>
        <ManagerNote title="Acquisitions, dispositions & capital returned">The source includes a manager-note area for a sold home, the replacement acquisition, and proceeds distributed to investors. An approved period update will populate this section.</ManagerNote>
      </article>
      <article id="stage-2" style={{ padding: "3rem 0", borderBottom: "1px solid var(--rule)" }}>
        <Eyebrow>02 / Rehab</Eyebrow><h3 style={{ ...h3, fontSize: "1.75rem" }}>Renovation progress</h3>
        <ManagerNote title="Renovation status">The reference template states: “No property is under renovation.” This is retained as template commentary, not a verified current status.</ManagerNote>
        <p style={{ paddingTop: "1.5rem", fontSize: "0.9375rem", color: "var(--text-secondary)", margin: 0 }}>Renovation scope, budget, spend, and completion dates will appear with the property report.</p>
      </article>
      <article id="stage-3" style={{ padding: "3rem 0", borderBottom: "1px solid var(--rule)" }}>
        <Eyebrow>03 / Rent &amp; stabilization</Eyebrow><h3 style={{ ...h3, fontSize: "1.75rem" }}>Operating performance</h3>
        <h4 style={{ fontSize: "1.125rem", fontWeight: 500, margin: "2rem 0 1rem" }}>3.1 Stabilized homes · T-12 performance</h4>
        <DataTable columns={perf} rows={[]} emptyText="Stabilized-property classification and financial data have not been connected." />
        <ManagerNote title="Stabilization criteria">The source template describes stabilization as a T-12 cap rate sustainably above 7%, or a Manager determination. The approved definition and cap-rate denominator must be confirmed before calculating or assigning status.</ManagerNote>
      </article>
      <article id="stage-4" style={{ padding: "3rem 0", borderBottom: "1px solid var(--rule)" }}>
        <Eyebrow>04 / Refinance</Eyebrow><h3 style={{ ...h3, fontSize: "1.75rem" }}>Capital recycling</h3>
        <ManagerNote title="Financing update">The source template notes that the Manager is exploring refinancing options and seeking quotes from lenders.</ManagerNote>
      </article>
      <article id="stage-5" style={{ padding: "3rem 0" }}>
        <Eyebrow>05 / Repeat &amp; scale</Eyebrow><h3 style={{ ...h3, fontSize: "1.75rem" }}>The next investment cycle</h3>
        <ManagerNote title="Scaling update">The source template notes that scaling work will be initiated after refinancing is executed.</ManagerNote>
        <Button style={{ marginTop: "1.5rem" }} arrow onClick={() => go("/investor-home")}>Read the scaling approach</Button>
      </article>
    </section>
  </>;
}
Object.assign(window, { InvestorHomeScreen, FundScreen });

const { Eyebrow, Button, TextLink, PhotoCard, PageTitle, SectionHeading, InvestorCallout, SourceNote, Icon, Input } = window.ObeliskDesignSystem_227ca9;
const h2Style = { fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: 1.16, letterSpacing: "-0.035em", fontWeight: 500, margin: "0 0 1.5rem" };
function HomeScreen({ go }) {
  const P = window.OBK.photos;
  return <>
    <section style={{ display: "grid", gridTemplateColumns: "1.02fr 1fr", gap: "3rem", alignItems: "center", padding: "65px 0 55px" }}>
      <div>
        <Eyebrow>Obelisk Fund Management</Eyebrow>
        <h1 style={{ fontSize: "clamp(2.75rem,4.5vw,4.35rem)", lineHeight: 1.05, letterSpacing: "-0.045em", fontWeight: 500, margin: "0 0 1.5rem" }}>A full-service<br />affordable housing<br /><em>platform.</em></h1>
        <p style={{ fontSize: "1.125rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 2rem" }}>Quality homes. Thoughtful ownership.<br />Long-term stewardship.</p>
        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" arrow onClick={() => go("/portfolio")}>Explore our portfolio</Button>
          <TextLink href="#/investor-login" onClick={(e) => { e.preventDefault(); go("/investor-login"); }}>Investor login</TextLink>
        </div>
      </div>
      <figure style={{ display: "flex", flexDirection: "column" }}>
        <img src="../../assets/photos/home-02.png" alt="Single-family home featured in the Obelisk portfolio" style={{ width: "100%", height: 440, objectFit: "cover" }} />
        <figcaption style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.75rem", color: "var(--text-secondary)", padding: "0.9rem 0" }}><span style={{ letterSpacing: "0.1em" }}>THE OBELISK PORTFOLIO</span><span>Affordable single-family housing</span></figcaption>
      </figure>
    </section>
    <section style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "5rem", borderTop: "1px solid var(--rule)", paddingTop: 65, marginTop: 10 }}>
      <div><Eyebrow>Our strategy</Eyebrow><h2 style={{ fontSize: "3.6rem", lineHeight: 1.07, letterSpacing: "-0.035em", fontWeight: 500, margin: 0 }}>Acquire.<br />Improve.<br /><em>Operate.</em></h2></div>
      <div style={{ paddingTop: "2rem", maxWidth: 750 }}>
        <p style={{ fontSize: "1.65rem", color: "var(--charcoal-700)", lineHeight: 1.5, letterSpacing: "-0.02em", margin: "0 0 1.5rem" }}>Obelisk acquires, owns and manages single-family rental homes, with a focus on providing well-maintained, attainable housing.</p>
        <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 1.5rem" }}>We invest in homes and communities where thoughtful capital investment and hands-on management can improve the resident experience while supporting the long-term quality and value of our properties.</p>
        <TextLink href="#/investor-home" onClick={(e) => { e.preventDefault(); go("/investor-home"); }}>Explore our business process</TextLink>
      </div>
    </section>
    <section style={{ marginTop: 80 }}>
      <SectionHeading eyebrow="Obelisk portfolio" title={<>Quality homes.<br />Long-term stewardship.</>} action={<TextLink href="#/portfolio" onClick={(e) => { e.preventDefault(); go("/portfolio"); }}>View the full portfolio</TextLink>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem" }}>{P.map((p) => <PhotoCard key={p.id} src={p.image} address={p.address} location={p.location} />)}</div>
    </section>
    <InvestorCallout onClick={(e) => { e.preventDefault(); go("/investor-login"); }} />
  </>;
}
function PortfolioScreen({ go }) {
  const P = window.OBK.photos;
  return <>
    <PageTitle eyebrow="The homes behind the platform" title="Our portfolio." intro="Our portfolio consists of affordable single-family rental homes located in established working-class neighborhoods. Through targeted renovations and disciplined property management, we transform underutilized housing into safe, habitable homes that generate stable cash flow and long-term value for both residents and investors." />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2rem", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "1.25rem 0", margin: "0 0 2rem", flexWrap: "wrap" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>37 homes in the Fund III portfolio</p>
      <Button arrow onClick={() => go("/investor-login")}>See property performance details</Button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2rem" }}>{P.map((p) => <PhotoCard key={p.id} src={p.image} address={p.address} location={p.location} />)}</div>
    <SourceNote>Photographs are from Obelisk’s property library and are labeled with each home’s recorded address. Operating data is available to investors through the investor portal.</SourceNote>
  </>;
}
function LoginScreen({ go }) {
  return <section style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", maxWidth: 1100, margin: "65px auto 15px", background: "var(--surface-card)", border: "1px solid var(--rule)" }}>
    <div style={{ position: "relative", minHeight: 650, overflow: "hidden" }}>
      <img src="../../assets/photos/4617-n-richard-arrington-jr-blvd-n.jpg" alt="Home from the Obelisk portfolio" style={{ height: "100%", width: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", inset: "auto 0 0", padding: "4rem 2.5rem 2rem", background: "var(--gradient-protect)", color: "var(--on-charcoal)" }}>
        <Eyebrow inverse>Obelisk investor partnership</Eyebrow>
        <h2 style={{ ...h2Style, margin: 0 }}>Connected to<br />your investment.</h2>
      </div>
    </div>
    <div style={{ padding: "3.5rem", alignSelf: "center" }}>
      <Icon name="lock" size="1.65rem" style={{ color: "var(--bronze-500)", marginBottom: "2rem", display: "block" }} />
      <Eyebrow>Investor portal</Eyebrow>
      <h1 style={{ fontSize: "3rem", lineHeight: 1.05, letterSpacing: "-0.045em", fontWeight: 500, margin: "0 0 1.5rem" }}>Welcome back.</h1>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>Your investment at a glance, the fund’s progress, and the properties behind it.</p>
      <div style={{ margin: "2rem 0" }}><Input placeholder="Email address" style={{ maxWidth: "none" }} /><Input placeholder="Password" style={{ maxWidth: "none", marginTop: 12 }} /></div>
      <Button variant="primary" size="lg" block arrow onClick={() => go("/investor-home")}>Sign in</Button>
      <p style={{ fontSize: "0.875rem", margin: "2rem 0 0", lineHeight: 1.75 }}>Need assistance?<br /><a href="mailto:szhang@obeliskfunds.com" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Contact Sy Zhang, Investor Relations</a></p>
    </div>
  </section>;
}
Object.assign(window, { HomeScreen, PortfolioScreen, LoginScreen });

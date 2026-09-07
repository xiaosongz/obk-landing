import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createServer } from "vite";
import { build } from "esbuild";
import { createRequire } from "node:module";
import {
  formatMetric,
  metricKeys,
  dateKeys,
  formatReportDate,
  parseFundSnapshot,
  matchPropertyPhoto,
} from "../src/fund-data.ts";
import {
  connectionEnv,
  makeSnapshot,
  quoteSnapshot,
} from "../scripts/lp-snapshot-lib.mjs";

// Synthetic values only. These are never bundled or presented as actual properties.
const reported = (value) => ({ state: "reported", value });
const summary = () => ({
  homes: reported(2),
  occupiedHomes: reported(1),
  occupancy: reported(50),
  totalAcquisitionCost: reported(200),
  totalRenovationCost: reported(0),
  totalCapitalization: reported(200),
  ttmRentCollected: reported(20),
  ttmNoi: reported(10),
  ttmNoiYield: reported(5),
  ttmCollectionRate: reported(120),
  ttmPeriodStart: reported("2025-07-01"),
  ttmPeriodEnd: reported("2026-06-30"),
  costAsOf: reported("2026-06-30"),
});
const detailsRow = (propertyId, values = {}) => ({
  propertyId,
  bedrooms: null,
  bathrooms: null,
  yearBuilt: null,
  sqft: null,
  zip: null,
  lat: null,
  lon: null,
  holdPeriodYears: null,
  currentMonthlyRent: null,
  leaseStart: null,
  leaseEnd: null,
  monthToMonth: null,
  leaseCurrent: null,
  ...values,
});
const periodRow = (propertyId, period, values = {}) => ({
  propertyId,
  period,
  periodStart: null,
  periodEnd: null,
  egi: null,
  propertyTax: null,
  insurance: null,
  opex: null,
  noi: null,
  capex: null,
  noiAfterCapex: null,
  potentialRent: null,
  collectionRate: null,
  noiYield: null,
  annualizedYield: null,
  ...values,
});
const directory = {
  fundCount: 1,
  summaryAsOf: "2026-06-30",
  summary: summary(),
  propertyDetails: [
    detailsRow(1, {
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 1950,
      sqft: 1200,
      zip: "00000",
      lat: 33.5,
      lon: -86.9,
      holdPeriodYears: 1.5,
      currentMonthlyRent: 0,
      leaseStart: "2025-01-01",
      leaseEnd: "2026-06-30",
      monthToMonth: false,
      leaseCurrent: true,
    }),
    detailsRow(38),
  ],
  propertyPeriods: [1, 38].flatMap((id) =>
    ["trailing_12_mo", "since_acquired"].map((period) =>
      periodRow(
        id,
        period,
        id === 1
          ? {
              periodStart:
                period === "trailing_12_mo" ? "2025-07-01" : "2025-01-01",
              periodEnd: "2026-06-30",
              egi: 100,
              propertyTax: 20,
              insurance: 10,
              opex: 80,
              noi: -10,
              capex: 5,
              noiAfterCapex: -15,
              potentialRent: 90,
              collectionRate: 111.1,
              noiYield: -5,
              annualizedYield: period === "since_acquired" ? -3.3 : null,
            }
          : {},
      ),
    ),
  ),
  properties: [
    {
      propertyId: 1,
      address: "Synthetic property A",
      status: "Rented",
      purchaseDate: "2025-01-01",
      purchasePrice: 0,
      renovationCost: 0,
      totalCapitalization: 0,
      costFromMergerModel: true,
    },
    {
      propertyId: 38,
      address: "Synthetic fallback property",
      status: null,
      purchaseDate: null,
      purchasePrice: 200,
      renovationCost: null,
      totalCapitalization: 200,
      costFromMergerModel: false,
    },
  ],
};

test("v3 export preserves merger/fallback rows, zeros, missing and not-reported values", () => {
  const data = makeSnapshot(directory);
  assert.equal(data.schemaVersion, 3);
  assert.equal(data.properties[0].purchasePrice, 0);
  assert.equal(data.properties[0].costFromMergerModel, true);
  assert.equal(data.properties[1].propertyId, 38);
  assert.equal(data.properties[1].purchasePrice, 200);
  assert.equal(data.properties[1].renovationCost, null);
  assert.equal(data.properties[1].costFromMergerModel, false);
  assert.equal(
    formatMetric("totalRenovationCost", data.summary.totalRenovationCost),
    "$0",
  );
  assert.equal(formatMetric("occupiedHomes", reported(0)), "0");
  assert.equal(formatMetric("occupancy", reported(0)), "0%");
  const values = summary();
  values.totalRenovationCost = { state: "missing", value: null };
  values.totalAcquisitionCost = { state: "not_reported", value: null };
  const report = makeSnapshot({ ...directory, summary: values });
  assert.equal(
    formatMetric("totalRenovationCost", report.summary.totalRenovationCost),
    "Missing",
  );
  assert.equal(
    formatMetric("totalAcquisitionCost", report.summary.totalAcquisitionCost),
    "Not yet reported",
  );
  assert.equal(formatReportDate(report.summary.costAsOf), "2026-06-30");
  assert.equal(formatReportDate({ state: "missing", value: null }), "Missing");
  assert.equal(
    formatReportDate({ state: "not_reported", value: null }),
    "Not yet reported",
  );
  const empty = Object.fromEntries(
    [...metricKeys, ...dateKeys].map((key) => [
      key,
      { state: "missing", value: null },
    ]),
  );
  empty.homes = reported(0);
  empty.occupiedHomes = reported(0);
  assert.equal(
    makeSnapshot({
      ...directory,
      properties: [],
      propertyDetails: [],
      propertyPeriods: [],
      summary: empty,
    }).properties.length,
    0,
  );
});

test("collection rates above 100% are valid through 200%, without relaxing occupancy or money checks", () => {
  for (const rate of [100.01, 120, 200]) {
    const values = summary();
    values.ttmCollectionRate = reported(rate);
    const data = makeSnapshot({ ...directory, summary: values });
    assert.equal(data.summary.ttmCollectionRate.value, rate);
  }
  assert.equal(formatMetric("ttmCollectionRate", reported(120)), "120%");
  for (const [key, value] of [
    ["ttmCollectionRate", 200.01],
    ["occupancy", 100.01],
    ["ttmNoi", -1],
    ["totalAcquisitionCost", -1],
  ]) {
    const values = summary();
    values[key] = reported(value);
    assert.throws(() => makeSnapshot({ ...directory, summary: values }));
  }
});

test("rejects wrong versions/funds, extra fields, duplicate IDs, invalid values and ambiguous periods", () => {
  for (const mutate of [
    (data) => {
      data.schemaVersion = 1;
    },
    (data) => {
      data.fundName = "Fund I";
    },
    (data) => {
      data.investor = "Synthetic extra field";
    },
    (data) => {
      data.properties[0].tenant = "Synthetic extra field";
    },
    (data) => {
      data.summary.investor = "Synthetic extra field";
    },
    (data) => {
      data.summary.homes.private = "Synthetic extra field";
    },
    (data) => {
      data.summary.costAsOf.private = "Synthetic extra field";
    },
    (data) => {
      delete data.summary.homes;
    },
    (data) => {
      delete data.summary.ttmPeriodEnd;
    },
    (data) => {
      data.properties.push(data.properties[0]);
    },
    (data) => {
      data.properties[0].purchasePrice = "0";
    },
    (data) => {
      data.properties[0].renovationCost = -1;
    },
    (data) => {
      data.properties[0].purchaseDate = "2026-02-30";
    },
    (data) => {
      data.properties[0].costFromMergerModel = "false";
    },
    (data) => {
      delete data.properties[0].costFromMergerModel;
    },
    (data) => {
      data.summary.occupiedHomes.value = 1.5;
    },
    (data) => {
      data.summary.occupancy.value = Infinity;
    },
    (data) => {
      data.summary.ttmNoi.value = NaN;
    },
    (data) => {
      data.summary.occupancy.state = "missing";
    },
    (data) => {
      data.summary.homes.state = "unknown";
    },
    (data) => {
      data.summaryAsOf = null;
    },
    (data) => {
      data.summary.costAsOf.value = "2026-02-30";
    },
    (data) => {
      data.summary.ttmPeriodStart.value = "2026-07-01";
    },
    (data) => {
      data.summary.ttmPeriodEnd = { state: "missing", value: null };
    },
    (data) => {
      data.summary.ttmPeriodStart = { state: "missing", value: null };
      data.summary.ttmPeriodEnd = { state: "missing", value: null };
    },
  ]) {
    const data = structuredClone(makeSnapshot(directory));
    mutate(data);
    assert.throws(() => parseFundSnapshot(data));
  }
  assert.throws(() => makeSnapshot({ ...directory, fundCount: 0 }));
  assert.throws(() => makeSnapshot({ ...directory, summary: {} }));
  assert.throws(() =>
    makeSnapshot({ ...directory, investor: "Synthetic extra field" }),
  );
});

test("photo linking requires a unique explicit match and confirmed photo address", () => {
  const row = { cockpitAddress: null, address: "Source caption" };
  assert.equal(matchPropertyPhoto("Synthetic property A", [row]), undefined);
  row.cockpitAddress = "Synthetic property A";
  assert.equal(matchPropertyPhoto("Synthetic property A", [row]), row);
  assert.equal(matchPropertyPhoto("synthetic property a", [row]), undefined);
  assert.equal(
    matchPropertyPhoto("Synthetic property A", [row, row]),
    undefined,
  );
  assert.equal(
    matchPropertyPhoto("Synthetic property A", [{ ...row, address: null }]),
    undefined,
  );
});

test("rendered Fund III page displays supplied values without assigning source photos to database rows", async () => {
  const data = makeSnapshot(directory);
  const result = await build({
    stdin: {
      contents: `
      const React = require('react');
      const { renderToStaticMarkup } = require('react-dom/server');
      const { MemoryRouter } = require('react-router-dom');
      const FundPortfolio = require('./src/FundPortfolio.tsx').default;
      module.exports = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(FundPortfolio)));
    `,
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
    plugins: [
      {
        name: "synthetic-report",
        setup(plugin) {
          plugin.onResolve({ filter: /^\.\/useFundSnapshot$/ }, () => ({
            path: "report",
            namespace: "synthetic",
          }));
          plugin.onLoad({ filter: /.*/, namespace: "synthetic" }, () => ({
            contents: `export const useFundSnapshot = () => (${JSON.stringify({ state: "ready", data })});`,
          }));
        },
      },
    ],
  });
  const module = { exports: "" };
  new Function("require", "module", result.outputFiles[0].text)(
    createRequire(import.meta.url),
    module,
  );
  const html = module.exports;
  for (const value of [
    "Synthetic property A",
    "$0",
    "$200",
    "$20",
    "$10",
    "50%",
    "120%",
    "Missing",
    "cost basis pending",
    "Synthetic fallback property",
    "including closing costs",
    " · TTM ",
    "2025-07-01",
    "Cost basis as of",
    "Photo unconfirmed",
    "2026-06-30",
  ])
    assert(html.includes(value), value);
  const groups = [
    ...html.matchAll(
      /<section class="fund-metric-group"[^>]*>(.*?)<\/section>/g,
    ),
  ].map((match) => match[1]);
  assert.deepEqual(
    groups.map((group) => [...group.matchAll(/<strong/g)].length),
    [4, 3, 3],
  );
  const grid = groups.join("");
  assert(!grid.includes("metric-unreported"));
  assert(!grid.includes("Snapshot as of"));
  assert(!grid.includes("info-button"));
  assert(html.includes("About these figures"));
  assert(html.includes('aria-expanded="false"'));
  assert(!grid.includes("Not yet reported"));
  for (const unsupported of [
    "Capital recycling rate",
    "stabilized homes",
    "stabilization rate",
    "refinance pipeline",
  ]) {
    assert(!grid.includes(unsupported));
    assert(
      !html.includes(unsupported),
      "unsourced measures stay in the closed panel",
    );
  }
  assert(!html.includes("4401 Avenue I"));
  assert(!html.includes("property-detail-01.png"));
});

test("investor account hides empty rows, preserves zero, and restores provided return panels", async () => {
  const result = await build({
    stdin: {
      contents: `
        const React = require('react');
        const { renderToStaticMarkup } = require('react-dom/server');
        const { MemoryRouter } = require('react-router-dom');
        const InvestorHome = require('./src/InvestorHome.tsx').default;
        const { investorExample } = require('./src/site-data.ts');
        const render = () => renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(InvestorHome)));
        const empty = render();
        investorExample.preferredTotal = 0;
        investorExample.promoteDistributed = 123;
        investorExample.subscription = null;
        module.exports = { empty, partial: render() };
      `,
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  });
  const module = { exports: null };
  new Function("require", "module", result.outputFiles[0].text)(
    createRequire(import.meta.url),
    module,
  );
  const { empty, partial } = module.exports;
  assert(
    empty.includes("Preferred return and promote figures are not yet provided"),
  );
  assert(!empty.includes("Not provided"));
  assert(empty.includes("Callable capital") && empty.includes("$0"));
  assert(!empty.includes('src="/images/business-process.png"'));
  assert.equal([...empty.matchAll(/class="process-card"/g)].length, 6);
  assert(partial.includes("Total preferred return") && partial.includes("$0"));
  assert(partial.includes("Distributed promote") && partial.includes("$123"));
  for (const hidden of [
    "Total subscription",
    "Distributed preferred return",
    "Accrued preferred return",
    "Total promote",
    "Remaining promote",
    "Not provided",
    "Preferred return and promote figures are not yet provided",
  ]) {
    assert(!partial.includes(hidden), hidden);
  }
});

test("CLI passes read-only SQL, writes atomically outside the repo, and preserves reports on rejected roles", async () => {
  const temp = await mkdtemp(join(tmpdir(), "obk-lp-publish-test-"));
  try {
    const output = join(temp, "fund-iii.json");
    const fake = join(temp, "psql");
    await writeFile(
      fake,
      `#!/usr/bin/env node
let sql=''; process.stdin.on('data', chunk => sql+=chunk); process.stdin.on('end', () => {
 if(!sql.includes('REPEATABLE READ READ ONLY') || !sql.includes("fund_name = 'Fund III'") || !sql.includes("public.fund_snapshot_metrics") || !sql.includes("public.fund_snapshot_properties") || !sql.includes("public.fund_snapshot_latest") || sql.includes("obk_merger") || sql.includes("public.properties") || sql.includes("has_table_privilege") || !sql.includes("NOT rolsuper") || !sql.includes('ROLLBACK;') || !process.argv.includes('-w') || process.env.PGOPTIONS !== '-c default_transaction_read_only=on') process.exit(2);
 console.log(process.env.TEST_REJECT ? 'rejected-role' : 'lp-read-only');
 console.log(process.env.TEST_BAD_REPORT ? '{"unexpected":true}' : ${JSON.stringify(JSON.stringify(makeSnapshot(directory)))});
});`,
      { mode: 0o700 },
    );
    const env = {
      ...process.env,
      PATH: `${temp}:${process.env.PATH}`,
      PGSERVICE: "synthetic_test_service",
      OBK_LP_ALLOW_ADMIN_ROLE: "0",
      OBK_LP_DATA_FILE: output,
    };
    const run = promisify(execFile);
    await run(process.execPath, ["scripts/lp-snapshot-publish.mjs"], { env });
    const original = await readFile(output, "utf8");
    assert.equal(
      parseFundSnapshot(JSON.parse(original)).properties[0].purchasePrice,
      0,
    );
    assert.equal((await stat(output)).mode & 0o777, 0o600);
    await assert.rejects(
      run(process.execPath, ["scripts/lp-snapshot-publish.mjs"], {
        env: { ...env, TEST_REJECT: "1", OBK_LP_ALLOW_ADMIN_ROLE: "1" },
      }),
    );
    assert.equal(await readFile(output, "utf8"), original);
    await assert.rejects(
      run(process.execPath, ["scripts/lp-snapshot-publish.mjs"], {
        env: { ...env, TEST_BAD_REPORT: "1" },
      }),
    );
    assert.equal(await readFile(output, "utf8"), original);
    await assert.rejects(
      run(process.execPath, ["scripts/lp-snapshot-publish.mjs"], {
        env: {
          ...env,
          OBK_LP_DATA_FILE: join(process.cwd(), "public", "forbidden.json"),
        },
      }),
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("local HTTP route serves validated LP data, fails closed and rejects cross-origin access", async () => {
  const temp = await mkdtemp(join(tmpdir(), "obk-lp-route-test-"));
  const previous = process.env.OBK_LP_DATA_FILE;
  const server = await createServer({
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: "127.0.0.1", port: 0, strictPort: false, open: false },
  });
  try {
    // An explicit path that does not exist must fail closed, even when a
    // gitignored demo export is present in public/lp-data/.
    process.env.OBK_LP_DATA_FILE = join(temp, "absent.json");
    await server.listen();
    const address = server.httpServer.address();
    const url = `http://127.0.0.1:${address.port}/lp-data/fund-iii.json`;
    assert.equal((await fetch(url)).status, 503);
    const path = join(temp, "fund-iii.json");
    process.env.OBK_LP_DATA_FILE = path;
    const data = makeSnapshot(directory);
    await writeFile(
      join(temp, "psql"),
      `#!/usr/bin/env node
process.stdin.resume(); process.stdin.on('end', () => {
 console.log('lp-read-only'); console.log(${JSON.stringify(JSON.stringify(data))});
});`,
      { mode: 0o700 },
    );
    await promisify(execFile)(
      process.execPath,
      ["scripts/lp-snapshot-publish.mjs"],
      {
        env: {
          ...process.env,
          PATH: `${temp}:${process.env.PATH}`,
          PGSERVICE: "synthetic_snapshot",
          OBK_LP_DATA_FILE: path,
        },
      },
    );
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), data);
    assert.equal(
      (await fetch(url, { headers: { Origin: "https://untrusted.invalid" } }))
        .status,
      403,
    );
    assert.equal((await fetch(url, { method: "POST" })).status, 405);
    await writeFile(path, '{"investor":"Synthetic forbidden field"}');
    const invalid = await fetch(url);
    assert.equal(invalid.status, 503);
    assert(!(await invalid.text()).includes("investor"));
  } finally {
    await server.close();
    if (previous === undefined) delete process.env.OBK_LP_DATA_FILE;
    else process.env.OBK_LP_DATA_FILE = previous;
    await rm(temp, { recursive: true, force: true });
  }
});

test("dollar-quote guard rejects payload tags and invalid tag identifiers", () => {
  assert.equal(
    quoteSnapshot("{}", "safe_tag"),
    "$safe_tag${}$safe_tag$::jsonb",
  );
  assert.throws(() =>
    quoteSnapshot('{"address":"contains_safe_tag_here"}', "safe_tag"),
  );
  assert.throws(() => quoteSnapshot("{}", "bad$tag"));
  const quoted = quoteSnapshot(JSON.stringify(makeSnapshot(directory)));
  assert.match(quoted, /^\$obk_lp_[0-9a-f]{32}\$/);
});

test("source and target connection settings are isolated, including service mode", () => {
  const env = {
    PGHOST: "synthetic_target",
    PGUSER: "target",
    PGDATABASE: "target",
    PGPASSWORD: "synthetic-target-password",
    PGSERVICE: "target_service",
    PGOPTIONS: "unsafe option",
    PGSERVICEFILE: "/unused-service-file",
    OBK_COCKPIT_PGHOST: "synthetic_source",
    OBK_COCKPIT_PGPORT: "1111",
    OBK_COCKPIT_PGUSER: "source",
    OBK_COCKPIT_PGDATABASE: "source",
    OBK_COCKPIT_PGPASSWORD: "synthetic-source-password",
  };
  const source = connectionEnv(true, env);
  assert.equal(source.PGHOST, "synthetic_source");
  assert.equal(source.PGPASSWORD, "synthetic-source-password");
  assert.equal(source.PGSERVICE, undefined);
  assert.equal(source.PGOPTIONS, undefined);
  assert.equal(source.PGSERVICEFILE, undefined);
  assert(!Object.keys(source).some((key) => key.startsWith("OBK_COCKPIT_")));
  const target = connectionEnv(false, env);
  assert.equal(target.PGHOST, "synthetic_target");
  assert.equal(target.PGPASSWORD, "synthetic-target-password");
  assert(!Object.keys(target).some((key) => key.startsWith("OBK_COCKPIT_")));
  assert.throws(() =>
    connectionEnv(true, {
      PGHOST: "target",
      PGUSER: "target",
      PGDATABASE: "target",
    }),
  );
  assert.equal(
    connectionEnv(true, {
      OBK_COCKPIT_PGSERVICE: "source_service",
      PGSERVICE: "target_service",
    }).PGSERVICE,
    "source_service",
  );
});

test("loader routes a validated snapshot from read-only cockpit to target and gates source override", async () => {
  const temp = await mkdtemp(join(tmpdir(), "obk-lp-load-test-"));
  try {
    const marker = join(temp, "loaded");
    await writeFile(
      join(temp, "psql"),
      `#!/usr/bin/env node
const fs = require('node:fs');
let sql = ''; process.stdin.on('data', chunk => sql += chunk); process.stdin.on('end', () => {
 if (process.env.OBK_COCKPIT_PGHOST || !process.argv.includes('-X') || !process.argv.includes('-w')) process.exit(2);
 if (process.env.PGHOST === 'synthetic_source') {
  if (process.env.PGUSER !== 'reader' || process.env.PGDATABASE !== 'synthetic_cockpit' || process.env.PGPASSWORD !== 'synthetic-source-password' || process.env.PGSERVICE || !sql.includes('REPEATABLE READ READ ONLY') || !sql.includes('Acquisition Terminated') || !sql.includes('obk_merger.property_capitalization') || !sql.includes('has_any_column_privilege') || !sql.includes('ROLLBACK;') || process.env.PGOPTIONS !== '-c default_transaction_read_only=on') process.exit(3);
  console.log(process.env.TEST_REJECT ? 'rejected-role' : 'lp-read-only');
  console.log(process.env.TEST_BAD_REPORT ? '{"fundCount":1,"unexpected":true}' : ${JSON.stringify(JSON.stringify(directory))});
 } else if (process.env.PGHOST === 'synthetic_target') {
  if (process.env.PGUSER !== 'owner' || process.env.PGDATABASE !== 'synthetic_lp' || process.env.PGPASSWORD !== 'synthetic-target-password' || process.env.PGOPTIONS !== '-c default_transaction_read_only=off' || !sql.includes('COMMIT;') || sql.includes('obk_merger')) process.exit(4);
  const match = sql.match(/load_fund_snapshot\\(\\$(obk_lp_[a-f0-9]+)\\$([\\s\\S]*)\\$\\1\\$::jsonb\\)/);
  if (!match || JSON.parse(match[2]).schemaVersion !== 3) process.exit(5);
  fs.writeFileSync(${JSON.stringify(marker)}, match[2]);
  console.log('42');
 } else process.exit(6);
});`,
      { mode: 0o700 },
    );
    const env = {
      ...process.env,
      PATH: `${temp}:${process.env.PATH}`,
      PGHOST: "synthetic_target",
      PGPORT: "2222",
      PGUSER: "owner",
      PGDATABASE: "synthetic_lp",
      PGPASSWORD: "synthetic-target-password",
      PGSERVICE: "",
      OBK_COCKPIT_PGHOST: "synthetic_source",
      OBK_COCKPIT_PGPORT: "1111",
      OBK_COCKPIT_PGUSER: "reader",
      OBK_COCKPIT_PGDATABASE: "synthetic_cockpit",
      OBK_COCKPIT_PGPASSWORD: "synthetic-source-password",
      OBK_COCKPIT_PGSERVICE: "",
      OBK_LP_ALLOW_ADMIN_ROLE: "0",
    };
    const run = (extra = {}) =>
      promisify(execFile)(process.execPath, ["scripts/lp-snapshot-load.mjs"], {
        env: { ...env, ...extra },
      });
    assert.match((await run()).stdout, /snapshot_id: 42/);
    assert.deepEqual(
      parseFundSnapshot(JSON.parse(await readFile(marker, "utf8"))).properties,
      directory.properties,
    );
    await rm(marker);
    await assert.rejects(run({ TEST_REJECT: "1" }));
    await assert.rejects(stat(marker));
    assert.match(
      (await run({ TEST_REJECT: "1", OBK_LP_ALLOW_ADMIN_ROLE: "1" })).stderr,
      /WARNING:.*privileged/,
    );
    await rm(marker);
    await assert.rejects(run({ TEST_BAD_REPORT: "1" }), (error) => {
      assert(!error.stderr.includes("synthetic-source-password"));
      assert(!error.stderr.includes("synthetic-target-password"));
      return true;
    });
    await assert.rejects(stat(marker));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("schema DDL and v3 parser have the exact same property and metric allowlists", async () => {
  const ddl = await readFile(
    new URL("../scripts/lp-snapshot-schema.sql", import.meta.url),
    "utf8",
  );
  const ts = await readFile(
    new URL("../src/fund-data.ts", import.meta.url),
    "utf8",
  );
  const quoted = (text) =>
    [...text.matchAll(/'([^']+)'/g)].map((match) => match[1]).sort();
  const array = (name) =>
    quoted(
      ddl.match(
        new RegExp(`${name} constant text\\[\\] := ARRAY\\[([\\s\\S]*?)\\]`),
      )[1],
    );
  const properties = [
    ...ts
      .match(/interface FundProperty \{([\s\S]*?)\n\}/)[1]
      .matchAll(/^  (\w+):/gm),
  ]
    .map((match) => match[1])
    .sort();
  assert.deepEqual(array("property_keys"), properties);
  assert.deepEqual(
    array("top_keys"),
    Object.keys(makeSnapshot(directory)).sort(),
  );
  const publisher = await readFile(
    new URL("../scripts/lp-snapshot-publish.mjs", import.meta.url),
    "utf8",
  );
  for (const [type, key, suffix] of [
    ["PropertyDetails", "detail_keys", "details"],
    ["PropertyPeriod", "period_keys", "periods"],
  ]) {
    const fields = [
      ...ts
        .match(new RegExp(`interface ${type} \\{([\\s\\S]*?)\\n\\}`))[1]
        .matchAll(/^  (\w+):/gm),
    ]
      .map((m) => m[1])
      .sort();
    assert.deepEqual(array(key), fields);
    const body = ddl.match(
      new RegExp(
        `CREATE TABLE IF NOT EXISTS public.fund_snapshot_property_${suffix} \\(([\\s\\S]*?)\\n\\);`,
      ),
    )[1];
    const columns = [
      ...body.matchAll(/^  (\w+) (?:bigint|text|date|numeric|boolean)\b/gm),
    ]
      .map((m) => m[1])
      .filter((k) => k !== "snapshot_id");
    assert.deepEqual(
      columns
        .map((k) => k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()))
        .sort(),
      fields,
    );
    assert.match(
      body,
      /FOREIGN KEY \(snapshot_id, property_id\) REFERENCES public.fund_snapshot_properties/,
    );
    for (const key of fields) assert(publisher.includes(`'${key}', p.`), key);
  }
  assert.match(ddl, /ADD COLUMN IF NOT EXISTS schema_version integer/);
  assert.match(ddl, /NOT NULL DEFAULT 2 CHECK \(schema_version IN \(2, 3\)\)/);
  assert.match(publisher, /'schemaVersion', s.schema_version/);
  assert(!/DROP TABLE|TRUNCATE|DELETE FROM/i.test(ddl));

  assert.deepEqual(array("metric_keys"), [...metricKeys, ...dateKeys].sort());
  assert.deepEqual(array("date_keys"), [...dateKeys].sort());
  const metricCheck = ddl.match(
    /metric text NOT NULL CHECK \(metric IN \(([\s\S]*?)\)\)/,
  )[1];
  assert.deepEqual(quoted(metricCheck), [...metricKeys, ...dateKeys].sort());
  const table = ddl.match(
    /CREATE TABLE IF NOT EXISTS public.fund_snapshot_properties \(([\s\S]*?)\n\);/,
  )[1];
  const columns = [
    ...table.matchAll(/^  (\w+) (?:bigint|text|date|numeric|boolean)\b/gm),
  ].map((match) => match[1]);
  assert.deepEqual(
    columns
      .filter((key) => key !== "snapshot_id")
      .map((key) =>
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      )
      .sort(),
    properties,
  );
  assert.match(
    ddl,
    /FUNCTION public\.load_fund_snapshot\(payload jsonb\)\s+RETURNS bigint/,
  );
});

test("v3 details and periods reject extra, missing, orphaned, duplicate and malformed data", () => {
  const data = makeSnapshot(directory);
  assert.equal(data.propertyDetails[0].currentMonthlyRent, 0);
  assert.equal(data.propertyDetails[1].currentMonthlyRent, null);
  assert.equal(data.propertyPeriods[0].noiAfterCapex, -15);
  assert.equal(data.propertyPeriods[1].annualizedYield, -3.3);
  const invalidPeriod = structuredClone(data);
  invalidPeriod.propertyPeriods[0].period = ["trailing_12_mo"];
  assert.throws(() => parseFundSnapshot(invalidPeriod));
  for (const mutate of [
    (d) => {
      d.schemaVersion = 2;
    },
    (d) => {
      delete d.propertyDetails;
    },
    (d) => {
      d.propertyDetails.pop();
    },
    (d) => {
      d.propertyDetails.push(d.propertyDetails[0]);
    },
    (d) => {
      d.propertyDetails[0].propertyId = 999;
    },
    (d) => {
      d.propertyPeriods[0].propertyId = 999;
    },
    (d) => {
      d.propertyPeriods.push(d.propertyPeriods[0]);
    },
    (d) => {
      d.propertyPeriods[0].period = "ytd";
    },
    (d) => {
      d.propertyDetails[0].unexpected = "Rejected";
    },
    (d) => {
      d.propertyPeriods[0].unexpected = "Rejected";
    },
    (d) => {
      delete d.propertyPeriods[0].egi;
    },
    (d) => {
      delete d.propertyDetails[0].lat;
    },
    (d) => {
      d.propertyDetails[0].lat = 91;
    },
    (d) => {
      d.propertyDetails[0].lon = -181;
    },
    (d) => {
      d.propertyDetails[0].lat = "33.5";
    },
    (d) => {
      d.propertyDetails[0].bedrooms = 2.5;
    },
    (d) => {
      d.propertyDetails[0].currentMonthlyRent = -1;
    },
    (d) => {
      d.propertyDetails[0].monthToMonth = "false";
    },
    (d) => {
      d.propertyDetails[0].leaseCurrent = false;
    },
    (d) => {
      d.propertyDetails[0].leaseStart = "2026-02-30";
    },
    (d) => {
      d.propertyDetails[0].leaseStart = "2027-01-01";
    },
    (d) => {
      d.propertyPeriods[0].noi = Infinity;
    },
    (d) => {
      d.propertyPeriods[0].egi = "0";
    },
    (d) => {
      d.propertyPeriods[0].periodEnd = "2026-02-30";
    },
    (d) => {
      d.propertyPeriods[0].periodStart = "2027-01-01";
    },
    (d) => {
      d.propertyPeriods[0].periodStart = null;
    },
    (d) => {
      d.propertyPeriods[0].periodStart = d.propertyPeriods[0].periodEnd = null;
    },
  ]) {
    const invalid = structuredClone(data);
    mutate(invalid);
    assert.throws(() => parseFundSnapshot(invalid));
  }
  for (const end of ["2026-06-29", "2026-06-30", "2026-07-01", null]) {
    for (const mtm of [true, false, null]) {
      const sample = structuredClone(data);
      sample.propertyDetails[0].leaseEnd = end;
      sample.propertyDetails[0].monthToMonth = mtm;
      sample.propertyDetails[0].leaseCurrent =
        mtm === true || (end !== null && end >= data.summaryAsOf)
          ? true
          : mtm === false && end !== null
            ? false
            : null;
      assert.doesNotThrow(() => parseFundSnapshot(sample));
    }
  }
  assert.doesNotThrow(() =>
    parseFundSnapshot({ ...data, propertyPeriods: [] }),
  );
});

test("v3 source SQL excludes private and test-only columns and uses only the two requested periods", async () => {
  const sql = await readFile(
    new URL("../scripts/fund-iii.sql", import.meta.url),
    "utf8",
  );
  const executable = sql.replace(/--[^\n]*/g, "");
  const index = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const css = await readFile(
    new URL("../src/styles.css", import.meta.url),
    "utf8",
  );
  assert(!/https?:\/\/[^\s"']*(?:google|gstatic)/i.test(index + css));
  for (const font of [
    "Archivo.ttf",
    "IBMPlexMono-Regular.ttf",
    "IBMPlexMono-Medium.ttf",
  ]) {
    assert(css.includes(`/fonts/${font}`));
    const bytes = await readFile(
      new URL(`../public/fonts/${font}`, import.meta.url),
    );
    assert.equal(bytes.readUInt32BE(0), 0x00010000);
  }

  for (const column of [
    "tenant_name",
    "tenant_phone",
    "pha_id",
    "hap_number",
    "landlord_id",
    "housing_authority",
    "source_sheet_row",
    "fcf",
    "capital_reserves",
  ])
    assert(!new RegExp(`\\b${column}\\b`, "i").test(executable), column);
  assert(!/m\.rent_collected\b/.test(executable));
  assert(!/SELECT\s+(?:\w+\.)?\*/i.test(executable));
  assert.match(
    sql,
    /ORDER BY lease_start DESC NULLS LAST, lease_number DESC LIMIT 1/,
  );
  assert.match(
    sql,
    /CROSS JOIN \(VALUES \('trailing_12_mo'\), \('since_acquired'\)\)/,
  );
  for (const column of [
    "lat",
    "lon",
    "zip_code",
    "bedrooms",
    "bathrooms",
    "year_built",
    "sqft",
  ])
    assert(sql.includes(`p.${column}`));
  for (const column of ["collection_rate", "noi_yield", "annualized_yield"])
    assert(sql.includes(`100.0 * m.${column}`));
});

test("property reports render snapshot values, lease states, missing values and OpenStreetMap", async () => {
  const result = await build({
    stdin: {
      contents: `
        const React = require('react');
        const { renderToStaticMarkup } = require('react-dom/server');
        const { MemoryRouter, Routes, Route } = require('react-router-dom');
        const { PropertyDetail, PropertyDirectory } = require('./src/PropertyPages.tsx');
        const { setReport } = require('./src/useFundSnapshot');
        module.exports = (report, path) => {
          setReport(report);
          return renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] },
            React.createElement(Routes, null,
              React.createElement(Route, { path: '/property-performance', element: React.createElement(PropertyDirectory) }),
              React.createElement(Route, { path: '/property-performance/:propertyId', element: React.createElement(PropertyDetail) }))));
        };
      `,
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
    plugins: [
      {
        name: "synthetic-property-report",
        setup(plugin) {
          plugin.onResolve({ filter: /useFundSnapshot$/ }, () => ({
            path: "report",
            namespace: "synthetic",
          }));
          plugin.onLoad({ filter: /.*/, namespace: "synthetic" }, () => ({
            contents: `let report; export const setReport = value => { report = value; }; export const useFundSnapshot = () => report;`,
          }));
          plugin.onLoad({ filter: /property-mapping\.json$/ }, () => ({
            loader: "json",
            contents: JSON.stringify(
              [1, 38].map((id) => ({
                id: `synthetic-${id}`,
                propertyId: id,
                address: `Synthetic home ${id}`,
                location: "Synthetic city",
                cockpitAddress: null,
                photo: "/synthetic.jpg",
                status: "current",
              })),
            ),
          }));
        },
      },
    ],
  });
  const module = { exports: null };
  new Function("require", "module", result.outputFiles[0].text)(
    createRequire(import.meta.url),
    module,
  );
  const render = (data, id = 1) =>
    module.exports(
      { state: "ready", data: parseFundSnapshot(data) },
      `/property-performance/synthetic-${id}`,
    );
  const data = makeSnapshot(directory);
  const html = render(data);
  for (const value of [
    "Occupied",
    "$0",
    "3 bd · 2 ba",
    "1950",
    "1,200 sq ft",
    "Annualized NOI yield since acquisition",
    "-3.3%",
    "-$15",
    "NOI less CapEx",
    "Current through 2026-06-30",
    "Obelisk Fund III LLC",
    "111.1%",
    "Monthly history is not part of the snapshot",
    "2025-07-01 to 2026-06-30",
    "2025-01-01 to 2026-06-30",
  ])
    assert(html.includes(value), value);
  const bbox = `${-86.9 - 0.004},${33.5 - 0.003},${-86.9 + 0.004},${33.5 + 0.003}`;
  assert(
    html.includes(
      `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&amp;marker=33.5,-86.9`,
    ),
  );
  assert(html.includes('referrerPolicy="no-referrer"'));
  assert(html.includes('loading="lazy"'));
  assert(
    html.includes(
      "https://www.openstreetmap.org/?mlat=33.5&amp;mlon=-86.9#map=17/33.5/-86.9",
    ),
  );
  for (const forbidden of [
    "google.com",
    "Tenant(s)",
    "Lease type",
    "Security deposit",
    "Section 8 amount",
    "Tenant portion",
    "Property type",
    "Cumulative cash-on-cash",
    "Financial history pending",
  ])
    assert(!html.includes(forbidden), forbidden);
  const missing = render(data, 38);
  assert(missing.includes("Map pending geocoding"));
  assert(missing.includes("Not provided"));
  assert(!missing.includes("<iframe"));
  assert(!missing.includes("$0"));
  const expired = structuredClone(data);
  expired.propertyDetails[0].leaseEnd = "2026-01-01";
  expired.propertyDetails[0].leaseCurrent = false;
  assert(
    render(expired).includes("Expired 2026-01-01; renewal not yet recorded"),
  );
  expired.propertyDetails[0].monthToMonth = true;
  expired.propertyDetails[0].leaseCurrent = true;
  assert(render(expired).includes("Month-to-month"));
  const noCoordinates = structuredClone(data);
  noCoordinates.propertyDetails[0].lat = null;
  assert(render(noCoordinates).includes("Map pending geocoding"));
  for (const status of ["Leasing", "Pending Sec 8"]) {
    const sample = structuredClone(data);
    sample.properties[0].status = status;
    assert(render(sample).includes(status));
  }
  const cards = module.exports(
    { state: "ready", data },
    "/property-performance",
  );
  assert(cards.includes("Rented"));
  assert(cards.includes("Current rent: $0"));
  for (const state of ["loading", "error", "unavailable"]) {
    const empty = module.exports(
      { state, data: null },
      "/property-performance/synthetic-1",
    );
    assert(empty.includes("Not provided"));
    assert(!empty.includes("$0"));
  }
});

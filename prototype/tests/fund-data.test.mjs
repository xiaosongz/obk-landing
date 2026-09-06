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
const directory = {
  fundCount: 1,
  summaryAsOf: "2026-06-30",
  summary: summary(),
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

test("v2 export preserves merger/fallback rows, zeros, missing and not-reported values", () => {
  const data = makeSnapshot(directory);
  assert.equal(data.schemaVersion, 2);
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
    makeSnapshot({ ...directory, properties: [], summary: empty }).properties
      .length,
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
    "Purchase price including closing costs",
    "TTM window:",
    "2025-07-01",
    "Cost as of:",
    "Photo unconfirmed",
    "2026-06-30",
  ])
    assert(html.includes(value), value);
  const grid = html
    .split('class="fund-metrics"')[1]
    .split('<p class="source-note">')[0];
  assert(!grid.includes("Not yet reported"));
  for (const unsupported of [
    "Capital recycling rate",
    "stabilized homes",
    "stabilization rate",
    "refinance pipeline",
  ]) {
    assert(!grid.includes(unsupported));
    assert(html.includes(unsupported));
  }
  assert(!html.includes("4401 Avenue I"));
  assert(!html.includes("property-detail-01.png"));
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
  if (!match || JSON.parse(match[2]).schemaVersion !== 2) process.exit(5);
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

test("schema DDL and v2 parser have the exact same property and metric allowlists", async () => {
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

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
import { makeSnapshot } from "../scripts/export-fund-iii.mjs";

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
  const temp = await mkdtemp(join(tmpdir(), "obk-lp-export-test-"));
  try {
    const output = join(temp, "fund-iii.json");
    const fake = join(temp, "psql");
    await writeFile(
      fake,
      `#!/usr/bin/env node
let sql=''; process.stdin.on('data', chunk => sql+=chunk); process.stdin.on('end', () => {
 if(!sql.includes('REPEATABLE READ READ ONLY') || !sql.includes("fund_name = 'Fund III'") || !sql.includes("Acquisition Terminated") || !sql.includes('ROLLBACK;') || !process.argv.includes('-w') || process.env.PGOPTIONS !== '-c default_transaction_read_only=on') process.exit(2);
 console.log(process.env.TEST_REJECT ? 'rejected-role' : 'lp-read-only');
 console.log(${JSON.stringify(JSON.stringify(directory))});
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
    await run(process.execPath, ["scripts/export-fund-iii.mjs"], { env });
    const original = await readFile(output, "utf8");
    assert.equal(
      parseFundSnapshot(JSON.parse(original)).properties[0].purchasePrice,
      0,
    );
    assert.equal((await stat(output)).mode & 0o777, 0o600);
    await assert.rejects(
      run(process.execPath, ["scripts/export-fund-iii.mjs"], {
        env: { ...env, TEST_REJECT: "1" },
      }),
    );
    assert.equal(await readFile(output, "utf8"), original);
    await assert.rejects(
      run(process.execPath, ["scripts/export-fund-iii.mjs"], {
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
    await writeFile(path, JSON.stringify(data));
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

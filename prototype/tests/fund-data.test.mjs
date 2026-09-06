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
  parseFundSnapshot,
  matchPropertyPhoto,
} from "../src/fund-data.ts";
import { makeSnapshot } from "../scripts/export-fund-iii.mjs";

// Synthetic values only. These are never bundled or presented as actual properties.
const directory = {
  fundCount: 1,
  properties: [
    {
      propertyId: 1,
      address: "Synthetic property A",
      status: null,
      purchaseDate: null,
      purchasePrice: 0,
      renovationCost: null,
      totalCapitalization: 100,
    },
  ],
};
const summary = () =>
  metricKeys.map((metric) => ({
    metric,
    asOf: "2026-09-01",
    state: "reported",
    value: 0,
  }));

test("export preserves zeros and missing values, and distinguishes an absent summary source", () => {
  const data = makeSnapshot(directory, null);
  assert.equal(data.properties[0].purchasePrice, 0);
  assert.equal(data.properties[0].renovationCost, null);
  assert.equal(
    formatMetric("occupancy", data.summary.occupancy),
    "Not yet reported",
  );
  const rows = summary();
  rows[0] = { ...rows[0], state: "missing", value: null };
  rows[3] = { ...rows[3], state: "not_reported", value: null };
  const report = makeSnapshot(directory, rows);
  assert.equal(
    formatMetric("occupied_homes", report.summary.occupied_homes),
    "0",
  );
  assert.equal(formatMetric("occupancy", report.summary.occupancy), "0%");
  assert.equal(
    formatMetric(
      "capital_recycling_rate",
      report.summary.capital_recycling_rate,
    ),
    "Missing",
  );
  assert.equal(
    formatMetric("stabilized_homes", report.summary.stabilized_homes),
    "Not yet reported",
  );
  assert.equal(
    makeSnapshot({ fundCount: 1, properties: [] }, null).properties.length,
    0,
  );
});

test("rejects wrong funds, extra private fields, duplicate IDs, invalid dates/numbers and ambiguous summary periods", () => {
  const valid = () => makeSnapshot(directory, summary());
  for (const mutate of [
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
      data.properties.push(data.properties[0]);
    },
    (data) => {
      data.properties[0].purchasePrice = "0";
    },
    (data) => {
      data.properties[0].purchaseDate = "2026-02-30";
    },
    (data) => {
      data.summary.occupancy.value = 101;
    },
    (data) => {
      data.summary.occupied_homes.value = 1.5;
    },
    (data) => {
      data.summary.occupancy.value = Infinity;
    },
    (data) => {
      data.summary.occupancy.state = "missing";
    },
    (data) => {
      data.summaryAsOf = null;
    },
  ]) {
    const data = structuredClone(valid());
    mutate(data);
    assert.throws(() => parseFundSnapshot(data));
  }
  assert.throws(() => makeSnapshot({ ...directory, fundCount: 0 }, null));
  assert.throws(() => makeSnapshot(directory, []));
  const rows = summary();
  rows[1].asOf = "2026-08-01";
  assert.throws(() => makeSnapshot(directory, rows));
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
  const rows = summary();
  rows[0] = { ...rows[0], state: "missing", value: null };
  rows[5] = { ...rows[5], state: "not_reported", value: null };
  const data = makeSnapshot(directory, rows);
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
    "$100",
    "0%",
    "Missing",
    "Not yet reported",
    "Photo unconfirmed",
    "2026-09-01",
  ])
    assert(html.includes(value), value);
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
 if(!sql.includes('REPEATABLE READ READ ONLY') || !sql.includes("f.fund_name = 'Fund III'") || !sql.includes('ROLLBACK;') || !process.argv.includes('-w') || process.env.PGOPTIONS !== '-c default_transaction_read_only=on') process.exit(2);
 console.log(process.env.TEST_REJECT ? 'rejected-role' : 'lp-read-only');
 console.log(${JSON.stringify(JSON.stringify(directory))}); console.log('null');
});`,
      { mode: 0o700 },
    );
    const env = {
      ...process.env,
      PATH: `${temp}:${process.env.PATH}`,
      PGSERVICE: "synthetic_test_service",
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
    const data = makeSnapshot(directory, summary());
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

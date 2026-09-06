import { readFile } from "node:fs/promises";
import {
  connectionEnv,
  makeSnapshot,
  quoteSnapshot,
  readSnapshotQuery,
  runPsql,
  sourceRoleCheck,
} from "./lp-snapshot-lib.mjs";

async function loadSnapshot() {
  const source = connectionEnv(true);
  const target = connectionEnv();
  const sql = await readFile(new URL("fund-iii.sql", import.meta.url), "utf8");
  const snapshot = makeSnapshot(
    await readSnapshotQuery(
      sql,
      source,
      sourceRoleCheck,
      process.env.OBK_LP_ALLOW_ADMIN_ROLE === "1",
    ),
  );
  const result = await runPsql(
    `BEGIN;
SET LOCAL statement_timeout = '15s';
SET LOCAL search_path = pg_catalog, public;
SET LOCAL TIME ZONE 'UTC';
SET LOCAL DateStyle = 'ISO, YMD';
SELECT public.load_fund_snapshot(${quoteSnapshot(JSON.stringify(snapshot))});
COMMIT;`,
    target,
    false,
  );
  const id = result.trim();
  if (!/^[1-9][0-9]*$/.test(id)) throw new Error("Unexpected snapshot ID");
  console.log(`Loaded Fund III snapshot_id: ${id}`);
}

loadSnapshot().catch(() => {
  console.error(
    "Snapshot load failed. Check private source/target connections, source read-only role, schema and v2 contract. No database details are printed.",
  );
  process.exitCode = 1;
});

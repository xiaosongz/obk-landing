import { execFile } from "node:child_process";
import { readFile, realpath, open, rename, unlink } from "node:fs/promises";
import { dirname, basename, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFundSnapshot } from "../src/fund-data.ts";

export function makeSnapshot(result, exportedAt = new Date().toISOString()) {
  const { fundCount, ...report } = result;
  if (fundCount !== 1) throw new Error("Expected exactly one Fund III row");
  // Forward every SQL field to the shared allowlist; never silently strip extras.
  return parseFundSnapshot({
    ...report,
    schemaVersion: 2,
    fundName: "Fund III",
    exportedAt,
  });
}

export async function exportFund() {
  // Connection comes from a named libpq service or explicit PG* variables so a
  // developer/GP login is never picked up silently. The password stays in the
  // libpq password file or PGPASSWORD; it is never passed as an argument.
  const explicitConnection =
    process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE;
  if (
    (!process.env.PGSERVICE && !explicitConnection) ||
    !process.env.OBK_LP_DATA_FILE
  )
    throw new Error(
      "Configure PGSERVICE (or PGHOST, PGUSER, PGDATABASE) and OBK_LP_DATA_FILE",
    );
  const destination = resolve(process.env.OBK_LP_DATA_FILE);
  const parent = await realpath(dirname(destination));
  const repo = await realpath(
    fileURLToPath(new URL("../../", import.meta.url)),
  );
  // Allowed destinations: anywhere outside the repository, or the gitignored
  // prototype/public/lp-data/ directory so a demo build is self-contained.
  const demoDirectory = await realpath(
    fileURLToPath(new URL("../public/lp-data/", import.meta.url)),
  ).catch(() => null);
  const within = relative(repo, parent);
  const outsideRepo =
    within.startsWith(`..${sep}`) || within === ".." || within.startsWith(sep);
  if (!outsideRepo && parent !== demoDirectory)
    throw new Error(
      "Export destination must be outside the repository or in public/lp-data/",
    );
  // Demo escape hatch: the owner may run the export with an administrative
  // login before a dedicated LP reader role exists. The transaction is still
  // read-only; only the role-attribute gate is bypassed, loudly.
  const allowAdminRole = process.env.OBK_LP_ALLOW_ADMIN_ROLE === "1";
  const sql = await readFile(new URL("fund-iii.sql", import.meta.url), "utf8");
  const roleCheck = `
SELECT CASE WHEN EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = current_user
    AND NOT rolsuper AND NOT rolcreatedb AND NOT rolcreaterole
    AND NOT rolreplication AND NOT rolbypassrls
) AND NOT has_table_privilege(current_user, 'public.properties', 'INSERT,UPDATE,DELETE,TRUNCATE,TRIGGER')
  AND NOT has_table_privilege(current_user, 'public.funds', 'INSERT,UPDATE,DELETE,TRUNCATE,TRIGGER')
  AND NOT has_any_column_privilege(current_user, 'public.properties', 'INSERT,UPDATE')
  AND NOT has_any_column_privilege(current_user, 'public.funds', 'INSERT,UPDATE')
  AND NOT EXISTS (
    SELECT 1 FROM (VALUES
      ('obk_merger.property_capitalization'),
      ('obk_merger.property_period_metrics'),
      ('obk_merger.merger_run_log')
    ) AS sources(table_name)
    WHERE has_table_privilege(current_user, table_name, 'INSERT,UPDATE,DELETE,TRUNCATE,TRIGGER')
       OR has_any_column_privilege(current_user, table_name, 'INSERT,UPDATE')
  )
THEN 'lp-read-only' ELSE 'rejected-role' END;`;
  // -X ignores psqlrc; -w never prompts; all queries share one read-only snapshot.
  const query = `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL statement_timeout = '15s';
SET LOCAL search_path = pg_catalog, public;
${roleCheck}
${sql}
ROLLBACK;`;
  const stdout = await new Promise((accept, reject) => {
    const child = execFile(
      "psql",
      ["-X", "-q", "-A", "-t", "-w", "-v", "ON_ERROR_STOP=1"],
      {
        env: {
          ...process.env,
          PGCONNECT_TIMEOUT: "5",
          PGOPTIONS: "-c default_transaction_read_only=on",
        },
        timeout: 30000,
        maxBuffer: 4 * 1024 * 1024,
      },
      (error, output) => (error ? reject(error) : accept(output)),
    );
    child.stdin.on("error", reject);
    child.stdin.end(query);
  });
  const lines = stdout.trim().split(/\r?\n/);
  if (lines.length !== 2) throw new Error("Unexpected query output");
  if (lines[0] !== "lp-read-only") {
    if (!allowAdminRole)
      throw new Error("Read-only role or query output rejected");
    console.warn(
      "WARNING: exporting with a privileged database role (OBK_LP_ALLOW_ADMIN_ROLE=1). Demo use only; provision a dedicated LP reader for production.",
    );
  }
  const snapshot = makeSnapshot(JSON.parse(lines[1]));
  const output = resolve(parent, basename(destination));
  const temporary = `${output}.${process.pid}.tmp`;
  const handle = await open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(JSON.stringify(snapshot, null, 2) + "\n");
    await handle.close();
    await rename(temporary, output);
  } finally {
    await handle.close();
    await unlink(temporary).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
  console.log(
    `Validated LP-only Fund III snapshot written to ${output} (${parent === demoDirectory ? "gitignored demo directory" : "outside the repository"}).`,
  );
}

async function main() {
  await exportFund();
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch(() => {
    console.error(
      "Fund III export failed. Check the private service, read-only role, schema, summary contract, and output path. Existing report was preserved.",
    );
    process.exitCode = 1;
  });
}

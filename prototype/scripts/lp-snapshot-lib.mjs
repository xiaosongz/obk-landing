import { execFile } from "node:child_process";
import { realpath, open, rename, unlink } from "node:fs/promises";
import { randomBytes } from "node:crypto";
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

export const sourceRoleCheck = `
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

export const publishRoleCheck = `
SELECT CASE WHEN EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = current_user AND NOT rolsuper
) THEN 'lp-read-only' ELSE 'rejected-role' END;`;

// Separate libpq connection settings: source never inherits the target's PG*.
// Only these six connection variables are forwarded; libpq default service and
// password files remain available. Never load an env file in these scripts.
export function connectionEnv(source = false, env = process.env) {
  const childEnv = Object.fromEntries(
    Object.entries(env).filter(
      ([key]) => !key.startsWith("PG") && !key.startsWith("OBK_COCKPIT_"),
    ),
  );
  for (const key of [
    "PGHOST",
    "PGPORT",
    "PGUSER",
    "PGDATABASE",
    "PGPASSWORD",
    "PGSERVICE",
  ]) {
    const value = env[source ? `OBK_COCKPIT_${key}` : key];
    if (value) childEnv[key] = value;
  }
  if (
    !childEnv.PGSERVICE &&
    !(childEnv.PGHOST && childEnv.PGUSER && childEnv.PGDATABASE)
  )
    throw new Error(
      "Configure a service or an explicit host, user and database",
    );
  return childEnv;
}

export function runPsql(sql, env, readOnly = true) {
  return new Promise((accept, reject) => {
    const child = execFile(
      "psql",
      ["-X", "-q", "-A", "-t", "-w", "-v", "ON_ERROR_STOP=1"],
      {
        env: {
          ...env,
          PGCONNECT_TIMEOUT: "5",
          PGOPTIONS: `-c default_transaction_read_only=${readOnly ? "on" : "off"}`,
        },
        timeout: 30000,
        maxBuffer: 4 * 1024 * 1024,
      },
      (error, output) =>
        error ? reject(new Error("Database command failed")) : accept(output),
    );
    child.stdin.on("error", () => reject(new Error("Database input failed")));
    child.stdin.end(sql);
  });
}

export async function readSnapshotQuery(
  sql,
  env,
  roleCheck,
  allowAdminRole = false,
) {
  const stdout = await runPsql(
    `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL statement_timeout = '15s';
SET LOCAL search_path = pg_catalog, public;
SET LOCAL TIME ZONE 'UTC';
SET LOCAL DateStyle = 'ISO, YMD';
${roleCheck}
${sql}
ROLLBACK;`,
    env,
  );
  const lines = stdout.trim().split(/\r?\n/);
  if (
    lines.length !== 2 ||
    !["lp-read-only", "rejected-role"].includes(lines[0])
  )
    throw new Error("Unexpected query output");
  if (lines[0] !== "lp-read-only") {
    if (!allowAdminRole)
      throw new Error("Read-only role or query output rejected");
    console.warn(
      "WARNING: reading the cockpit with a privileged database role (OBK_LP_ALLOW_ADMIN_ROLE=1). Demo use only; use a dedicated cockpit reader for production.",
    );
  }
  return JSON.parse(lines[1]);
}

export function quoteSnapshot(
  payload,
  tag = `obk_lp_${randomBytes(16).toString("hex")}`,
) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tag) || payload.includes(tag))
    throw new Error("Unsafe snapshot dollar-quote tag");
  return `$${tag}$${payload}$${tag}$::jsonb`;
}

export async function snapshotDestination(path) {
  if (!path) throw new Error("Configure OBK_LP_DATA_FILE");
  const destination = resolve(path);
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
  return {
    output: resolve(parent, basename(destination)),
    demo: parent === demoDirectory,
  };
}

export async function writeSnapshot(snapshot, { output, demo }) {
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
    `Validated LP-only Fund III snapshot written to ${output} (${demo ? "gitignored demo directory" : "outside the repository"}).`,
  );
}

import { parseFundSnapshot } from "../src/fund-data.ts";
import {
  connectionEnv,
  publishRoleCheck,
  readSnapshotQuery,
  snapshotDestination,
  writeSnapshot,
} from "./lp-snapshot-lib.mjs";

// Reconstruct from normalized tables; no raw payload is stored or reused.
const sql = `
SELECT json_build_object(
  'schemaVersion', 2,
  'fundName', s.fund_name,
  'exportedAt', to_char(s.exported_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  'summaryAsOf', s.summary_as_of,
  'properties', COALESCE((
    SELECT json_agg(json_build_object(
      'propertyId', p.property_id,
      'address', p.address,
      'status', p.status,
      'purchaseDate', p.purchase_date,
      'purchasePrice', p.purchase_price,
      'renovationCost', p.renovation_cost,
      'totalCapitalization', p.total_capitalization,
      'costFromMergerModel', p.cost_from_merger_model
    ) ORDER BY p.address, p.property_id)
    FROM public.fund_snapshot_properties p WHERE p.snapshot_id = s.snapshot_id
  ), '[]'::json),
  'summary', (
    SELECT json_object_agg(m.metric, json_build_object(
      'state', m.state,
      'value', COALESCE(to_jsonb(m.value_number), to_jsonb(m.value_date))
    )) FROM public.fund_snapshot_metrics m WHERE m.snapshot_id = s.snapshot_id
  )
) FROM public.fund_snapshot_latest s WHERE s.fund_name = 'Fund III';`;

async function publishSnapshot() {
  const destination = await snapshotDestination(process.env.OBK_LP_DATA_FILE);
  const snapshot = parseFundSnapshot(
    await readSnapshotQuery(sql, connectionEnv(), publishRoleCheck),
  );
  await writeSnapshot(snapshot, destination);
}

publishSnapshot().catch(() => {
  console.error(
    "Snapshot publish failed. Check the private snapshot connection, non-superuser role, schema, v2 contract and output path. Existing report was preserved.",
  );
  process.exitCode = 1;
});

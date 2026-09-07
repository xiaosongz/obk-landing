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
  'schemaVersion', s.schema_version,
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
  'propertyDetails', COALESCE((
    SELECT json_agg(json_build_object(
      'propertyId', p.property_id,
      'bedrooms', p.bedrooms,
      'bathrooms', p.bathrooms,
      'yearBuilt', p.year_built,
      'sqft', p.sqft,
      'zip', p.zip,
      'lat', p.lat,
      'lon', p.lon,
      'holdPeriodYears', p.hold_period_years,
      'currentMonthlyRent', p.current_monthly_rent,
      'leaseStart', p.lease_start,
      'leaseEnd', p.lease_end,
      'monthToMonth', p.month_to_month,
      'leaseCurrent', p.lease_current
    ) ORDER BY p.property_id)
    FROM public.fund_snapshot_property_details p WHERE p.snapshot_id = s.snapshot_id
  ), '[]'::json),
  'propertyPeriods', COALESCE((
    SELECT json_agg(json_build_object(
      'propertyId', p.property_id,
      'period', p.period,
      'periodStart', p.period_start,
      'periodEnd', p.period_end,
      'egi', p.egi,
      'propertyTax', p.property_tax,
      'insurance', p.insurance,
      'opex', p.opex,
      'noi', p.noi,
      'capex', p.capex,
      'noiAfterCapex', p.noi_after_capex,
      'potentialRent', p.potential_rent,
      'collectionRate', p.collection_rate,
      'noiYield', p.noi_yield,
      'annualizedYield', p.annualized_yield
    ) ORDER BY p.property_id, p.period)
    FROM public.fund_snapshot_property_periods p WHERE p.snapshot_id = s.snapshot_id
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
    "Snapshot publish failed. Check the private snapshot connection, non-superuser role, schema, v3 contract and output path. Existing report was preserved.",
  );
  process.exitCode = 1;
});

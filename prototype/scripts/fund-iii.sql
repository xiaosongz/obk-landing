-- Run only through export-fund-iii.mjs in a read-only transaction.
-- No GP API, tenants, investors, transactions, or SELECT *.
--
-- Funds I and II merged into Fund III (owner confirmation, 2026-09-06). The
-- database's properties.fund_id still records the original acquisition vehicle,
-- so the LP portfolio is every current property regardless of that column.
-- Terminated acquisitions and synthetic IDs (>= 9001) are excluded.
SELECT json_build_object(
  'fundCount', (SELECT count(*) FROM public.funds WHERE fund_name = 'Fund III'),
  'properties', COALESCE((
    SELECT json_agg(json_build_object(
      'propertyId', p.property_id,
      'address', p.address,
      'status', p.status,
      'purchaseDate', p.purchase_date,
      'purchasePrice', p.purchase_price,
      'renovationCost', p.total_renovation_cost,
      'totalCapitalization', p.total_capitalization
    ) ORDER BY p.address, p.property_id)
    FROM public.properties p
    WHERE p.status IS DISTINCT FROM 'Acquisition Terminated'
      AND p.property_id < 9001
  ), '[]'::json)
);

-- Summary measures. If the owner supplies public.lp_fund_iii_summary it is
-- authoritative. Otherwise only the two measures derivable from property
-- status are reported (occupied = status 'Rented'); the rest stay
-- "not yet reported", never zero.
SELECT to_regclass('public.lp_fund_iii_summary') IS NOT NULL AS has_summary \gset
\if :has_summary
SELECT COALESCE(json_agg(json_build_object(
  'asOf', as_of_date, 'metric', metric, 'state', state, 'value', value
)), '[]'::json)
FROM public.lp_fund_iii_summary
WHERE fund_name = 'Fund III';
\else
WITH fund AS (
  SELECT count(*) AS total,
         count(*) FILTER (WHERE p.status = 'Rented') AS occupied
  FROM public.properties p
  WHERE p.status IS DISTINCT FROM 'Acquisition Terminated'
    AND p.property_id < 9001
)
SELECT json_build_array(
  json_build_object('asOf', current_date, 'metric', 'capital_recycling_rate', 'state', 'not_reported', 'value', NULL),
  json_build_object('asOf', current_date, 'metric', 'occupied_homes', 'state', 'reported', 'value', occupied),
  json_build_object('asOf', current_date, 'metric', 'occupancy', 'state',
    CASE WHEN total > 0 THEN 'reported' ELSE 'missing' END, 'value',
    CASE WHEN total > 0 THEN round(100.0 * occupied / total, 1) END),
  json_build_object('asOf', current_date, 'metric', 'stabilized_homes', 'state', 'not_reported', 'value', NULL),
  json_build_object('asOf', current_date, 'metric', 'stabilization_rate', 'state', 'not_reported', 'value', NULL),
  json_build_object('asOf', current_date, 'metric', 'refinance_pipeline', 'state', 'not_reported', 'value', NULL)
)
FROM fund;
\endif

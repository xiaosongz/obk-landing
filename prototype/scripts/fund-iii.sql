-- Run only through lp-snapshot-load.mjs in a read-only transaction.
-- No GP API, tenants, investors, transactions, or SELECT *.
-- Funds I and II merged into Fund III (owner confirmation, 2026-09-06).
-- fund_id is the original acquisition vehicle, so keep every active property.
WITH active_properties AS (
  SELECT p.property_id, p.address, p.status,
         COALESCE(c.purchase_date, p.purchase_date) AS purchase_date,
         COALESCE(c.purchase_price, p.purchase_price) AS purchase_price,
         COALESCE(c.renovation_cost, p.total_renovation_cost) AS renovation_cost,
         COALESCE(c.total_cost, p.total_capitalization) AS total_cost,
         c.property_id IS NOT NULL AS cost_from_merger_model
  FROM public.properties p
  LEFT JOIN obk_merger.property_capitalization c USING (property_id)
  WHERE p.status IS DISTINCT FROM 'Acquisition Terminated'
    AND p.property_id < 9001
), rollup AS (
  SELECT count(*) AS homes,
         count(*) FILTER (WHERE p.status = 'Rented') AS occupied_homes,
         sum(p.purchase_price) AS acquisition_cost,
         sum(p.renovation_cost) AS renovation_cost,
         sum(p.total_cost) AS capitalization,
         sum(m.rent_egi_collected) AS rent_egi_collected,
         sum(m.noi) AS noi,
         -- rent_collected is not a column in every merger schema revision;
         -- collection_rate = rent_collected / potential_rent, so recover it.
         sum(m.collection_rate * m.potential_rent) AS rent_collected,
         sum(m.potential_rent) AS potential_rent,
         min(m.period_start) AS period_start,
         max(m.period_end) AS period_end,
         count(DISTINCT m.period_start) = 1
           AND count(DISTINCT m.period_end) = 1 AS consistent_period
  FROM active_properties p
  LEFT JOIN obk_merger.property_period_metrics m
    ON m.property_id = p.property_id AND m.period_label = 'trailing_12_mo'
), latest_run AS (
  SELECT as_of_date FROM obk_merger.merger_run_log ORDER BY run_id DESC LIMIT 1
)
SELECT json_build_object(
  'fundCount', (SELECT count(*) FROM public.funds WHERE fund_name = 'Fund III'),
  'summaryAsOf', COALESCE((SELECT as_of_date FROM latest_run), r.period_end),
  'properties', COALESCE((
    SELECT json_agg(json_build_object(
      'propertyId', p.property_id,
      'address', p.address,
      'status', p.status,
      'purchaseDate', p.purchase_date,
      'purchasePrice', p.purchase_price,
      'renovationCost', p.renovation_cost,
      'totalCapitalization', p.total_cost,
      'costFromMergerModel', p.cost_from_merger_model
    ) ORDER BY p.address, p.property_id)
    FROM active_properties p
  ), '[]'::json),
  -- SQL SUM ignores absent inputs; all-null sums and undefined ratios stay
  -- missing, never zero. Mixed TTM windows are withheld, not combined.
  'summary', (
    SELECT json_object_agg(metric, json_build_object(
      'state', CASE WHEN value IS NULL THEN 'missing' ELSE 'reported' END,
      'value', value
    ))
    FROM (VALUES
      ('homes', to_jsonb(r.homes)),
      ('occupiedHomes', to_jsonb(r.occupied_homes)),
      ('occupancy', to_jsonb(round(100.0 * r.occupied_homes / NULLIF(r.homes, 0), 1))),
      ('totalAcquisitionCost', to_jsonb(r.acquisition_cost)),
      ('totalRenovationCost', to_jsonb(r.renovation_cost)),
      ('totalCapitalization', to_jsonb(r.capitalization)),
      ('ttmRentCollected', to_jsonb(CASE WHEN r.consistent_period THEN r.rent_egi_collected END)),
      ('ttmNoi', to_jsonb(CASE WHEN r.consistent_period THEN r.noi END)),
      ('ttmNoiYield', to_jsonb(CASE WHEN r.consistent_period THEN round(100.0 * r.noi / NULLIF(r.capitalization, 0), 2) END)),
      ('ttmCollectionRate', to_jsonb(CASE WHEN r.consistent_period THEN round(100.0 * r.rent_collected / NULLIF(r.potential_rent, 0), 2) END)),
      ('ttmPeriodStart', to_jsonb(CASE WHEN r.consistent_period THEN r.period_start END)),
      ('ttmPeriodEnd', to_jsonb(CASE WHEN r.consistent_period THEN r.period_end END)),
      ('costAsOf', to_jsonb((SELECT as_of_date FROM latest_run)))
    ) AS measures(metric, value)
  )
)
FROM rollup r;

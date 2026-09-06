-- Run only through export-fund-iii.mjs in a read-only transaction.
-- No GP API, tenants, investors, transactions, or SELECT *.
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
    JOIN public.funds f ON f.fund_id = p.fund_id
    WHERE f.fund_name = 'Fund III'
      AND p.status IS DISTINCT FROM 'Acquisition Terminated'
      AND p.property_id < 9001
  ), '[]'::json)
);

-- Optional owner-provided read model; this is NOT an existing cockpit view.
-- Missing view means not yet reported, never zero. A malformed view fails export.
SELECT to_regclass('public.lp_fund_iii_summary') IS NOT NULL AS has_summary \gset
\if :has_summary
SELECT COALESCE(json_agg(json_build_object(
  'asOf', as_of_date, 'metric', metric, 'state', state, 'value', value
)), '[]'::json)
FROM public.lp_fund_iii_summary
WHERE fund_name = 'Fund III';
\else
SELECT 'null';
\endif

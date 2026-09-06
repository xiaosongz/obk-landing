-- Website snapshot allowlist: the v2 fund header, 10 numeric + 3 date summary
-- measures, and the 8 FundProperty fields in src/fund-data.ts, nothing else.
-- snapshot_id, source_label and loaded_at are load metadata only; schemaVersion
-- is fixed at 2 and reconstructed by the publisher. No raw payload is retained.
-- No investor, tenant, bank or transaction data. Investor-account tables come later.
-- Owner applies this only to the isolated obk_lp database. No cross-database reads.
BEGIN;

CREATE TABLE IF NOT EXISTS public.fund_snapshots (
  snapshot_id bigserial PRIMARY KEY,
  fund_name text NOT NULL CHECK (fund_name = 'Fund III'),
  exported_at timestamptz NOT NULL CHECK (isfinite(exported_at)),
  summary_as_of date CHECK (isfinite(summary_as_of)),
  source_label text NOT NULL,
  loaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fund_snapshot_metrics (
  snapshot_id bigint NOT NULL REFERENCES public.fund_snapshots(snapshot_id),
  metric text NOT NULL CHECK (metric IN (
    'homes', 'occupiedHomes', 'occupancy', 'totalAcquisitionCost',
    'totalRenovationCost', 'totalCapitalization', 'ttmRentCollected', 'ttmNoi',
    'ttmNoiYield', 'ttmCollectionRate', 'ttmPeriodStart', 'ttmPeriodEnd', 'costAsOf'
  )),
  state text NOT NULL CHECK (state IN ('reported', 'missing', 'not_reported')),
  value_number numeric CHECK (value_number >= 0 AND value_number::text NOT IN ('NaN', 'Infinity', '-Infinity')),
  value_date date CHECK (isfinite(value_date)),
  PRIMARY KEY (snapshot_id, metric),
  CHECK (
    (state <> 'reported' AND value_number IS NULL AND value_date IS NULL) OR
    (state = 'reported' AND (
      (metric IN ('ttmPeriodStart', 'ttmPeriodEnd', 'costAsOf') AND value_number IS NULL AND value_date IS NOT NULL) OR
      (metric NOT IN ('ttmPeriodStart', 'ttmPeriodEnd', 'costAsOf') AND value_number IS NOT NULL AND value_date IS NULL)
    ))
  ),
  CHECK (metric NOT IN ('homes', 'occupiedHomes') OR (value_number = trunc(value_number) AND value_number <= 9007199254740991)),
  CHECK (metric <> 'occupancy' OR value_number <= 100),
  CHECK (metric <> 'ttmCollectionRate' OR value_number <= 200)
);

CREATE TABLE IF NOT EXISTS public.fund_snapshot_properties (
  snapshot_id bigint NOT NULL REFERENCES public.fund_snapshots(snapshot_id),
  property_id bigint NOT NULL CHECK (property_id BETWEEN 1 AND 9007199254740991),
  address text NOT NULL CHECK (address ~ '[^[:space:]]'),
  status text CHECK (status ~ '[^[:space:]]'),
  purchase_date date CHECK (isfinite(purchase_date)),
  purchase_price numeric CHECK (purchase_price >= 0 AND purchase_price::text NOT IN ('NaN', 'Infinity', '-Infinity')),
  renovation_cost numeric CHECK (renovation_cost >= 0 AND renovation_cost::text NOT IN ('NaN', 'Infinity', '-Infinity')),
  total_capitalization numeric CHECK (total_capitalization >= 0 AND total_capitalization::text NOT IN ('NaN', 'Infinity', '-Infinity')),
  cost_from_merger_model boolean NOT NULL,
  PRIMARY KEY (snapshot_id, property_id)
);

-- Newest source export wins even if an older export is loaded later; IDs break ties.
CREATE OR REPLACE VIEW public.fund_snapshot_latest AS
SELECT DISTINCT ON (fund_name)
  snapshot_id, fund_name, exported_at, summary_as_of, source_label, loaded_at
FROM public.fund_snapshots
ORDER BY fund_name, exported_at DESC, snapshot_id DESC;

CREATE OR REPLACE FUNCTION public.load_fund_snapshot(payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  top_keys constant text[] := ARRAY[
    'schemaVersion', 'fundName', 'exportedAt', 'summaryAsOf', 'properties', 'summary'
  ];
  property_keys constant text[] := ARRAY[
    'propertyId', 'address', 'status', 'purchaseDate', 'purchasePrice',
    'renovationCost', 'totalCapitalization', 'costFromMergerModel'
  ];
  metric_keys constant text[] := ARRAY[
    'homes', 'occupiedHomes', 'occupancy', 'totalAcquisitionCost',
    'totalRenovationCost', 'totalCapitalization', 'ttmRentCollected', 'ttmNoi',
    'ttmNoiYield', 'ttmCollectionRate', 'ttmPeriodStart', 'ttmPeriodEnd', 'costAsOf'
  ];
  date_keys constant text[] := ARRAY['ttmPeriodStart', 'ttmPeriodEnd', 'costAsOf'];
  new_id bigint;
  item jsonb;
  key text;
  measure jsonb;
  value jsonb;
BEGIN
  IF jsonb_typeof(payload) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid v2 snapshot object';
  END IF;
  IF NOT (payload ?& top_keys) OR payload - top_keys <> '{}'::jsonb
    OR payload->'schemaVersion' IS DISTINCT FROM '2'::jsonb
    OR payload->'fundName' IS DISTINCT FROM '"Fund III"'::jsonb
    OR jsonb_typeof(payload->'exportedAt') IS DISTINCT FROM 'string'
    OR (payload->>'exportedAt') !~ '^\d{4}-\d{2}-\d{2}T.*Z$'
    OR jsonb_typeof(payload->'properties') IS DISTINCT FROM 'array'
    OR jsonb_typeof(payload->'summary') IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Snapshot does not match the v2 allowlist';
  END IF;
  value := payload->'summaryAsOf';
  IF value <> 'null'::jsonb AND (jsonb_typeof(value) <> 'string'
    OR (payload->>'summaryAsOf') !~ '^\d{4}-\d{2}-\d{2}$') THEN
    RAISE EXCEPTION 'Invalid summary date';
  END IF;
  IF NOT ((payload->'summary') ?& metric_keys)
    OR (payload->'summary') - metric_keys <> '{}'::jsonb THEN
    RAISE EXCEPTION 'Summary does not match the v2 allowlist';
  END IF;

  -- A failed validation or INSERT aborts this function's entire statement.
  INSERT INTO public.fund_snapshots(fund_name, exported_at, summary_as_of, source_label)
  VALUES (payload->>'fundName', (payload->>'exportedAt')::timestamptz,
    (payload->>'summaryAsOf')::date, 'cockpit merger model (legacy cost fallback)')
  RETURNING snapshot_id INTO new_id;

  FOR item IN SELECT element FROM jsonb_array_elements(payload->'properties') AS rows(element) LOOP
    IF jsonb_typeof(item) IS DISTINCT FROM 'object' THEN
      RAISE EXCEPTION 'Invalid property object';
    END IF;
    IF NOT (item ?& property_keys) OR item - property_keys <> '{}'::jsonb
      OR jsonb_typeof(item->'propertyId') <> 'number'
      OR (item->>'propertyId')::numeric <> trunc((item->>'propertyId')::numeric)
      OR jsonb_typeof(item->'address') <> 'string'
      OR jsonb_typeof(item->'status') NOT IN ('string', 'null')
      OR jsonb_typeof(item->'costFromMergerModel') <> 'boolean' THEN
      RAISE EXCEPTION 'Property does not match the v2 allowlist';
    END IF;
    value := item->'purchaseDate';
    IF value <> 'null'::jsonb AND (jsonb_typeof(value) <> 'string'
      OR (item->>'purchaseDate') !~ '^\d{4}-\d{2}-\d{2}$') THEN
      RAISE EXCEPTION 'Invalid property date';
    END IF;
    FOREACH key IN ARRAY ARRAY['purchasePrice', 'renovationCost', 'totalCapitalization'] LOOP
      IF jsonb_typeof(item->key) NOT IN ('number', 'null') THEN
        RAISE EXCEPTION 'Invalid property amount';
      END IF;
    END LOOP;
    INSERT INTO public.fund_snapshot_properties(
      snapshot_id, property_id, address, status, purchase_date, purchase_price,
      renovation_cost, total_capitalization, cost_from_merger_model
    ) VALUES (
      new_id, (item->>'propertyId')::bigint, item->>'address', item->>'status',
      (item->>'purchaseDate')::date, (item->>'purchasePrice')::numeric,
      (item->>'renovationCost')::numeric, (item->>'totalCapitalization')::numeric,
      (item->>'costFromMergerModel')::boolean
    );
  END LOOP;

  FOR key, measure IN SELECT k, v FROM jsonb_each(payload->'summary') AS entries(k, v) LOOP
    IF jsonb_typeof(measure) IS DISTINCT FROM 'object' THEN
      RAISE EXCEPTION 'Invalid metric object';
    END IF;
    IF NOT (measure ?& ARRAY['state', 'value'])
      OR measure - ARRAY['state', 'value'] <> '{}'::jsonb
      OR jsonb_typeof(measure->'state') <> 'string'
      OR (measure->>'state') NOT IN ('reported', 'missing', 'not_reported') THEN
      RAISE EXCEPTION 'Metric does not match the v2 allowlist';
    END IF;
    value := measure->'value';
    IF measure->>'state' = 'reported' THEN
      IF payload->'summaryAsOf' = 'null'::jsonb THEN
        RAISE EXCEPTION 'Reported summary needs an as-of date';
      END IF;
      IF key = ANY(date_keys) THEN
        IF jsonb_typeof(value) <> 'string' OR (measure->>'value') !~ '^\d{4}-\d{2}-\d{2}$' THEN
          RAISE EXCEPTION 'Invalid reporting date';
        END IF;
      ELSIF jsonb_typeof(value) <> 'number' THEN
        RAISE EXCEPTION 'Invalid summary number';
      END IF;
    ELSIF value <> 'null'::jsonb THEN
      RAISE EXCEPTION 'Unreported metric must have a null value';
    END IF;
    INSERT INTO public.fund_snapshot_metrics(snapshot_id, metric, state, value_number, value_date)
    VALUES (new_id, key, measure->>'state',
      CASE WHEN NOT (key = ANY(date_keys)) THEN (measure->>'value')::numeric END,
      CASE WHEN key = ANY(date_keys) THEN (measure->>'value')::date END);
  END LOOP;

  IF ((payload #>> '{summary,ttmPeriodStart,state}') = 'reported') <>
     ((payload #>> '{summary,ttmPeriodEnd,state}') = 'reported')
    OR (payload #>> '{summary,ttmPeriodStart,value}') > (payload #>> '{summary,ttmPeriodEnd,value}') THEN
    RAISE EXCEPTION 'Invalid TTM window';
  END IF;
  FOREACH key IN ARRAY ARRAY['ttmRentCollected', 'ttmNoi', 'ttmNoiYield', 'ttmCollectionRate'] LOOP
    IF payload->'summary'->key->>'state' = 'reported'
      AND payload #>> '{summary,ttmPeriodStart,state}' <> 'reported' THEN
      RAISE EXCEPTION 'Reported TTM metrics need a reporting window';
    END IF;
  END LOOP;
  RETURN new_id;
END;
$function$;

-- Invoker rights: the owner can load; do not grant public execution by default.
REVOKE ALL ON FUNCTION public.load_fund_snapshot(jsonb) FROM PUBLIC;
COMMIT;

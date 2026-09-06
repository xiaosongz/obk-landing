// Shared by the browser and the private exporter. No database or identity data here.
export const metricKeys = [
  "capital_recycling_rate",
  "occupied_homes",
  "occupancy",
  "stabilized_homes",
  "stabilization_rate",
  "refinance_pipeline",
] as const;
export type MetricKey = (typeof metricKeys)[number];
export type ReportedValue =
  | { state: "reported"; value: number }
  | { state: "missing" | "not_reported"; value: null };
export interface FundProperty {
  propertyId: number;
  address: string;
  status: string | null;
  purchaseDate: string | null;
  purchasePrice: number | null;
  renovationCost: number | null;
  totalCapitalization: number | null;
}
export interface FundSnapshot {
  schemaVersion: 1;
  fundName: "Fund III";
  exportedAt: string;
  summaryAsOf: string | null;
  properties: FundProperty[];
  summary: Record<MetricKey, ReportedValue>;
}

const percentageKeys = new Set<string>([
  "capital_recycling_rate",
  "occupancy",
  "stabilization_rate",
]);
export function formatMetric(key: MetricKey, metric: ReportedValue): string {
  if (metric.state !== "reported")
    return metric.state === "missing" ? "Missing" : "Not yet reported";
  return (
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(
      metric.value,
    ) + (percentageKeys.has(key) ? "%" : "")
  );
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid report object");
  return value as Record<string, unknown>;
}
function exactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  if (
    Object.keys(value).length !== keys.length ||
    keys.some((key) => !(key in value))
  ) {
    throw new Error("Report fields do not match the LP allowlist");
  }
}
function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
function nullableMoney(value: unknown) {
  if (
    value !== null &&
    (typeof value !== "number" || !Number.isFinite(value) || value < 0)
  ) {
    throw new Error("Invalid acquisition amount");
  }
}

// Fail closed: unknown fields (including accidentally exported personal data) are rejected.
export function parseFundSnapshot(input: unknown): FundSnapshot {
  const data = record(input);
  exactKeys(data, [
    "schemaVersion",
    "fundName",
    "exportedAt",
    "summaryAsOf",
    "properties",
    "summary",
  ]);
  if (data.schemaVersion !== 1 || data.fundName !== "Fund III")
    throw new Error("Wrong report or fund");
  if (
    typeof data.exportedAt !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T.*Z$/.test(data.exportedAt) ||
    !Number.isFinite(Date.parse(data.exportedAt))
  )
    throw new Error("Invalid export timestamp");
  if (data.summaryAsOf !== null && !validDate(data.summaryAsOf))
    throw new Error("Invalid summary date");
  if (!Array.isArray(data.properties))
    throw new Error("Missing property directory");
  const ids = new Set<number>();
  for (const inputRow of data.properties) {
    const row = record(inputRow);
    exactKeys(row, [
      "propertyId",
      "address",
      "status",
      "purchaseDate",
      "purchasePrice",
      "renovationCost",
      "totalCapitalization",
    ]);
    if (
      typeof row.propertyId !== "number" ||
      !Number.isSafeInteger(row.propertyId) ||
      row.propertyId < 1 ||
      ids.has(row.propertyId)
    )
      throw new Error("Invalid or duplicate property ID");
    ids.add(row.propertyId);
    if (typeof row.address !== "string" || !row.address.trim())
      throw new Error("Missing property address");
    if (
      row.status !== null &&
      (typeof row.status !== "string" || !row.status.trim())
    )
      throw new Error("Invalid property status");
    if (row.purchaseDate !== null && !validDate(row.purchaseDate))
      throw new Error("Invalid acquisition date");
    for (const key of [
      "purchasePrice",
      "renovationCost",
      "totalCapitalization",
    ])
      nullableMoney(row[key]);
  }
  const summary = record(data.summary);
  exactKeys(summary, metricKeys);
  for (const key of metricKeys) {
    const metric = record(summary[key]);
    exactKeys(metric, ["state", "value"]);
    if (metric.state === "reported") {
      if (
        typeof metric.value !== "number" ||
        !Number.isFinite(metric.value) ||
        metric.value < 0
      )
        throw new Error("Invalid summary value");
      if (!percentageKeys.has(key) && !Number.isSafeInteger(metric.value))
        throw new Error("Invalid home count");
      if (
        (key === "occupancy" || key === "stabilization_rate") &&
        metric.value > 100
      )
        throw new Error("Invalid percentage");
      if (data.summaryAsOf === null)
        throw new Error("Reported summary needs an as-of date");
    } else if (
      !["missing", "not_reported"].includes(String(metric.state)) ||
      metric.value !== null
    ) {
      throw new Error("Invalid reporting state");
    }
  }
  return data as unknown as FundSnapshot;
}

// Only explicit, unique owner-confirmed database matches may attach a photo.
export function matchPropertyPhoto<
  T extends { cockpitAddress: string | null; address: string | null },
>(address: string, mapping: T[]): T | undefined {
  const matches = mapping.filter(
    (row) => row.address !== null && row.cockpitAddress === address,
  );
  return matches.length === 1 ? matches[0] : undefined;
}

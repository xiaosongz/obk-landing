// Shared by the browser and the private exporter. No database or identity data here.
export const metricKeys = [
  "homes",
  "occupiedHomes",
  "occupancy",
  "totalAcquisitionCost",
  "totalRenovationCost",
  "totalCapitalization",
  "ttmRentCollected",
  "ttmNoi",
  "ttmNoiYield",
  "ttmCollectionRate",
] as const;
export const dateKeys = ["ttmPeriodStart", "ttmPeriodEnd", "costAsOf"] as const;
export type MetricKey = (typeof metricKeys)[number];
export type ReportedValue<T = number> =
  | { state: "reported"; value: T }
  | { state: "missing" | "not_reported"; value: null };
export interface FundProperty {
  propertyId: number;
  address: string;
  status: string | null;
  purchaseDate: string | null;
  purchasePrice: number | null;
  renovationCost: number | null;
  totalCapitalization: number | null;
  costFromMergerModel: boolean;
}
export interface FundSnapshot {
  schemaVersion: 2;
  fundName: "Fund III";
  exportedAt: string;
  summaryAsOf: string | null;
  properties: FundProperty[];
  summary: Record<MetricKey, ReportedValue> &
    Record<(typeof dateKeys)[number], ReportedValue<string>>;
}

const percentageKeys = new Set<string>([
  "occupancy",
  "ttmNoiYield",
  "ttmCollectionRate",
]);
const moneyKeys = new Set<string>([
  "totalAcquisitionCost",
  "totalRenovationCost",
  "totalCapitalization",
  "ttmRentCollected",
  "ttmNoi",
]);
export function formatMetric(key: MetricKey, metric: ReportedValue): string {
  if (metric.state !== "reported")
    return metric.state === "missing" ? "Missing" : "Not yet reported";
  if (moneyKeys.has(key))
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(metric.value);
  return (
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(
      metric.value,
    ) + (percentageKeys.has(key) ? "%" : "")
  );
}

export function formatReportDate(metric: ReportedValue<string>): string {
  return metric.state === "reported"
    ? metric.value
    : metric.state === "missing"
      ? "Missing"
      : "Not yet reported";
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
  if (data.schemaVersion !== 2 || data.fundName !== "Fund III")
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
      "costFromMergerModel",
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
    if (typeof row.costFromMergerModel !== "boolean")
      throw new Error("Invalid cost basis source");
    for (const key of [
      "purchasePrice",
      "renovationCost",
      "totalCapitalization",
    ])
      nullableMoney(row[key]);
  }
  const summary = record(data.summary);
  exactKeys(summary, [...metricKeys, ...dateKeys]);
  for (const key of [...metricKeys, ...dateKeys]) {
    const metric = record(summary[key]);
    exactKeys(metric, ["state", "value"]);
    if (metric.state === "reported") {
      if ((dateKeys as readonly string[]).includes(key)) {
        if (!validDate(metric.value)) throw new Error("Invalid reporting date");
      } else if (
        typeof metric.value !== "number" ||
        !Number.isFinite(metric.value) ||
        metric.value < 0
      )
        throw new Error("Invalid summary value");
      if (
        (key === "homes" || key === "occupiedHomes") &&
        !Number.isSafeInteger(metric.value)
      )
        throw new Error("Invalid home count");
      if (
        (key === "occupancy" && (metric.value as number) > 100) ||
        (key === "ttmCollectionRate" && (metric.value as number) > 200)
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
  const start = record(summary.ttmPeriodStart);
  const end = record(summary.ttmPeriodEnd);
  if (
    (start.state === "reported") !== (end.state === "reported") ||
    (start.state === "reported" &&
      (start.value as string) > (end.value as string))
  )
    throw new Error("Invalid TTM window");
  for (const key of [
    "ttmRentCollected",
    "ttmNoi",
    "ttmNoiYield",
    "ttmCollectionRate",
  ]) {
    if (record(summary[key]).state === "reported" && start.state !== "reported")
      throw new Error("Reported TTM metrics need a reporting window");
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

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
export interface PropertyDetails {
  propertyId: number;
  bedrooms: number | null;
  bathrooms: number | null;
  yearBuilt: number | null;
  sqft: number | null;
  zip: string | null;
  lat: number | null;
  lon: number | null;
  holdPeriodYears: number | null;
  currentMonthlyRent: number | null;
  leaseStart: string | null;
  leaseEnd: string | null;
  monthToMonth: boolean | null;
  leaseCurrent: boolean | null;
}

export interface PropertyPeriod {
  propertyId: number;
  period: "trailing_12_mo" | "since_acquired";
  periodStart: string | null;
  periodEnd: string | null;
  egi: number | null;
  propertyTax: number | null;
  insurance: number | null;
  opex: number | null;
  noi: number | null;
  capex: number | null;
  noiAfterCapex: number | null;
  potentialRent: number | null;
  collectionRate: number | null;
  noiYield: number | null;
  annualizedYield: number | null;
}
export interface FundSnapshot {
  schemaVersion: 3;
  fundName: "Fund III";
  exportedAt: string;
  summaryAsOf: string | null;
  properties: FundProperty[];
  propertyDetails: PropertyDetails[];
  propertyPeriods: PropertyPeriod[];
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

function nullableNumber(value: unknown) {
  if (value !== null && (typeof value !== "number" || !Number.isFinite(value)))
    throw new Error("Invalid report number");
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
    "propertyDetails",
    "propertyPeriods",
    "summary",
  ]);
  if (data.schemaVersion !== 3 || data.fundName !== "Fund III")
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
  if (
    !Array.isArray(data.propertyDetails) ||
    !Array.isArray(data.propertyPeriods)
  )
    throw new Error("Missing property reports");
  const detailIds = new Set<number>();
  for (const inputRow of data.propertyDetails) {
    const row = record(inputRow);
    exactKeys(row, [
      "propertyId",
      "bedrooms",
      "bathrooms",
      "yearBuilt",
      "sqft",
      "zip",
      "lat",
      "lon",
      "holdPeriodYears",
      "currentMonthlyRent",
      "leaseStart",
      "leaseEnd",
      "monthToMonth",
      "leaseCurrent",
    ]);
    if (
      typeof row.propertyId !== "number" ||
      !ids.has(row.propertyId) ||
      detailIds.has(row.propertyId)
    )
      throw new Error("Unknown or duplicate details property ID");
    detailIds.add(row.propertyId);
    for (const key of [
      "bedrooms",
      "bathrooms",
      "yearBuilt",
      "sqft",
      "holdPeriodYears",
      "currentMonthlyRent",
    ])
      nullableMoney(row[key]);
    for (const key of ["bedrooms", "yearBuilt"])
      if (row[key] !== null && !Number.isSafeInteger(row[key]))
        throw new Error("Invalid asset integer");
    if (row.zip !== null && (typeof row.zip !== "string" || !row.zip.trim()))
      throw new Error("Invalid ZIP");
    for (const [key, bound] of [
      ["lat", 90],
      ["lon", 180],
    ] as const) {
      nullableNumber(row[key]);
      if (row[key] !== null && Math.abs(row[key] as number) > bound)
        throw new Error("Invalid coordinate");
    }
    for (const key of ["leaseStart", "leaseEnd"])
      if (row[key] !== null && !validDate(row[key]))
        throw new Error("Invalid lease date");
    if (
      row.leaseStart !== null &&
      row.leaseEnd !== null &&
      (row.leaseStart as string) > (row.leaseEnd as string)
    )
      throw new Error("Invalid lease window");
    for (const key of ["monthToMonth", "leaseCurrent"])
      if (row[key] !== null && typeof row[key] !== "boolean")
        throw new Error("Invalid lease flag");
    const leaseCurrent =
      row.monthToMonth === true ||
      (row.leaseEnd !== null &&
        data.summaryAsOf !== null &&
        (row.leaseEnd as string) >= (data.summaryAsOf as string))
        ? true
        : row.monthToMonth === false &&
            row.leaseEnd !== null &&
            data.summaryAsOf !== null
          ? false
          : null;
    if (row.leaseCurrent !== leaseCurrent)
      throw new Error("Inconsistent lease current flag");
  }
  if (detailIds.size !== ids.size)
    throw new Error("Every property needs details");
  const periodIds = new Set<string>();
  for (const inputRow of data.propertyPeriods) {
    const row = record(inputRow);
    exactKeys(row, [
      "propertyId",
      "period",
      "periodStart",
      "periodEnd",
      "egi",
      "propertyTax",
      "insurance",
      "opex",
      "noi",
      "capex",
      "noiAfterCapex",
      "potentialRent",
      "collectionRate",
      "noiYield",
      "annualizedYield",
    ]);
    const id = `${row.propertyId}:${row.period}`;
    if (
      typeof row.propertyId !== "number" ||
      !ids.has(row.propertyId) ||
      typeof row.period !== "string" ||
      !["trailing_12_mo", "since_acquired"].includes(row.period) ||
      periodIds.has(id)
    )
      throw new Error("Unknown or duplicate property period");
    periodIds.add(id);
    for (const key of ["periodStart", "periodEnd"])
      if (row[key] !== null && !validDate(row[key]))
        throw new Error("Invalid property period date");
    if (
      (row.periodStart === null) !== (row.periodEnd === null) ||
      (row.periodStart !== null &&
        (row.periodStart as string) > (row.periodEnd as string))
    )
      throw new Error("Invalid property period window");
    for (const key of [
      "egi",
      "propertyTax",
      "insurance",
      "opex",
      "noi",
      "capex",
      "noiAfterCapex",
      "potentialRent",
      "collectionRate",
      "noiYield",
      "annualizedYield",
    ]) {
      nullableNumber(row[key]);
      if (row[key] !== null && row.periodStart === null)
        throw new Error("Property measures need dates");
    }
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

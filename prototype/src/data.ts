// Fictional fixtures only. Production figures must come from the authenticated API.
export type PropertyStatus =
  "Stabilized" | "Leasing" | "Renovating" | "Stabilizing";
export interface Property {
  id: string;
  name: string;
  district: string;
  beds: number;
  baths: number;
  area: number;
  status: PropertyStatus;
  cost: number;
  noi: number | null;
  occupied: boolean;
  refinanced: boolean;
}
export const properties: Property[] = [
  {
    id: "01",
    name: "Magnolia House",
    district: "West district",
    beds: 3,
    baths: 2,
    area: 1420,
    status: "Stabilized",
    cost: 185000,
    noi: 14800,
    occupied: true,
    refinanced: true,
  },
  {
    id: "02",
    name: "Cedar House",
    district: "North district",
    beds: 3,
    baths: 1,
    area: 1260,
    status: "Stabilized",
    cost: 172500,
    noi: 12600,
    occupied: true,
    refinanced: false,
  },
  {
    id: "03",
    name: "Oak House",
    district: "East district",
    beds: 4,
    baths: 2,
    area: 1640,
    status: "Stabilized",
    cost: 196000,
    noi: 15900,
    occupied: true,
    refinanced: true,
  },
  {
    id: "04",
    name: "Willow House",
    district: "West district",
    beds: 2,
    baths: 1,
    area: 1120,
    status: "Stabilized",
    cost: 164000,
    noi: 11760,
    occupied: true,
    refinanced: false,
  },
  {
    id: "05",
    name: "Laurel House",
    district: "North district",
    beds: 3,
    baths: 2,
    area: 1380,
    status: "Stabilized",
    cost: 178000,
    noi: 13100,
    occupied: true,
    refinanced: true,
  },
  {
    id: "06",
    name: "Juniper House",
    district: "East district",
    beds: 3,
    baths: 2,
    area: 1510,
    status: "Leasing",
    cost: 205000,
    noi: 3200,
    occupied: false,
    refinanced: false,
  },
  {
    id: "07",
    name: "Elm House",
    district: "West district",
    beds: 3,
    baths: 1,
    area: 1290,
    status: "Renovating",
    cost: 189000,
    noi: -1800,
    occupied: false,
    refinanced: false,
  },
  {
    id: "08",
    name: "Maple House",
    district: "North district",
    beds: 2,
    baths: 1,
    area: 1080,
    status: "Stabilizing",
    cost: 160000,
    noi: null,
    occupied: true,
    refinanced: false,
  },
];
export const periods = {
  jun: {
    label: "Q2 2026",
    date: "June 30, 2026",
    updated: "July 15, 2026",
    contribution: 250000,
    returned: 40000,
    income: 18600,
    months: 12,
    factor: 1,
  },
  mar: {
    label: "Q1 2026",
    date: "March 31, 2026",
    updated: "April 15, 2026",
    contribution: 250000,
    returned: 25000,
    income: 12900,
    months: 9,
    factor: 0.92,
  },
};
export type PeriodKey = keyof typeof periods;
export const distributionSeries = [
  0, 1100, 2400, 3800, 5200, 7600, 9300, 11100, 12900, 14900, 16800, 18600,
];
export const monthLabels = [
  "Jul 25",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan 26",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
];
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
export const percent = (n: number) => `${(n * 100).toFixed(1)}%`;
export function propertiesForPeriod(key: PeriodKey): Property[] {
  return properties.map((p) => ({
    ...p,
    noi: p.noi === null ? null : Math.round(p.noi * periods[key].factor),
  }));
}
export function exportPortfolio(rows: Property[], date: string) {
  const csv = [
    ["SAMPLE DATA - fictional properties", date],
    [
      "Property",
      "Status",
      "Cost USD",
      "Trailing 12 month NOI USD",
      "NOI yield on cost",
      "NOI coverage",
    ],
    ...rows.map((p) => [
      p.name,
      p.status,
      p.cost,
      p.noi ?? "",
      p.noi === null ? "" : percent(p.noi / p.cost),
      p.noi === null ? "Unavailable" : "Available",
    ]),
  ]
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `obelisk-sample-portfolio-${date.replaceAll(/[, ]+/g, "-")}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

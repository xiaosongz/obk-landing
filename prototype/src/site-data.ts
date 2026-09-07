import propertyMapping from "./property-mapping.json";
import type { MetricKey } from "./fund-data";

export const navigation = [
  { key: "/", label: "Home" },
  { key: "/portfolio", label: "Portfolio" },
  { key: "/investor-login", label: "Investor Login" },
  { key: "/investor-home", label: "Investor Home" },
  { key: "/fund-iii-portfolio", label: "Fund III Portfolio" },
  { key: "/property-performance", label: "Property Performance" },
];

export interface PortfolioProperty {
  id: string;
  propertyId: number | null;
  name: string;
  location: string | null;
  image: string;
  sold: boolean;
  addressProvided: boolean;
}

// The explicit mapping is the only property/photo source for all tabs. Each
// photograph comes from the owner's address-named photo library and is linked
// to its database record through `cockpitAddress`. Following the merger of
// Funds I and II into Fund III, every current home belongs to Fund III.
export const portfolioProperties: PortfolioProperty[] = propertyMapping.map(
  (p) => ({
    id: p.id,
    propertyId: p.propertyId,
    name: p.address ?? "Unlabeled property",
    location: p.location,
    image: p.photo,
    sold: p.status === "sold",
    addressProvided: p.address !== null,
  }),
);

export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

// Fictional capital account for layout review. Never copied from an investor record.
export const investorExample = {
  name: "Demo investor",
  subscription: 250000,
  contribution: 250000,
  callable: 0,
  returned: 40000,
  remaining: 210000,
  preferredTotal: null,
  preferredDistributed: null,
  preferredAccrued: null,
  promoteTotal: null,
  promoteDistributed: null,
  promoteRemaining: null,
};

export const fundMetrics: {
  key: MetricKey;
  label: string;
  definition: string;
  group: "Portfolio" | "Cost basis" | "Trailing twelve months";
  caption?: string;
}[] = [
  {
    key: "homes",
    group: "Portfolio",
    label: "Homes",
    definition: "Homes in the active portfolio.",
  },
  {
    key: "occupiedHomes",
    group: "Portfolio",
    label: "Occupied homes",
    definition:
      "Homes whose recorded status in the portfolio database is Rented.",
  },
  {
    key: "occupancy",
    group: "Portfolio",
    label: "Occupancy",
    definition: "Occupied homes ÷ homes in the fund × 100%.",
  },
  {
    key: "totalAcquisitionCost",
    group: "Cost basis",
    label: "Acquisition cost",
    caption: "including closing costs",
    definition:
      "Purchase price including closing costs, from the merger model; legacy values are used where the cost basis is pending.",
  },
  {
    key: "totalRenovationCost",
    group: "Cost basis",
    label: "Renovation cost",
    definition:
      "Total renovation cost from the merger model, with the same legacy fallback.",
  },
  {
    key: "totalCapitalization",
    group: "Cost basis",
    label: "Total capitalization",
    definition:
      "Total acquisition and renovation cost from the merger model, with the same legacy fallback.",
  },
  {
    key: "ttmRentCollected",
    group: "Trailing twelve months",
    label: "TTM rent collected (EGI)",
    definition:
      "Sum of effective gross income collected over the trailing twelve months.",
  },
  {
    key: "ttmNoi",
    group: "Trailing twelve months",
    label: "TTM NOI",
    definition: "Sum of net operating income over the trailing twelve months.",
  },
  {
    key: "ttmNoiYield",
    group: "Trailing twelve months",
    label: "TTM NOI yield",
    definition: "TTM NOI ÷ total capitalization × 100%.",
  },
  {
    key: "ttmCollectionRate",
    group: "Portfolio",
    label: "TTM collection rate",
    caption: "can exceed 100% when arrears are collected",
    definition:
      "Rent collected ÷ potential rent × 100%. Arrears collected can bring this above 100%; it is separate from occupied-home occupancy.",
  },
];

export const financialLines = [
  { key: "egi", label: "Effective gross income (EGI)" },
  { key: "propertyTax", label: "Property tax" },
  { key: "insurance", label: "Insurance" },
  { key: "opex", label: "Variable operating expenses" },
  { key: "noi", label: "Net operating income (NOI)" },
  { key: "capex", label: "Capital expenditures (CapEx)" },
  { key: "noiAfterCapex", label: "NOI less CapEx" },
] as const;

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
  name: string;
  location: string | null;
  image: string;
  sold: boolean;
  addressProvided: boolean;
}

// The explicit mapping is the only ordered property/photo source for all tabs.
// Source-template status is historical, not a current database classification.
export const portfolioProperties: PortfolioProperty[] = propertyMapping.map(
  (p) => ({
    id: p.id,
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
}[] = [
  {
    key: "capital_recycling_rate",
    label: "Capital recycling rate",
    definition: "Capital recycled ÷ initial equity invested × 100%.",
  },
  {
    key: "occupied_homes",
    label: "Occupied homes",
    definition: "Count of occupied homes.",
  },
  {
    key: "occupancy",
    label: "Occupancy",
    definition: "Occupied homes ÷ total homes × 100%.",
  },
  {
    key: "stabilized_homes",
    label: "Stabilized homes",
    definition:
      "Count of homes classified as stabilized by the approved reporting model.",
  },
  {
    key: "stabilization_rate",
    label: "Stabilization rate",
    definition: "Stabilized homes ÷ total homes × 100%.",
  },
  {
    key: "refinance_pipeline",
    label: "Refinance pipeline",
    definition:
      "Homes appraised and ready for long-term debt, as reported by the approved summary source. Not inferred from stabilization.",
  },
];

export const financialLines = [
  { key: "egi", label: "Effective gross income (EGI)" },
  { key: "tax", label: "Property tax" },
  { key: "insurance", label: "Insurance" },
  { key: "opex", label: "Variable operating expenses" },
  { key: "noi", label: "Net operating income (NOI)" },
  { key: "capex", label: "Capital expenditures (CapEx)" },
  { key: "fcf", label: "Free cash flow (FCF)" },
];

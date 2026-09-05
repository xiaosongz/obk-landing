import { reference } from "./reference-content";

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

// Only the first four current-property captions are supplied by the source page.
// Image order is a gallery reference, not a database property identifier.
const captions = [
  {
    id: "2-4401-avenue-i",
    name: "4401 Avenue I",
    location: "Birmingham, AL 35208",
  },
  {
    id: "4129-avenue-q",
    name: "4129 Avenue Q",
    location: "Birmingham, AL 35208",
  },
  {
    id: "4011-43rd-avenue-n",
    name: "4011 43rd Avenue N",
    location: "Birmingham, AL 35217",
  },
  {
    id: "9645-9th-ave-n",
    name: "9645 9th Ave N",
    location: "Birmingham, AL 35211",
  },
];

export const portfolioProperties: PortfolioProperty[] = reference.photos[
  "property-performance"
].map((image, index, images) => {
  const caption = captions[index];
  const sold = index === images.length - 1;
  return {
    id: caption?.id ?? `portfolio-home-${index + 1}`,
    name:
      caption?.name ??
      (sold
        ? "Sold property"
        : `Portfolio home ${String(index + 1).padStart(2, "0")}`),
    location: caption?.location ?? null,
    image: index === 0 ? reference.photos["property-detail"][0] : image,
    sold,
    addressProvided: !!caption,
  };
});

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

export const fundMetrics = [
  {
    label: "Capital recycling rate",
    definition: "Capital recycled ÷ initial equity invested × 100%.",
  },
  { label: "Occupied homes", definition: "Count of occupied homes." },
  { label: "Occupancy", definition: "Occupied homes ÷ total homes × 100%." },
  {
    label: "Stabilized homes",
    definition:
      "Count of homes classified as stabilized by the approved reporting model.",
  },
  {
    label: "Stabilization rate",
    definition: "Stabilized homes ÷ total homes × 100%.",
  },
  {
    label: "Refinance pipeline",
    definition:
      "Homes appraised and ready for long-term debt. The source template uses stabilized homes as a proxy; the final mapping needs verification.",
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

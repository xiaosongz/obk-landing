/** Full-width charcoal band with eyebrow, h2, text and an inverse CTA — closes the home page. */
export interface InvestorCalloutProps {
  eyebrow?: string;
  title?: string;
  text?: string;
  cta?: string;
  href?: string;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
}
export function InvestorCallout(props: InvestorCalloutProps): JSX.Element;

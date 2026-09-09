/** Business-process step card: bronze numeral, title, two-line description, bronze tagline; border turns bronze on hover. */
export interface ProcessCardProps {
  number: number | string;
  title: string;
  description: string;
  tagline: string;
  href?: string;
  style?: React.CSSProperties;
}
export function ProcessCard(props: ProcessCardProps): JSX.Element;

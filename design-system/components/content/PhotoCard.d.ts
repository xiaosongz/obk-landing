/** 4:3 property photograph with two-line address caption; plain gallery figure or framed directory card. */
export interface PhotoCardProps {
  src: string;
  address?: string;
  location?: string;
  /** shown as caption suffix (plain) or Tag (framed) — only when not "current" */
  status?: string;
  rent?: string;
  href?: string;
  /** hairline-boxed card with Tag, title and CTA (property directory); plain is gallery figure with caption */
  framed?: boolean;
  cta?: string;
  style?: React.CSSProperties;
}
export function PhotoCard(props: PhotoCardProps): JSX.Element;

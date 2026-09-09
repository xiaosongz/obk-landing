/** Uppercase 0.75rem tracked label that opens every section, card and page title. */
export interface EyebrowProps {
  children: React.ReactNode;
  accent?: boolean;
  inverse?: boolean;
  as?: "p" | "span";
  style?: React.CSSProperties;
}
export function Eyebrow(props: EyebrowProps): JSX.Element;

/** The Obelisk wordmark — Archivo 600, 0.14em tracking, with FUND MANAGEMENT beneath. No logo file exists. */
export interface WordmarkProps {
  inverse?: boolean;
  small?: boolean;
  size?: string;
  href?: string;
  as?: "a" | "div" | "span";
  style?: React.CSSProperties;
}
export function Wordmark(props: WordmarkProps): JSX.Element;

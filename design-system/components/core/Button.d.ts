/** Square-cornered button; charcoal primary, hairline default, bronze hero CTA. 40px / 48px tall.
 * @startingPoint section="Core" subtitle="Primary, default, bronze, inverse, link" viewport="700x260" */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "default" | "bronze" | "inverse" | "link";
  size?: "md" | "lg";
  block?: boolean;
  /** append the arrow-right glyph */
  arrow?: boolean;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;

/** Single expandable panel, closed by default — "About these figures", "Read the full approach". */
export interface CollapseProps {
  label: string;
  children: React.ReactNode;
  /** no box; used inside process steps */
  ghost?: boolean;
  defaultOpen?: boolean;
  style?: React.CSSProperties;
}
export function Collapse(props: CollapseProps): JSX.Element;

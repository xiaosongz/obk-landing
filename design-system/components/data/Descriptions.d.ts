/** Label/value list — plain (capital account) or bordered grid (asset overview, lease). */
export interface DescriptionsProps {
  items: { label: string; value: React.ReactNode }[];
  /** grid of tinted label cells (asset overview / lease); plain is a label: value list */
  bordered?: boolean;
  columns?: 1 | 2;
  style?: React.CSSProperties;
}
export function Descriptions(props: DescriptionsProps): JSX.Element;

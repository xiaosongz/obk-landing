/** One cell of a fund-metric row: label, 2rem tabular figure, optional caption. */
export interface MetricTileProps {
  label: string;
  value: React.ReactNode;
  caption?: string;
  /** grey 1.1rem treatment for Missing / Not yet reported */
  pending?: boolean;
  style?: React.CSSProperties;
}
export function MetricTile(props: MetricTileProps): JSX.Element;

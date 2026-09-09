/** A titled row of equal-width MetricTiles inside one hairline box (Portfolio 4 / Cost basis 3 / TTM 3). */
export interface MetricGroupProps {
  title?: string;
  metrics: { label: string; value: React.ReactNode; caption?: string; pending?: boolean }[];
  style?: React.CSSProperties;
}
export function MetricGroup(props: MetricGroupProps): JSX.Element;

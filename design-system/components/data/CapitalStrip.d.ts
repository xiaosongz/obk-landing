/** Charcoal band of large IBM Plex Mono money figures — the investor capital account summary. */
export interface CapitalStripProps {
  items: { label: string; value: string; note?: string }[];
  note?: string | null;
  style?: React.CSSProperties;
}
export function CapitalStrip(props: CapitalStripProps): JSX.Element;

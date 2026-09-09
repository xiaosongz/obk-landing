/** 104px header: wordmark left, right-aligned 0.875rem nav with active underline, bottom hairline; optional preview bar. */
export interface SiteHeaderProps {
  items: { key: string; label: string }[];
  active?: string;
  onNavigate?: (key: string) => void;
  /** optional grey DESIGN PREVIEW bar above the header (off by default) */
  previewBar?: boolean;
  style?: React.CSSProperties;
}
export function SiteHeader(props: SiteHeaderProps): JSX.Element;

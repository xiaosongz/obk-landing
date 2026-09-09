/** Tinted footer: wordmark row, disclosure paragraph (always present), status line and IR link. */
export interface SiteFooterProps {
  tagline?: string;
  portalHref?: string;
  onNavigate?: (key: string) => void;
  contactHref?: string;
  status?: string | null;
  year?: number;
  style?: React.CSSProperties;
}
export function SiteFooter(props: SiteFooterProps): JSX.Element;

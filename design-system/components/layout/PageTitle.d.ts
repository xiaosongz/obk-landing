/** Page opener: eyebrow, h1 ending in a period, muted intro up to 900px. */
export interface PageTitleProps {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** right-hand panel, e.g. the investor-relations contact */
  aside?: React.ReactNode;
  style?: React.CSSProperties;
}
export function PageTitle(props: PageTitleProps): JSX.Element;

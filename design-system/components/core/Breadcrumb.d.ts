/** Slash-separated breadcrumb used above property reports. */
export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  style?: React.CSSProperties;
}
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;

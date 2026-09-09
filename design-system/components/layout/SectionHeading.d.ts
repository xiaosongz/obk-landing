/** Section opener with eyebrow + h2/h3 and an optional right-aligned action. */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  level?: 2 | 3;
  /** right-aligned action: TextLink, Tag, Input… */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;

/** 0.875rem 500 inline link with a 1rem gap and arrow suffix; underlines on hover. */
export interface TextLinkProps {
  children: React.ReactNode;
  href?: string;
  arrow?: boolean;
  inverse?: boolean;
  underline?: boolean;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
}
export function TextLink(props: TextLinkProps): JSX.Element;

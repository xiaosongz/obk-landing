/** Boxed status message for loading / unavailable reports; error uses a bronze rule (no red exists in the brand). */
export interface AlertProps {
  title: string;
  description?: string;
  type?: "info" | "error";
  style?: React.CSSProperties;
}
export function Alert(props: AlertProps): JSX.Element;

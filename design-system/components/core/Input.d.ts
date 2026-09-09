/** 40px hairline text input; the prototype only uses it as a directory search field. */
export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** show the search glyph prefix */
  search?: boolean;
  ariaLabel?: string;
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;

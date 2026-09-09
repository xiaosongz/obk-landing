/** Hairline table with tinted header, 18px row padding, right-aligned tabular money; scrolls horizontally inside its box. */
export interface DataTableProps {
  columns: { key: string; title: string; align?: "left" | "right"; width?: number | string; render?: (row: any) => React.ReactNode }[];
  rows: any[];
  rowKey?: string;
  emptyText?: string;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export function DataTable(props: DataTableProps): JSX.Element;

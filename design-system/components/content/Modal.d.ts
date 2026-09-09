/** Centered dialog with the single floating shadow; only floating layer besides the mobile menu. */
export interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  closeLabel?: string;
}
export function Modal(props: ModalProps): JSX.Element;

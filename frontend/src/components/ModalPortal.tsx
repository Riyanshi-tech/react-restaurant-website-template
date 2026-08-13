import { createPortal } from 'react-dom';

/** Escape dashboard overflow clipping so modals sit above navbar */
export const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

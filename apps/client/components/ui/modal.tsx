import {ReactNode} from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({isOpen, onClose, title, children}: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box text-base-content">
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
        {children}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

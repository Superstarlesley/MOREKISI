import React from 'react';
import { XIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm Delete',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-600">{message}</p>
        </div>
        <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition shadow"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

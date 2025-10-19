
import React, { useRef, useEffect } from 'react';
import { Language, t } from '../../services/translation';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  language: Language;
  confirmText?: string;
  confirmButtonClass?: string;
  borderColorClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, onConfirm, onCancel, title, message, language, 
    confirmText, confirmButtonClass, borderColorClass 
}) => {
  if (!isOpen) return null;
  
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    confirmButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30" onClick={onCancel}>
      <div 
        className={`bg-stone-800 p-8 rounded-lg shadow-2xl w-full max-w-md mx-4 text-center border ${borderColorClass || 'border-red-500'}`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-red-400 mb-4">{title}</h2>
        <p className="text-lg mb-8 text-white">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-stone-600 hover:bg-stone-700 text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-stone-800"
          >
            {t('cancel', language)}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={confirmButtonClass || "bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-stone-800"}
          >
            {confirmText || t('reset', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
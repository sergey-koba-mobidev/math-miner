
import React, { useRef, useEffect } from 'react';
import { Language, t } from '../../services/translation';

interface RewardModalProps {
  title: string;
  message: string;
  onClose: () => void;
  language: Language;
}

export const RewardModal: React.FC<RewardModalProps> = ({ title, message, onClose, language }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
      <div className="bg-stone-800 p-8 rounded-lg shadow-2xl border border-yellow-400 w-full max-w-md mx-4 text-center">
        <h2 className="text-3xl font-bold text-yellow-300 mb-4">
          {title}
        </h2>
        <p className="text-lg mb-6 text-white">
          {message}
        </p>
        <button
          ref={buttonRef}
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-stone-800"
        >
          {t('awesome', language)}
        </button>
      </div>
    </div>
  );
};

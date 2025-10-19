
import React, { useRef, useEffect } from 'react';
import { Language, t } from '../../services/translation';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30" onClick={onClose}>
      <div 
        className="bg-stone-800 p-4 rounded-lg shadow-2xl border border-blue-400 w-full max-w-2xl h-5/6 mx-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-3xl font-bold text-blue-300">{t('tutorialTitle', language)}</h2>
          <button onClick={onClose} className="text-3xl text-stone-400 hover:text-white">&times;</button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 text-stone-300 space-y-4">
          <section>
            <h3 className="text-xl font-bold text-yellow-200 mb-1">{t('tutorialGoalTitle', language)}</h3>
            <p>{t('tutorialGoalDesc', language)}</p>
          </section>
          <section>
            <h3 className="text-xl font-bold text-yellow-200 mb-1">{t('tutorialDigTitle', language)}</h3>
            <p>{t('tutorialDigDesc', language)}</p>
          </section>
          <section>
            <h3 className="text-xl font-bold text-yellow-200 mb-1">{t('tutorialResourcesTitle', language)}</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>{t('tutorialResourceDirt', language)}</li>
              <li>{t('tutorialResourceMinerals', language)}</li>
              <li>{t('tutorialResourceDynamite', language)}</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-bold text-yellow-200 mb-1">{t('tutorialCombatTitle', language)}</h3>
            <p>{t('tutorialCombatDesc', language)}</p>
          </section>
           <section>
            <h3 className="text-xl font-bold text-yellow-200 mb-1">{t('tutorialUpgradeTitle', language)}</h3>
            <p>{t('tutorialUpgradeDesc', language)}</p>
          </section>
          <section>
            <h3 className="text-xl font-bold text-yellow-200 mb-1">{t('tutorialFreeUpgradeTitle', language)}</h3>
            <p>{t('tutorialFreeUpgradeDesc', language)}</p>
          </section>
        </div>
         <div className="mt-4 flex-shrink-0">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-stone-800"
          >
            {t('gotIt', language)}
          </button>
        </div>
      </div>
    </div>
  );
};

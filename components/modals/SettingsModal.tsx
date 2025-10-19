
import React, { useRef, useEffect } from 'react';
import { Language, t } from '../../services/translation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTestingMode: boolean;
  onToggleTestingMode: () => void;
  onResetGame: () => void;
  onRegenerateMine: () => void;
  mathDifficulty: number;
  onDifficultyChange: (value: number) => void;
  resourceMultiplier: number;
  onResourceMultiplierChange: (value: number) => void;
  onOpenTutorial: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const DifficultySlider: React.FC<{ label: string, value: number, onChange: (value: number) => void, min: number, max: number, step: number, labels?: string[] }> = 
({ label, value, onChange, min, max, step, labels }) => (
    <div className="flex flex-col">
        <label className="text-stone-300 text-sm mb-1">{label}</label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
        />
        {labels && <div className="flex justify-between text-xs text-stone-400 mt-1">
            {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>}
    </div>
);


export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, isTestingMode, onToggleTestingMode, onResetGame, onRegenerateMine,
  mathDifficulty, onDifficultyChange, resourceMultiplier, onResourceMultiplierChange,
  onOpenTutorial, language, onLanguageChange
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30" onClick={onClose}>
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-stone-800 p-4 rounded-lg shadow-2xl border border-stone-500 w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-3xl font-bold text-stone-300">{t('settingsTitle', language)}</h2>
          <button onClick={onClose} className="text-3xl text-stone-400 hover:text-white">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 text-stone-300 space-y-6">
            <section>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{t('gameGuide', language)}</h3>
                        <p className="text-sm text-stone-400">{t('gameGuideDesc', language)}</p>
                    </div>
                    <button onClick={onOpenTutorial} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        {t('tutorial', language)}
                    </button>
                </div>
            </section>

            <section className="border-t border-stone-700 pt-4">
                 <div className="mb-4">
                    <label htmlFor="language-select" className="block font-bold text-lg mb-1">{t('language', language)}</label>
                    <p className="text-sm text-stone-400 mb-2">{t('languageDesc', language)}</p>
                    <select
                        id="language-select"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                        className="w-full p-2 rounded bg-stone-900 border border-stone-600 text-white"
                    >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="es">Español</option>
                        <option value="pl">Polski</option>
                        <option value="ua">Українська</option>
                    </select>
                </div>

                <div className="mb-4">
                    <h3 className="font-bold text-lg">{t('mathDifficulty', language)}</h3>
                    <p className="text-sm text-stone-400 mb-2">{t('mathDifficultyDesc', language)}</p>
                    <DifficultySlider 
                        label=""
                        value={mathDifficulty}
                        onChange={onDifficultyChange}
                        min={1} max={5} step={1}
                        labels={[t('easy', language), '','','', t('hard', language)]}
                    />
                </div>
                {isTestingMode && (
                     <div className="mb-4">
                        <h3 className="font-bold text-lg">{t('resourceReward', language)}</h3>
                        <p className="text-sm text-stone-400 mb-2">{t('resourceRewardDesc', language)}</p>
                         <DifficultySlider 
                            label=""
                            value={resourceMultiplier}
                            onChange={onResourceMultiplierChange}
                            min={1} max={10} step={1}
                            labels={['1x', '','','','','','','','', '10x']}
                        />
                    </div>
                )}
            </section>
            
            <section className="border-t border-stone-700 pt-4">
                <h3 className="text-xl font-bold text-red-400 mb-2">{t('dangerZone', language)}</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 bg-stone-900/50 rounded">
                        <div>
                            <h4 className="font-bold">{t('testingMode', language)}</h4>
                            <p className="text-sm text-stone-400">{t('testingModeDesc', language)}</p>
                        </div>
                         <label htmlFor="testing-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id="testing-toggle" className="sr-only" checked={isTestingMode} onChange={onToggleTestingMode} />
                                <div className="block bg-stone-600 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isTestingMode ? 'translate-x-6 bg-yellow-400' : ''}`}></div>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-stone-900/50 rounded">
                        <div>
                            <h4 className="font-bold">{t('regenerateMine', language)}</h4>
                            <p className="text-sm text-stone-400">{t('regenerateMineDesc', language)}</p>
                        </div>
                        <button onClick={onRegenerateMine} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                             {t('regenerate', language)}
                        </button>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-stone-900/50 rounded">
                        <div>
                            <h4 className="font-bold">{t('resetGame', language)}</h4>
                            <p className="text-sm text-stone-400">{t('resetGameDesc', language)}</p>
                        </div>
                        <button onClick={onResetGame} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                             {t('reset', language)}
                        </button>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Language, t } from '../../services/translation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTestingMode: boolean;
  onToggleTestingMode: () => void;
  onResetGame: () => void;
  mathDifficulty: number;
  onDifficultyChange: (level: number) => void;
  resourceMultiplier: number;
  onResourceMultiplierChange: (level: number) => void;
  onOpenTutorial: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, isTestingMode, onToggleTestingMode, onResetGame, 
    mathDifficulty, onDifficultyChange, resourceMultiplier, onResourceMultiplierChange,
    onOpenTutorial, language, onLanguageChange
}) => {
  if (!isOpen) return null;
  const toggleBgClass = isTestingMode ? 'bg-green-500' : 'bg-gray-600';
  const toggleIndicatorClass = isTestingMode ? 'translate-x-6' : 'translate-x-1';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20" onClick={onClose}>
      <div 
        className="bg-stone-800 p-8 rounded-lg shadow-2xl border border-stone-600 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-stone-300">{t('settingsTitle', language)}</h2>
          <button onClick={onClose} className="text-3xl text-stone-400 hover:text-white">&times;</button>
        </div>
        
        <div className="space-y-4">
            <div className="bg-stone-900/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-white">{t('gameGuide', language)}</p>
                    <p className="text-sm text-stone-400">{t('gameGuideDesc', language)}</p>
                    </div>
                    <button
                    onClick={onOpenTutorial}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-blue-500"
                    >
                    {t('tutorial', language)}
                    </button>
                </div>
            </div>

            <div className="bg-stone-900/50 p-4 rounded-lg">
                 <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{t('language', language)}</h3>
                        <p className="text-sm text-stone-400">{t('languageDesc', language)}</p>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                        className="bg-stone-700 text-white p-2 rounded-md border border-stone-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="es">Español</option>
                        <option value="pl">Polski</option>
                        <option value="ua">Українська</option>
                    </select>
                </div>
            </div>

            <div className="bg-stone-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{t('mathDifficulty', language)}</h3>
                    <span className="font-bold text-yellow-300 text-lg">{mathDifficulty}</span>
                </div>
                <p className="text-sm text-stone-400 mb-3">{t('mathDifficultyDesc', language)}</p>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={mathDifficulty}
                    onChange={(e) => onDifficultyChange(Number(e.target.value))}
                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                <div className="flex justify-between text-xs text-stone-500 mt-1 px-1">
                    <span>{t('easy', language)}</span>
                    <span>{t('hard', language)}</span>
                </div>
            </div>

            <div className="bg-stone-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{t('resourceReward', language)}</h3>
                    <span className="font-bold text-yellow-300 text-lg">x{resourceMultiplier}</span>
                </div>
                <p className="text-sm text-stone-400 mb-3">{t('resourceRewardDesc', language)}</p>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={resourceMultiplier}
                    onChange={(e) => onResourceMultiplierChange(Number(e.target.value))}
                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                <div className="flex justify-between text-xs text-stone-500 mt-1 px-1">
                    <span>x1</span>
                    <span>x5</span>
                </div>
            </div>
            
            <div className="border-t border-stone-700 pt-4">
                <h3 className="text-lg font-semibold text-red-400 mb-2">{t('dangerZone', language)}</h3>
                <div className="bg-stone-900/50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                        <h3 className="text-lg font-semibold text-white">{t('testingMode', language)}</h3>
                        <p className="text-sm text-stone-400">{t('testingModeDesc', language)}</p>
                        </div>
                        <button
                        onClick={onToggleTestingMode}
                        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-green-500 ${toggleBgClass}`}
                        aria-checked={isTestingMode}
                        role="switch"
                        >
                        <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ease-in-out ${toggleIndicatorClass}`} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-stone-900/50 p-4 rounded-lg">
                    <div>
                    <p className="text-white">{t('resetGame', language)}</p>
                    <p className="text-sm text-stone-400">{t('resetGameDesc', language)}</p>
                    </div>
                    <button
                    onClick={onResetGame}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-red-500"
                    >
                    {t('reset', language)}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
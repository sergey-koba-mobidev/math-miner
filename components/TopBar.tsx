import React from 'react';
import type { ResourceType, CharacterStats, FloatingText, EquipmentLevels, AnimationState } from '../types';
import { RESOURCE_ICONS, DepthIcon, ShopIcon, BestiaryIcon, SettingsIcon } from './icons/GameIcons';
import { CharacterDisplay } from './CharacterDisplay';
import { Language, t } from '../services/translation';


interface TopBarProps {
  resources: Record<ResourceType, number>;
  accessibleDepth: number;
  hero: CharacterStats;
  mob: CharacterStats;
  floatingTexts: FloatingText[];
  onShopOpen: () => void;
  onBestiaryOpen: () => void;
  onSettingsOpen: () => void;
  equipmentLevels: EquipmentLevels;
  heroAnimation: AnimationState;
  mobAnimation: AnimationState;
  blinkingResources: Partial<Record<ResourceType, boolean>>;
  language: Language;
  onTriggerSuperpower: () => void;
  superpowerCooldown: number;
  superpowerTurnsLeft: number;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  resources, accessibleDepth, hero, mob, floatingTexts, onShopOpen, onBestiaryOpen, onSettingsOpen, 
  equipmentLevels, heroAnimation, mobAnimation, blinkingResources, language, 
  onTriggerSuperpower, superpowerCooldown, superpowerTurnsLeft
}) => {
  return (
    <div className="w-full z-10 bg-stone-800/90 backdrop-blur-sm shadow-lg p-2">
      <div className="w-full grid grid-cols-[1fr_auto_1fr] items-start gap-4">
        {/* Left Spacer - This empty div ensures the center column is truly centered */}
        <div></div>

        {/* Center Content */}
        <div className="flex flex-col items-center gap-2">
            {/* Combatants Row */}
            <div className="flex justify-around items-center w-full max-w-lg">
                <CharacterDisplay 
                    stats={hero} 
                    floatingTexts={floatingTexts.filter(t => t.target === 'hero')} 
                    equipmentLevels={equipmentLevels}
                    animationState={heroAnimation}
                    language={language}
                    onTriggerSuperpower={onTriggerSuperpower}
                    superpowerCooldown={superpowerCooldown}
                    isSuperpowerActive={superpowerTurnsLeft > 0}
                />
                <span className="text-2xl font-bold text-stone-400 animate-pulse">{t('vs', language)}</span>
                <div data-mob-display="true">
                    <CharacterDisplay 
                        stats={mob} 
                        floatingTexts={floatingTexts.filter(t => t.target === 'mob')}
                        animationState={mobAnimation}
                        language={language}
                    />
                </div>
            </div>

            {/* Resources Row */}
            <div className="flex justify-center items-center flex-wrap gap-2 md:gap-4 bg-stone-900/70 p-2 rounded-lg w-full max-w-2xl">
                {(Object.keys(resources) as ResourceType[]).map((key) => {
                    const isBlinking = blinkingResources[key];
                    return (
                        <div 
                            key={key}
                            data-resource-icon={key}
                            className={`flex items-center gap-2 bg-stone-900/50 p-2 rounded-lg transition-all ${isBlinking ? 'animate-blink' : ''}`}
                        >
                            {React.cloneElement(RESOURCE_ICONS[key] as React.ReactElement<{ className?: string }>, { className: 'w-8 h-8' })}
                            <span className="font-bold text-lg text-yellow-100">{resources[key]}</span>
                        </div>
                    );
                })}
                <div className="flex items-center gap-2 bg-stone-900/50 p-2 rounded-lg" title={t('depthTitle', language)}>
                    <DepthIcon />
                    <span className="font-bold text-lg text-stone-300">{accessibleDepth}m</span>
                </div>
            </div>
        </div>

        {/* Right Buttons */}
        <div className="justify-self-end flex items-center gap-2">
            <button onClick={onShopOpen} className="flex items-center gap-2 bg-yellow-600/50 hover:bg-yellow-500/50 px-3 py-2 rounded-lg transition-colors font-bold text-sm" title={t('shop', language)}>
                <ShopIcon />
                <span>{t('shop', language)}</span>
            </button>
            <button onClick={onBestiaryOpen} className="flex items-center gap-2 bg-amber-600/50 hover:bg-amber-500/50 px-3 py-2 rounded-lg transition-colors font-bold text-sm" title={t('bestiary', language)}>
                <BestiaryIcon />
                <span>{t('bestiary', language)}</span>
            </button>
            <button onClick={onSettingsOpen} className="flex items-center gap-2 bg-stone-600/50 hover:bg-stone-500/50 px-3 py-2 rounded-lg transition-colors font-bold text-sm" title={t('settings', language)}>
                <SettingsIcon />
                <span>{t('settings', language)}</span>
            </button>
        </div>
      </div>
      <style>{`
          @keyframes blink {
            50% {
              background-color: rgba(252, 211, 77, 0.5); /* yellow-400 with opacity */
              transform: scale(1.1);
            }
          }
          .animate-blink {
            animation: blink 0.4s ease-in-out;
          }
        `}</style>
    </div>
  );
};
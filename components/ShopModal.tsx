import React, { useRef, useEffect } from 'react';
import type { EquipmentLevels, EquipmentSlot, ResourceType } from '../types';
import { EQUIPMENT_DATA } from '../data/equipment';
import { RESOURCE_ICONS } from './icons/GameIcons';
import { drawCharacter } from '../services/drawing/characterDrawers';
import { Language, t, tEquip, tSlot } from '../services/translation';


interface ShopModalProps {
  onClose: () => void;
  onUpgrade: (slot: EquipmentSlot) => void;
  equipmentLevels: EquipmentLevels;
  resources: Record<ResourceType, number>;
  isTestingMode: boolean;
  language: Language;
}

const slotIcons: Record<EquipmentSlot, React.ReactElement> = {
  WEAPON: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.45-6.914l10.9 4.364M4.545 12.001l14.91 6.09" /></svg>,
  SHIELD: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  HELMET: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 16a1 1 0 001-1V8a1 1 0 011-1h1" /></svg>,
  ARMOR: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m-5 3H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2h-1m-6 3l-2-2-2 2m4 0l-2 2-2 2m4 0l2 2 2-2m-4 0l2-2 2 2" /></svg>,
  LEGS: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-12l-8 8-8-8" /></svg>,
  BOOTS: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
};

const formatStat = (key: string, value: number) => {
    switch (key) {
        case 'maxHp': return `+${value} HP`;
        case 'attack': return `+${value} ATK`;
        case 'defense': return `+${value} DEF`;
        case 'evasion': return `+${value}% EVA`;
        case 'critChance': return `+${value}% CRIT`;
        default: return '';
    }
}

// Reusable canvas component for rendering the hero based on equipment
interface HeroPreviewCanvasProps {
  equipmentLevels: EquipmentLevels;
  className?: string;
}

const HeroPreviewCanvas: React.FC<HeroPreviewCanvasProps> = ({ equipmentLevels, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frameCounter = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coloration = { hueRotate: 0 };

    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (timestamp - lastTime > 120) { // ~8 FPS
        lastTime = timestamp;
        frameCounter.current += 1;
        drawCharacter(ctx, 'HERO', frameCounter.current, { coloration, equipment: equipmentLevels });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [equipmentLevels]);

  return (
    <canvas
      ref={canvasRef}
      width="64"
      height="64"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export const ShopModal: React.FC<ShopModalProps> = ({ onClose, onUpgrade, equipmentLevels, resources, isTestingMode, language }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20" onClick={onClose}>
      <div 
        className="bg-stone-800 p-4 rounded-lg shadow-2xl border border-yellow-400 w-full max-w-4xl h-5/6 mx-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-yellow-300">{t('shop', language)}</h2>
            <button onClick={onClose} className="text-2xl text-stone-400 hover:text-white">&times;</button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(equipmentLevels) as EquipmentSlot[]).map(slot => {
                const currentLevel = equipmentLevels[slot];
                const currentItem = EQUIPMENT_DATA[slot].find(item => item.level === currentLevel);
                const nextItem = EQUIPMENT_DATA[slot].find(item => item.level === currentLevel + 1);

                const canAfford = isTestingMode || (nextItem ? Object.entries(nextItem.cost).every(([resource, cost]) => resources[resource as ResourceType] >= (cost as number)) : false);
                
                return (
                    <div key={slot} className="bg-stone-900/80 p-4 rounded-lg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2 text-yellow-200">
                                {slotIcons[slot]}
                                <h3 className="text-xl font-bold capitalize">{tSlot(slot, language)}</h3>
                            </div>

                            <div className="flex justify-around items-center my-2 bg-stone-800 p-2 rounded-md">
                                <div>
                                    <p className="text-center text-xs text-stone-400 mb-1">{t('current', language)}</p>
                                    <HeroPreviewCanvas equipmentLevels={equipmentLevels} className="w-16 h-16" />
                                </div>
                                {nextItem && (
                                    <>
                                        <div className="text-green-400 text-2xl">&rarr;</div>
                                        <div>
                                            <p className="text-center text-xs text-green-300 mb-1">{t('upgrade', language)}</p>
                                            <HeroPreviewCanvas 
                                                equipmentLevels={{...equipmentLevels, [slot]: currentLevel + 1}} 
                                                className="w-16 h-16" 
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="bg-stone-800 p-2 rounded-md mb-2 min-h-[50px]">
                                <p className="font-semibold">{currentItem ? tEquip(currentItem.nameKey as any, language) : t('unequipped', language)}</p>
                                <p className="text-sm text-stone-400">
                                    {currentItem ? Object.entries(currentItem.stats).map(([key, val]) => formatStat(key, val!)).join(' / ') : t('noStats', language)}
                                </p>
                            </div>

                            {nextItem && (
                                <div className="border-t border-stone-700 pt-2">
                                    <p className="text-green-400 font-semibold">{tEquip(nextItem.nameKey as any, language)}</p>
                                     <p className="text-sm text-green-300">
                                        {Object.entries(nextItem.stats).map(([key, val]) => formatStat(key, val!)).join(' / ')}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {Object.entries(nextItem.cost).map(([res, cost]) => (
                                            <div key={res} className={`flex items-center gap-1 p-1 rounded-md text-xs ${resources[res as ResourceType] < (cost as number) && !isTestingMode ? 'bg-red-900/50' : 'bg-stone-700/50'}`}>
                                                {/* FIX: Cast element to specify props type for React.cloneElement to resolve overload error. */}
                                                {React.cloneElement(RESOURCE_ICONS[res as ResourceType] as React.ReactElement<{className?: string}>, {className: 'w-4 h-4'})}
                                                <span>{isTestingMode ? 0 : cost}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!nextItem && <p className="text-center text-yellow-400 font-bold mt-4">{t('maxLevel', language)}</p>}
                        </div>
                        
                        {nextItem && (
                             <button 
                                onClick={() => onUpgrade(slot)} 
                                disabled={!canAfford}
                                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {t('upgrade', language)}
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

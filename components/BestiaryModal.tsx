

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOBS } from '../data/mobs';
// FIX: Changed type-only import to allow ResourceType enum to be used as a value.
import { type MobBaseStats, ResourceType } from '../types';
import { drawCharacter } from '../services/drawing/characterDrawers';
import { Language, t, tMob } from '../services/translation';
import { RESOURCE_ICONS } from './icons/GameIcons';

interface MobPreviewCanvasProps {
  spriteKey: string;
  coloration: { hueRotate: number };
  isSilhouette?: boolean;
  className?: string;
}

const MobPreviewCanvas: React.FC<MobPreviewCanvasProps> = ({ spriteKey, coloration, isSilhouette = false, className = "w-16 h-16 flex-shrink-0" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const frameCounter = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let lastTime = 0;
        const animate = (timestamp: number) => {
            if (timestamp - lastTime > 120) { // ~8 FPS
                lastTime = timestamp;
                frameCounter.current += 1;
                drawCharacter(ctx, spriteKey, frameCounter.current, { coloration, isSilhouette });
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animate(0);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [spriteKey, coloration, isSilhouette]);

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

// Simplified loot generation logic for display purposes
const getPotentialLoot = (mobIndex: number): ResourceType[] => {
    // FIX: Used ResourceType enum members instead of string literals.
    const loot: ResourceType[] = [ResourceType.DIRT, ResourceType.STONE];
    if (mobIndex >= 9) loot.push(ResourceType.MINERAL);
    if (mobIndex >= 19) loot.push(ResourceType.SILVER);
    if (mobIndex >= 49) loot.push(ResourceType.GOLD);
    return loot;
}

interface BestiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  highestMobIndexEncountered: number;
  language: Language;
}

export const BestiaryModal: React.FC<BestiaryModalProps> = ({ isOpen, onClose, highestMobIndexEncountered, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMob, setSelectedMob] = useState<MobBaseStats | null>(null);

  const filteredMobs = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return MOBS.filter((mob, index) => {
        if (index > highestMobIndexEncountered + 1) return false;
        if (index > highestMobIndexEncountered && searchTerm === '') return true; // Show the next one as "???" only if not searching
        if (index > highestMobIndexEncountered) return false;

        let name = tMob(mob.nameKey as any, language);
        if (mob.nameKey.startsWith('endless_')) {
            const baseNameKey = mob.nameKey.replace('endless_', '');
            const baseName = tMob(baseNameKey as any, language);
            name = `${t('endless', language)} ${baseName}`;
        }
        return name.toLowerCase().includes(lowerCaseSearch);
    });
  }, [searchTerm, highestMobIndexEncountered, language]);
  
  useEffect(() => {
    if (isOpen && !selectedMob) {
        setSelectedMob(MOBS[highestMobIndexEncountered]);
    } else if (!isOpen) {
        setSearchTerm('');
        setSelectedMob(null);
    }
  }, [isOpen, highestMobIndexEncountered, selectedMob]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30" onClick={onClose}>
      <div 
        className="bg-stone-800 p-4 rounded-lg shadow-2xl border border-amber-400 w-full max-w-4xl h-full sm:h-5/6 mx-0 sm:mx-4 flex flex-col md:flex-row gap-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Mob List */}
        <div className="w-full md:w-1/3 flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-amber-300">{t('bestiary', language)}</h2>
                <button onClick={onClose} className="text-3xl text-stone-400 hover:text-white md:hidden">&times;</button>
            </div>
          <input
            type="text"
            placeholder={`${t('search', language)}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-stone-900 border border-stone-600 text-white"
          />
          {/* Mobile Horizontal List */}
          <div className="md:hidden flex flex-row overflow-x-auto py-2 space-x-2 bg-stone-900/50 rounded-md px-2">
            {filteredMobs.map((mob) => {
              const mobIndex = MOBS.indexOf(mob);
              const isDiscovered = mobIndex <= highestMobIndexEncountered;
              let name = isDiscovered ? tMob(mob.nameKey as any, language) : t('unknownMob', language);
              if (isDiscovered && mob.nameKey.startsWith('endless_')) {
                const baseNameKey = mob.nameKey.replace('endless_', '');
                const baseName = tMob(baseNameKey as any, language);
                name = `${t('endless', language)} ${baseName}`;
              }
              return (
                <button
                  key={mob.nameKey + mobIndex + '-mobile'}
                  onClick={() => setSelectedMob(mob)}
                  className={`p-2 rounded-md flex flex-col items-center gap-1 transition-colors flex-shrink-0 w-28 ${selectedMob?.nameKey === mob.nameKey ? 'bg-amber-600/50' : 'hover:bg-stone-700/50'}`}
                >
                  <MobPreviewCanvas 
                    spriteKey={mob.spriteKey} 
                    coloration={mob.spriteColoration} 
                    isSilhouette={!isDiscovered} 
                    className="w-12 h-12 flex-shrink-0"
                  />
                  <span className={`font-bold text-xs text-center truncate w-full ${isDiscovered ? 'text-stone-200' : 'text-stone-500'}`}>{name}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Vertical List */}
          <div className="hidden md:block flex-grow overflow-y-auto pr-2 bg-stone-900/50 rounded-md">
            {filteredMobs.map((mob) => {
              const mobIndex = MOBS.indexOf(mob);
              const isDiscovered = mobIndex <= highestMobIndexEncountered;
              let name = isDiscovered ? tMob(mob.nameKey as any, language) : t('unknownMob', language);
              if (isDiscovered && mob.nameKey.startsWith('endless_')) {
                const baseNameKey = mob.nameKey.replace('endless_', '');
                const baseName = tMob(baseNameKey as any, language);
                name = `${t('endless', language)} ${baseName}`;
              }

              return (
                <button 
                  key={mob.nameKey + mobIndex}
                  onClick={() => setSelectedMob(mob)}
                  className={`w-full text-left p-2 rounded-md my-1 flex items-center gap-2 transition-colors ${selectedMob?.nameKey === mob.nameKey ? 'bg-amber-600/50' : 'hover:bg-stone-700/50'}`}
                >
                    <MobPreviewCanvas spriteKey={mob.spriteKey} coloration={mob.spriteColoration} isSilhouette={!isDiscovered} />
                    <span className={`font-bold ${isDiscovered ? 'text-stone-200' : 'text-stone-500'}`}>{name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mob Details */}
        <div className="w-full md:w-2/3 flex flex-col bg-stone-900/50 p-4 rounded-md overflow-y-auto flex-grow">
            {selectedMob ? (() => {
                const mobIndex = MOBS.indexOf(selectedMob);
                const isDiscovered = mobIndex <= highestMobIndexEncountered;
                let name = isDiscovered ? tMob(selectedMob.nameKey as any, language) : t('unknownMob', language);
                if (isDiscovered && selectedMob.nameKey.startsWith('endless_')) {
                    const baseNameKey = selectedMob.nameKey.replace('endless_', '');
                    const baseName = tMob(baseNameKey as any, language);
                    name = `${t('endless', language)} ${baseName}`;
                }
                const lore = isDiscovered ? tMob(selectedMob.loreKey as any, language) : t('discoverPrompt', language);

                return (
                    <>
                        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-stone-700 pb-4 mb-4">
                            <MobPreviewCanvas 
                                spriteKey={selectedMob.spriteKey} 
                                coloration={selectedMob.spriteColoration} 
                                isSilhouette={!isDiscovered} 
                                className="w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0"
                            />
                            <div className="text-center sm:text-left">
                                <h3 className={`text-3xl font-bold ${isDiscovered ? 'text-amber-200' : 'text-stone-500'}`}>{name}</h3>
                                <p className="text-stone-400 italic mt-2">{lore}</p>
                            </div>
                        </div>
                        {isDiscovered && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-stone-300">
                                <div className="bg-stone-800/60 p-3 rounded-md">
                                    <h4 className="font-bold text-lg text-amber-300 border-b border-stone-600 mb-2">{t('hp', language)}</h4>
                                    <p className="text-2xl">{selectedMob.maxHp}</p>
                                </div>
                                <div className="bg-stone-800/60 p-3 rounded-md">
                                    <h4 className="font-bold text-lg text-amber-300 border-b border-stone-600 mb-2">{t('attack', language)}</h4>
                                    <p className="text-2xl">{selectedMob.attack}</p>
                                </div>
                                <div className="bg-stone-800/60 p-3 rounded-md">
                                    <h4 className="font-bold text-lg text-amber-300 border-b border-stone-600 mb-2">{t('defense', language)}</h4>
                                    <p className="text-2xl">{selectedMob.defense}</p>
                                </div>
                                <div className="bg-stone-800/60 p-3 rounded-md">
                                    <h4 className="font-bold text-lg text-amber-300 border-b border-stone-600 mb-2">{t('evasion', language)}</h4>
                                    <p className="text-2xl">{selectedMob.evasion}%</p>
                                </div>
                                 <div className="bg-stone-800/60 p-3 rounded-md">
                                    <h4 className="font-bold text-lg text-amber-300 border-b border-stone-600 mb-2">{t('critChance', language)}</h4>
                                    <p className="text-2xl">{selectedMob.critChance}%</p>
                                </div>
                                <div className="bg-stone-800/60 p-3 rounded-md">
                                    <h4 className="font-bold text-lg text-amber-300 border-b border-stone-600 mb-2">{t('potentialLoot', language)}</h4>
                                    <div className="flex gap-2 items-center mt-2 flex-wrap">
                                        {getPotentialLoot(mobIndex).map(res => (
                                             <div key={res} className="bg-stone-900 p-1 rounded-md" title={res}>
                                                {React.cloneElement(RESOURCE_ICONS[res] as React.ReactElement<{className?: string}>, {className: 'w-6 h-6'})}
                                             </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                );
            })() : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-stone-500">{t('discoverPrompt', language)}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
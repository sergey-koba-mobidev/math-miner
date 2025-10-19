

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { MobBaseStats, ResourceType } from '../types';
import { RESOURCE_ICONS, drawCharacter } from '../constants';
import { ResourceType as ResEnum } from '../types';

interface BestiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMobs: MobBaseStats[];
  highestMobIndexEncountered: number;
}

const getPotentialLoot = (mobIndex: number): ResourceType[] => {
    const potential: ResourceType[] = [ResEnum.DIRT, ResEnum.STONE];
    if (mobIndex + 1 > 10) potential.push(ResEnum.MINERAL);
    if (mobIndex + 1 > 20) potential.push(ResEnum.SILVER);
    if (mobIndex + 1 > 50) potential.push(ResEnum.GOLD);
    return potential;
};

export const BestiaryModal: React.FC<BestiaryModalProps> = ({ isOpen, onClose, allMobs, highestMobIndexEncountered }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // FIX: Changed useRef to be initialized with null to satisfy TypeScript's strict null checks.
  // The error "Expected 1 arguments, but got 0" likely points to this line, as `useRef<number>()` is an invalid call.
  const animationFrameRef = useRef<number | null>(null);
  const frameCounter = useRef(0);

  const mobsWithIndices = useMemo(() => allMobs.map((mob, index) => ({ ...mob, originalIndex: index })), [allMobs]);

  const filteredMobs = useMemo(() => {
    if (!filter) return mobsWithIndices;
    return mobsWithIndices.filter(mob => mob.name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter, mobsWithIndices]);

  const selectedMob = allMobs[selectedIndex];
  const isSelectedMobDiscovered = selectedIndex <= highestMobIndexEncountered;
  
  useEffect(() => {
    if (!isOpen || !selectedMob) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spriteKey = selectedMob.spriteKey || 'SLIME';
    const coloration = selectedMob.spriteColoration || { hueRotate: 0 };
    
    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (timestamp - lastTime > 120) { // ~8 FPS
        lastTime = timestamp;
        frameCounter.current += 1;
        // FIX: The `drawCharacter` function expects the last argument to be an options object.
        drawCharacter(ctx, spriteKey, frameCounter.current, { coloration, isSilhouette: !isSelectedMobDiscovered });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, selectedMob, isSelectedMobDiscovered]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20" onClick={onClose}>
      <div 
        className="bg-stone-800 p-4 rounded-lg shadow-2xl border border-amber-400 w-full max-w-6xl h-5/6 mx-4 flex flex-col md:flex-row gap-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Mob List */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col bg-stone-900/50 p-2 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-amber-300">Bestiary</h2>
            <button onClick={onClose} className="text-2xl text-stone-400 hover:text-white">&times;</button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 bg-stone-800 rounded-md border border-stone-700 mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex-grow overflow-y-auto pr-2">
            {filteredMobs.map((mob) => {
              const isDiscovered = mob.originalIndex <= highestMobIndexEncountered;
              return (
                <button 
                  key={mob.originalIndex}
                  onClick={() => {
                    setSelectedIndex(mob.originalIndex);
                    setFilter('');
                  }}
                  className={`w-full text-left p-2 rounded my-1 text-sm ${
                    selectedIndex === mob.originalIndex ? 'bg-amber-600/50' : 'hover:bg-stone-700/50'
                  } ${!isDiscovered ? 'text-stone-500' : 'text-white'}`}
                >
                 {mob.originalIndex + 1}. {isDiscovered ? mob.name : '???'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Mob Details */}
        <div className="flex-grow bg-stone-900/50 p-4 rounded-lg flex flex-col items-center">
            {selectedMob && (
                <>
                    <h3 className="text-3xl font-bold text-yellow-200 mb-2">{isSelectedMobDiscovered ? selectedMob.name : '???'}</h3>
                    <div className="h-[96px] w-[96px] flex items-center justify-center mb-4">
                       <canvas
                          ref={canvasRef}
                          width="64"
                          height="64"
                          style={{
                            imageRendering: 'pixelated',
                            width: '96px',
                            height: '96px',
                          }}
                        ></canvas>
                    </div>
                    
                    {isSelectedMobDiscovered ? (
                        <div className="w-full text-center overflow-y-auto pr-2">
                            <p className="text-stone-300 italic mb-4 text-sm">{selectedMob.lore}</p>
                            
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 bg-stone-800/60 p-4 rounded-lg mb-4">
                                <div className="font-bold text-right text-stone-400">HP:</div> <div className="text-left text-white">{selectedMob.maxHp}</div>
                                <div className="font-bold text-right text-stone-400">Attack:</div> <div className="text-left text-white">{selectedMob.attack}</div>
                                <div className="font-bold text-right text-stone-400">Defense:</div> <div className="text-left text-white">{selectedMob.defense}</div>
                                <div className="font-bold text-right text-stone-400">Evasion:</div> <div className="text-left text-white">{selectedMob.evasion}%</div>
                                <div className="font-bold text-right text-stone-400">Crit Chance:</div> <div className="text-left text-white">{selectedMob.critChance}%</div>
                            </div>

                            <h4 className="font-bold text-lg text-amber-200 mb-2">Potential Loot</h4>
                            <div className="flex justify-center items-center gap-4 flex-wrap bg-stone-800/60 p-3 rounded-lg">
                               {getPotentialLoot(selectedIndex).map(resType => (
                                   <div key={resType} className="flex flex-col items-center" title={resType}>
                                       {/* FIX: Cast element to specify props type for React.cloneElement to resolve overload error. */}
                                       {React.cloneElement(RESOURCE_ICONS[resType] as React.ReactElement<{className?: string}>, { className: 'w-8 h-8' })}
                                   </div>
                               ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-stone-400 text-lg">Encounter this creature to reveal its details.</p>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};
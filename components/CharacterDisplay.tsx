// FIX: Removed extraneous file markers that were causing syntax errors.
import React, { useRef, useEffect } from 'react';
import type { CharacterStats, FloatingText, EquipmentLevels, AnimationState } from '../types';
import { drawCharacter } from '../services/drawing/characterDrawers';
import { Language, t } from '../services/translation';
import { SuperpowerIcon } from './icons/GameIcons';

interface CharacterDisplayProps {
  stats: CharacterStats;
  floatingTexts: FloatingText[];
  equipmentLevels?: EquipmentLevels;
  animationState?: AnimationState;
  language: Language;
  onTriggerSuperpower?: () => void;
  superpowerCooldown?: number;
  isSuperpowerActive?: boolean;
}

const getTextClasses = (type: FloatingText['type']) => {
    switch (type) {
        case 'damage': return 'text-white font-bold text-base sm:text-lg';
        case 'crit': return 'text-red-500 font-extrabold text-lg sm:text-2xl scale-110 sm:scale-125';
        case 'miss': return 'text-gray-400 italic text-base sm:text-lg';
        case 'loot': return 'text-yellow-300 font-bold text-base sm:text-lg';
        default: return 'text-white';
    }
};

export const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ 
  stats, floatingTexts, equipmentLevels, animationState = 'idle', language,
  onTriggerSuperpower, superpowerCooldown = 0, isSuperpowerActive = false
}) => {
  const hpPercentage = (stats.hp / stats.maxHp) * 100;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frameCounter = useRef(0);
  
  const isHero = !!equipmentLevels;
  const isSuperpowerReady = superpowerCooldown === 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spriteKey = isHero ? 'HERO' : stats.spriteKey || 'SLIME';
    const coloration = stats.spriteColoration || { hueRotate: 0 };

    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (timestamp - lastTime > 120) { // ~8 FPS
        lastTime = timestamp;
        frameCounter.current += 1;
        drawCharacter(ctx, spriteKey, frameCounter.current, { coloration, equipment: equipmentLevels });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stats, isHero, equipmentLevels, language]);

  const animationClasses: Record<AnimationState, string> = {
    idle: '',
    attacking: isHero ? 'animate-attack-hero' : 'animate-attack-mob',
    'taking-damage': 'animate-take-damage',
    missed: 'animate-miss',
  };

  const superpowerGlowClass = isSuperpowerActive ? 'animate-superpower-glow' : '';

  return (
    <div className={`relative w-36 sm:w-48 h-[160px] sm:h-[170px] bg-stone-900/60 p-1 sm:p-2 rounded-lg border border-stone-700 shadow-md flex flex-col items-center justify-between transition-all duration-200 ${animationClasses[animationState]} ${superpowerGlowClass}`}>
      {/* Top section: Name and Sprite */}
      <div className="w-full flex flex-col items-center">
        <div className="h-6 flex items-center justify-center gap-1">
            <span className="text-center font-bold text-sm sm:text-base text-yellow-100 truncate w-full px-1" style={{ textShadow: '1px 1px 2px black' }}>
            {stats.name}
            </span>
            {isHero && onTriggerSuperpower && (
                <button
                    onClick={onTriggerSuperpower}
                    disabled={superpowerCooldown > 0}
                    className={`relative disabled:opacity-50 disabled:cursor-not-allowed group ${isSuperpowerReady ? 'animate-superpower-pulse' : ''}`}
                    title={superpowerCooldown > 0 ? t('superpowerCooldown', language, { turns: superpowerCooldown }) : t('superpowerTitle', language)}
                >
                    <SuperpowerIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    {superpowerCooldown > 0 && (
                        <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-stone-600">
                            {superpowerCooldown}
                        </span>
                    )}
                </button>
            )}
        </div>
        <div className="h-[64px] sm:h-[72px] w-full flex items-end justify-center">
            <canvas
              ref={canvasRef}
              width="64"
              height="64"
              style={{
                imageRendering: 'pixelated',
                width: isHero ? '68px' : '72px',
                height: isHero ? '68px' : '72px',
                transformOrigin: 'bottom',
              }}
            ></canvas>
        </div>
      </div>
      
      {/* Bottom section: HP and Stats */}
      <div className="w-full">
        <div className="relative w-full bg-red-800 rounded-full h-3 sm:h-4 my-1 border border-black/50 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-500 ease-linear"
            style={{ width: `${hpPercentage}%` }}
          ></div>
          <span className="absolute w-full text-center text-[10px] sm:text-xs font-bold text-white" style={{ textShadow: '1px 1px 2px black' }}>
            {stats.hp} / {stats.maxHp}
          </span>
        </div>
        <div className="flex justify-around flex-wrap text-[10px] sm:text-xs mt-1 text-stone-300 gap-x-1 sm:gap-x-2">
          <span>{t('atk', language)}: {stats.attack}</span>
          <span>{t('def', language)}: {stats.defense}</span>
          <span>{t('eva', language)}: {stats.evasion}%</span>
          <span>{t('crit', language)}: {stats.critChance}%</span>
        </div>
      </div>

      {/* Floating texts */}
      {floatingTexts.map(text => (
        <span 
          key={text.id} 
          className={`floating-text absolute top-10 sm:top-12 left-1/2 whitespace-nowrap ${getTextClasses(text.type)}`}
          style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.7)'}}
        >
          {text.text}
        </span>
      ))}
      <style>{`
        /* Superpower Ready Pulse Animation */
        @keyframes superpower-pulse {
            0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 3px #fef08a);
            }
            50% {
                transform: scale(1.2);
                filter: drop-shadow(0 0 8px #fde047);
            }
        }
        .animate-superpower-pulse {
            animation: superpower-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Superpower Active Glow Animation */
        @keyframes superpower-glow {
            0%, 100% {
                box-shadow: 0 0 5px #fff, 0 0 10px #ffec8b, 0 0 15px #ffd700, 0 0 20px #ffd700;
                border-color: #ffd700;
            }
            50% {
                box-shadow: 0 0 10px #fff, 0 0 20px #ffec8b, 0 0 30px #ffd700, 0 0 40px #ffd700;
                border-color: #ffec8b;
            }
        }
        .animate-superpower-glow {
            animation: superpower-glow 2s ease-in-out infinite;
        }

        /* Combat Text Animation */
        @keyframes float-up {
          0% {
            transform: translate(-50%, 0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50px) scale(1.2);
            opacity: 0;
          }
        }
        .floating-text {
          pointer-events: none;
          animation: float-up 2s ease-out forwards;
        }

        /* Combat Animations */
        @keyframes attack-hero {
          50% { transform: translateX(30px) scale(1.05); }
        }
        @keyframes attack-mob {
          50% { transform: translateX(-30px) scale(1.05); }
        }
        @keyframes take-damage-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
        }
        @keyframes take-damage-flash {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.8) drop-shadow(0 0 8px red); }
        }
        @keyframes miss-dodge {
          50% { transform: translateX(${isHero ? '-20px' : '20px'}) scale(0.95); opacity: 0.8; }
        }

        .animate-attack-hero { animation: attack-hero 0.8s ease-in-out; }
        .animate-attack-mob { animation: attack-mob 0.8s ease-in-out; }
        .animate-take-damage { animation: take-damage-shake 0.5s ease-in-out, take-damage-flash 0.5s ease-in-out; }
        .animate-miss { animation: miss-dodge 0.6s ease-out; }
      `}</style>
    </div>
  );
};
import React, { useRef, useEffect } from 'react';
import type { CharacterStats, FloatingText, EquipmentLevels, AnimationState } from '../types';
import { drawCharacter } from '../services/drawing/characterDrawers';
import { Language, t } from '../services/translation';

interface CharacterDisplayProps {
  stats: CharacterStats;
  floatingTexts: FloatingText[];
  equipmentLevels?: EquipmentLevels;
  animationState?: AnimationState;
  language: Language;
}

const getTextClasses = (type: FloatingText['type']) => {
    switch (type) {
        case 'damage': return 'text-white font-bold text-lg';
        case 'crit': return 'text-red-500 font-extrabold text-2xl scale-125';
        case 'miss': return 'text-gray-400 italic text-lg';
        case 'loot': return 'text-yellow-300 font-bold text-lg';
        default: return 'text-white';
    }
};

export const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ stats, floatingTexts, equipmentLevels, animationState = 'idle', language }) => {
  const hpPercentage = (stats.hp / stats.maxHp) * 100;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frameCounter = useRef(0);
  
  const isHero = stats.name === t('hero', language);

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

  return (
    <div className={`relative w-48 h-[170px] bg-stone-900/60 p-2 rounded-lg border border-stone-700 shadow-md flex flex-col items-center justify-between transition-transform duration-200 ${animationClasses[animationState]}`}>
      {/* Top section: Name and Sprite */}
      <div className="w-full flex flex-col items-center">
        <span className="h-6 text-center font-bold text-yellow-100 truncate w-full px-1" style={{ textShadow: '1px 1px 2px black' }}>
          {stats.name}
        </span>
        <div className="h-[72px] w-full flex items-end justify-center">
            <canvas
              ref={canvasRef}
              width="64"
              height="64"
              style={{
                imageRendering: 'pixelated',
                width: isHero ? '72px' : '80px',
                height: isHero ? '72px' : '80px',
                transformOrigin: 'bottom',
              }}
            ></canvas>
        </div>
      </div>
      
      {/* Bottom section: HP and Stats */}
      <div className="w-full">
        <div className="relative w-full bg-red-800 rounded-full h-4 my-1 border border-black/50 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-500 ease-linear"
            style={{ width: `${hpPercentage}%` }}
          ></div>
          <span className="absolute w-full text-center text-xs font-bold text-white" style={{ textShadow: '1px 1px 2px black' }}>
            {stats.hp} / {stats.maxHp}
          </span>
        </div>
        <div className="flex justify-around flex-wrap text-xs mt-1 text-stone-300 gap-x-2">
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
          className={`floating-text absolute top-12 left-1/2 whitespace-nowrap ${getTextClasses(text.type)}`}
          style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.7)'}}
        >
          {text.text}
        </span>
      ))}
      <style>{`
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

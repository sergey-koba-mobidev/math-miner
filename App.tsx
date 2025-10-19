import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { Mine } from './components/Mine';
import { MathModal } from './components/MathModal';
import { ShopModal } from './components/ShopModal';
import { BestiaryModal } from './components/BestiaryModal';
import { TILE_ROWS, TILE_COLS, initialEquipment, RESOURCE_ICONS, TILE_SIZE_PX } from './constants';
import { generateProblem } from './services/mathService';
import type { TileData, ResourceType, Problem, TileType, CharacterStats, FloatingText, EquipmentLevels, EquipmentSlot, AnimationState, LootAnimation } from './types';
import { TileType as TileEnum, ResourceType as ResourceEnum } from './types';
import { EQUIPMENT_DATA } from './data/equipment';
import { MOBS } from './data/mobs';

// Helper function to generate a new mine grid without causing a re-render.
// This is used for the initial state to prevent crashes on load.
const generateInitialMine = (): TileData[][] => {
    const newGrid: TileData[][] = [];
    for (let r = 0; r < TILE_ROWS; r++) {
      const row: TileData[] = [];
      for (let c = 0; c < TILE_COLS; c++) {
        let type: TileType;
        if (r === 0 && (c > 2 && c < 7)) {
          type = TileEnum.EMPTY;
        } else {
            const random = Math.random();
            const goldChance = r > 75 ? 0.02 : 0;
            const silverChance = r > 40 ? 0.03 : 0;
            const mineralChance = r > 10 ? 0.08 : 0;
            const chestChance = r > 20 ? 0.015 : 0;
            const easterEggChance = r > 50 ? 0.005 : 0;
            
            const pGold = goldChance;
            const pSilver = pGold + silverChance;
            const pMineral = pSilver + chestChance;
            const pChest = pMineral + easterEggChance;
            const pEasterEgg = pChest + 0.001; // Tiny chance for easter egg

            if (random < pGold) type = TileEnum.GOLD_ORE;
            else if (random < pSilver) type = TileEnum.SILVER_ORE;
            else if (random < pMineral) type = TileEnum.MINERAL;
            else if (random < pChest) type = TileEnum.CHEST;
            else if (random < pEasterEgg) type = TileEnum.EASTER_EGG;
            else if (random < pEasterEgg + 0.4) type = TileEnum.STONE;
            else type = TileEnum.DIRT;
        }
        row.push({ type, id: `${r}-${c}`, variant: Math.floor(Math.random() * 5) });
      }
      newGrid.push(row);
    }
    return newGrid;
};


// Helper function to format stats for the modal
const formatStatForModal = (key: string, value: number) => {
    switch (key) {
        case 'maxHp': return `+${value} HP`;
        case 'attack': return `+${value} ATK`;
        case 'defense': return `+${value} DEF`;
        case 'evasion': return `+${value}% EVA`;
        case 'critChance': return `+${value}% CRIT`;
        default: return '';
    }
}

// New FreeUpgradeModal component defined in the same file
interface FreeUpgradeModalProps {
  item: { name: string; stats: string };
  onClose: () => void;
}

const FreeUpgradeModal: React.FC<FreeUpgradeModalProps> = ({ item, onClose }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
      <div className="bg-stone-800 p-8 rounded-lg shadow-2xl border border-green-400 w-full max-w-md mx-4 text-center">
        <h2 className="text-3xl font-bold text-green-300 mb-4">
          Free Upgrade!
        </h2>
        <p className="text-lg mb-2 text-white">
          Your hard work paid off! You found a free equipment upgrade!
        </p>
        <div className="bg-stone-900/80 p-4 rounded-lg my-4">
          <p className="text-xl font-bold text-yellow-200">{item.name}</p>
          <p className="text-md text-green-300">{item.stats}</p>
        </div>
        <button
          ref={buttonRef}
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-stone-800"
        >
          Great!
        </button>
      </div>
    </div>
  );
};


// New RewardModal component defined in the same file
interface RewardModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ title, message, onClose }) => {
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
          Awesome!
        </button>
      </div>
    </div>
  );
};

// New ConfirmationModal component
interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;
  
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    confirmButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30" onClick={onCancel}>
      <div 
        className="bg-stone-800 p-8 rounded-lg shadow-2xl border border-red-500 w-full max-w-md mx-4 text-center"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-red-400 mb-4">{title}</h2>
        <p className="text-lg mb-8 text-white">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-stone-600 hover:bg-stone-700 text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-stone-800"
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-stone-800"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// New SettingsModal component
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
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, isTestingMode, onToggleTestingMode, onResetGame, 
    mathDifficulty, onDifficultyChange, resourceMultiplier, onResourceMultiplierChange 
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
          <h2 className="text-3xl font-bold text-stone-300">Settings</h2>
          <button onClick={onClose} className="text-3xl text-stone-400 hover:text-white">&times;</button>
        </div>
        
        <div className="bg-stone-900/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Testing Mode</h3>
              <p className="text-sm text-stone-400">All equipment upgrades are free.</p>
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
        
        <div className="mt-4 bg-stone-900/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Math Difficulty</h3>
            <span className="font-bold text-yellow-300 text-lg">{mathDifficulty}</span>
          </div>
          <p className="text-sm text-stone-400 mb-3">Controls the complexity of math problems.</p>
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
            <span>Easy</span>
            <span>Hard</span>
          </div>
        </div>

        <div className="mt-4 bg-stone-900/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Resource Reward</h3>
            <span className="font-bold text-yellow-300 text-lg">x{resourceMultiplier}</span>
          </div>
          <p className="text-sm text-stone-400 mb-3">Multiplies rewards from digging and mobs.</p>
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
        
        <div className="mt-6 border-t border-stone-700 pt-6">
           <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
           <div className="flex items-center justify-between bg-stone-900/50 p-4 rounded-lg">
             <div>
               <p className="text-white">Reset Game</p>
               <p className="text-sm text-stone-400">This will permanently delete all your progress.</p>
             </div>
             <button
               onClick={onResetGame}
               className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-red-500"
             >
               Reset
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};


interface ModalState {
  problem: Problem;
  row: number;
  col: number;
}

// --- Loot Animation Components ---
interface FloatingLootIconProps {
  animation: LootAnimation;
  onEnd: (resource: ResourceType) => void;
}

const FloatingLootIcon: React.FC<FloatingLootIconProps> = ({ animation, onEnd }) => {
  const { resource, startRect, endRect } = animation;
  const [phase, setPhase] = useState('start');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('end'), 50);
    return () => clearTimeout(timer);
  }, []);

  const startX = startRect.x + startRect.width / 2;
  const startY = startRect.y + startRect.height / 2;
  const endX = endRect.x + endRect.width / 2;
  const endY = endRect.y + endRect.height / 2;

  const style: React.CSSProperties = {
    position: 'fixed',
    left: startX,
    top: startY,
    transform: 'translate(-50%, -50%) scale(1.5)',
    transition: 'all 0.8s cubic-bezier(0.5, 0, 1, 0.5)',
    opacity: 1,
    zIndex: 100,
  };

  if (phase === 'end') {
    style.left = endX;
    style.top = endY;
    style.transform = 'translate(-50%, -50%) scale(0.5)';
    style.opacity = 0;
  }

  return (
    <div style={style} onTransitionEnd={() => onEnd(resource)}>
      {/* FIX: Cast element to specify props type for React.cloneElement to resolve overload error. */}
      {React.cloneElement(RESOURCE_ICONS[resource] as React.ReactElement<{ className?: string }>, { className: 'w-8 h-8' })}
    </div>
  );
};

interface LootAnimationLayerProps {
  animations: LootAnimation[];
  onAnimationEnd: (id: number, resource: ResourceType) => void;
}

const LootAnimationLayer: React.FC<LootAnimationLayerProps> = ({ animations, onAnimationEnd }) => (
  <>
    {animations.map(anim => (
      <FloatingLootIcon
        key={anim.id}
        animation={anim}
        onEnd={(resource) => onAnimationEnd(anim.id, resource)}
      />
    ))}
  </>
);


const baseHeroStats: Omit<CharacterStats, 'hp' | 'maxHp' | 'name'> = {
  attack: 5,
  defense: 2,
  evasion: 1,
  critChance: 5,
};

const App: React.FC = () => {
  const [resources, setResources] = useState<Record<ResourceType, number>>({
    DIRT: 0,
    STONE: 0,
    MINERAL: 0,
    SILVER: 0,
    GOLD: 0,
    DYNAMITE: 0,
  });
  const [mineGrid, setMineGrid] = useState<TileData[][]>(() => generateInitialMine());
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [deepestRow, setDeepestRow] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [accessibleDepth, setAccessibleDepth] = useState(0);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTestingMode, setIsTestingMode] = useState(false);
  const [mathDifficulty, setMathDifficulty] = useState(3);
  const [resourceMultiplier, setResourceMultiplier] = useState(1);
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
  const [equipmentLevels, setEquipmentLevels] = useState<EquipmentLevels>(initialEquipment);
  const [currentMobIndex, setCurrentMobIndex] = useState(0);
  const [digsSinceLastReward, setDigsSinceLastReward] = useState(0);
  const [nextRewardDigCount, setNextRewardDigCount] = useState(() => Math.floor(Math.random() * 11) + 20); // 20-30
  const [freeUpgradeInfo, setFreeUpgradeInfo] = useState<{ name: string; stats: string } | null>(null);
  const [diggingAnimationTarget, setDiggingAnimationTarget] = useState<{ row: number; col: number; isDynamite: boolean } | null>(null);
  const isHeroTurnRef = useRef(true);
  const [heroAnimation, setHeroAnimation] = useState<AnimationState>('idle');
  const [mobAnimation, setMobAnimation] = useState<AnimationState>('idle');
  const [lootAnimations, setLootAnimations] = useState<LootAnimation[]>([]);
  const [blinkingResources, setBlinkingResources] = useState<Partial<Record<ResourceType, boolean>>>({});
  const mineContainerRef = useRef<HTMLDivElement>(null);


  const [combatants, setCombatants] = useState<{ hero: CharacterStats; mob: CharacterStats }>({
    hero: { name: 'Hero', hp: 100, maxHp: 100, ...baseHeroStats },
    mob: { ...MOBS[0], hp: MOBS[0].maxHp },
  });

  const generateLoot = (mobIndex: number, multiplier: number): Partial<Record<ResourceType, number>> => {
    const loot: Partial<Record<ResourceType, number>> = {};
    const difficulty = mobIndex + 1;

    // Dirt and Stone always drop
    loot.DIRT = Math.round((5 + Math.floor(Math.random() * difficulty * 0.5)) * multiplier);
    loot.STONE = Math.round((3 + Math.floor(Math.random() * difficulty * 0.4)) * multiplier);

    // Mineral drop chance
    if (difficulty > 10 && Math.random() < Math.min(0.9, 0.1 + difficulty * 0.001)) {
        loot.MINERAL = Math.round((1 + Math.floor(Math.random() * difficulty * 0.1)) * multiplier);
    }
    // Silver drop chance
    if (difficulty > 20 && Math.random() < Math.min(0.75, 0.05 + (difficulty - 20) * 0.001)) {
        loot.SILVER = Math.round((1 + Math.floor(Math.random() * difficulty * 0.05)) * multiplier);
    }
    // Gold drop chance
    if (difficulty > 50 && Math.random() < Math.min(0.5, 0.01 + (difficulty - 50) * 0.0005)) {
        loot.GOLD = Math.round((1 + Math.floor(Math.random() * difficulty * 0.025)) * multiplier);
    }

    return loot;
  };

  // Recalculate hero stats when equipment changes
  useEffect(() => {
    const newStats = {
      maxHp: 100,
      attack: baseHeroStats.attack,
      defense: baseHeroStats.defense,
      evasion: baseHeroStats.evasion,
      critChance: baseHeroStats.critChance,
    };

    for (const key in equipmentLevels) {
      const slot = key as EquipmentSlot;
      const level = equipmentLevels[slot];
      if (level > 0) {
        const item = EQUIPMENT_DATA[slot].find(item => item.level === level);
        if (item) {
          if (item.stats.maxHp) newStats.maxHp += item.stats.maxHp;
          if (item.stats.attack) newStats.attack += item.stats.attack;
          if (item.stats.defense) newStats.defense += item.stats.defense;
          if (item.stats.evasion) newStats.evasion += item.stats.evasion;
          if (item.stats.critChance) newStats.critChance += item.stats.critChance;
        }
      }
    }

    setCombatants(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        ...newStats,
        // Don't fully heal on equip, just cap current HP at new maxHP
        hp: Math.min(prev.hero.hp, newStats.maxHp),
      },
    }));
  }, [equipmentLevels]);


  // Turn-based Combat Loop
  useEffect(() => {
    const combatInterval = setInterval(() => {
      setCombatants(prev => {
        if (prev.hero.hp <= 0 || prev.mob.hp <= 0) {
          if (prev.hero.hp <= 0) {
            isHeroTurnRef.current = true;
            return { ...prev, hero: { ...prev.hero, hp: prev.hero.maxHp } };
          }
          return prev;
        }

        let { hero, mob } = { ...prev };
        
        // --- Execute one turn with animations ---
        if (isHeroTurnRef.current) {
          setHeroAnimation('attacking');
          setTimeout(() => {
              const newEvents: FloatingText[] = [];
              if (Math.random() * 100 < mob.evasion) {
                  newEvents.push({ id: Date.now() + Math.random(), text: 'Miss', target: 'mob', type: 'miss' });
                  setMobAnimation('missed');
              } else {
                  const isCrit = Math.random() * 100 < hero.critChance;
                  const attackRandomness = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                  const baseAttack = Math.max(1, hero.attack + attackRandomness);
                  const attackPower = isCrit ? baseAttack * 1.5 : baseAttack;
                  const damage = Math.max(1, Math.floor(attackPower - mob.defense));
                  mob = { ...mob, hp: Math.max(0, mob.hp - damage) };
                  newEvents.push({ id: Date.now() + Math.random(), text: isCrit ? `${damage}!` : `${damage}`, target: 'mob', type: isCrit ? 'crit' : 'damage' });
                  setMobAnimation('taking-damage');
              }
              setFloatingTexts(prevTexts => [...prevTexts, ...newEvents]);
              newEvents.forEach(event => {
                  setTimeout(() => setFloatingTexts(prevTexts => prevTexts.filter(t => t.id !== event.id)), 2000);
              });
              setCombatants({ hero, mob }); // Update state after calculation

              setTimeout(() => {
                  setHeroAnimation('idle');
                  setMobAnimation('idle');
              }, 600); // Defender animation duration
          }, 400); // Attacker animation halfway point
          isHeroTurnRef.current = false;
        } else {
          setMobAnimation('attacking');
          setTimeout(() => {
              const newEvents: FloatingText[] = [];
              if (Math.random() * 100 < hero.evasion) {
                  newEvents.push({ id: Date.now() + Math.random(), text: 'Miss', target: 'hero', type: 'miss' });
                  setHeroAnimation('missed');
              } else {
                  const isCrit = Math.random() * 100 < mob.critChance;
                  const attackRandomness = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                  const baseAttack = Math.max(1, mob.attack + attackRandomness);
                  const attackPower = isCrit ? baseAttack * 1.5 : baseAttack;
                  const damage = Math.max(1, Math.floor(attackPower - hero.defense));
                  hero = { ...hero, hp: Math.max(0, hero.hp - damage) };
                  newEvents.push({ id: Date.now() + Math.random(), text: isCrit ? `${damage}!` : `${damage}`, target: 'hero', type: isCrit ? 'crit' : 'damage' });
                  setHeroAnimation('taking-damage');
              }
              setFloatingTexts(prevTexts => [...prevTexts, ...newEvents]);
              newEvents.forEach(event => {
                  setTimeout(() => setFloatingTexts(prevTexts => prevTexts.filter(t => t.id !== event.id)), 2000);
              });
              setCombatants({ hero, mob }); // Update state after calculation

              setTimeout(() => {
                  setHeroAnimation('idle');
                  setMobAnimation('idle');
              }, 600); // Defender animation duration
          }, 400); // Attacker animation halfway point
          isHeroTurnRef.current = true;
        }

        // Return the state immediately, animations and state updates will happen async
        return { hero, mob };
      });
    }, 3000);
    
    return () => clearInterval(combatInterval);
  }, []);

  // Mob death and respawn logic - separate from the main combat loop
  useEffect(() => {
    if (combatants.mob.hp <= 0) {
      setTimeout(() => {
        const droppedLoot = generateLoot(currentMobIndex, resourceMultiplier);
        
        // Award 1 dynamite on mob defeat
        droppedLoot.DYNAMITE = 1;

        const mobDisplayElement = document.querySelector('[data-mob-display="true"]');
        if (mobDisplayElement && Object.keys(droppedLoot).length > 0) {
            const startRect = mobDisplayElement.getBoundingClientRect();
            const newAnimations: LootAnimation[] = [];
            // FIX: Refactored to a forEach loop to avoid potential destructuring issues with some TypeScript compilers/configurations.
            Object.entries(droppedLoot).forEach(([resource, amount]) => {
                if (amount && amount > 0) {
                    const endElement = document.querySelector(`[data-resource-icon="${resource}"]`);
                    if (endElement) {
                        const endRect = endElement.getBoundingClientRect();
                        newAnimations.push({
                            id: Date.now() + Math.random(),
                            resource: resource as ResourceType,
                            startRect,
                            endRect,
                            amount
                        });
                    }
                }
            });
            if (newAnimations.length > 0) {
              setLootAnimations(prev => [...prev, ...newAnimations]);
            }
        }
        
        setResources(prevRes => {
          const newRes = { ...prevRes };
          for (const [resource, amount] of Object.entries(droppedLoot)) {
            if (amount && amount > 0) {
              newRes[resource as ResourceType] += amount;
            }
          }
          return newRes;
        });
  
        const nextMobIndex = Math.min(currentMobIndex + 1, MOBS.length - 1);
        setCurrentMobIndex(nextMobIndex);
        const nextMobData = MOBS[nextMobIndex];
        setCombatants(prev => ({...prev, mob: { ...nextMobData, hp: nextMobData.maxHp }}));
        isHeroTurnRef.current = true; // Hero always starts against a new mob
      }, 500);
    }
    
    if (combatants.hero.hp <= 0) {
      setTimeout(() => {
          setCombatants(prev => ({...prev, hero: {...prev.hero, hp: prev.hero.maxHp}}));
          isHeroTurnRef.current = true; // Hero always starts after respawn
      }, 500);
    }
  }, [combatants.hero.hp, combatants.mob.hp, currentMobIndex, resourceMultiplier]);

  // Load game data from localStorage
  useEffect(() => {
    const savedDataJSON = localStorage.getItem('mathMinerSaveData');
    if (savedDataJSON) {
      try {
        const savedData = JSON.parse(savedDataJSON);
        // Check for essential data; if missing, it's an invalid save.
        if (savedData.mineGrid && savedData.resources && typeof savedData.deepestRow === 'number') {
          setMineGrid(savedData.mineGrid);
          setResources(savedData.resources);
          setDeepestRow(savedData.deepestRow);
          if (savedData.equipmentLevels) {
            setEquipmentLevels(savedData.equipmentLevels);
          }
          if (typeof savedData.currentMobIndex === 'number') {
            const mobIndex = savedData.currentMobIndex;
            setCurrentMobIndex(mobIndex);
            setCombatants(prev => ({
                ...prev,
                mob: { ...MOBS[mobIndex], hp: MOBS[mobIndex].maxHp }
            }));
          }
          if (typeof savedData.digsSinceLastReward === 'number') {
            setDigsSinceLastReward(savedData.digsSinceLastReward);
          }
          if (typeof savedData.nextRewardDigCount === 'number') {
            setNextRewardDigCount(savedData.nextRewardDigCount);
          }
          if (typeof savedData.isTestingMode === 'boolean') {
            setIsTestingMode(savedData.isTestingMode);
          }
          if (typeof savedData.mathDifficulty === 'number') {
            setMathDifficulty(savedData.mathDifficulty);
          }
          if (typeof savedData.resourceMultiplier === 'number') {
            setResourceMultiplier(savedData.resourceMultiplier);
          }
        }
        // If save data is invalid or doesn't exist, the initial state generated by useState is used.
      } catch (error) {
        console.error("Failed to parse saved data, using default state.", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save game data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const gameState = {
        resources,
        mineGrid,
        deepestRow,
        equipmentLevels,
        currentMobIndex,
        digsSinceLastReward,
        nextRewardDigCount,
        isTestingMode,
        mathDifficulty,
        resourceMultiplier,
      };
      localStorage.setItem('mathMinerSaveData', JSON.stringify(gameState));
    }
  }, [resources, mineGrid, deepestRow, isLoaded, equipmentLevels, currentMobIndex, digsSinceLastReward, nextRewardDigCount, isTestingMode, mathDifficulty, resourceMultiplier]);

  const calculateAccessibleDepth = useCallback((grid: TileData[][]): number => {
    if (!grid || grid.length === 0) return 0;

    const rows = grid.length;
    const cols = grid[0].length;
    const queue: [number, number][] = [];
    const visited = new Set<string>();
    let maxDepth = 0;

    for (let c = 0; c < cols; c++) {
      if (grid[0][c].type === TileEnum.EMPTY) {
        const key = `0-${c}`;
        queue.push([0, c]);
        visited.add(key);
      }
    }

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      maxDepth = Math.max(maxDepth, r);

      const neighbors = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]];

      for (const [nr, nc] of neighbors) {
        const key = `${nr}-${nc}`;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(key) && grid[nr]?.[nc]?.type === TileEnum.EMPTY) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    return maxDepth;
  }, []);

  useEffect(() => {
    if (mineGrid.length > 0) {
      setAccessibleDepth(calculateAccessibleDepth(mineGrid));
    }
  }, [mineGrid, calculateAccessibleDepth]);

  const handleDig = (row: number, col: number) => {
    const tile = mineGrid[row][col];
    if (tile.type === TileEnum.EASTER_EGG) {
      handleEasterEgg(row, col);
    } else {
      const problem = generateProblem(row, mathDifficulty);
      setModalState({ problem, row, col });
    }
  };

  const handleEasterEgg = (row: number, col: number) => {
    const newGrid = mineGrid.map(r => r.slice());
    newGrid[row][col] = { ...newGrid[row][col], type: TileEnum.EMPTY };
    setMineGrid(newGrid);

    if (row > deepestRow) setDeepestRow(row);

    const rewardType = Math.random() > 0.5 ? ResourceEnum.GOLD : ResourceEnum.SILVER;
    let amount = rewardType === ResourceEnum.GOLD ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 30) + 20;
    amount = Math.round(amount * resourceMultiplier);
    
    setResources(prev => ({ ...prev, [rewardType]: prev[rewardType] + amount }));
    setRewardMessage(`Surprise! You've found a hidden treasure! You get ${amount} ${rewardType}!`);
    
    // Trigger animation for Easter Egg loot
    const mineContainer = mineContainerRef.current;
    if (mineContainer) {
      const mineRect = mineContainer.getBoundingClientRect();
      const startX = mineRect.left + (col + 0.5) * TILE_SIZE_PX;
      const startY = mineRect.top + (row + 0.5) * TILE_SIZE_PX - mineContainer.scrollTop;
      const startRect = { x: startX, y: startY, width: 0, height: 0, top: startY, left: startX, bottom: startY, right: startX, toJSON: () => {} } as DOMRect;
      
      const endElement = document.querySelector(`[data-resource-icon="${rewardType}"]`);
      if (endElement) {
        const endRect = endElement.getBoundingClientRect();
        const animation: LootAnimation = {
          id: Date.now(),
          resource: rewardType,
          startRect,
          endRect,
          amount,
        };
        setLootAnimations(prev => [...prev, animation]);
      }
    }
  };

  const handleFreeUpgrade = () => {
    const upgradableSlots = (Object.keys(equipmentLevels) as EquipmentSlot[]).filter(
        slot => equipmentLevels[slot] < 30
    );

    if (upgradableSlots.length === 0) return; // All maxed out

    const randomSlot = upgradableSlots[Math.floor(Math.random() * upgradableSlots.length)];
    
    // Use functional update to get the latest state
    setEquipmentLevels(prevLevels => {
        const newLevel = prevLevels[randomSlot] + 1;
        const upgradedItem = EQUIPMENT_DATA[randomSlot].find(item => item.level === newLevel);
        
        if (upgradedItem) {
            const statsString = Object.entries(upgradedItem.stats)
                .map(([key, val]) => formatStatForModal(key, val!))
                .join(' / ');
            
            setFreeUpgradeInfo({ name: upgradedItem.name, stats: statsString });
        }

        return { ...prevLevels, [randomSlot]: newLevel };
    });
};

  const handleSolveProblem = (isCorrect: boolean, useDynamite: boolean) => {
    if (!modalState) return;
    const { row, col } = modalState;

    setModalState(null); // Close modal immediately

    if (isCorrect) {
      const isDynamiteDig = useDynamite && resources.DYNAMITE > 0;
      setDiggingAnimationTarget({ row, col, isDynamite: isDynamiteDig });

      // Delay game state update to allow animation to play
      setTimeout(() => {
        const newGrid = mineGrid.map(r => r.slice());
        const lootGained: Partial<Record<ResourceType, number>> = {};
        let deepestDugRow = row;

        const digTile = (r: number, c: number) => {
            if (r < 0 || r >= TILE_ROWS || c < 0 || c >= TILE_COLS) return;
            if (newGrid[r][c].type === TileEnum.EMPTY) return;

            const dugTile = newGrid[r][c];
            newGrid[r][c] = { ...dugTile, type: TileEnum.EMPTY };
            deepestDugRow = Math.max(deepestDugRow, r);

            switch(dugTile.type) {
                case TileEnum.DIRT: lootGained.DIRT = (lootGained.DIRT || 0) + 1; break;
                case TileEnum.STONE: lootGained.STONE = (lootGained.STONE || 0) + 1; break;
                case TileEnum.MINERAL: lootGained.MINERAL = (lootGained.MINERAL || 0) + 5; break;
                case TileEnum.SILVER_ORE: lootGained.SILVER = (lootGained.SILVER || 0) + Math.floor(Math.random() * 3) + 1; break;
                case TileEnum.GOLD_ORE: lootGained.GOLD = (lootGained.GOLD || 0) + Math.floor(Math.random() * 2) + 1; break;
                case TileEnum.CHEST:
                    const problemDifficulty = generateProblem(r, mathDifficulty).difficulty;
                    lootGained.SILVER = (lootGained.SILVER || 0) + Math.floor(Math.random() * 20) + 10;
                    const goldReward = Math.ceil((problemDifficulty / 2) + Math.random() * problemDifficulty);
                    lootGained.GOLD = (lootGained.GOLD || 0) + goldReward;
                    break;
            }
        };

        if (isDynamiteDig) {
            for (let rOffset = -1; rOffset <= 1; rOffset++) {
                for (let cOffset = -1; cOffset <= 1; cOffset++) {
                    digTile(row + rOffset, col + cOffset);
                }
            }
        } else {
            digTile(row, col);
        }

        if (deepestDugRow > deepestRow) {
            setDeepestRow(deepestDugRow);
        }

        // Apply multiplier
        for (const key in lootGained) {
            const resource = key as ResourceType;
            lootGained[resource] = Math.round((lootGained[resource] || 0) * resourceMultiplier);
        }

        setResources(prev => {
            const newResources = {...prev};
            for (const [resource, amount] of Object.entries(lootGained)) {
                newResources[resource as ResourceType] = (newResources[resource as ResourceType] || 0) + (amount as number);
            }
            if(isDynamiteDig) {
                newResources.DYNAMITE -= 1;
            }
            return newResources;
        });

        // Trigger animations for the gained loot
        const mineContainer = mineContainerRef.current;
        if (mineContainer && Object.keys(lootGained).length > 0) {
          const mineRect = mineContainer.getBoundingClientRect();
          const startX = mineRect.left + (col + 0.5) * TILE_SIZE_PX;
          const startY = mineRect.top + (row + 0.5) * TILE_SIZE_PX - mineContainer.scrollTop;
          const startRect = { x: startX, y: startY, width: 0, height: 0, top: startY, left: startX, bottom: startY, right: startX, toJSON: () => {} } as DOMRect;
          
          const newAnimations: LootAnimation[] = [];
          for (const [resource, amount] of Object.entries(lootGained)) {
            if (amount && amount > 0) {
              const endElement = document.querySelector(`[data-resource-icon="${resource}"]`);
              if (endElement) {
                const endRect = endElement.getBoundingClientRect();
                newAnimations.push({
                  id: Date.now() + Math.random(),
                  resource: resource as ResourceType,
                  startRect,
                  endRect,
                  amount,
                });
              }
            }
          }
          if (newAnimations.length > 0) {
            setLootAnimations(prev => [...prev, ...newAnimations]);
          }
        }
        
        const newDigCount = digsSinceLastReward + 1;
        setDigsSinceLastReward(newDigCount);

        if (newDigCount >= nextRewardDigCount) {
          handleFreeUpgrade();
          setDigsSinceLastReward(0);
          setNextRewardDigCount(Math.floor(Math.random() * 11) + 20);
        }
        
        setMineGrid(newGrid);
        setDiggingAnimationTarget(null); // Clear animation target
      }, 600); // Duration matches animation
    }
  };

  const handleUpgradeEquipment = (slot: EquipmentSlot) => {
    const currentLevel = equipmentLevels[slot];
    const nextLevel = currentLevel + 1;
    const upgradeData = EQUIPMENT_DATA[slot].find(item => item.level === nextLevel);

    if (!upgradeData) return;

    const canAfford = isTestingMode || Object.entries(upgradeData.cost).every(([resource, cost]) => {
      return resources[resource as ResourceType] >= (cost as number);
    });
    
    if (canAfford) {
      if (!isTestingMode) {
          setResources(prev => {
            const newResources = { ...prev };
            for (const [resource, cost] of Object.entries(upgradeData.cost)) {
              newResources[resource as ResourceType] -= (cost as number);
            }
            return newResources;
          });
      }
      setEquipmentLevels(prev => ({ ...prev, [slot]: nextLevel }));
    }
  };
  
  const handleResetGame = () => {
    localStorage.removeItem('mathMinerSaveData');
    window.location.reload();
  };

  const handleLootAnimationEnd = (id: number, resource: ResourceType) => {
    setLootAnimations(prev => prev.filter(anim => anim.id !== id));
    
    setBlinkingResources(prev => ({ ...prev, [resource]: true }));
    setTimeout(() => {
        setBlinkingResources(prev => ({ ...prev, [resource]: false }));
    }, 400);
  };

  return (
    <div className="h-screen w-screen flex flex-col font-mono bg-[#3a2d27]">
      <LootAnimationLayer animations={lootAnimations} onAnimationEnd={handleLootAnimationEnd} />
      <TopBar 
        resources={resources} 
        accessibleDepth={accessibleDepth} 
        hero={combatants.hero}
        mob={combatants.mob}
        floatingTexts={floatingTexts}
        onShopOpen={() => setIsShopOpen(true)}
        onBestiaryOpen={() => setIsBestiaryOpen(true)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        equipmentLevels={equipmentLevels}
        heroAnimation={heroAnimation}
        mobAnimation={mobAnimation}
        blinkingResources={blinkingResources}
      />
      <Mine 
        ref={mineContainerRef}
        grid={mineGrid} 
        onDig={handleDig} 
        deepestRow={deepestRow} 
        diggingAnimationTarget={diggingAnimationTarget}
      />
      {modalState && (
        <MathModal 
          problem={modalState.problem} 
          onSolve={handleSolveProblem}
          dynamiteCount={resources.DYNAMITE}
        />
      )}
      {rewardMessage && (
        <RewardModal
            title="Treasure Found!"
            message={rewardMessage}
            onClose={() => setRewardMessage(null)}
        />
      )}
      {isShopOpen && (
        <ShopModal
          onClose={() => setIsShopOpen(false)}
          onUpgrade={handleUpgradeEquipment}
          equipmentLevels={equipmentLevels}
          resources={resources}
          isTestingMode={isTestingMode}
        />
      )}
       {freeUpgradeInfo && (
        <FreeUpgradeModal
            item={freeUpgradeInfo}
            onClose={() => setFreeUpgradeInfo(null)}
        />
      )}
      {isBestiaryOpen && (
        <BestiaryModal
          isOpen={isBestiaryOpen}
          onClose={() => setIsBestiaryOpen(false)}
          allMobs={MOBS}
          highestMobIndexEncountered={currentMobIndex}
        />
      )}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isTestingMode={isTestingMode}
        onToggleTestingMode={() => setIsTestingMode(prev => !prev)}
        onResetGame={() => setIsResetConfirmationOpen(true)}
        mathDifficulty={mathDifficulty}
        onDifficultyChange={setMathDifficulty}
        resourceMultiplier={resourceMultiplier}
        onResourceMultiplierChange={setResourceMultiplier}
      />
      <ConfirmationModal
        isOpen={isResetConfirmationOpen}
        onCancel={() => setIsResetConfirmationOpen(false)}
        onConfirm={handleResetGame}
        title="Reset Game?"
        message="Are you sure? All progress, including resources and equipment, will be permanently lost."
      />
    </div>
  );
};

export default App;

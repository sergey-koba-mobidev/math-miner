
import { useState, useEffect, useCallback, useRef } from 'react';
import { initialEquipment, TILE_SIZE_PX, TILE_ROWS, TILE_COLS } from '../constants';
import { generateProblem } from '../services/mathService';
import { Language, t, tEquip, tMob } from '../services/translation';
import type { TileData, ResourceType, Problem, TileType, CharacterStats, FloatingText, EquipmentLevels, EquipmentSlot, AnimationState, LootAnimation } from '../types';
import { TileType as TileEnum, ResourceType as ResourceEnum } from '../types';
import { EQUIPMENT_DATA } from '../data/equipment';
import { MOBS } from '../data/mobs';
import { generateInitialMine } from '../services/mineService';
import { formatStatForModal } from '../utils/formatters';

const baseHeroStats: Omit<CharacterStats, 'hp' | 'maxHp' | 'name'> = {
  attack: 5,
  defense: 2,
  evasion: 1,
  critChance: 5,
};

interface ModalState {
  problem: Problem;
  row: number;
  col: number;
}


export const useGame = () => {
    // === STATE ===
    const [resources, setResources] = useState<Record<ResourceType, number>>({
        DIRT: 0, STONE: 0, MINERAL: 0, SILVER: 0, GOLD: 0, DYNAMITE: 0,
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
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [isTestingMode, setIsTestingMode] = useState(false);
    const [mathDifficulty, setMathDifficulty] = useState(3);
    const [resourceMultiplier, setResourceMultiplier] = useState(1);
    const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
    const [isRegenerateConfirmationOpen, setIsRegenerateConfirmationOpen] = useState(false);
    const [equipmentLevels, setEquipmentLevels] = useState<EquipmentLevels>(initialEquipment);
    const [currentMobIndex, setCurrentMobIndex] = useState(0);
    const [digsSinceLastReward, setDigsSinceLastReward] = useState(0);
    const [nextRewardDigCount, setNextRewardDigCount] = useState(() => Math.floor(Math.random() * 11) + 20); // 20-30
    const [freeUpgradeInfo, setFreeUpgradeInfo] = useState<{ name: string; stats: string } | null>(null);
    const [diggingAnimationTarget, setDiggingAnimationTarget] = useState<{ row: number; col: number; isDynamite: boolean } | null>(null);
    const [heroAnimation, setHeroAnimation] = useState<AnimationState>('idle');
    const [mobAnimation, setMobAnimation] = useState<AnimationState>('idle');
    const [lootAnimations, setLootAnimations] = useState<LootAnimation[]>([]);
    const [blinkingResources, setBlinkingResources] = useState<Partial<Record<ResourceType, boolean>>>({});
    const [language, setLanguage] = useState<Language>('en');
    const [combatants, setCombatants] = useState<{ hero: CharacterStats; mob: CharacterStats }>({
        hero: { name: 'Hero', hp: 100, maxHp: 100, ...baseHeroStats },
        // FIX: Casting nameKey to 'any' to satisfy the type constraints of tMob, which expects a specific literal type.
        mob: { ...MOBS[0], hp: MOBS[0].maxHp, name: tMob(MOBS[0].nameKey as any, language) },
    });

    // === REFS ===
    const isHeroTurnRef = useRef(true);
    const mineContainerRef = useRef<HTMLDivElement>(null);

    // === HELPER FUNCTIONS ===
    const generateLoot = useCallback((mobIndex: number, multiplier: number): Partial<Record<ResourceType, number>> => {
        const loot: Partial<Record<ResourceType, number>> = {};
        const difficulty = mobIndex + 1;
        loot.DIRT = Math.round((5 + Math.floor(Math.random() * difficulty * 0.5)) * multiplier);
        loot.STONE = Math.round((3 + Math.floor(Math.random() * difficulty * 0.4)) * multiplier);
        if (difficulty > 10 && Math.random() < Math.min(0.9, 0.1 + difficulty * 0.001)) {
            loot.MINERAL = Math.round((1 + Math.floor(Math.random() * difficulty * 0.1)) * multiplier);
        }
        if (difficulty > 20 && Math.random() < Math.min(0.75, 0.05 + (difficulty - 20) * 0.001)) {
            loot.SILVER = Math.round((1 + Math.floor(Math.random() * difficulty * 0.05)) * multiplier);
        }
        if (difficulty > 50 && Math.random() < Math.min(0.5, 0.01 + (difficulty - 50) * 0.0005)) {
            loot.GOLD = Math.round((1 + Math.floor(Math.random() * difficulty * 0.025)) * multiplier);
        }
        return loot;
    }, []);

    // === EFFECTS ===

    // Recalculate hero stats when equipment changes
    useEffect(() => {
        const newStats = {
            maxHp: 100, attack: baseHeroStats.attack, defense: baseHeroStats.defense,
            evasion: baseHeroStats.evasion, critChance: baseHeroStats.critChance,
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
            hero: { ...prev.hero, ...newStats, name: t('hero', language), hp: Math.min(prev.hero.hp, newStats.maxHp) },
        }));
    }, [equipmentLevels, language]);

    // Update mob name when language changes
    useEffect(() => {
        const currentMob = MOBS[currentMobIndex];
        // FIX: Casting nameKey to 'any' to satisfy the type constraints of tMob.
        let name = tMob(currentMob.nameKey as any, language);
        if (currentMob.nameKey.startsWith('endless_')) {
            const baseNameKey = currentMob.nameKey.replace('endless_', '');
            // FIX: Casting the derived baseNameKey to 'any' for tMob.
            const baseName = tMob(baseNameKey as any, language);
            name = `${t('endless', language)} ${baseName}`;
        }
        setCombatants(prev => ({ ...prev, mob: { ...prev.mob, name } }));
    }, [currentMobIndex, language]);

    // Turn-based Combat Loop
    useEffect(() => {
        const combatInterval = setInterval(() => {
            setCombatants(prev => {
                if (prev.hero.hp <= 0 || prev.mob.hp <= 0) return prev;

                let { hero, mob } = { ...prev };
                
                const createFloatingText = (damage: number, target: 'hero' | 'mob', isCrit: boolean) => ({
                    id: Date.now() + Math.random(),
                    text: isCrit ? `${damage}!` : `${damage}`,
                    target,
                    type: isCrit ? 'crit' : 'damage',
                } as FloatingText);

                if (isHeroTurnRef.current) {
                    setHeroAnimation('attacking');
                    setTimeout(() => {
                        const newEvents: FloatingText[] = [];
                        if (Math.random() * 100 < mob.evasion) {
                            newEvents.push({ id: Date.now() + Math.random(), text: 'Miss', target: 'mob', type: 'miss' });
                            setMobAnimation('missed');
                        } else {
                            const isCrit = Math.random() * 100 < hero.critChance;
                            const attackRandomness = Math.floor(Math.random() * 3) - 1;
                            const baseAttack = Math.max(1, hero.attack + attackRandomness);
                            const attackPower = isCrit ? baseAttack * 1.5 : baseAttack;
                            const damage = Math.max(1, Math.floor(attackPower - mob.defense));
                            mob = { ...mob, hp: Math.max(0, mob.hp - damage) };
                            newEvents.push(createFloatingText(damage, 'mob', isCrit));
                            setMobAnimation('taking-damage');
                        }
                        setFloatingTexts(prevTexts => [...prevTexts, ...newEvents]);
                        newEvents.forEach(event => setTimeout(() => setFloatingTexts(prevTexts => prevTexts.filter(t => t.id !== event.id)), 2000));
                        setCombatants({ hero, mob });
                        setTimeout(() => { setHeroAnimation('idle'); setMobAnimation('idle'); }, 600);
                    }, 400);
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
                            const attackRandomness = Math.floor(Math.random() * 3) - 1;
                            const baseAttack = Math.max(1, mob.attack + attackRandomness);
                            const attackPower = isCrit ? baseAttack * 1.5 : baseAttack;
                            const damage = Math.max(1, Math.floor(attackPower - hero.defense));
                            hero = { ...hero, hp: Math.max(0, hero.hp - damage) };
                            newEvents.push(createFloatingText(damage, 'hero', isCrit));
                            setHeroAnimation('taking-damage');
                        }
                        setFloatingTexts(prevTexts => [...prevTexts, ...newEvents]);
                        newEvents.forEach(event => setTimeout(() => setFloatingTexts(prevTexts => prevTexts.filter(t => t.id !== event.id)), 2000));
                        setCombatants({ hero, mob });
                        setTimeout(() => { setHeroAnimation('idle'); setMobAnimation('idle'); }, 600);
                    }, 400);
                    isHeroTurnRef.current = true;
                }
                return { hero, mob };
            });
        }, 3000);
        return () => clearInterval(combatInterval);
    }, []);

    // Mob death and respawn logic
    useEffect(() => {
        if (combatants.mob.hp <= 0) {
            setTimeout(() => {
                const droppedLoot = generateLoot(currentMobIndex, resourceMultiplier);
                droppedLoot.DYNAMITE = (droppedLoot.DYNAMITE || 0) + 1;

                const mobDisplayElement = document.querySelector('[data-mob-display="true"]');
                if (mobDisplayElement && Object.keys(droppedLoot).length > 0) {
                    const startRect = mobDisplayElement.getBoundingClientRect();
                    const newAnimations: LootAnimation[] = [];
                    for (const [resource, amount] of Object.entries(droppedLoot)) {
                        // FIX: Added a type guard to ensure 'amount' is a number, addressing potential 'unknown' type issues and a misleading destructuring error.
                        if (typeof amount === 'number' && amount > 0) {
                            const endElement = document.querySelector(`[data-resource-icon="${resource}"]`);
                            if (endElement) {
                                newAnimations.push({
                                    id: Date.now() + Math.random(), resource: resource as ResourceType,
                                    startRect, endRect: endElement.getBoundingClientRect(), amount
                                });
                            }
                        }
                    }
                    if (newAnimations.length > 0) setLootAnimations(prev => [...prev, ...newAnimations]);
                }
                
                setResources(prevRes => {
                    const newRes = { ...prevRes };
                    for (const [resource, amount] of Object.entries(droppedLoot)) {
                        // FIX: Added a type guard for 'amount' to prevent type errors during resource updates.
                        if (typeof amount === 'number' && amount > 0) newRes[resource as ResourceType] = (newRes[resource as ResourceType] || 0) + amount;
                    }
                    return newRes;
                });
        
                const nextMobIndex = Math.min(currentMobIndex + 1, MOBS.length - 1);
                setCurrentMobIndex(nextMobIndex);
                const nextMobData = MOBS[nextMobIndex];
                // FIX: Casting nameKey to 'any' to satisfy the type constraints of tMob.
                let nextMobName = tMob(nextMobData.nameKey as any, language);
                if (nextMobData.nameKey.startsWith('endless_')) {
                    const baseNameKey = nextMobData.nameKey.replace('endless_', '');
                    // FIX: Casting the derived baseNameKey to 'any' for tMob.
                    const baseName = tMob(baseNameKey as any, language);
                    nextMobName = `${t('endless', language)} ${baseName}`;
                }

                setCombatants(prev => ({...prev, mob: { ...nextMobData, hp: nextMobData.maxHp, name: nextMobName }}));
                isHeroTurnRef.current = true;
            }, 500);
        }
        
        if (combatants.hero.hp <= 0) {
            setTimeout(() => {
                setCombatants(prev => ({ ...prev, hero: {...prev.hero, hp: prev.hero.maxHp}, mob: {...prev.mob, hp: prev.mob.maxHp} }));
                isHeroTurnRef.current = true;
            }, 500);
        }
    }, [combatants.hero.hp, combatants.mob.hp, currentMobIndex, resourceMultiplier, language, generateLoot]);

    // Load game data from localStorage
    useEffect(() => {
        const savedDataJSON = localStorage.getItem('mathMinerSaveData');
        if (savedDataJSON) {
            try {
                const savedData = JSON.parse(savedDataJSON);
                if (savedData.mineGrid && savedData.resources && typeof savedData.deepestRow === 'number') {
                    setMineGrid(savedData.mineGrid);
                    setResources(savedData.resources);
                    setDeepestRow(savedData.deepestRow);
                    if (savedData.equipmentLevels) setEquipmentLevels(savedData.equipmentLevels);
                    if (typeof savedData.currentMobIndex === 'number') {
                        const mobIndex = savedData.currentMobIndex;
                        const mobData = MOBS[mobIndex];
                        // FIX: Casting nameKey to 'any' to satisfy the type constraints of tMob.
                        let mobName = tMob(mobData.nameKey as any, savedData.language || 'en');
                        if (mobData.nameKey.startsWith('endless_')) {
                            const baseNameKey = mobData.nameKey.replace('endless_', '');
                            // FIX: Casting the derived baseNameKey to 'any' for tMob.
                            const baseName = tMob(baseNameKey as any, savedData.language || 'en');
                            mobName = `${t('endless', savedData.language || 'en')} ${baseName}`;
                        }
                        setCurrentMobIndex(mobIndex);
                        setCombatants(prev => ({ ...prev, mob: { ...MOBS[mobIndex], hp: MOBS[mobIndex].maxHp, name: mobName } }));
                    }
                    if (typeof savedData.digsSinceLastReward === 'number') setDigsSinceLastReward(savedData.digsSinceLastReward);
                    if (typeof savedData.nextRewardDigCount === 'number') setNextRewardDigCount(savedData.nextRewardDigCount);
                    if (typeof savedData.isTestingMode === 'boolean') setIsTestingMode(savedData.isTestingMode);
                    if (typeof savedData.mathDifficulty === 'number') setMathDifficulty(savedData.mathDifficulty);
                    if (typeof savedData.resourceMultiplier === 'number') setResourceMultiplier(savedData.resourceMultiplier);
                    if (savedData.language) setLanguage(savedData.language);
                }
            } catch (error) { console.error("Failed to parse saved data, using default state.", error); }
        }
        setIsLoaded(true);
    }, []);

    // Save game data to localStorage
    useEffect(() => {
        if (isLoaded) {
            const gameState = {
                resources, mineGrid, deepestRow, equipmentLevels, currentMobIndex,
                digsSinceLastReward, nextRewardDigCount, isTestingMode, mathDifficulty, resourceMultiplier, language,
            };
            localStorage.setItem('mathMinerSaveData', JSON.stringify(gameState));
        }
    }, [resources, mineGrid, deepestRow, isLoaded, equipmentLevels, currentMobIndex, digsSinceLastReward, nextRewardDigCount, isTestingMode, mathDifficulty, resourceMultiplier, language]);

    // Calculate accessible depth
    useEffect(() => {
        if (mineGrid.length > 0) {
            const calculateAccessibleDepth = (grid: TileData[][]): number => {
                if (!grid || grid.length === 0) return 0;
                const queue: [number, number][] = [];
                const visited = new Set<string>();
                let maxDepth = 0;
                for (let c = 0; c < TILE_COLS; c++) {
                    if (grid[0][c].type === TileEnum.EMPTY) {
                        queue.push([0, c]);
                        visited.add(`0-${c}`);
                    }
                }
                while (queue.length > 0) {
                    const [r, c] = queue.shift()!;
                    maxDepth = Math.max(maxDepth, r);
                    const neighbors = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]];
                    for (const [nr, nc] of neighbors) {
                        const key = `${nr}-${nc}`;
                        if (nr >= 0 && nr < TILE_ROWS && nc >= 0 && nc < TILE_COLS && !visited.has(key) && grid[nr]?.[nc]?.type === TileEnum.EMPTY) {
                            visited.add(key);
                            queue.push([nr, nc]);
                        }
                    }
                }
                return maxDepth;
            };
            setAccessibleDepth(calculateAccessibleDepth(mineGrid));
        }
    }, [mineGrid]);
    
    // === HANDLERS ===
    
    const handleFreeUpgrade = useCallback(() => {
        const upgradableSlots = (Object.keys(equipmentLevels) as EquipmentSlot[]).filter(slot => equipmentLevels[slot] < 30);
        if (upgradableSlots.length === 0) return;
        const randomSlot = upgradableSlots[Math.floor(Math.random() * upgradableSlots.length)];
        
        setEquipmentLevels(prevLevels => {
            const newLevel = prevLevels[randomSlot] + 1;
            const upgradedItem = EQUIPMENT_DATA[randomSlot].find(item => item.level === newLevel);
            if (upgradedItem) {
                const statsString = Object.entries(upgradedItem.stats).map(([key, val]) => formatStatForModal(key, val!)).join(' / ');
                // FIX: Casting nameKey to 'any' to satisfy the type constraints of tEquip.
                setFreeUpgradeInfo({ name: tEquip(upgradedItem.nameKey as any, language), stats: statsString });
            }
            return { ...prevLevels, [randomSlot]: newLevel };
        });
    }, [equipmentLevels, language]);
    
    const handleEasterEgg = useCallback((row: number, col: number) => {
        const newGrid = mineGrid.map(r => r.slice());
        newGrid[row][col] = { ...newGrid[row][col], type: TileEnum.EMPTY };
        setMineGrid(newGrid);

        if (row > deepestRow) setDeepestRow(row);

        const rewardType = Math.random() > 0.5 ? ResourceEnum.GOLD : ResourceEnum.SILVER;
        let amount = Math.round((rewardType === ResourceEnum.GOLD ? rand(5, 20) : rand(20, 50)) * resourceMultiplier);
        
        setResources(prev => ({ ...prev, [rewardType]: prev[rewardType] + amount }));
        setRewardMessage(t('easterEggMessage', language, { amount, resource: rewardType }));
        
        const mineContainer = mineContainerRef.current;
        if (mineContainer) {
            const mineRect = mineContainer.getBoundingClientRect();
            const startX = mineRect.left + (col + 0.5) * TILE_SIZE_PX;
            const startY = mineRect.top + (row + 0.5) * TILE_SIZE_PX - mineContainer.scrollTop;
            const startRect = { x: startX, y: startY, width: 0, height: 0, top: startY, left: startX, bottom: startY, right: startX, toJSON: () => {} } as DOMRect;
            const endElement = document.querySelector(`[data-resource-icon="${rewardType}"]`);
            if (endElement) {
                setLootAnimations(prev => [...prev, { id: Date.now(), resource: rewardType, startRect, endRect: endElement.getBoundingClientRect(), amount }]);
            }
        }
    }, [mineGrid, deepestRow, resourceMultiplier, language]);

    const handleDig = useCallback((row: number, col: number) => {
        const tile = mineGrid[row][col];
        if (tile.type === TileEnum.EASTER_EGG) {
            handleEasterEgg(row, col);
        } else {
            const problem = generateProblem(row, mathDifficulty);
            setModalState({ problem, row, col });
        }
    }, [mineGrid, mathDifficulty, handleEasterEgg]);

    const handleSolveProblem = useCallback((isCorrect: boolean, useDynamite: boolean) => {
        if (!modalState) return;
        const { row, col } = modalState;
        setModalState(null);

        if (isCorrect) {
            const isDynamiteDig = useDynamite && resources.DYNAMITE > 0;
            setDiggingAnimationTarget({ row, col, isDynamite: isDynamiteDig });

            setTimeout(() => {
                const newGrid = mineGrid.map(r => r.slice());
                const lootGained: Partial<Record<ResourceType, number>> = {};
                let deepestDugRow = row;
                let tilesDugCount = 0;

                const digTile = (r: number, c: number): boolean => {
                    if (r < 0 || r >= TILE_ROWS || c < 0 || c >= TILE_COLS || newGrid[r][c].type === TileEnum.EMPTY) return false;
                    const dugTile = newGrid[r][c];
                    newGrid[r][c] = { ...dugTile, type: TileEnum.EMPTY };
                    deepestDugRow = Math.max(deepestDugRow, r);
                    switch(dugTile.type) {
                        case TileEnum.DIRT: lootGained.DIRT = (lootGained.DIRT || 0) + 1; break;
                        case TileEnum.STONE: lootGained.STONE = (lootGained.STONE || 0) + 1; break;
                        case TileEnum.MINERAL: lootGained.MINERAL = (lootGained.MINERAL || 0) + 5; break;
                        case TileEnum.SILVER_ORE: lootGained.SILVER = (lootGained.SILVER || 0) + rand(1, 3); break;
                        case TileEnum.GOLD_ORE: lootGained.GOLD = (lootGained.GOLD || 0) + rand(1, 2); break;
                        case TileEnum.CHEST:
                            const problemDifficulty = generateProblem(r, mathDifficulty).difficulty;
                            lootGained.SILVER = (lootGained.SILVER || 0) + rand(10, 30);
                            lootGained.GOLD = (lootGained.GOLD || 0) + Math.ceil((problemDifficulty / 2) + Math.random() * problemDifficulty);
                            break;
                    }
                    return true;
                };

                if (isDynamiteDig) {
                    for (let rOffset = -1; rOffset <= 1; rOffset++) for (let cOffset = -1; cOffset <= 1; cOffset++) if(digTile(row + rOffset, col + cOffset)) tilesDugCount++;
                } else {
                    if(digTile(row, col)) tilesDugCount++;
                }

                // FIX: Add a type guard to prevent comparing 'unknown' with 'number'. This seems to be a strange TS inference issue.
                if (typeof deepestDugRow === 'number' && deepestDugRow > deepestRow) setDeepestRow(deepestDugRow);

                for (const key in lootGained) lootGained[key as ResourceType] = Math.round((lootGained[key as ResourceType] || 0) * resourceMultiplier);

                setResources(prev => {
                    const newResources = {...prev};
                    // FIX: Added type guard for 'amount' to fix 'unknown' type error.
                    for (const [res, amount] of Object.entries(lootGained)) {
                        if (typeof amount === 'number') {
                            newResources[res as ResourceType] = (newResources[res as ResourceType] || 0) + amount;
                        }
                    }
                    if(isDynamiteDig) newResources.DYNAMITE -= 1;
                    return newResources;
                });
                
                const mineContainer = mineContainerRef.current;
                if (mineContainer && Object.keys(lootGained).length > 0) {
                    const mineRect = mineContainer.getBoundingClientRect();
                    const startX = mineRect.left + (col + 0.5) * TILE_SIZE_PX;
                    const startY = mineRect.top + (row + 0.5) * TILE_SIZE_PX - mineContainer.scrollTop;
                    const startRect = { x: startX, y: startY, width: 0, height: 0, top: startY, left: startX, bottom: startY, right: startX, toJSON: () => {} } as DOMRect;
                    const newAnimations: LootAnimation[] = [];
                    for (const [resource, amount] of Object.entries(lootGained)) {
                        // FIX: Add type guard for 'amount' to fix 'unknown' type error.
                        if (typeof amount === 'number' && amount > 0) {
                            const endElement = document.querySelector(`[data-resource-icon="${resource}"]`);
                            if (endElement) newAnimations.push({ id: Date.now() + Math.random(), resource: resource as ResourceType, startRect, endRect: endElement.getBoundingClientRect(), amount });
                        }
                    }
                    if (newAnimations.length > 0) setLootAnimations(prev => [...prev, ...newAnimations]);
                }
                
                if (tilesDugCount > 0) {
                    setDigsSinceLastReward(prevDigs => {
                        let newDigCount = prevDigs + tilesDugCount;
                        if (newDigCount >= nextRewardDigCount) {
                            handleFreeUpgrade();
                            const newGoal = rand(20, 30);
                            setNextRewardDigCount(newGoal);
                            return newDigCount - nextRewardDigCount;
                        }
                        return newDigCount;
                    });
                }
                setMineGrid(newGrid);
                setDiggingAnimationTarget(null);
            }, 600);
        }
    }, [modalState, resources.DYNAMITE, mineGrid, mathDifficulty, deepestRow, resourceMultiplier, nextRewardDigCount, handleFreeUpgrade]);

    const handleUpgradeEquipment = useCallback((slot: EquipmentSlot) => {
        const currentLevel = equipmentLevels[slot];
        const upgradeData = EQUIPMENT_DATA[slot].find(item => item.level === currentLevel + 1);
        if (!upgradeData) return;

        const canAfford = isTestingMode || Object.entries(upgradeData.cost).every(([res, cost]) => resources[res as ResourceType] >= (cost as number));
        
        if (canAfford) {
            if (!isTestingMode) {
                setResources(prev => {
                    const newResources = { ...prev };
                    for (const [res, cost] of Object.entries(upgradeData.cost)) newResources[res as ResourceType] -= (cost as number);
                    return newResources;
                });
            }
            setEquipmentLevels(prev => ({ ...prev, [slot]: currentLevel + 1 }));
        }
    }, [equipmentLevels, isTestingMode, resources]);
  
    const handleResetGame = () => {
        localStorage.removeItem('mathMinerSaveData');
        window.location.reload();
    };

    const handleRegenerateMine = () => {
        setMineGrid(generateInitialMine());
        setDeepestRow(0);
        setIsRegenerateConfirmationOpen(false);
    };

    const handleLootAnimationEnd = (id: number, resource: ResourceType) => {
        setLootAnimations(prev => prev.filter(anim => anim.id !== id));
        setBlinkingResources(prev => ({ ...prev, [resource]: true }));
        setTimeout(() => setBlinkingResources(prev => ({ ...prev, [resource]: false })), 400);
    };

    return {
        // State & Refs
        mineContainerRef, lootAnimations, resources, accessibleDepth, combatants, floatingTexts,
        equipmentLevels, heroAnimation, mobAnimation, blinkingResources, language, mineGrid,
        deepestRow, diggingAnimationTarget, modalState, rewardMessage, isShopOpen, freeUpgradeInfo,
        isBestiaryOpen, currentMobIndex, isSettingsOpen, isTestingMode, mathDifficulty,
        resourceMultiplier, isTutorialOpen, isResetConfirmationOpen, isRegenerateConfirmationOpen,
        // Handlers
        handleLootAnimationEnd, setIsShopOpen, setIsBestiaryOpen, setIsSettingsOpen, handleSolveProblem,
        setRewardMessage, handleUpgradeEquipment, setFreeUpgradeInfo, setIsTutorialOpen,
        setIsResetConfirmationOpen, handleResetGame, setIsTestingMode, setMathDifficulty,
        setResourceMultiplier, setLanguage, handleDig, setIsRegenerateConfirmationOpen, handleRegenerateMine,
    };
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameState } from './useGameState';
import { useModalState, MathModalState } from './useModalState';
import { useCombatSystem } from './useCombatSystem';
import { generateProblem } from '../services/mathService';
import { t, tEquip } from '../services/translation';
import type { TileData, ResourceType, EquipmentSlot, LootAnimation, FloatingText } from '../types';
import { TileType as TileEnum, ResourceType as ResourceEnum } from '../types';
import { TILE_SIZE_PX, TILE_ROWS, TILE_COLS } from '../constants';
import { EQUIPMENT_DATA } from '../data/equipment';
import { formatStatForModal } from '../utils/formatters';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const useGameLoop = () => {
    const gameState = useGameState();
    const modals = useModalState();
    const mineContainerRef = useRef<HTMLDivElement>(null);

    const [superpowerTurnsLeft, setSuperpowerTurnsLeft] = useState(0);
    const [diggingAnimationTarget, setDiggingAnimationTarget] = useState<{ row: number; col: number; isDynamite: boolean } | null>(null);
    const [lootAnimations, setLootAnimations] = useState<LootAnimation[]>([]);
    const [blinkingResources, setBlinkingResources] = useState<Partial<Record<ResourceType, boolean>>>({});
    const [accessibleDepth, setAccessibleDepth] = useState(0);

    const onMobDefeated = useCallback((loot: Partial<Record<ResourceType, number>>) => {
        const mobDisplayElement = document.querySelector('[data-mob-display="true"]');
        if (mobDisplayElement) {
            const startRect = mobDisplayElement.getBoundingClientRect();
            const newAnimations: LootAnimation[] = [];
            for (const [resource, amount] of Object.entries(loot)) {
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
        
        gameState.setResources(prev => {
            const newRes = { ...prev };
            for (const [resource, amount] of Object.entries(loot)) {
                if (typeof amount === 'number' && amount > 0) {
                    newRes[resource as ResourceType] = (newRes[resource as ResourceType] || 0) + amount;
                }
            }
            return newRes;
        });

        gameState.setCurrentMobIndex(prev => prev + 1);

    }, [gameState.setResources, gameState.setCurrentMobIndex]);

    const onHeroDefeated = useCallback(() => {
        // Currently just resets HP, could add more penalties later
    }, []);

    const combatSystem = useCombatSystem({
        equipmentLevels: gameState.equipmentLevels,
        superpowerTurnsLeft,
        currentMobIndex: gameState.currentMobIndex,
        language: gameState.language,
        resourceMultiplier: gameState.resourceMultiplier,
        onMobDefeated,
        onHeroDefeated,
    });
    
    const handleFreeUpgrade = useCallback(() => {
        const upgradableSlots = (Object.keys(gameState.equipmentLevels) as EquipmentSlot[]).filter(slot => gameState.equipmentLevels[slot] < 30);
        if (upgradableSlots.length === 0) return;
        
        const randomSlot = upgradableSlots[Math.floor(Math.random() * upgradableSlots.length)];
        
        gameState.setEquipmentLevels(prevLevels => {
            const newLevel = prevLevels[randomSlot] + 1;
            const upgradedItem = EQUIPMENT_DATA[randomSlot].find(item => item.level === newLevel);
            if (upgradedItem) {
                const statsString = Object.entries(upgradedItem.stats).map(([key, val]) => formatStatForModal(key, val!)).join(' / ');
                modals.setFreeUpgradeInfo({ name: tEquip(upgradedItem.nameKey as any, gameState.language), stats: statsString });
            }
            return { ...prevLevels, [randomSlot]: newLevel };
        });
    }, [gameState.equipmentLevels, gameState.setEquipmentLevels, gameState.language, modals.setFreeUpgradeInfo]);

    const handleDig = useCallback((row: number, col: number) => {
        const tile = gameState.mineGrid[row][col];
        if (tile.type === TileEnum.EASTER_EGG) {
            const newGrid = gameState.mineGrid.map(r => r.slice());
            newGrid[row][col] = { ...newGrid[row][col], type: TileEnum.EMPTY };
            gameState.setMineGrid(newGrid);

            if (row > gameState.deepestRow) gameState.setDeepestRow(row);
            const rewardType = Math.random() > 0.5 ? ResourceEnum.GOLD : ResourceEnum.SILVER;
            let amount = Math.round((rewardType === ResourceEnum.GOLD ? rand(5, 20) : rand(20, 50)) * gameState.resourceMultiplier);
            gameState.setResources(prev => ({ ...prev, [rewardType]: prev[rewardType] + amount }));
            modals.setRewardMessage(t('easterEggMessage', gameState.language, { amount, resource: rewardType }));
        } else {
            const problem = generateProblem(row, gameState.mathDifficulty);
            modals.setMathModalState({ problem, row, col, type: 'dig' });
        }
    }, [gameState.mineGrid, gameState.mathDifficulty, gameState.deepestRow, gameState.resourceMultiplier, gameState.language, gameState.setMineGrid, gameState.setDeepestRow, gameState.setResources, modals.setRewardMessage, modals.setMathModalState]);

    const handleSolveProblem = useCallback((isCorrect: boolean, useDynamite: boolean) => {
        if (!modals.mathModalState) return;
        const { type, row, col } = modals.mathModalState;
        modals.setMathModalState(null);

        if (type === 'superpower') {
            gameState.setSuperpowerCooldown(10);
            if (isCorrect) {
                setSuperpowerTurnsLeft(3);
                const newEvent: FloatingText = { id: Date.now(), text: t('superpowerActivate', gameState.language), target: 'hero', type: 'loot' };
                combatSystem.setFloatingTexts(prev => [...prev, newEvent]);
            }
            return;
        }

        if (isCorrect && row !== undefined && col !== undefined) {
            const isDynamiteDig = useDynamite && gameState.resources.DYNAMITE > 0;
            setDiggingAnimationTarget({ row, col, isDynamite: isDynamiteDig });
            
            setTimeout(() => {
                const newGrid = gameState.mineGrid.map(r => r.slice());
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
                            const problemDifficulty = generateProblem(r, gameState.mathDifficulty).difficulty;
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

                if (deepestDugRow > gameState.deepestRow) gameState.setDeepestRow(deepestDugRow);
                for (const key in lootGained) lootGained[key as ResourceType] = Math.round((lootGained[key as ResourceType] || 0) * gameState.resourceMultiplier);
                
                gameState.setResources(prev => {
                    const newResources = {...prev};
                    for (const [res, amount] of Object.entries(lootGained)) {
                        if (typeof amount === 'number') newResources[res as ResourceType] = (newResources[res as ResourceType] || 0) + amount;
                    }
                    if(isDynamiteDig) newResources.DYNAMITE -= 1;
                    return newResources;
                });
                
                if (tilesDugCount > 0) {
                    gameState.setDigsSinceLastReward(prevDigs => {
                        let newDigCount = prevDigs + tilesDugCount;
                        if (newDigCount >= gameState.nextRewardDigCount) {
                            handleFreeUpgrade();
                            gameState.setNextRewardDigCount(rand(20, 30));
                            return newDigCount - gameState.nextRewardDigCount;
                        }
                        return newDigCount;
                    });
                }

                gameState.setMineGrid(newGrid);
                setDiggingAnimationTarget(null);
            }, 600);
        }
    }, [modals.mathModalState, gameState, combatSystem, handleFreeUpgrade, modals.setMathModalState]);
    
    const handleTriggerSuperpower = useCallback(() => {
        if (gameState.superpowerCooldown > 0) return;
        const problem = generateProblem(gameState.deepestRow, gameState.mathDifficulty);
        modals.setMathModalState({ problem, type: 'superpower' });
    }, [gameState.superpowerCooldown, gameState.deepestRow, gameState.mathDifficulty, modals.setMathModalState]);
    
    const handleUpgradeEquipment = useCallback((slot: EquipmentSlot) => {
        const currentLevel = gameState.equipmentLevels[slot];
        const upgradeData = EQUIPMENT_DATA[slot].find(item => item.level === currentLevel + 1);
        if (!upgradeData) return;
        const canAfford = gameState.isTestingMode || Object.entries(upgradeData.cost).every(([res, cost]) => gameState.resources[res as ResourceType] >= (cost as number));
        if (canAfford) {
            if (!gameState.isTestingMode) {
                gameState.setResources(prev => {
                    const newResources = { ...prev };
                    for (const [res, cost] of Object.entries(upgradeData.cost)) newResources[res as ResourceType] -= (cost as number);
                    return newResources;
                });
            }
            gameState.setEquipmentLevels(prev => ({ ...prev, [slot]: currentLevel + 1 }));
        }
    }, [gameState.equipmentLevels, gameState.isTestingMode, gameState.resources, gameState.setResources, gameState.setEquipmentLevels]);
    
    const handleLootAnimationEnd = (id: number, resource: ResourceType) => {
        setLootAnimations(prev => prev.filter(anim => anim.id !== id));
        setBlinkingResources(prev => ({ ...prev, [resource]: true }));
        setTimeout(() => setBlinkingResources(prev => ({ ...prev, [resource]: false })), 400);
    };

    // Recalculate accessible depth when mineGrid changes
    useEffect(() => {
        if (gameState.mineGrid.length > 0) {
            const calculateAccessibleDepth = (grid: TileData[][]): number => {
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
            setAccessibleDepth(calculateAccessibleDepth(gameState.mineGrid));
        }
    }, [gameState.mineGrid]);

    // Superpower and Cooldown turn management (runs every hero turn, which is every 2 combat turns)
    useEffect(() => {
        const turnInterval = setInterval(() => {
            setSuperpowerTurnsLeft(t => Math.max(0, t-1));
            gameState.setSuperpowerCooldown(c => Math.max(0, c-1));
        }, 6000); // Once every two combat turns (3s * 2)
        return () => clearInterval(turnInterval);
    }, [gameState.setSuperpowerCooldown]);


    return {
        // From useGameState
        ...gameState,
        // From useModalState
        ...modals,
        modalState: modals.mathModalState, // Alias for compatibility with App.tsx
        // From useCombatSystem
        ...combatSystem,
        // State managed here
        mineContainerRef,
        lootAnimations,
        accessibleDepth,
        diggingAnimationTarget,
        blinkingResources,
        superpowerTurnsLeft,
        // Handlers
        handleLootAnimationEnd,
        handleSolveProblem,
        handleUpgradeEquipment,
        handleDig,
        handleTriggerSuperpower,
        // Custom reset/regenerate that close modals
        handleResetGame: () => {
            modals.setIsResetConfirmationOpen(false);
            gameState.handleResetGame();
        },
        handleRegenerateMine: () => {
            modals.setIsRegenerateConfirmationOpen(false);
            gameState.handleRegenerateMine();
        },
    };
};


import { useState, useEffect } from 'react';
import { initialEquipment } from '../constants';
import { generateInitialMine } from '../services/mineService';
import type { TileData, ResourceType, EquipmentLevels } from '../types';
import { MOBS } from '../data/mobs';
import { tMob } from '../services/translation';
import type { Language } from '../services/translation';

// A utility hook for state that persists in localStorage
// FIX: Updated hook to correctly handle lazy initialization with functions, preventing type errors downstream.
function usePersistentState<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            }
            return initialValue instanceof Function ? initialValue() : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}


export const useGameState = () => {
    const [resources, setResources] = usePersistentState<Record<ResourceType, number>>('resources', {
        DIRT: 0, STONE: 0, MINERAL: 0, SILVER: 0, GOLD: 0, DYNAMITE: 0,
    });
    const [mineGrid, setMineGrid] = usePersistentState<TileData[][]>('mineGrid', generateInitialMine);
    const [deepestRow, setDeepestRow] = usePersistentState('deepestRow', 0);
    const [equipmentLevels, setEquipmentLevels] = usePersistentState<EquipmentLevels>('equipmentLevels', initialEquipment);
    const [currentMobIndex, setCurrentMobIndex] = usePersistentState('currentMobIndex', 0);
    const [digsSinceLastReward, setDigsSinceLastReward] = usePersistentState('digsSinceLastReward', 0);
    // FIX: Explicitly typed to <number> to ensure correct type inference with lazy initializer.
    const [nextRewardDigCount, setNextRewardDigCount] = usePersistentState<number>('nextRewardDigCount', () => Math.floor(Math.random() * 11) + 20); // 20-30
    const [isTestingMode, setIsTestingMode] = usePersistentState('isTestingMode', false);
    const [mathDifficulty, setMathDifficulty] = usePersistentState('mathDifficulty', 3);
    const [resourceMultiplier, setResourceMultiplier] = usePersistentState('resourceMultiplier', 1);
    const [language, setLanguage] = usePersistentState<Language>('language', 'en');
    const [superpowerCooldown, setSuperpowerCooldown] = usePersistentState('superpowerCooldown', 0);
    const [isLoaded, setIsLoaded] = useState(false);

    // This effect runs once on mount to signal that persistent state has been loaded.
    useEffect(() => {
        setIsLoaded(true);
    }, []);
    
    // Legacy load logic for transitioning from single save object to multiple keys.
    // This can be removed in a future version.
    useEffect(() => {
        const legacyData = localStorage.getItem('mathMinerSaveData');
        if (legacyData) {
            try {
                const parsed = JSON.parse(legacyData);
                // If we find a legacy save file and our new keys aren't set, migrate the data.
                if (!localStorage.getItem('resources')) {
                    if (parsed.resources) setResources(parsed.resources);
                    if (parsed.mineGrid) setMineGrid(parsed.mineGrid);
                    if (parsed.deepestRow) setDeepestRow(parsed.deepestRow);
                    if (parsed.equipmentLevels) setEquipmentLevels(parsed.equipmentLevels);
                    if (parsed.currentMobIndex) setCurrentMobIndex(parsed.currentMobIndex);
                    if (parsed.digsSinceLastReward) setDigsSinceLastReward(parsed.digsSinceLastReward);
                    if (parsed.nextRewardDigCount) setNextRewardDigCount(parsed.nextRewardDigCount);
                    if (parsed.isTestingMode) setIsTestingMode(parsed.isTestingMode);
                    if (parsed.mathDifficulty) setMathDifficulty(parsed.mathDifficulty);
                    if (parsed.resourceMultiplier) setResourceMultiplier(parsed.resourceMultiplier);
                    if (parsed.language) setLanguage(parsed.language);
                    if (parsed.superpowerCooldown) setSuperpowerCooldown(parsed.superpowerCooldown);
                }
            } catch (e) {
                console.error("Error parsing legacy save data", e);
            } finally {
                // Once migrated (or failed), remove the old key.
                localStorage.removeItem('mathMinerSaveData');
            }
        }
    }, [
      setResources, setMineGrid, setDeepestRow, setEquipmentLevels, 
      setCurrentMobIndex, setDigsSinceLastReward, setNextRewardDigCount, 
      setIsTestingMode, setMathDifficulty, setResourceMultiplier, setLanguage, setSuperpowerCooldown
    ]);


    const handleResetGame = () => {
        // Clear all persistent state keys used by usePersistentState
        Object.keys(localStorage).forEach(key => {
            if (['resources', 'mineGrid', 'deepestRow', 'equipmentLevels', 'currentMobIndex', 'digsSinceLastReward', 'nextRewardDigCount', 'isTestingMode', 'mathDifficulty', 'resourceMultiplier', 'language', 'superpowerCooldown'].includes(key)) {
                localStorage.removeItem(key);
            }
        });
        window.location.reload();
    };

    const handleRegenerateMine = () => {
        setMineGrid(generateInitialMine());
        setDeepestRow(0);
    };

    return {
        isLoaded,
        resources, setResources,
        mineGrid, setMineGrid,
        deepestRow, setDeepestRow,
        equipmentLevels, setEquipmentLevels,
        currentMobIndex, setCurrentMobIndex,
        digsSinceLastReward, setDigsSinceLastReward,
        nextRewardDigCount, setNextRewardDigCount,
        isTestingMode, setIsTestingMode,
        mathDifficulty, setMathDifficulty,
        resourceMultiplier, setResourceMultiplier,
        language, setLanguage,
        superpowerCooldown, setSuperpowerCooldown,
        handleResetGame,
        handleRegenerateMine,
    };
};
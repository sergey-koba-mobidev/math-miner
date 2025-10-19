import { useState, useEffect, useRef, useMemo } from 'react';
import { EQUIPMENT_DATA } from '../data/equipment';
import { MOBS } from '../data/mobs';
import { t, tMob } from '../services/translation';
import type { Language } from '../services/translation';
import type { CharacterStats, EquipmentLevels, EquipmentSlot, FloatingText, AnimationState, ResourceType } from '../types';

const baseHeroStats: Omit<CharacterStats, 'hp' | 'maxHp' | 'name'> = {
  attack: 5,
  defense: 2,
  evasion: 1,
  critChance: 5,
};

const generateLoot = (mobIndex: number, multiplier: number): Partial<Record<ResourceType, number>> => {
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
};


interface UseCombatSystemProps {
    equipmentLevels: EquipmentLevels;
    superpowerTurnsLeft: number;
    currentMobIndex: number;
    language: Language;
    resourceMultiplier: number;
    onMobDefeated: (loot: Partial<Record<ResourceType, number>>) => void;
    onHeroDefeated: () => void;
}

export const useCombatSystem = ({
    equipmentLevels,
    superpowerTurnsLeft,
    currentMobIndex,
    language,
    resourceMultiplier,
    onMobDefeated,
    onHeroDefeated,
}: UseCombatSystemProps) => {
    const isHeroTurnRef = useRef(true);
    const [heroAnimation, setHeroAnimation] = useState<AnimationState>('idle');
    const [mobAnimation, setMobAnimation] = useState<AnimationState>('idle');
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    
    const heroStats = useMemo(() => {
        const stats = {
            maxHp: 100, attack: baseHeroStats.attack, defense: baseHeroStats.defense,
            evasion: baseHeroStats.evasion, critChance: baseHeroStats.critChance,
        };

        for (const key in equipmentLevels) {
            const slot = key as EquipmentSlot;
            const level = equipmentLevels[slot];
            if (level > 0) {
                const item = EQUIPMENT_DATA[slot].find(item => item.level === level);
                if (item) {
                    if (item.stats.maxHp) stats.maxHp += item.stats.maxHp;
                    if (item.stats.attack) stats.attack += item.stats.attack;
                    if (item.stats.defense) stats.defense += item.stats.defense;
                    if (item.stats.evasion) stats.evasion += item.stats.evasion;
                    if (item.stats.critChance) stats.critChance += item.stats.critChance;
                }
            }
        }
        
        if (superpowerTurnsLeft > 1) {
            stats.attack = Math.round(stats.attack * 2);
            stats.defense = Math.round(stats.defense * 2);
            stats.evasion = Math.min(95, Math.round(stats.evasion * 2)); // Cap evasion
            stats.critChance = Math.min(100, Math.round(stats.critChance * 2)); // Cap crit
        }

        return { ...stats, name: t('hero', language) };
    }, [equipmentLevels, superpowerTurnsLeft, language]);
    
    const mobData = useMemo(() => {
        const mob = MOBS[currentMobIndex];
        let name = tMob(mob.nameKey as any, language);
        if (mob.nameKey.startsWith('endless_')) {
            const baseNameKey = mob.nameKey.replace('endless_', '');
            const baseName = tMob(baseNameKey as any, language);
            name = `${t('endless', language)} ${baseName}`;
        }
        return { ...mob, name };
    }, [currentMobIndex, language]);

    const [combatants, setCombatants] = useState<{ hero: CharacterStats; mob: CharacterStats }>({
        hero: { ...baseHeroStats, ...heroStats, hp: heroStats.maxHp },
        mob: { ...mobData, hp: mobData.maxHp },
    });

    // Sync combatant stats with calculated stats from props
    useEffect(() => {
        setCombatants(prev => ({
            hero: { ...prev.hero, ...heroStats, hp: Math.min(prev.hero.hp, heroStats.maxHp) },
            mob: { ...prev.mob, ...mobData, hp: prev.mob.hp <= 0 ? mobData.maxHp : Math.min(prev.mob.hp, mobData.maxHp) }
        }));
    }, [heroStats, mobData]);

    // Combat Loop
    useEffect(() => {
        const combatInterval = setInterval(() => {
            if (isHeroTurnRef.current) {
                setHeroAnimation('attacking');
                setTimeout(() => {
                    setCombatants(prev => {
                        if (prev.hero.hp <= 0 || prev.mob.hp <= 0) return prev;
                        const { hero, mob } = prev;
                        let newMob = { ...mob };
                        const newEvents: FloatingText[] = [];

                        if (Math.random() * 100 < mob.evasion) {
                            setMobAnimation('missed');
                            newEvents.push({ id: Date.now() + Math.random(), text: 'Miss', target: 'mob', type: 'miss' });
                        } else {
                            const isCrit = Math.random() * 100 < hero.critChance;
                            const attackRandomness = Math.floor(Math.random() * 3) - 1;
                            const baseAttack = Math.max(1, hero.attack + attackRandomness);
                            const attackPower = isCrit ? baseAttack * 1.5 : baseAttack;
                            const damage = Math.max(1, Math.floor(attackPower - mob.defense));
                            
                            newMob = { ...mob, hp: Math.max(0, mob.hp - damage) };
                            
                            setMobAnimation('taking-damage');
                            newEvents.push({
                                id: Date.now() + Math.random(),
                                text: isCrit ? `${damage}!` : `${damage}`,
                                target: 'mob',
                                type: isCrit ? 'crit' : 'damage',
                            });
                        }
                        setFloatingTexts(texts => [...texts, ...newEvents]);
                        return { ...prev, mob: newMob };
                    });
                    setTimeout(() => { setHeroAnimation('idle'); setMobAnimation('idle'); }, 600);
                }, 400);
                isHeroTurnRef.current = false;
            } else {
                setMobAnimation('attacking');
                setTimeout(() => {
                    setCombatants(prev => {
                        if (prev.hero.hp <= 0 || prev.mob.hp <= 0) return prev;
                        const { hero, mob } = prev;
                        let newHero = { ...hero };
                        const newEvents: FloatingText[] = [];

                        if (Math.random() * 100 < hero.evasion) {
                            setHeroAnimation('missed');
                            newEvents.push({ id: Date.now() + Math.random(), text: 'Miss', target: 'hero', type: 'miss' });
                        } else {
                            const isCrit = Math.random() * 100 < mob.critChance;
                            const attackRandomness = Math.floor(Math.random() * 3) - 1;
                            const baseAttack = Math.max(1, mob.attack + attackRandomness);
                            const attackPower = isCrit ? baseAttack * 1.5 : baseAttack;
                            const damage = Math.max(1, Math.floor(attackPower - hero.defense));

                            newHero = { ...hero, hp: Math.max(0, hero.hp - damage) };
                            setHeroAnimation('taking-damage');
                            newEvents.push({
                                id: Date.now() + Math.random(),
                                text: isCrit ? `${damage}!` : `${damage}`,
                                target: 'hero',
                                type: isCrit ? 'crit' : 'damage',
                            });
                        }
                        setFloatingTexts(texts => [...texts, ...newEvents]);
                        return { ...prev, hero: newHero };
                    });
                    setTimeout(() => { setHeroAnimation('idle'); setMobAnimation('idle'); }, 600);
                }, 400);
                isHeroTurnRef.current = true;
            }
        }, 3000);

        return () => clearInterval(combatInterval);
    }, []);

    // Combat outcome handling
    useEffect(() => {
        if (combatants.mob.hp <= 0) {
            const timeout = setTimeout(() => {
                const loot = generateLoot(currentMobIndex, resourceMultiplier);
                loot.DYNAMITE = (loot.DYNAMITE || 0) + 1;
                onMobDefeated(loot);
                isHeroTurnRef.current = true;
            }, 500);
            return () => clearTimeout(timeout);
        }
        
        if (combatants.hero.hp <= 0) {
            const timeout = setTimeout(() => {
                onHeroDefeated();
                setCombatants(prev => ({
                    ...prev, 
                    hero: { ...prev.hero, hp: prev.hero.maxHp },
                    mob: { ...prev.mob, hp: prev.mob.maxHp }
                }));
                isHeroTurnRef.current = true;
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [combatants.hero.hp, combatants.mob.hp, currentMobIndex, resourceMultiplier, onMobDefeated, onHeroDefeated]);
    
    // Clear floating texts after animation
    useEffect(() => {
        if (floatingTexts.length > 0) {
            const timer = setTimeout(() => {
                setFloatingTexts(prev => prev.slice(1));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [floatingTexts]);

    return {
        combatants,
        heroAnimation,
        mobAnimation,
        floatingTexts,
        setFloatingTexts,
    };
};

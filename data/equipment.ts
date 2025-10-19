
import type { EquipmentLevel, EquipmentSlot, ResourceType } from '../types';

const generateCost = (level: number) => {
  const cost: Partial<Record<ResourceType, number>> = {};
  
  // A flatter exponential curve for easier early-game progression.
  // The exponent 1.5 is less aggressive than the previous 1.8.
  const costCurve = Math.pow(level, 1.5);

  // Tier 1: Dirt & Stone. Significantly reduced base costs and scaling.
  cost.DIRT = Math.floor(costCurve * 5 + 10 * level);
  cost.STONE = Math.floor(costCurve * 3 + 8 * level);

  // Tier 2: Minerals. Introduced at level 6. Slower scaling curve.
  if (level > 5) {
    // Math.pow(level - 5, 1.4) ensures the cost starts low and ramps up gently.
    cost.MINERAL = Math.floor(Math.pow(level - 5, 1.4) * 2 + (level - 5));
  }

  // Tier 3: Silver. Introduced at level 16. Starts cheaper and scales more smoothly.
  if (level > 15) {
    cost.SILVER = Math.floor(Math.pow(level - 15, 1.5) * 1.5 + (level - 15));
  }

  // Tier 4: Gold. Introduced at level 26. Starts cheaper.
  if (level > 25) {
    cost.GOLD = Math.floor(Math.pow(level - 25, 1.6) + Math.ceil((level - 25) / 2));
  }
  
  return cost;
}

const WEAPON_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        return {
            level,
            nameKey: `weapon_${level}`,
            stats: { attack: Math.floor(level * 2.5) },
            cost: generateCost(level),
        }
    })
];

const SHIELD_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        return {
            level,
            nameKey: `shield_${level}`,
            stats: { defense: Math.floor(level * 1.5), maxHp: level * 5 },
            cost: generateCost(level),
        }
    })
];

const HELMET_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        return {
            level,
            nameKey: `helmet_${level}`,
            stats: { defense: level, maxHp: level * 10 },
            cost: generateCost(level),
        }
    })
];

const ARMOR_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        return {
            level,
            nameKey: `armor_${level}`,
            stats: { defense: Math.floor(level * 2), maxHp: level * 15 },
            cost: generateCost(level),
        }
    })
];

const LEGS_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        return {
            level,
            nameKey: `legs_${level}`,
            stats: { defense: level, evasion: Math.floor(level * 0.2) },
            cost: generateCost(level),
        }
    })
];

const BOOTS_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        return {
            level,
            nameKey: `boots_${level}`,
            stats: { evasion: Math.ceil(level * 0.5) },
            cost: generateCost(level),
        }
    })
];

export const EQUIPMENT_DATA: Record<EquipmentSlot, EquipmentLevel[]> = {
    WEAPON: WEAPON_LEVELS,
    SHIELD: SHIELD_LEVELS,
    HELMET: HELMET_LEVELS,
    ARMOR: ARMOR_LEVELS,
    LEGS: LEGS_LEVELS,
    BOOTS: BOOTS_LEVELS,
}
import React from 'react';

export enum TileType {
  EMPTY = 'EMPTY',
  DIRT = 'DIRT',
  STONE = 'STONE',
  MINERAL = 'MINERAL',
  SILVER_ORE = 'SILVER_ORE',
  GOLD_ORE = 'GOLD_ORE',
  CHEST = 'CHEST',
  EASTER_EGG = 'EASTER_EGG',
}

export enum ResourceType {
  DIRT = 'DIRT',
  STONE = 'STONE',
  MINERAL = 'MINERAL',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DYNAMITE = 'DYNAMITE',
}

export interface TileData {
  type: TileType;
  id: string;
  variant: number;
}

export interface Problem {
  question: string;
  answer: number;
  difficulty: number;
  hints?: number[];
}

export interface CharacterStats {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  evasion: number;
  critChance: number;
  // This can be undefined for the hero
  spriteKey?: string; 
  spriteColoration?: { hueRotate: number };
}

export interface MobBaseStats extends Omit<CharacterStats, 'hp' | 'name'> {
  nameKey: string;
  loreKey: string;
  spriteKey: string;
  spriteColoration: { hueRotate: number };
}

export interface FloatingText {
  id: number;
  text: string;
  target: 'hero' | 'mob';
  type: 'damage' | 'crit' | 'miss' | 'loot';
}

export interface LootAnimation {
  id: number;
  resource: ResourceType;
  startRect: DOMRect;
  endRect: DOMRect;
  amount: number;
}

export enum EquipmentSlot {
  WEAPON = 'WEAPON',
  SHIELD = 'SHIELD',
  HELMET = 'HELMET',
  ARMOR = 'ARMOR',
  LEGS = 'LEGS',
  BOOTS = 'BOOTS',
}

export type EquipmentLevels = Record<EquipmentSlot, number>;

// Specific stats for equipment to avoid confusion with CharacterStats' `hp`.
export interface EquipmentStats {
  maxHp?: number;
  attack?: number;
  defense?: number;
  evasion?: number;
  critChance?: number;
}

export interface EquipmentLevel {
  level: number;
  nameKey: string;
  stats: EquipmentStats;
  cost: Partial<Record<ResourceType, number>>;
}

export type AnimationState = 'idle' | 'attacking' | 'taking-damage' | 'missed';
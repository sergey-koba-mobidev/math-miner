import type { MobBaseStats } from '../types';

const baseMobs: Omit<MobBaseStats, 'maxHp' | 'attack' | 'defense' | 'evasion' | 'critChance' | 'name' | 'lore'>[] = [
    // Tier 1: Grimy Tunnels (0-9)
    { nameKey: 'mob_1_name', loreKey: 'mob_1_lore', spriteKey: 'SLIME', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_2_name', loreKey: 'mob_2_lore', spriteKey: 'BAT', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_3_name', loreKey: 'mob_3_lore', spriteKey: 'GIANT_RAT', spriteColoration: { hueRotate: 200 }},
    { nameKey: 'mob_4_name', loreKey: 'mob_4_lore', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_5_name', loreKey: 'mob_5_lore', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 200 }},
    { nameKey: 'mob_6_name', loreKey: 'mob_6_lore', spriteKey: 'SLIME', spriteColoration: { hueRotate: 120 }},
    { nameKey: 'mob_7_name', loreKey: 'mob_7_lore', spriteKey: 'GIANT_RAT', spriteColoration: { hueRotate: 300 }},
    { nameKey: 'mob_8_name', loreKey: 'mob_8_lore', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 30 }},
    { nameKey: 'mob_9_name', loreKey: 'mob_9_lore', spriteKey: 'SLIME', spriteColoration: { hueRotate: 240 }},
    { nameKey: 'mob_10_name', loreKey: 'mob_10_lore', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: -45 }},

    // Tier 2: Goblin Warrens & Old Mines (10-19)
    { nameKey: 'mob_11_name', loreKey: 'mob_11_lore', spriteKey: 'ORC', spriteColoration: { hueRotate: -20 }},
    { nameKey: 'mob_12_name', loreKey: 'mob_12_lore', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 280 }},
    { nameKey: 'mob_13_name', loreKey: 'mob_13_lore', spriteKey: 'WORM', spriteColoration: { hueRotate: 200 }},
    { nameKey: 'mob_14_name', loreKey: 'mob_14_lore', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 90 }},
    { nameKey: 'mob_15_name', loreKey: 'mob_15_lore', spriteKey: 'ORC', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_16_name', loreKey: 'mob_16_lore', spriteKey: 'BAT', spriteColoration: { hueRotate: 270 }},
    { nameKey: 'mob_17_name', loreKey: 'mob_17_lore', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_18_name', loreKey: 'mob_18_lore', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 220 }},
    { nameKey: 'mob_19_name', loreKey: 'mob_19_lore', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 150 }},
    { nameKey: 'mob_20_name', loreKey: 'mob_20_lore', spriteKey: 'ORC', spriteColoration: { hueRotate: 330 }},

    // Tier 3: Forgotten Crypt (20-29)
    { nameKey: 'mob_21_name', loreKey: 'mob_21_lore', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 20 }},
    { nameKey: 'mob_22_name', loreKey: 'mob_22_lore', spriteKey: 'GHOUL', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_23_name', loreKey: 'mob_23_lore', spriteKey: 'WRAITH', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_24_name', loreKey: 'mob_24_lore', spriteKey: 'MIMIC', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_25_name', loreKey: 'mob_25_lore', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 60 }},
    { nameKey: 'mob_26_name', loreKey: 'mob_26_lore', spriteKey: 'WRAITH', spriteColoration: { hueRotate: 90 }},
    { nameKey: 'mob_27_name', loreKey: 'mob_27_lore', spriteKey: 'GHOUL', spriteColoration: { hueRotate: 120 }},
    { nameKey: 'mob_28_name', loreKey: 'mob_28_lore', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 270 }},
    { nameKey: 'mob_29_name', loreKey: 'mob_29_lore', spriteKey: 'WORM', spriteColoration: { hueRotate: 300 }},
    { nameKey: 'mob_30_name', loreKey: 'mob_30_lore', spriteKey: 'LICH', spriteColoration: { hueRotate: 270 }},
    
    // Tier 4: Cavern of Whispers (30-39)
    { nameKey: 'mob_31_name', loreKey: 'mob_31_lore', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_32_name', loreKey: 'mob_32_lore', spriteKey: 'SHADOW', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_33_name', loreKey: 'mob_33_lore', spriteKey: 'GAZER', spriteColoration: { hueRotate: 120 }},
    { nameKey: 'mob_34_name', loreKey: 'mob_34_lore', spriteKey: 'TROLL', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_35_name', loreKey: 'mob_35_lore', spriteKey: 'SLIME', spriteColoration: { hueRotate: 60 }},
    { nameKey: 'mob_36_name', loreKey: 'mob_36_lore', spriteKey: 'SHADOW', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_37_name', loreKey: 'mob_37_lore', spriteKey: 'GARGOYLE', spriteColoration: { hueRotate: 220 }},
    { nameKey: 'mob_38_name', loreKey: 'mob_38_lore', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 220 }},
    { nameKey: 'mob_39_name', loreKey: 'mob_39_lore', spriteKey: 'GAZER', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_40_name', loreKey: 'mob_40_lore', spriteKey: 'SHADOW', spriteColoration: { hueRotate: 270 }},

    // Tier 5: The Great Forge (40-49)
    { nameKey: 'mob_41_name', loreKey: 'mob_41_lore', spriteKey: 'BAT', spriteColoration: { hueRotate: 350 } },
    { nameKey: 'mob_42_name', loreKey: 'mob_42_lore', spriteKey: 'SLIME', spriteColoration: { hueRotate: 30 } },
    { nameKey: 'mob_43_name', loreKey: 'mob_43_lore', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_44_name', loreKey: 'mob_44_lore', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 0 } },
    { nameKey: 'mob_45_name', loreKey: 'mob_45_lore', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_46_name', loreKey: 'mob_46_lore', spriteKey: 'GIANT_RAT', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_47_name', loreKey: 'mob_47_lore', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 300 }},
    { nameKey: 'mob_48_name', loreKey: 'mob_48_lore', spriteKey: 'TROLL', spriteColoration: { hueRotate: 330 } },
    { nameKey: 'mob_49_name', loreKey: 'mob_49_lore', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_50_name', loreKey: 'mob_50_lore', spriteKey: 'DEMON', spriteColoration: { hueRotate: 0 }},

    // Tier 6: Labyrinth of Beasts (50-59)
    { nameKey: 'mob_51_name', loreKey: 'mob_51_lore', spriteKey: 'ORC', spriteColoration: { hueRotate: 30 }},
    { nameKey: 'mob_52_name', loreKey: 'mob_52_lore', spriteKey: 'BAT', spriteColoration: { hueRotate: 60 }},
    { nameKey: 'mob_53_name', loreKey: 'mob_53_lore', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 120 }},
    { nameKey: 'mob_54_name', loreKey: 'mob_54_lore', spriteKey: 'BAT', spriteColoration: { hueRotate: 40 }},
    { nameKey: 'mob_55_name', loreKey: 'mob_55_lore', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 200 }},
    { nameKey: 'mob_56_name', loreKey: 'mob_56_lore', spriteKey: 'GAZER', spriteColoration: { hueRotate: 300 }},
    { nameKey: 'mob_57_name', loreKey: 'mob_57_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 30 }},
    { nameKey: 'mob_58_name', loreKey: 'mob_58_lore', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 90 }},
    { nameKey: 'mob_59_name', loreKey: 'mob_59_lore', spriteKey: 'TROLL', spriteColoration: { hueRotate: 60 }},
    { nameKey: 'mob_60_name', loreKey: 'mob_60_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 0 }},
    
    // Tier 7: Crystalline Maze (60-69)
    { nameKey: 'mob_61_name', loreKey: 'mob_61_lore', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_62_name', loreKey: 'mob_62_lore', spriteKey: 'WORM', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_63_name', loreKey: 'mob_63_lore', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_64_name', loreKey: 'mob_64_lore', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 330 }},
    { nameKey: 'mob_65_name', loreKey: 'mob_65_lore', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 240 }},
    { nameKey: 'mob_66_name', loreKey: 'mob_66_lore', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 60 }},
    { nameKey: 'mob_67_name', loreKey: 'mob_67_lore', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 120 }},
    { nameKey: 'mob_68_name', loreKey: 'mob_68_lore', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 300 }},
    { nameKey: 'mob_69_name', loreKey: 'mob_69_lore', spriteKey: 'LICH', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_70_name', loreKey: 'mob_70_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 150 }},

    // Tier 8: The Dragon's Maw (70-79)
    { nameKey: 'mob_71_name', loreKey: 'mob_71_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_72_name', loreKey: 'mob_72_lore', spriteKey: 'ORC', spriteColoration: { hueRotate: 180 }},
    { nameKey: 'mob_73_name', loreKey: 'mob_73_lore', spriteKey: 'DEMON', spriteColoration: { hueRotate: -120 }},
    { nameKey: 'mob_74_name', loreKey: 'mob_74_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 120 }},
    { nameKey: 'mob_75_name', loreKey: 'mob_75_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 300 }},
    { nameKey: 'mob_76_name', loreKey: 'mob_76_lore', spriteKey: 'DEMON', spriteColoration: { hueRotate: 330 }},
    { nameKey: 'mob_77_name', loreKey: 'mob_77_lore', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 0 }},
    { nameKey: 'mob_78_name', loreKey: 'mob_78_lore', spriteKey: 'DEMON', spriteColoration: { hueRotate: 60 }},
    { nameKey: 'mob_79_name', loreKey: 'mob_79_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 50 }},
    { nameKey: 'mob_80_name', loreKey: 'mob_80_lore', spriteKey: 'DEMON', spriteColoration: { hueRotate: 20 }},
    
    // Tier 9: The Core (80-89)
    { nameKey: 'mob_81_name', loreKey: 'mob_81_lore', spriteKey: 'SLIME', spriteColoration: { hueRotate: 270 }},
    { nameKey: 'mob_82_name', loreKey: 'mob_82_lore', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 120 }},
    { nameKey: 'mob_83_name', loreKey: 'mob_83_lore', spriteKey: 'LICH', spriteColoration: { hueRotate: 220 }},
    { nameKey: 'mob_84_name', loreKey: 'mob_84_lore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 260 }},
    { nameKey: 'mob_85_name', loreKey: 'mob_85_lore', spriteKey: 'TROLL', spriteColoration: { hueRotate: 50 }},
    { nameKey: 'mob_86_name', loreKey: 'mob_86_lore', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 50 }},
    { nameKey: 'mob_87_name', loreKey: 'mob_87_lore', spriteKey: 'DEMON', spriteColoration: { hueRotate: 200 }},
    { nameKey: 'mob_88_name', loreKey: 'mob_88_lore', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 150 }},
    { nameKey: 'mob_89_name', loreKey: 'mob_89_lore', spriteKey: 'WORM', spriteColoration: { hueRotate: 260 }},
    { nameKey: 'mob_90_name', loreKey: 'mob_90_lore', spriteKey: 'GAZER', spriteColoration: { hueRotate: 150 }},
];

export const MOBS: MobBaseStats[] = baseMobs.map((mob, index) => {
    // Smoother exponential scaling for a better difficulty curve
    const hp = Math.floor(20 * Math.pow(1.11, index));
    const attack = Math.floor(3 * Math.pow(1.09, index));
    const defense = Math.floor(1 * Math.pow(1.10, index));
    
    // Make certain archetypes have distinct stat advantages
    let evasion = 5;
    let critChance = 5;

    switch(mob.spriteKey) {
        case 'BAT':
        case 'SPIDER':
        case 'WRAITH':
        case 'SHADOW':
            evasion = Math.floor(10 + index * 0.3);
            break;
        case 'GOBLIN':
        case 'DEMON':
            critChance = Math.floor(10 + index * 0.25);
            break;
        case 'SLIME':
        case 'WORM':
        case 'TROLL':
            evasion = 0; // Low evasion for tanky mobs
            break;
        case 'GOLEM':
        case 'LIVING_ARMOR':
        case 'GARGOYLE':
            critChance = 0; // Low crit for methodical mobs
            break;
    }

    return {
        ...mob,
        maxHp: hp,
        attack: attack,
        defense: defense,
        evasion: Math.min(50, evasion), // Cap evasion
        critChance: Math.min(40, critChance), // Cap crit
    };
});

// Procedurally generate mobs for the endless deep
while(MOBS.length < 110) {
  const lastMob = MOBS[MOBS.length - 1];
  const archetype = baseMobs[Math.floor(Math.random() * baseMobs.length)];
  const newMob: MobBaseStats = {
    ...archetype,
    nameKey: `endless_${archetype.nameKey}`,
    loreKey: 'mob_endless_lore',
    maxHp: Math.floor(lastMob.maxHp * 1.1),
    attack: Math.floor(lastMob.attack * 1.08),
    defense: Math.floor(lastMob.defense * 1.09),
    evasion: Math.min(50, lastMob.evasion + 1),
    critChance: Math.min(40, lastMob.critChance + 1),
    spriteColoration: { hueRotate: (lastMob.spriteColoration.hueRotate + Math.random() * 40) % 360 },
  };
  MOBS.push(newMob);
}
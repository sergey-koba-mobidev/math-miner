
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
        const names = ["Wooden Stick", "Rusty Dagger", "Iron Shortsword", "Steel Longsword", "Mithril Blade", "Elven Glaive", "Dwarven Axe", "Orcish Cleaver", "Obsidian Katana", "Runic Claymore", "Knight's Lance", "Holy Avenger", "Demonslayer", "Blade of the Phoenix", "Dragonfang", "Frostbrand", "Stormcaller", "Void Reaver", "Celestial Scythe", "Soul Eater", "Glimmering Rapier", "Titan's Maul", "Shadowspike", "Sunforged Saber", "Aetherius", "Heartseeker Bow", "Worldbreaker", "Galactic Halberd", "Nebula Pike", "Dragonfire Blade"];
        return {
            level,
            name: names[i] || `Weapon Lv. ${level}`,
            stats: { attack: Math.floor(level * 2.5) },
            cost: generateCost(level),
        }
    })
];

const SHIELD_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        const names = ["Pot Lid", "Wooden Buckler", "Iron Targe", "Steel Kite Shield", "Tower Shield", "Mithril Aegis", "Elven Spellshield", "Dwarven Bulwark", "Orcish War-Door", "Obsidian Barrier", "Runic Ward", "Knight's Guard", "Holy Protector", "Demonwall", "Phoenix Embrace", "Dragonscale Shield", "Aegis of Storms", "Void Mirror", "Celestial Bastion", "Soul Warden", "Crystal Deflector", "Titan's Guard", "Shadow Barrier", "Sunstone Aegis", "Aetherium Wall", "Heartwood Shield", "World-Shell", "Galactic Barricade", "Nebula Ward", "Aegis of the Dragonheart"];
        return {
            level,
            name: names[i] || `Shield Lv. ${level}`,
            stats: { defense: Math.floor(level * 1.5), maxHp: level * 5 },
            cost: generateCost(level),
        }
    })
];

const HELMET_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        const names = ["Leather Cap", "Iron Pot Helm", "Steel Sallet", "Full Helm", "Mithril Coif", "Elven Circlet", "Dwarven Greathelm", "Orcish Skull-helm", "Obsidian Visage", "Runic Casque", "Knight's Armet", "Crown of Light", "Helm of Domination", "Phoenix Crest", "Dragon-Skull Helm", "Helm of Winter", "Crown of Tempests", "Void Gaze", "Celestial Crown", "Soul Cage", "Crystal Diadem", "Titan's Visor", "Shadow Cowl", "Sun-Crest Helm", "Aetherium Crown", "Helm of the Guardian", "World-Helm", "Galactic Crown", "Nebula Veil", "Dragon-Visage Helm"];
        return {
            level,
            name: names[i] || `Helmet Lv. ${level}`,
            stats: { defense: level, maxHp: level * 10 },
            cost: generateCost(level),
        }
    })
];

const ARMOR_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        const names = ["Padded Shirt", "Leather Jerkin", "Ring Mail", "Chainmail Hauberk", "Steel Plate", "Mithril Coat", "Elven Leaf-mail", "Dwarven Plating", "Orcish War-harness", "Obsidian Chestplate", "Runic Brigandine", "Knight's Cuirass", "Holy Vestments", "Demonbone Armor", "Phoenix Plume Raiment", "Dragonskin Tunic", "Storm-forged Plate", "Void Carapace", "Celestial Armor", "Soulforged Breastplate", "Crystal Mail", "Titan's Carapace", "Shadow-weave Tunic", "Sun-plate Armor", "Aetherium Plate", "Heart-Plate of the Forest", "World-Plate", "Galactic Raiment", "Nebula Carapace", "Dragonscale Platemail"];
        return {
            level,
            name: names[i] || `Armor Lv. ${level}`,
            stats: { defense: Math.floor(level * 2), maxHp: level * 15 },
            cost: generateCost(level),
        }
    })
];

const LEGS_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        const names = ["Cloth Trousers", "Leather Breeches", "Ring Mail Leggings", "Chainmail Chausses", "Steel Greaves", "Mithril Leggings", "Elven Tights", "Dwarven Leg-guards", "Orcish Loincloth", "Obsidian Legplates", "Runic Greaves", "Knight's Tassets", "Holy Leggings", "Demonbone Greaves", "Phoenixfire Pants", "Dragonskin Breeches", "Stormrider's Legguards", "Void-touched Leggings", "Celestial Kilt", "Soul-woven Greaves", "Crystal Legguards", "Titan's Striders", "Shadow-Stalkers", "Sun-blessed Greaves", "Aetherium Greaves", "Earth-bound Leggings", "World-Greaves", "Galactic Striders", "Nebula Leggings", "Dragon-Bone Greaves"];
        return {
            level,
            name: names[i] || `Legs Lv. ${level}`,
            stats: { defense: level, evasion: Math.floor(level * 0.2) },
            cost: generateCost(level),
        }
    })
];

const BOOTS_LEVELS: EquipmentLevel[] = [
    ...Array.from({length: 30}, (_, i) => {
        const level = i + 1;
        const names = ["Sandals", "Leather Shoes", "Iron Sollerets", "Steel Sabatons", "Plated Boots", "Mithril Boots", "Elven Slippers", "Dwarven Stompers", "Orcish War-boots", "Obsidian Sabatons", "Runic Treads", "Knight's Sabatons", "Boots of Light", "Demon-Stompers", "Phoenix-Talon Boots", "Dragon-Scale Boots", "Storm-Dancer's Boots", "Void-Walkers", "Celestial Sandals", "Soul-Treads", "Crystal Slippers", "Titan's Treads", "Shadow-step Boots", "Sun-Striders", "Aether-Walkers", "Boots of the Earth", "World-Stompers", "Galactic Greaves", "Nebula-Walkers", "Dragonflight Boots"];
        return {
            level,
            name: names[i] || `Boots Lv. ${level}`,
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

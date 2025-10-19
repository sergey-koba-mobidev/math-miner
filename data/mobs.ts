import type { MobBaseStats } from '../types';

const baseMobs: Omit<MobBaseStats, 'maxHp' | 'attack' | 'defense' | 'evasion' | 'critChance'>[] = [
    // Tier 1: Grimy Tunnels (0-9)
    { name: 'Green Slime', spriteKey: 'SLIME', spriteColoration: { hueRotate: 0 }, lore: 'A common, gelatinous creature found in damp caves. Not very bright, but surprisingly bouncy.'},
    { name: 'Cave Bat', spriteKey: 'BAT', spriteColoration: { hueRotate: 0 }, lore: 'A swift and erratic flier. Its high-pitched screeches can be disorienting.'},
    { name: 'Giant Rat', spriteKey: 'GIANT_RAT', spriteColoration: { hueRotate: 200 }, lore: 'An unusually large rodent, probably mutated by underground minerals. It has a nasty bite.'},
    { name: 'Goblin Scout', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 0 }, lore: 'A cunning and cowardly creature that prefers to attack in numbers. Hoards shiny, worthless trinkets.'},
    { name: 'Rock Spider', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 200 }, lore: 'It lurks in the darkness, its rocky carapace perfect camouflage.'},
    { name: 'Red Slime', spriteKey: 'SLIME', spriteColoration: { hueRotate: 120 }, lore: 'A more volatile variant of the Green Slime, seemingly angered by its fiery hue.'},
    { name: 'Diseased Rat', spriteKey: 'GIANT_RAT', spriteColoration: { hueRotate: 300 }, lore: 'Its fur is matted and its eyes glow with fever. Best not to get bitten.'},
    { name: 'Goblin Thief', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 30 }, lore: 'Faster and more cunning than a scout, it aims for weak points.'},
    { name: 'Blue Slime', spriteKey: 'SLIME', spriteColoration: { hueRotate: 240 }, lore: 'A chilly slime that can numb its attackers with its cold touch.'},
    { name: 'Goblin Bruiser', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: -45 }, lore: 'Bigger, meaner, and slightly less cowardly than its cousins. Brute force is its only tactic.'},

    // Tier 2: Goblin Warrens & Old Mines (10-19)
    { name: 'Hobgoblin', spriteKey: 'ORC', spriteColoration: { hueRotate: -20 }, lore: 'A more disciplined and dangerous cousin of the common goblin.'},
    { name: 'Venomous Spider', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 280 }, lore: 'Its fangs drip with a potent neurotoxin. The vibrant colors are a clear warning.'},
    { name: 'Rock Worm', spriteKey: 'WORM', spriteColoration: { hueRotate: 200 }, lore: 'A massive annelid that consumes stone and dirt. Its tough hide is difficult to pierce.'},
    { name: 'Goblin Shaman', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 90 }, lore: 'This goblin has dabbled in dark arts, flinging curses and hexes at its foes.'},
    { name: 'Orc Grunt', spriteKey: 'ORC', spriteColoration: { hueRotate: 0 }, lore: 'A hulking brute that lives for battle. Its crude armor is surprisingly effective.'},
    { name: 'Vampire Bat', spriteKey: 'BAT', spriteColoration: { hueRotate: 270 }, lore: 'A blood-sucking variant of the Cave Bat, capable of draining life from its victims.'},
    { name: 'Skeleton', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 0 }, lore: 'The reanimated bones of a long-dead miner. It swings its pickaxe with mindless determination.'},
    { name: 'Stone Golem', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 220 }, lore: 'An animated statue of immense strength and fortitude. Its stony fists can pulverize rock.'},
    { name: 'Goblin Chieftain', spriteKey: 'GOBLIN', spriteColoration: { hueRotate: 150 }, lore: 'The biggest and smartest of the local goblins. That still isn\'t saying much.'},
    { name: 'Orc Berserker', spriteKey: 'ORC', spriteColoration: { hueRotate: 330 }, lore: 'Fueled by battle rage, this orc attacks with reckless abandon.'},

    // Tier 3: Forgotten Crypt (20-29)
    { name: 'Skeleton Archer', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 20 }, lore: 'A skeletal marksman that never misses its target... usually.'},
    { name: 'Ghoul', spriteKey: 'GHOUL', spriteColoration: { hueRotate: 0 }, lore: 'A ravenous undead that feasts on the dead. Its claws are unnaturally sharp.'},
    { name: 'Wraith', spriteKey: 'WRAITH', spriteColoration: { hueRotate: 180 }, lore: 'A sorrowful spirit bound to the mortal plane. Its touch drains the warmth from living things.'},
    { name: 'Treasure Chest Mimic', spriteKey: 'MIMIC', spriteColoration: { hueRotate: 0 }, lore: 'Looks like a chest. Acts like a chest. Until you get too close.'},
    { name: 'Skeleton Knight', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 60 }, lore: 'This skeleton was buried with its armor on. A terrible decision for graverobbers, and now, for you.'},
    { name: 'Banshee', spriteKey: 'WRAITH', spriteColoration: { hueRotate: 90 }, lore: 'A wailing spirit whose shriek can shatter stone and confidence.'},
    { name: 'Abomination', spriteKey: 'GHOUL', spriteColoration: { hueRotate: 120 }, lore: 'A grotesque amalgamation of several unfortunate souls, stitched together by foul magic.'},
    { name: 'Crypt Lord', spriteKey: 'SKELETON', spriteColoration: { hueRotate: 270 }, lore: 'An ancient and powerful undead being that rules over this forgotten tomb.'},
    { name: 'Grave Worm', spriteKey: 'WORM', spriteColoration: { hueRotate: 300 }, lore: 'It feasts on the dead and grows fat and powerful in the deep.'},
    { name: 'Novice Lich', spriteKey: 'LICH', spriteColoration: { hueRotate: 270 }, lore: 'A sorcerer who has embraced undeath. Still learning to control its immense power.'},
    
    // Tier 4: Cavern of Whispers (30-39)
    { name: 'Gloom Spider', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 0 }, lore: 'A spider that has adapted to the eerie darkness, its venom causing vivid hallucinations.'},
    { name: 'Shadow Stalker', spriteKey: 'SHADOW', spriteColoration: { hueRotate: 0 }, lore: 'A creature of pure darkness that hunts in the deepest shadows.'},
    { name: 'Gazer Spawn', spriteKey: 'GAZER', spriteColoration: { hueRotate: 120 }, lore: 'A young, immature floating eyeball. Its magical abilities are highly unstable.'},
    { name: 'Cave Troll', spriteKey: 'TROLL', spriteColoration: { hueRotate: 0 }, lore: 'A massive, dim-witted creature of immense strength. It regenerates wounds at an alarming rate.'},
    { name: 'Corrosive Slime', spriteKey: 'SLIME', spriteColoration: { hueRotate: 60 }, lore: 'This slime\'s acidic body can dissolve armor and weapons with ease.'},
    { name: 'Doppelganger', spriteKey: 'SHADOW', spriteColoration: { hueRotate: 180 }, lore: 'A shapeshifting entity that mimics the form of other creatures... or miners.'},
    { name: 'Gargoyle', spriteKey: 'GARGOYLE', spriteColoration: { hueRotate: 220 }, lore: 'A stone sentinel that comes to life to repel intruders. Its skin is hard as rock.'},
    { name: 'Phase Spider', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 220 }, lore: 'This spider can shift between dimensions, making it incredibly difficult to hit.'},
    { name: 'Gazer', spriteKey: 'GAZER', spriteColoration: { hueRotate: 0 }, lore: 'A fully grown eyeball tyrant. Each of its eyes can project a different, deadly beam of magic.'},
    { name: 'Mind Flayer', spriteKey: 'SHADOW', spriteColoration: { hueRotate: 270 }, lore: 'An ancient, tentacled being that feeds on the minds of sentient creatures.'},

    // Tier 5: The Great Forge (40-49)
    { name: 'Fire Bat', spriteKey: 'BAT', spriteColoration: { hueRotate: 350 }, lore: 'A bat that has made its home in the volcanic depths, its wings trailing embers.' },
    { name: 'Magma Slime', spriteKey: 'SLIME', spriteColoration: { hueRotate: 30 }, lore: 'A slime composed of molten rock. Too much bouncing could cause an eruption.' },
    { name: 'Iron Golem', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 0 }, lore: 'Forged in the heart of a forgotten forge, this automaton knows no mercy.'},
    { name: 'Fire Elemental', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 0 }, lore: 'A being of pure, untamed flame. It dances with destructive glee.' },
    { name: 'Living Armor', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 0 }, lore: 'An empty suit of enchanted armor, animated by a vengeful spirit.'},
    { name: 'Hellhound', spriteKey: 'GIANT_RAT', spriteColoration: { hueRotate: 0 }, lore: 'A monstrous canine from the underworld, wreathed in flames.'},
    { name: 'Obsidian Golem', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 300 }, lore: 'Forged from volcanic glass, its edges are unnaturally sharp.'},
    { name: 'Infernal Troll', spriteKey: 'TROLL', spriteColoration: { hueRotate: 330 }, lore: 'This troll fell into a volcano and got back up, angrier and on fire.' },
    { name: 'Runic Guardian', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 180 }, lore: 'An ancient sentinel empowered by powerful runes to guard a forgotten secret.'},
    { name: 'Lesser Demon', spriteKey: 'DEMON', spriteColoration: { hueRotate: 0 }, lore: 'A fiend from another plane, summoned by the intense heat. It delights in causing pain and chaos.'},

    // Tier 6: Labyrinth of Beasts (50-59)
    { name: 'Minotaur', spriteKey: 'ORC', spriteColoration: { hueRotate: 30 }, lore: 'A bull-headed humanoid that navigates the labyrinthine caves with terrifying ease.'},
    { name: 'Cockatrice', spriteKey: 'BAT', spriteColoration: { hueRotate: 60 }, lore: 'A grotesque hybrid of a lizard and a rooster, whose gaze can turn flesh to stone.'},
    { name: 'Young Hydra', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 120 }, lore: 'Still growing its heads, but each one is filled with razor-sharp teeth.'},
    { name: 'Roc', spriteKey: 'BAT', spriteColoration: { hueRotate: 40 }, lore: 'A bird of prey so large it can carry off a troll.'},
    { name: 'Stone Hydra', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 200 }, lore: 'A hydra whose scales have petrified over centuries, making it incredibly durable.'},
    { name: 'Elder Gazer', spriteKey: 'GAZER', spriteColoration: { hueRotate: 300 }, lore: 'An ancient and powerful Gazer whose magical abilities have been honed over millennia.'},
    { name: 'Chimera', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 30 }, lore: 'A monstrous fusion of a lion, a goat, and a dragon. A failed magical experiment.'},
    { name: 'Hydra', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 90 }, lore: 'For every head you cut off, two more shall take its place. Or so the legend goes.'},
    { name: 'War Troll', spriteKey: 'TROLL', spriteColoration: { hueRotate: 60 }, lore: 'A troll that has been armored and trained for war. Smarter and more dangerous than its wild cousins.'},
    { name: 'Manticore', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 0 }, lore: 'It has the body of a lion, the wings of a dragon, and a tail that can fire venomous spikes.'},
    
    // Tier 7: Crystalline Maze (60-69)
    { name: 'Crystal Golem', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 180 }, lore: 'An automaton carved from a single, massive crystal. It refracts light in dazzling, deadly patterns.'},
    { name: 'Gem-Eater', spriteKey: 'WORM', spriteColoration: { hueRotate: 180 }, lore: 'This worm\'s diet of precious gems has made its hide as hard as diamond.'},
    { name: 'Crystal Spider', spriteKey: 'SPIDER', spriteColoration: { hueRotate: 180 }, lore: 'It spins webs of crystalline thread that are as beautiful as they are sharp.'},
    { name: 'Ruby Elemental', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 330 }, lore: 'A being of pure, solidified magical energy in a ruby form. It pulses with intense heat.'},
    { name: 'Sapphire Elemental', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 240 }, lore: 'An elemental of solidified cold. Its touch can freeze foes solid.'},
    { name: 'Haunted Greatsword', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 60 }, lore: 'The spirit animating this armor was once a great swordsman. It has not forgotten its skill.'},
    { name: 'Emerald Elemental', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 120 }, lore: 'An elemental of pure life energy, crystallized into an emerald form. It can mend its own wounds.'},
    { name: 'Diamond Golem', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 300 }, lore: 'The pinnacle of golem craftsmanship. Its body is nearly indestructible.'},
    { name: 'Crystal Lich', spriteKey: 'LICH', spriteColoration: { hueRotate: 180 }, lore: 'This lich has encased its phylactery, and itself, in near-indestructible magic crystal.'},
    { name: 'Prismatic Dragon', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 150 }, lore: 'A dragon whose scales are made of pure crystal, allowing it to focus and refract light into a devastating energy beam.'},

    // Tier 8: The Dragon's Maw (70-79)
    { name: 'Young Dragon', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 0 }, lore: 'Not yet an adult, but still a terrifying force of nature. Its fire breath is hot enough to melt steel.'},
    { name: 'Orc Dragon-Knight', spriteKey: 'ORC', spriteColoration: { hueRotate: 180 }, lore: 'A powerful orc who has managed to tame and ride a young dragon. A deadly duo.'},
    { name: 'Greater Demon', spriteKey: 'DEMON', spriteColoration: { hueRotate: -120 }, lore: 'A powerful fiend that commands lesser demons. Its very presence corrupts the air around it.' },
    { name: 'Green Dragon', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 120 }, lore: 'Its scales shimmer like emeralds, and its breath is a cloud of corrosive poison.'},
    { name: 'Black Dragon', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 300 }, lore: 'A malevolent dragon that breathes streams of acid, melting all that stands in its way.'},
    { name: 'Demon Captain', spriteKey: 'DEMON', spriteColoration: { hueRotate: 330 }, lore: 'A commander in the infernal legions, wielding a whip of pure fire.'},
    { name: 'Magma Hydra', spriteKey: 'HYDRA', spriteColoration: { hueRotate: 0 }, lore: 'This hydra lives in volcanic vents, and its multiple heads spit streams of molten rock.'},
    { name: 'Demon Lord', spriteKey: 'DEMON', spriteColoration: { hueRotate: 60 }, lore: 'A ruler of a demonic realm, possessing unimaginable power. Its mere gaze can instill terror.'},
    { name: 'Elder Dragon', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 50 }, lore: 'This dragon has lived for thousands of years. Its wisdom is matched only by its greed.'},
    { name: 'Balrog', spriteKey: 'DEMON', spriteColoration: { hueRotate: 20 }, lore: 'An ancient demon of shadow and flame. It wields a whip of pure fire and a sword of pure shadow.' },
    
    // Tier 9: The Core (80-89)
    { name: 'Cosmic Slime', spriteKey: 'SLIME', spriteColoration: { hueRotate: 270 }, lore: 'A slime containing a multitude of stars. It is surprisingly dense.'},
    { name: 'Adamantite Golem', spriteKey: 'GOLEM', spriteColoration: { hueRotate: 120 }, lore: 'Constructed from the hardest metal known, it is a truly unstoppable force.'},
    { name: 'Archlich', spriteKey: 'LICH', spriteColoration: { hueRotate: 220 }, lore: 'A lich of immense power, who has lived for thousands of years. It commands legions of the undead.'},
    { name: 'Void Dragon', spriteKey: 'DRAGON', spriteColoration: { hueRotate: 260 }, lore: 'A dragon that has spent an eternity in the void. It breathes pure entropy.'},
    { name: 'Titan', spriteKey: 'TROLL', spriteColoration: { hueRotate: 50 }, lore: 'A primordial being of immense size and power, one of the original shapers of the world.'},
    { name: 'Seraphim', spriteKey: 'LIVING_ARMOR', spriteColoration: { hueRotate: 50 }, lore: 'A celestial being of righteous fury, sent to purge the darkness from the deep.'},
    { name: 'World-Ender', spriteKey: 'DEMON', spriteColoration: { hueRotate: 200 }, lore: 'A being whose sole purpose is to bring about the end of all things.'},
    { name: 'Chaos Elemental', spriteKey: 'ELEMENTAL', spriteColoration: { hueRotate: 150 }, lore: 'A swirling vortex of every element, constantly shifting and unpredictable.'},
    { name: 'The Ancient One', spriteKey: 'WORM', spriteColoration: { hueRotate: 260 }, lore: 'A creature that existed before time itself. Its motives are unknowable.'},
    { name: 'The Core Itself', spriteKey: 'GAZER', spriteColoration: { hueRotate: 150 }, lore: 'The heart of the world, a being of pure energy and immense, terrifying power. It gazes back at you.'},
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
    name: `Endless ${archetype.name}`,
    maxHp: Math.floor(lastMob.maxHp * 1.1),
    attack: Math.floor(lastMob.attack * 1.08),
    defense: Math.floor(lastMob.defense * 1.09),
    evasion: Math.min(50, lastMob.evasion + 1),
    critChance: Math.min(40, lastMob.critChance + 1),
    spriteColoration: { hueRotate: (lastMob.spriteColoration.hueRotate + Math.random() * 40) % 360 },
    lore: `A creature from a depth beyond comprehension, twisted into a familiar but far more powerful form.`
  };
  MOBS.push(newMob);
}

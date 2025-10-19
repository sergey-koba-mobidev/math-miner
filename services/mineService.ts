
import { TILE_ROWS, TILE_COLS } from '../constants';
import { TileData, TileType } from '../types';
const { DIRT, STONE, MINERAL, SILVER_ORE, GOLD_ORE, CHEST, EASTER_EGG, EMPTY } = TileType;

export const generateInitialMine = (): TileData[][] => {
    const newGrid: TileData[][] = [];

    // --- Pre-determine locations for early rewards to attract players ---
    const earlyRewards: {r: number, c: number, type: TileType}[] = [];
    // Potential rows are 3-14
    const rewardRows = Array.from({length: 12}, (_, i) => i + 3); 
    // Potential columns avoid the far edges
    const rewardCols = Array.from({length: TILE_COLS - 4}, (_, i) => i + 2); 

    // Add 1 guaranteed chest
    const chestRowIndex = Math.floor(Math.random() * rewardRows.length);
    const chestRow = rewardRows.splice(chestRowIndex, 1)[0]; // Remove row to avoid overlap
    const chestCol = rewardCols[Math.floor(Math.random() * rewardCols.length)];
    earlyRewards.push({r: chestRow, c: chestCol, type: CHEST});
    
    // Add 3 guaranteed minerals, ensuring they don't overlap
    for (let i = 0; i < 3; i++) {
        let mineralRow, mineralCol;
        do {
            mineralRow = rewardRows[Math.floor(Math.random() * rewardRows.length)];
            mineralCol = rewardCols[Math.floor(Math.random() * rewardCols.length)];
        } while (earlyRewards.some(rew => rew.r === mineralRow && rew.c === mineralCol));
        earlyRewards.push({r: mineralRow, c: mineralCol, type: MINERAL});
    }

    for (let r = 0; r < TILE_ROWS; r++) {
      const row: TileData[] = [];
      for (let c = 0; c < TILE_COLS; c++) {
        let type: TileType;

        // Check for pre-determined early rewards first
        const earlyReward = earlyRewards.find(rew => rew.r === r && rew.c === c);

        if (earlyReward) {
            type = earlyReward.type;
        } else if (r === 0 && (c > 2 && c < 7)) {
            type = EMPTY;
        } else {
            // Regular procedural generation with corrected probabilities
            const random = Math.random();
            const goldChance = r > 75 ? 0.02 : 0;
            const silverChance = r > 40 ? 0.03 : 0;
            const mineralChance = r > 10 ? 0.08 : 0;
            const chestChance = r > 20 ? 0.015 : 0;
            const easterEggChance = r > 50 ? 0.005 : 0;
            
            const pGold = goldChance;
            const pSilver = pGold + silverChance;
            const pMineral = pSilver + mineralChance;
            const pChest = pMineral + chestChance;
            const pEasterEgg = pChest + easterEggChance;

            if (random < pGold) type = GOLD_ORE;
            else if (random < pSilver) type = SILVER_ORE;
            else if (random < pMineral) type = MINERAL;
            else if (random < pChest) type = CHEST;
            else if (random < pEasterEgg) type = EASTER_EGG;
            else if (random < pEasterEgg + 0.4) type = STONE;
            else type = DIRT;
        }
        row.push({ type, id: `${r}-${c}`, variant: Math.floor(Math.random() * 5) });
      }
      newGrid.push(row);
    }
    return newGrid;
};

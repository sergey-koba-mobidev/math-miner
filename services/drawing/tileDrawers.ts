import { TileType } from '../../types';
import { TILE_SIZE_PX } from '../../constants';

function mulberry32(a: number) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export const getTileBaseColor = (tileType: TileType): string[] => {
    switch(tileType) {
        case TileType.DIRT: return ['#6b4f3a', '#8e7a6b', '#5a3f2a'];
        case TileType.STONE: return ['#8a8a8a', '#7a7a7a', '#9a9a9a'];
        case TileType.MINERAL: return ['#4dd0e1', '#e0ffff', '#8a8a8a'];
        case TileType.SILVER_ORE: return ['#f0f0f0', '#b0b0b0', '#8a8a8a'];
        case TileType.GOLD_ORE: return ['#ffee58', '#fbc02d', '#8a8a8a'];
        case TileType.CHEST: return ['#a1887f', '#fbc02d', '#6b4f3a'];
        default: return ['#6b4f3a'];
    }
}

const drawDirt = (ctx: CanvasRenderingContext2D, variant: number, rand: () => number) => {
    ctx.fillStyle = '#6b4f3a';
    ctx.fillRect(0, 0, 64, 64);
    
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(rand() * 64, rand() * 64, rand() * 5 + 1, 0, Math.PI * 2);
        ctx.fill();
    }

    switch(variant) {
        case 0: // Pebbles
             ctx.fillStyle = '#8e7a6b';
             for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(rand() * 64, rand() * 64, rand() * 3 + 1, 0, Math.PI * 2);
                ctx.fill();
             }
            break;
        case 1: // Crack
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(rand() * 20, 0); ctx.lineTo(rand() * 20 + 20, 32); ctx.lineTo(rand() * 20 + 15, 64);
            ctx.stroke();
            break;
        case 2: // Layered
            ctx.fillStyle = '#7a5f4a';
            ctx.fillRect(0, 0, 64, 32 + (rand() * 10 - 5));
            break;
        case 3: // Roots
            ctx.strokeStyle = '#5a3f2a';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(32, 0); ctx.lineTo(30, 20); ctx.lineTo(40, 40); ctx.lineTo(38, 64);
            ctx.moveTo(30, 20); ctx.lineTo(15, 35);
            ctx.stroke();
            break;
        case 4: // Darker splotches
            ctx.fillStyle = '#5a3f2a';
             for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.ellipse(rand() * 64, rand() * 64, rand() * 10 + 5, rand() * 10 + 5, 0, 0, Math.PI * 2);
                ctx.fill();
             }
            break;
    }
};

const drawStone = (ctx: CanvasRenderingContext2D, variant: number, rand: () => number) => {
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, 64, 64);
    
    // Base texture
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let i = 0; i < 15; i++) {
        ctx.fillRect(rand() * 64, rand() * 64, rand() * 4, rand() * 4);
    }

    switch(variant) {
        case 0: // Cracks
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, rand()*64); ctx.lineTo(30, rand()*64); ctx.lineTo(35, 64);
            ctx.moveTo(30, rand()*32+16); ctx.lineTo(64, rand()*32+16);
            ctx.stroke();
            break;
        case 1: // Jagged
            ctx.fillStyle = '#7a7a7a';
            ctx.beginPath();
            ctx.moveTo(0,0); ctx.lineTo(64,0); ctx.lineTo(64,64); ctx.lineTo(32 + rand()*20-10, 50); ctx.closePath();
            ctx.fill();
            break;
        case 2: // Sedimentary
            ctx.strokeStyle = '#9a9a9a';
            for (let y = 5; y < 64; y += 10) {
                ctx.beginPath();
                ctx.moveTo(0, y + rand()*4-2); ctx.lineTo(64, y + rand()*4-2);
                ctx.stroke();
            }
            break;
        case 3: // Dark veins
            ctx.strokeStyle = '#5a5a5a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 40); ctx.quadraticCurveTo(20, 10, 64, 5 + rand() * 20);
            ctx.stroke();
            break;
        case 4: // Fractured
             ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, 32, 32);
             ctx.fillStyle = '#909090'; ctx.fillRect(32, 32, 32, 32);
            break;
    }
}

const drawMineral = (ctx: CanvasRenderingContext2D, variant: number, frame: number) => {
    const glow = 0.8 + Math.sin(frame * 0.1) * 0.2;
    ctx.shadowColor = `hsla(187, 100%, 70%, ${glow})`;
    ctx.shadowBlur = 15;

    const drawCrystal = (x: number, y: number, size: number) => {
        const grad = ctx.createRadialGradient(x, y, size * 0.1, x, y, size * 0.8);
        grad.addColorStop(0, '#e0ffff');
        grad.addColorStop(1, '#4dd0e1');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x, y - size); // Top point
        ctx.lineTo(x + size * 0.8, y); // Right point
        ctx.lineTo(x, y + size); // Bottom point
        ctx.lineTo(x - size * 0.8, y); // Left point
        ctx.closePath();
        ctx.fill();
    };

    switch(variant) {
        case 0: // Cluster
             drawCrystal(32, 32, 12);
             drawCrystal(25, 25, 8);
             drawCrystal(40, 40, 7);
            break;
        case 1: // Large Geode
            drawCrystal(32, 32, 18);
            break;
        case 2: // Crystalline Vein
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, 20); ctx.quadraticCurveTo(32, 44, 64, 30);
            ctx.lineTo(64, 40); ctx.quadraticCurveTo(32, 54, 0, 30);
            ctx.clip();
            drawCrystal(32, 32, 25);
            ctx.restore();
            break;
        case 3: // Scattered Shards
            drawCrystal(20, 25, 7);
            drawCrystal(45, 20, 8);
            drawCrystal(30, 45, 9);
            break;
        case 4: // Pulsing Heart
            const pulseSize = 15 + Math.sin(frame * 0.1) * 3;
            drawCrystal(32, 32, pulseSize);
            break;
    }
    ctx.shadowBlur = 0;
};


const drawOreVein = (ctx: CanvasRenderingContext2D, variant: number, color1: string, color2: string, rand: () => number) => {
    const grad = ctx.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.strokeStyle = grad;
    ctx.shadowColor = color1;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 4;

    switch (variant) {
        case 0:
            ctx.beginPath(); ctx.moveTo(0, 10 + rand()*10); ctx.lineTo(64, 54 + rand()*10); ctx.stroke();
            break;
        case 1:
            ctx.beginPath(); ctx.moveTo(32 + rand()*10-5, 0); ctx.lineTo(28, 32); ctx.lineTo(36, 64); ctx.stroke();
            break;
        case 2:
            ctx.lineWidth = 8;
            ctx.beginPath(); ctx.arc(32, 32, 10 + rand()*5, 0, Math.PI * 2); ctx.stroke();
            break;
        case 3:
            ctx.beginPath(); ctx.moveTo(0, 32 + rand()*10-5); ctx.lineTo(64, 32 + rand()*10-5); ctx.stroke();
            ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(32 + rand()*10-5, 0); ctx.lineTo(32 + rand()*10-5, 64); ctx.stroke();
            break;
        case 4:
            ctx.beginPath(); ctx.moveTo(0, 64); ctx.quadraticCurveTo(32, 32 + rand()*20-10, 64, 0); ctx.stroke();
            break;
    }
    ctx.shadowBlur = 0;
}

const drawChest = (ctx: CanvasRenderingContext2D, frame: number, rand: () => number) => {
    // Wood base
    const woodGrad = ctx.createLinearGradient(0, 20, 0, 54);
    woodGrad.addColorStop(0, '#a1887f');
    woodGrad.addColorStop(1, '#5d4037');
    ctx.fillStyle = woodGrad;
    ctx.fillRect(10, 26, 44, 28);
    // Lid
    const lidGrad = ctx.createLinearGradient(0, 8, 0, 26);
    lidGrad.addColorStop(0, '#bcaaa4');
    lidGrad.addColorStop(1, '#8d6e63');
    ctx.fillStyle = lidGrad;
    ctx.beginPath();
    ctx.moveTo(8, 26);
    ctx.quadraticCurveTo(32, 8, 56, 26);
    ctx.fill();

    // Gold fittings
    const goldGrad = ctx.createLinearGradient(0, 0, 64, 0);
    goldGrad.addColorStop(0, '#ffff8d');
    goldGrad.addColorStop(0.5, '#fbc02d');
    goldGrad.addColorStop(1, '#ffff8d');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(8, 24, 48, 4); // Lid strap
    ctx.fillRect(8, 28, 4, 24); // Left strap
    ctx.fillRect(52, 28, 4, 24); // Right strap
    ctx.beginPath(); // Lock
    ctx.arc(32, 40, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black'; // Keyhole
    ctx.fillRect(31, 38, 2, 4);
    
    // Glint animation
    const glintProgress = (frame % 150);
    if (glintProgress < 10) {
        ctx.fillStyle = `rgba(255, 255, 224, ${0.9 - (glintProgress)*0.09})`;
        const x = 20 + rand() * 24;
        const y = 15 + rand() * 20;
        ctx.beginPath();
        ctx.moveTo(x, y - 5); ctx.lineTo(x + 2, y); ctx.lineTo(x, y + 5); ctx.lineTo(x - 2, y);
        ctx.fill();
    }
}


const drawEasterEgg = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Pulsing glow
    const glow = 0.6 + Math.sin(frame * 0.1) * 0.4;
    const grad = ctx.createRadialGradient(32, 32, 5, 32, 32, 28);
    grad.addColorStop(0, `hsla(260, 100%, 80%, ${glow})`);
    grad.addColorStop(1, `hsla(260, 100%, 50%, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    // Orb
    ctx.fillStyle = `hsl(260, 100%, 50%)`;
    ctx.beginPath(); ctx.arc(32, 32, 18, 0, Math.PI*2); ctx.fill();
    // Question mark
    ctx.fillStyle = `hsl(50, 100%, 70%)`;
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', 32, 40);
}


export const drawTile = (ctx: CanvasRenderingContext2D, tileType: TileType, variant: number, frame: number = 0, tileId: string = '0-0') => {
    ctx.clearRect(0, 0, TILE_SIZE_PX, TILE_SIZE_PX);

    const [r, c] = tileId.split('-').map(Number);
    const seed = r * 10000 + c * 10 + variant; // A unique seed for each tile variant
    const rand = mulberry32(seed);

    switch(tileType) {
        case TileType.EMPTY:
            ctx.fillStyle = '#4e3b32';
            ctx.fillRect(0, 0, 64, 64);
            break;
        case TileType.DIRT:
            drawDirt(ctx, variant, rand);
            break;
        case TileType.STONE:
            drawStone(ctx, variant, rand);
            break;
        case TileType.MINERAL:
            drawStone(ctx, variant, rand);
            drawMineral(ctx, variant, frame);
            break;
        case TileType.SILVER_ORE:
            drawStone(ctx, variant, rand);
            drawOreVein(ctx, variant, '#f0f0f0', '#b0b0b0', rand);
            break;
        case TileType.GOLD_ORE:
            drawStone(ctx, variant, rand);
            drawOreVein(ctx, variant, '#ffee58', '#fbc02d', rand);
            break;
        case TileType.CHEST:
            drawDirt(ctx, 0, rand); // Chest on dirt
            drawChest(ctx, frame, rand);
            break;
        case TileType.EASTER_EGG:
            drawStone(ctx, 0, rand);
            drawEasterEgg(ctx, frame);
            break;
    }
}

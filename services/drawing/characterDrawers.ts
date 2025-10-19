import type { EquipmentLevels } from '../../types';
import { initialEquipment } from '../../constants';

type DrawFunction = (ctx: CanvasRenderingContext2D, frame: number, color: string, isSilhouette?: boolean, equipment?: EquipmentLevels) => void;

const getPrimaryColor = (hue: number, isSilhouette?: boolean) => isSilhouette ? '#1c1917' : `hsl(${hue}, 60%, 50%)`;
const getShadowColor = (hue: number, isSilhouette?: boolean) => isSilhouette ? '#0c0a09' : `hsl(${hue}, 60%, 30%)`;
const getEyeColor = (isSilhouette?: boolean) => isSilhouette ? '#0c0a09' : 'white';
const getPupilColor = (isSilhouette?: boolean) => isSilhouette ? '#0c0a09' : 'black';

const drawWeapon = (ctx: CanvasRenderingContext2D, level: number, frame: number, bob: number) => {
    if (level === 0) return;
    ctx.save();
    ctx.translate(50, 38 + bob);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    switch(level) {
        case 1: { // Wooden Stick
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(-2, -28, 4, 28);
            ctx.fillStyle = '#6d4c41'; ctx.fillRect(-2, -28, 2, 28);
            break;
        }
        case 2: { // Rusty Dagger
            ctx.fillStyle = '#4a2c2a'; ctx.fillRect(-2, 0, 4, 6); // Hilt
            ctx.fillStyle = '#ab47bc'; ctx.fillRect(-4, -2, 8, 2); // Guard
            const blade = ctx.createLinearGradient(0, -20, 0, 0);
            blade.addColorStop(0, '#757575'); blade.addColorStop(1, '#e0e0e0');
            ctx.fillStyle = blade;
            ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(-2.5, -2); ctx.lineTo(2.5, -2); ctx.fill();
            ctx.fillStyle = 'rgba(121, 85, 72, 0.6)'; // Rust
            ctx.fillRect(-2, -10, 1.5, 4); ctx.fillRect(1, -14, 1, 3);
            break;
        }
        case 3: { // Iron Shortsword
            const bladeLength = 22;
            const guardWidth = 8;
            const hiltColor = '#616161';
            const bladeGradient = ctx.createLinearGradient(-3, 0, 3, 0);
            bladeGradient.addColorStop(0, '#9e9e9e'); bladeGradient.addColorStop(0.5, '#f5f5f5'); bladeGradient.addColorStop(1, '#9e9e9e');
            ctx.fillStyle = hiltColor; ctx.fillRect(-2, 0, 4, 8); // Hilt
            ctx.fillRect(-guardWidth/2, -2, guardWidth, 3); // Guard
            ctx.fillStyle = bladeGradient; // Blade
            ctx.beginPath(); ctx.moveTo(0, -bladeLength); ctx.lineTo(-3, -2); ctx.lineTo(3, -2); ctx.fill();
            break;
        }
        case 4: { // Steel Longsword
            const bladeLength = 28;
            const guardWidth = 9;
            const hiltColor = '#546e7a';
            const bladeGradient = ctx.createLinearGradient(-3, 0, 3, 0);
            bladeGradient.addColorStop(0, '#b0bec5'); bladeGradient.addColorStop(0.5, '#ffffff'); bladeGradient.addColorStop(1, '#b0bec5');
            ctx.fillStyle = hiltColor; ctx.fillRect(-2, 0, 4, 8); // Hilt
            ctx.fillRect(-guardWidth/2, -2, guardWidth, 3); // Guard
            ctx.fillStyle = bladeGradient; // Blade
            ctx.beginPath(); ctx.moveTo(0, -bladeLength); ctx.lineTo(-3, -2); ctx.lineTo(3, -2); ctx.fill();
            break;
        }
        case 5: { // Mithril Blade
            const bladeLength = 32;
            const guardWidth = 10;
            const hiltColor = '#78909c';
            const bladeGradient = ctx.createLinearGradient(-3, 0, 3, 0);
            bladeGradient.addColorStop(0, '#e0e0e0'); bladeGradient.addColorStop(0.5, '#ffffff'); bladeGradient.addColorStop(1, '#e0e0e0');
            ctx.shadowColor = '#e3f2fd'; ctx.shadowBlur = 5;
            ctx.fillStyle = hiltColor; ctx.fillRect(-2, 0, 4, 9); // Hilt
            ctx.fillRect(-guardWidth/2, -2, guardWidth, 3); // Guard
            ctx.fillStyle = bladeGradient; // Blade
            ctx.beginPath(); ctx.moveTo(0, -bladeLength); ctx.lineTo(-3.5, -2); ctx.lineTo(3.5, -2); ctx.fill();
            break;
        }
        case 6: { // Elven Glaive
            ctx.fillStyle = '#c8e6c9'; ctx.fillRect(-1.5, -45, 3, 45); // Shaft
            const blade = ctx.createLinearGradient(0, -45, 10, -35);
            blade.addColorStop(0, '#fff'); blade.addColorStop(1, '#a5d6a7');
            ctx.fillStyle = blade;
            ctx.beginPath(); ctx.moveTo(1.5, -45); ctx.quadraticCurveTo(15, -40, 5, -25); ctx.lineTo(1.5, -28); ctx.fill();
            break;
        }
        case 7: { // Dwarven Axe
            ctx.fillStyle = '#6d4c41'; ctx.fillRect(-2, -35, 4, 35); // Handle
            const head = ctx.createLinearGradient(0, -35, 20, -20);
            head.addColorStop(0, '#90a4ae'); head.addColorStop(1, '#cfd8dc');
            ctx.fillStyle = head;
            ctx.beginPath(); ctx.moveTo(2, -35); ctx.lineTo(18, -32); ctx.lineTo(16, -15); ctx.lineTo(2, -20); ctx.fill();
            break;
        }
        case 8: { // Orcish Cleaver
            ctx.fillStyle = '#4e342e'; ctx.fillRect(-2, -30, 4, 30); // Handle
            const head = ctx.createLinearGradient(0, -30, 20, -10);
            head.addColorStop(0, '#757575'); head.addColorStop(1, '#bdbdbd');
            ctx.fillStyle = head;
            ctx.fillRect(2, -32, 20, 14);
            break;
        }
        case 9: { // Obsidian Katana
            ctx.fillStyle = '#212121'; ctx.fillRect(-1.5, 0, 3, 10); // Hilt
            ctx.fillStyle = '#424242'; ctx.fillRect(-4, -2, 8, 2); // Guard
            const blade = ctx.createLinearGradient(-3, 0, 3, 0);
            blade.addColorStop(0.4, '#111'); blade.addColorStop(0.5, '#482880'); blade.addColorStop(0.6, '#111');
            ctx.fillStyle = blade;
            ctx.beginPath(); ctx.moveTo(0.5, -40); ctx.quadraticCurveTo(-1, -20, -3, -2); ctx.lineTo(3, -2); ctx.quadraticCurveTo(1, -20, 0.5, -40); ctx.fill();
            break;
        }
        case 10: { // Runic Claymore
            ctx.fillStyle = '#455a64'; ctx.fillRect(-2.5, 0, 5, 12);
            ctx.fillRect(-10, -3, 20, 4);
            const blade = ctx.createLinearGradient(-4,0,4,0);
            blade.addColorStop(0, '#90a4ae'); blade.addColorStop(0.5, '#eceff1'); blade.addColorStop(1, '#90a4ae');
            ctx.fillStyle = blade; ctx.beginPath(); ctx.moveTo(0,-45); ctx.lineTo(-4,-3); ctx.lineTo(4,-3); ctx.fill();
            ctx.fillStyle = `hsla(180, 100%, 70%, ${0.7+Math.sin(frame*0.2)*0.3})`;
            ctx.shadowColor = 'cyan'; ctx.shadowBlur = 5; ctx.font = '8px serif'; ctx.fillText('~', -1, -20);
            break;
        }
        case 11: { // Knight's Lance
            ctx.fillStyle = '#a1887f'; ctx.fillRect(-1, -50, 2, 50); // Shaft
            ctx.fillStyle = '#e0e0e0'; ctx.beginPath(); ctx.moveTo(0, -55); ctx.lineTo(-2, -48); ctx.lineTo(2, -48); ctx.fill(); // Tip
            ctx.fillStyle = '#bcaaa4'; ctx.beginPath(); ctx.arc(0, 5, 5, 0, Math.PI * 2); ctx.fill(); // Hand guard
            break;
        }
        case 12: { // Holy Avenger
            ctx.fillStyle = '#fff9c4'; ctx.fillRect(-2, 0, 4, 8); // Hilt
            ctx.fillStyle = '#ffeb3b'; ctx.fillRect(-8, -3, 16, 4); // Guard
            const blade = ctx.createLinearGradient(0, 0, 0, -40);
            blade.addColorStop(0, 'white'); blade.addColorStop(1, '#ffeb3b');
            ctx.fillStyle = blade;
            ctx.shadowColor = '#ffff8d'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-4, -3); ctx.lineTo(4, -3); ctx.fill();
            break;
        }
        case 13: { // Demonslayer
            ctx.fillStyle = '#212121'; ctx.fillRect(-2, 0, 4, 8);
            ctx.fillStyle = '#e53935'; ctx.fillRect(-10, -3, 20, 4);
            const blade = ctx.createLinearGradient(-4,0,4,0);
            blade.addColorStop(0, '#616161'); blade.addColorStop(0.5, '#e0e0e0'); blade.addColorStop(1, '#616161');
            ctx.fillStyle = blade; ctx.beginPath(); ctx.moveTo(0,-42); ctx.lineTo(-4,-3); ctx.lineTo(4,-3); ctx.fill();
            break;
        }
        case 14: { // Blade of the Phoenix
            ctx.fillStyle = '#4e342e'; ctx.fillRect(-2, 0, 4, 8); // Hilt
            ctx.globalAlpha = 0.8 + Math.sin(frame * 0.3) * 0.2;
            const fire = ctx.createLinearGradient(0, 0, 0, -45);
            fire.addColorStop(0, 'red'); fire.addColorStop(0.5, 'orange'); fire.addColorStop(1, 'yellow');
            ctx.fillStyle = fire; ctx.shadowColor = 'red'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.moveTo(0, -45); ctx.quadraticCurveTo(-15, -30, -3, -3); ctx.lineTo(3, -3); ctx.quadraticCurveTo(15, -30, 0, -45); ctx.fill();
            break;
        }
        case 15: { // Dragonfang
            ctx.fillStyle = '#43a047'; ctx.fillRect(-2, 0, 4, 8);
            const blade = ctx.createLinearGradient(-3.5, 0, 3.5, 0);
            blade.addColorStop(0, '#81c784'); blade.addColorStop(0.5, '#e8f5e9'); blade.addColorStop(1, '#81c784');
            ctx.fillStyle = blade;
            ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(-3.5, -2); ctx.lineTo(3.5, -2); ctx.fill();
            break;
        }
        case 16: { // Frostbrand
            const ice = ctx.createLinearGradient(0,0,0,-42);
            ice.addColorStop(0, '#e1f5fe'); ice.addColorStop(1, '#4fc3f7');
            ctx.fillStyle = ice; ctx.shadowColor = '#81d4fa'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(-4, 0); ctx.lineTo(4, 0); ctx.fill();
            break;
        }
        case 17: { // Stormcaller
            const core = ctx.createLinearGradient(0,0,0,-45);
            core.addColorStop(0, '#7e57c2'); core.addColorStop(1, '#d1c4e9');
            ctx.fillStyle = core; ctx.beginPath(); ctx.moveTo(0,-45); ctx.lineTo(-2,0); ctx.lineTo(2,0); ctx.fill();
            ctx.strokeStyle = `rgba(224, 224, 244, ${0.5 + Math.sin(frame * 0.5) * 0.5})`; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.sin(frame*0.5)*3, -10); ctx.lineTo(Math.sin(frame*0.5)*-3, -20); ctx.lineTo(Math.sin(frame*0.5)*3, -30); ctx.lineTo(0, -45); ctx.stroke();
            break;
        }
        case 18: { // Void Reaver
            const blade = ctx.createLinearGradient(0, -50, 0, 0);
            blade.addColorStop(0, '#1a237e'); blade.addColorStop(1, '#d1c4e9');
            ctx.fillStyle = blade; ctx.beginPath(); ctx.moveTo(0,-50); ctx.lineTo(-5,0); ctx.lineTo(5,0); ctx.fill();
            ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(frame*0.1)*0.5})`;
            ctx.fillRect(0, -20, 1, 1); ctx.fillRect(-2, -30, 1, 1);
            break;
        }
        case 19: { // Celestial Scythe
            ctx.fillStyle = '#263238'; ctx.fillRect(-1.5, -50, 3, 55); // Shaft
            const blade = ctx.createRadialGradient(2, -48, 2, 2, -48, 30);
            blade.addColorStop(0, 'white'); blade.addColorStop(0.1, '#e3f2fd'); blade.addColorStop(1, '#1a237e');
            ctx.fillStyle = blade;
            ctx.beginPath(); ctx.moveTo(1.5, -50); ctx.quadraticCurveTo(30, -40, 15, -15); ctx.lineTo(1.5, -20); ctx.fill();
            break;
        }
        case 20: { // Soul Eater
            ctx.fillStyle = '#212121';
            const blade = ctx.createLinearGradient(0, -48, 0, 0);
            blade.addColorStop(0, '#80cbc4'); blade.addColorStop(1, '#004d40');
            ctx.fillStyle = blade;
            ctx.globalAlpha = 0.8;
            ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(-5, 0); ctx.lineTo(5, 0); ctx.fill();
            break;
        }
        case 21: { // Glimmering Rapier
            ctx.fillStyle = '#f8bbd0'; ctx.beginPath(); ctx.arc(0, 5, 5, 0, Math.PI*2); ctx.fill(); // hilt
            const blade = ctx.createLinearGradient(-1, 0, 1, 0);
            blade.addColorStop(0, '#e0e0e0'); blade.addColorStop(0.5, '#fff'); blade.addColorStop(1, '#e0e0e0');
            ctx.fillStyle = blade; ctx.fillRect(-1, -48, 2, 53);
            break;
        }
        case 22: { // Titan's Maul
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-3, -40, 6, 40); // Handle
            const head = ctx.createLinearGradient(-15, 0, 15, 0);
            head.addColorStop(0, '#616161'); head.addColorStop(0.5, '#bdbdbd'); head.addColorStop(1, '#616161');
            ctx.fillStyle = head; ctx.fillRect(-15, -45, 30, 15);
            break;
        }
        case 23: { // Shadowspike
            ctx.globalAlpha = 0.8;
            const blade = ctx.createLinearGradient(0, -50, 0, 0);
            blade.addColorStop(0, '#424242'); blade.addColorStop(1, '#000');
            ctx.fillStyle = blade; ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(-3, 0); ctx.lineTo(3, 0); ctx.fill();
            break;
        }
        case 24: { // Sunforged Saber
            ctx.fillStyle = '#ff6f00'; ctx.fillRect(-8, -4, 16, 5); // guard
            const blade = ctx.createLinearGradient(0, -50, 0, 0);
            const c1 = `hsl(40, 100%, ${60 + Math.sin(frame*0.2)*5}%)`;
            const c2 = `hsl(50, 100%, ${70 + Math.sin(frame*0.2)*5}%)`;
            blade.addColorStop(0, c2); blade.addColorStop(1, c1);
            ctx.fillStyle = blade; ctx.shadowColor = 'orange'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(0, -48); ctx.quadraticCurveTo(-2, -24, -3, -4); ctx.lineTo(3,-4); ctx.quadraticCurveTo(2, -24, 0, -48); ctx.fill();
            break;
        }
        case 25: { // Aetherius
            const core = ctx.createLinearGradient(0, -55, 0, 0);
            core.addColorStop(0, '#f8bbd0'); core.addColorStop(1, '#e1bee7');
            ctx.fillStyle = core; ctx.globalAlpha = 0.7; ctx.shadowColor = 'magenta'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.moveTo(0, -55); ctx.lineTo(-6, 0); ctx.lineTo(6, 0); ctx.fill();
            break;
        }
        case 26: { // Heartseeker Bow
            ctx.translate(-20, -20);
            const wood = ctx.createLinearGradient(0, -25, 0, 25);
            wood.addColorStop(0, '#8d6e63'); wood.addColorStop(1, '#5d4037');
            ctx.strokeStyle = wood; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(0, -25); ctx.quadraticCurveTo(20, 0, 0, 25); ctx.stroke();
            ctx.strokeStyle = '#fffde7'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(0, 25); ctx.stroke(); // String
            break;
        }
        case 27: { // Worldbreaker
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(-4, -45, 8, 45); // handle
            const head = ctx.createLinearGradient(-20, 0, 20, 0);
            head.addColorStop(0, '#4caf50'); head.addColorStop(0.5, '#a5d6a7'); head.addColorStop(1, '#4caf50');
            ctx.fillStyle = head; ctx.fillRect(-20, -50, 40, 15);
            break;
        }
        case 28: { // Galactic Halberd
            ctx.fillStyle = '#455a64'; ctx.fillRect(-1.5, -60, 3, 60); // shaft
            const blade = ctx.createLinearGradient(0, -60, 0, -40);
            blade.addColorStop(0, '#1a237e'); blade.addColorStop(1, '#9fa8da');
            ctx.fillStyle = blade;
            ctx.beginPath(); ctx.moveTo(1.5, -60); ctx.lineTo(15, -55); ctx.lineTo(1.5, -40); ctx.fill(); // axe part
            ctx.beginPath(); ctx.moveTo(0, -62); ctx.lineTo(-2, -58); ctx.lineTo(2, -58); ctx.fill(); // spear tip
            break;
        }
        case 29: { // Nebula Pike
            ctx.fillStyle = '#212121'; ctx.fillRect(-1, -60, 2, 60);
            const blade = ctx.createRadialGradient(0,-58, 1, 0, -58, 10);
            const c1 = `hsl(${280 + Math.sin(frame*0.1)*20}, 100%, 80%)`;
            const c2 = `hsl(${220 + Math.sin(frame*0.1)*20}, 100%, 70%)`;
            blade.addColorStop(0, c1); blade.addColorStop(1, c2);
            ctx.fillStyle = blade; ctx.shadowColor = c1; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(0,-64); ctx.lineTo(-3, -50); ctx.lineTo(3, -50); ctx.fill();
            break;
        }
        case 30: { // Dragonfire Blade
            const blade = ctx.createLinearGradient(0, -55, 0, 0);
            const c1 = `hsl(15, 100%, ${55 + Math.sin(frame*0.2)*5}%)`;
            const c2 = `hsl(35, 100%, ${50 + Math.sin(frame*0.2)*5}%)`;
            blade.addColorStop(0, c2); blade.addColorStop(1, c1);
            ctx.fillStyle = blade; ctx.shadowColor = 'red'; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.moveTo(0, -55); ctx.lineTo(-8, 0); ctx.lineTo(8, 0); ctx.fill();
            ctx.fillStyle = '#111'; ctx.shadowBlur=0;
            ctx.fillRect(-12, -4, 24, 5); // guard
            break;
        }
    }
    ctx.restore();
};

const drawShield = (ctx: CanvasRenderingContext2D, level: number, frame: number, bob: number) => {
    if (level === 0) return;
    ctx.save();
    ctx.translate(16, 36 + bob);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    switch(level) {
        case 1: { // Pot Lid
            ctx.fillStyle = '#bdbdbd'; ctx.beginPath(); ctx.arc(0,0,12,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = '#757575'; ctx.beginPath(); ctx.arc(0,0,4,0,Math.PI*2); ctx.fill();
            break;
        }
        case 2: { // Wooden Buckler
            ctx.fillStyle = '#a1887f'; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = '#795548'; ctx.fillRect(-1, -14, 2, 28); ctx.fillRect(-14, -1, 28, 2);
            ctx.fillStyle = '#616161'; ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.fill();
            break;
        }
        case 3: { // Iron Targe
            ctx.fillStyle = '#9e9e9e'; ctx.beginPath(); ctx.arc(0,0,15,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = '#757575'; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = '#616161'; ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2); ctx.fill();
            break;
        }
        case 4: { // Steel Kite Shield
            ctx.fillStyle = '#b0bec5';
            ctx.beginPath(); ctx.moveTo(0, -18); ctx.quadraticCurveTo(15, -10, 14, 5); ctx.quadraticCurveTo(12, 18, 0, 20); ctx.quadraticCurveTo(-12, 18, -14, 5); ctx.quadraticCurveTo(-15, -10, 0, -18); ctx.fill();
            ctx.fillStyle = '#90a4ae';
            ctx.beginPath(); ctx.moveTo(0,-18); ctx.lineTo(1,-18); ctx.lineTo(1, 20); ctx.lineTo(-1, 20); ctx.lineTo(-1,-18); ctx.fill();
            break;
        }
        case 5: { // Tower Shield
            ctx.fillStyle = '#90a4ae'; ctx.fillRect(-12, -20, 24, 40);
            ctx.fillStyle = '#cfd8dc'; ctx.fillRect(-10, -18, 20, 36);
            break;
        }
        case 6: { // Mithril Aegis
            ctx.fillStyle = '#e0e0e0'; ctx.shadowColor = '#e3f2fd'; ctx.shadowBlur = 5;
            ctx.beginPath(); ctx.moveTo(0, -20); ctx.quadraticCurveTo(16, -10, 15, 5); ctx.quadraticCurveTo(13, 20, 0, 22); ctx.quadraticCurveTo(-13, 20, -15, 5); ctx.quadraticCurveTo(-16, -10, 0, -20); ctx.fill();
            break;
        }
        case 7: { // Elven Spellshield
            ctx.fillStyle = '#a5d6a7';
            ctx.beginPath(); ctx.moveTo(0,-20); ctx.bezierCurveTo(20, -10, 15, 20, 0, 22); ctx.bezierCurveTo(-15, 20, -20, -10, 0, -20); ctx.fill();
            const runeColor = `hsla(120, 80%, 80%, ${0.6 + Math.sin(frame * 0.2) * 0.4})`;
            ctx.fillStyle = runeColor; ctx.shadowColor = 'lightgreen'; ctx.shadowBlur = 5; ctx.font = '10px serif'; ctx.fillText('?', -2, 4);
            break;
        }
        case 8: { // Dwarven Bulwark
            ctx.fillStyle = '#78909c';
            ctx.beginPath(); ctx.moveTo(-10, -16); ctx.lineTo(10,-16); ctx.lineTo(18,0); ctx.lineTo(10,16); ctx.lineTo(-10,16); ctx.lineTo(-18,0); ctx.closePath(); ctx.fill();
            break;
        }
        case 9: { // Orcish War-Door
            ctx.fillStyle = '#795548'; ctx.fillRect(-14, -22, 28, 44);
            ctx.fillStyle = '#757575'; ctx.fillRect(-16, -2, 32, 4);
            ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(-2, -26); ctx.lineTo(2,-26); ctx.fill(); // spike
            ctx.beginPath(); ctx.moveTo(0, 22); ctx.lineTo(-2, 26); ctx.lineTo(2,26); ctx.fill(); // spike
            break;
        }
        case 10: { // Obsidian Barrier
            ctx.fillStyle = '#212121';
            ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(16, 0); ctx.lineTo(0, 22); ctx.lineTo(-16, 0); ctx.closePath(); ctx.fill();
            break;
        }
        case 11: { // Runic Ward
            ctx.fillStyle = '#455a64'; ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = `hsla(180, 100%, 70%, ${0.7+Math.sin(frame*0.2)*0.3})`;
            ctx.shadowColor = 'cyan'; ctx.shadowBlur = 8;
            ctx.font = '10px serif'; ctx.fillText('ᛟ', -4, 4);
            break;
        }
        case 12: { // Knight's Guard
            ctx.fillStyle = '#cfd8dc';
            ctx.beginPath(); ctx.moveTo(-14,-18); ctx.lineTo(14, -18); ctx.lineTo(14, 10); ctx.quadraticCurveTo(0, 22, -14, 10); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffc107'; ctx.fillRect(-2, -10, 4, 20); ctx.fillRect(-8, -2, 16, 4);
            break;
        }
        case 13: { // Holy Protector
            ctx.fillStyle = '#ffeb3b'; ctx.shadowColor = 'yellow'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(-14,-18); ctx.lineTo(14, -18); ctx.lineTo(14, 10); ctx.quadraticCurveTo(0, 22, -14, 10); ctx.closePath(); ctx.fill();
            break;
        }
        case 14: { // Demonwall
            ctx.fillStyle = '#424242'; ctx.fillRect(-14, -22, 28, 44);
            const eyeColor = `hsla(0, 100%, 50%, ${0.7+Math.sin(frame*0.1)*0.3})`;
            ctx.fillStyle = eyeColor; ctx.shadowColor = 'red'; ctx.shadowBlur = 5;
            ctx.beginPath(); ctx.moveTo(-8, -5); ctx.lineTo(0, 5); ctx.lineTo(8, -5); ctx.fill(); // Angry eyes
            break;
        }
        case 15: { // Phoenix Embrace
            const grad = ctx.createRadialGradient(0,0,2,0,0,22);
            grad.addColorStop(0, 'yellow'); grad.addColorStop(1, 'red');
            ctx.fillStyle = grad; ctx.globalAlpha = 0.8 + Math.sin(frame * 0.3) * 0.2;
            ctx.shadowColor = 'orange'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.moveTo(0, -22); ctx.quadraticCurveTo(25, 0, 0, 24); ctx.quadraticCurveTo(-25, 0, 0, -22); ctx.fill();
            break;
        }
        case 16: { // Dragonscale Shield
            ctx.fillStyle = '#2e7d32'; ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = '#66bb6a';
            for(let i=-20; i<20; i+=8) for(let j=-20; j<20; j+=8) {
                if(Math.sqrt(i*i+j*j) < 20) { ctx.beginPath(); ctx.arc(i, j, 4, 0, Math.PI); ctx.fill(); }
            }
            break;
        }
        case 17: { // Aegis of Storms
            ctx.fillStyle = '#5e35b1'; ctx.beginPath(); ctx.arc(0,0,20,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle = `rgba(224, 224, 244, ${0.5 + Math.sin(frame * 0.5) * 0.5})`;
            ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(0, 0); ctx.lineTo(10, 10); ctx.stroke();
            break;
        }
        case 18: { // Void Mirror
            const grad = ctx.createRadialGradient(0,0,1,0,0,22);
            grad.addColorStop(0, '#424242'); grad.addColorStop(1, '#000');
            ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(0,0,16,22,0,0,Math.PI*2); ctx.fill();
            break;
        }
        case 19: { // Celestial Bastion
            const grad = ctx.createLinearGradient(-16, 0, 16, 0);
            grad.addColorStop(0, '#1a237e'); grad.addColorStop(1, '#673ab7');
            ctx.fillStyle = grad; ctx.fillRect(-16, -22, 32, 44);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(frame*0.1)*0.3})`;
            ctx.fillRect(-5, 4, 1, 1); ctx.fillRect(8, 6, 1, 1); ctx.fillRect(0, 15, 1, 1);
            break;
        }
        case 20: { // Soul Warden
            ctx.globalAlpha = 0.7;
            const grad = ctx.createRadialGradient(0,0,5,0,0,22);
            grad.addColorStop(0, 'white'); grad.addColorStop(1, '#009688');
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0,0,22,0,Math.PI*2); ctx.fill();
            break;
        }
        case 21: { // Crystal Deflector
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#b3e5fc'; ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(20, 0); ctx.lineTo(0, 24); ctx.lineTo(-20, 0); ctx.fill();
            ctx.strokeStyle = '#e1f5fe'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0,-24); ctx.lineTo(0,24); ctx.moveTo(-20,0); ctx.lineTo(20,0); ctx.stroke();
            break;
        }
        case 22: { // Titan's Guard
            ctx.fillStyle = '#616161'; ctx.fillRect(-18, -25, 36, 50);
            ctx.fillStyle = '#9e9e9e'; ctx.fillRect(-16, -23, 32, 46);
            break;
        }
        case 23: { // Shadow Barrier
            ctx.globalAlpha = 0.7 + Math.sin(frame*0.2)*0.1;
            const grad = ctx.createRadialGradient(0,0,5,0,0,24);
            grad.addColorStop(0, '#424242'); grad.addColorStop(1, 'black');
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2); ctx.fill();
            break;
        }
        case 24: { // Sunstone Aegis
            const grad = ctx.createRadialGradient(0,0,2,0,0,22);
            const c1 = `hsl(40, 100%, ${60 + Math.sin(frame*0.2)*5}%)`;
            const c2 = `hsl(50, 100%, ${70 + Math.sin(frame*0.2)*5}%)`;
            grad.addColorStop(0, c2); grad.addColorStop(1, c1);
            ctx.fillStyle = grad; ctx.shadowColor = 'orange'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.arc(0,0,22,0,Math.PI*2); ctx.fill();
            break;
        }
        case 25: { // Aetherium Wall
            ctx.fillStyle = `hsla(320, 80%, 80%, ${0.6 + Math.sin(frame*0.1)*0.2})`;
            ctx.strokeStyle = `hsla(320, 80%, 90%, ${0.8 + Math.sin(frame*0.1)*0.2})`;
            ctx.shadowColor = 'magenta'; ctx.shadowBlur = 10;
            ctx.fillRect(-16, -22, 32, 44);
            ctx.strokeRect(-16, -22, 32, 44);
            break;
        }
        case 26: { // Heartwood Shield
            ctx.fillStyle = '#6d4c41'; ctx.beginPath(); ctx.ellipse(0,0,18,24,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#81c784'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0,-20); ctx.quadraticCurveTo(5, -5, 0, 0); ctx.quadraticCurveTo(-5, 5, 0, 20); ctx.stroke();
            break;
        }
        case 27: { // World-Shell
            ctx.fillStyle = '#a1887f'; ctx.beginPath(); ctx.arc(0,0,23,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1;
            for(let i=-2; i<=2; i++) {
                const y = i*6;
                const xOffset = i%2 === 0 ? 0 : 5;
                const hexWidth = 10;
                ctx.strokeRect(xOffset - (hexWidth/2), y, hexWidth, 6);
            }
            break;
        }
        case 28: { // Galactic Barricade
            ctx.fillStyle = '#000'; ctx.fillRect(-18, -25, 36, 50);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(frame*0.1)*0.3})`;
            ctx.fillRect(-10, -15, 2, 2); ctx.fillRect(5, -8, 1, 1); ctx.fillRect(-5, 10, 1, 1);
            break;
        }
        case 29: { // Nebula Ward
            const grad = ctx.createRadialGradient(0,0,1,0,0,25);
            const c1 = `hsl(${280 + Math.sin(frame*0.1)*20}, 100%, 80%)`;
            const c2 = `hsl(${220 + Math.sin(frame*0.1)*20}, 100%, 70%)`;
            grad.addColorStop(0, c1); grad.addColorStop(1, c2);
            ctx.fillStyle = grad; ctx.shadowColor = c1; ctx.shadowBlur = 10;
            ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(0,0,25,0,Math.PI*2); ctx.fill();
            break;
        }
        case 30: { // Aegis of the Dragonheart
            ctx.fillStyle = '#212121'; ctx.fillRect(-16, -25, 32, 50);
            const gemColor = `hsla(0, 100%, 60%, ${0.7 + Math.sin(frame * 0.15) * 0.3})`;
            ctx.fillStyle = gemColor; ctx.shadowColor = 'red'; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
            break;
        }
    }
    ctx.restore();
};

const drawHelmet = (ctx: CanvasRenderingContext2D, level: number, frame: number, bob: number) => {
    ctx.save();
    ctx.translate(32, 19 + bob);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    if (level === 0) {
        ctx.fillStyle = '#4e342e'; // Hair
        ctx.beginPath(); ctx.arc(0, -3, 9, 0, Math.PI, true); ctx.fill();
        ctx.restore(); return;
    }
    switch(level) {
        case 1: { // Leather Cap
            ctx.fillStyle = '#a1887f'; ctx.beginPath(); ctx.arc(0,0,10,Math.PI, 0); ctx.fill();
            break;
        }
        case 2: { // Iron Pot Helm
            ctx.fillStyle = '#9e9e9e'; ctx.beginPath(); ctx.arc(0,2,10,Math.PI, 0); ctx.fill();
            ctx.fillRect(-10, 1, 20, 2);
            break;
        }
        case 3: { // Steel Sallet
            ctx.fillStyle = '#b0bec5'; ctx.beginPath(); ctx.arc(0,0,10,Math.PI, 0); ctx.fill();
            ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(12, 4); ctx.lineTo(-12, 4); ctx.lineTo(-10,0); ctx.fill();
            break;
        }
        case 4: { // Full Helm
            ctx.fillStyle = '#b0bec5'; ctx.fillRect(-10, -8, 20, 16);
            ctx.fillStyle = '#455a64'; ctx.fillRect(-11, -2, 22, 4); // Visor slit
            break;
        }
        case 5: { // Mithril Coif
            ctx.fillStyle = '#e0e0e0'; ctx.shadowColor = '#e3f2fd'; ctx.shadowBlur = 5;
            ctx.fillRect(-10, -8, 20, 16);
            ctx.fillStyle = '#78909c'; ctx.fillRect(-1, -1, 2, 2);
            break;
        }
        case 6: { // Elven Circlet
            ctx.fillStyle = '#fffde7'; ctx.fillRect(-10, -2, 20, 2);
            ctx.fillStyle = `hsl(120, 100%, ${80 + Math.sin(frame*0.2)*10}%)`;
            ctx.beginPath(); ctx.moveTo(0,-2); ctx.lineTo(-3,-6); ctx.lineTo(3,-6); ctx.fill();
            break;
        }
        case 7: { // Dwarven Greathelm
            ctx.fillStyle = '#78909c'; ctx.fillRect(-12, -10, 24, 18);
            ctx.fillStyle = '#546e7a'; ctx.fillRect(-13, -4, 26, 6);
            break;
        }
        case 8: { // Orcish Skull-helm
            ctx.fillStyle = '#ede7f6'; ctx.beginPath(); ctx.arc(0,0,10,Math.PI,0); ctx.fill();
            ctx.fillStyle = '#bcaaa4';
            ctx.beginPath(); ctx.moveTo(10, -2); ctx.lineTo(14, -6); ctx.lineTo(10,2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(-10, -2); ctx.lineTo(-14, -6); ctx.lineTo(-10,2); ctx.fill();
            break;
        }
        case 9: { // Obsidian Visage
            ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(-12, 8); ctx.lineTo(12, 8); ctx.fill();
            ctx.fillStyle = `hsl(300, 80%, ${60+Math.sin(frame*0.2)*10}%)`; ctx.fillRect(-4, -1, 8, 2);
            break;
        }
        case 10: { // Runic Casque
            ctx.fillStyle = '#455a64'; ctx.fillRect(-11, -9, 22, 17);
            ctx.fillStyle = `hsla(180, 100%, 70%, ${0.7+Math.sin(frame*0.2)*0.3})`;
            ctx.shadowColor = 'cyan'; ctx.shadowBlur = 5;
            ctx.font = '10px serif'; ctx.fillText('ᛟ', -4, 2);
            break;
        }
        case 11: { // Knight's Armet
            ctx.fillStyle = '#cfd8dc'; ctx.fillRect(-11, -9, 22, 18);
            ctx.fillStyle = '#b0bec5'; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(-11, -4); ctx.lineTo(11, -4); ctx.fill();
            break;
        }
        case 12: { // Crown of Light
            ctx.fillStyle = `hsl(50, 100%, ${70 + Math.sin(frame * 0.2) * 10}%)`;
            ctx.shadowColor = 'yellow'; ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(-14, 0); ctx.lineTo(-10, -10); ctx.lineTo(-4, 0); ctx.lineTo(0, -12); ctx.lineTo(4, 0); ctx.lineTo(10, -10); ctx.lineTo(14, 0); ctx.closePath(); ctx.fill();
            break;
        }
        case 13: { // Helm of Domination
            ctx.fillStyle = '#616161'; ctx.fillRect(-12, -10, 24, 18);
            ctx.fillStyle = '#e53935'; ctx.beginPath(); ctx.arc(0,-2,3,0,Math.PI*2); ctx.fill(); // gem
            ctx.fillStyle = '#424242';
            ctx.beginPath(); ctx.moveTo(12,-8); ctx.lineTo(18, -14); ctx.lineTo(12, 0); ctx.fill(); // horn R
            ctx.beginPath(); ctx.moveTo(-12,-8); ctx.lineTo(-18, -14); ctx.lineTo(-12, 0); ctx.fill(); // horn L
            break;
        }
        case 14: { // Phoenix Crest
            ctx.fillStyle = '#ffb74d'; ctx.fillRect(-10, -8, 20, 16);
            ctx.globalAlpha = 0.8 + Math.sin(frame * 0.3) * 0.2;
            const fire = ctx.createLinearGradient(0, -8, 0, -20);
            fire.addColorStop(0, 'red'); fire.addColorStop(1, 'yellow');
            ctx.fillStyle = fire; ctx.shadowColor = 'red'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(-8,-8); ctx.lineTo(8,-8); ctx.fill();
            break;
        }
        case 15: { // Dragon-Skull Helm
            ctx.fillStyle = '#f5f5f5';
            ctx.beginPath(); ctx.arc(0,0,11,Math.PI,0); ctx.fill();
            ctx.fillStyle = '#bdbdbd';
            ctx.beginPath(); ctx.moveTo(11,-2); ctx.lineTo(15, -4); ctx.lineTo(11, 2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(-11,-2); ctx.lineTo(-15, -4); ctx.lineTo(-11, 2); ctx.fill();
            break;
        }
        case 16: { // Helm of Winter
            const grad = ctx.createRadialGradient(0,0,2,0,0,12);
            grad.addColorStop(0, '#e3f2fd'); grad.addColorStop(1, '#4fc3f7');
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0,0,12,Math.PI, 0); ctx.fill();
            break;
        }
        case 17: { // Crown of Tempests
            ctx.fillStyle = '#5e35b1'; ctx.fillRect(-10, -2, 20, 4);
            ctx.strokeStyle = `rgba(224, 224, 244, ${0.5 + Math.sin(frame * 0.5) * 0.5})`;
            ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-10,-2); ctx.lineTo(-5, -12); ctx.lineTo(0,-2); ctx.lineTo(5, -12); ctx.lineTo(10,-2); ctx.stroke();
            break;
        }
        case 18: { // Void Gaze
            ctx.fillStyle = '#212121'; ctx.fillRect(-12, -10, 24, 18);
            const grad = ctx.createRadialGradient(0, -1, 1, 0, -1, 10);
            grad.addColorStop(0, '#d1c4e9'); grad.addColorStop(1, '#1a237e');
            ctx.fillStyle = grad; ctx.fillRect(-10, -4, 20, 6);
            break;
        }
        case 19: { // Celestial Crown
            ctx.fillStyle = '#1a237e'; ctx.fillRect(-12, -3, 24, 5);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(frame*0.1)*0.3})`;
            ctx.fillRect(0, -6, 1, 1); ctx.fillRect(-8, -4, 1, 1); ctx.fillRect(8, -4, 1, 1);
            break;
        }
        case 20: { // Soul Cage
            ctx.fillStyle = '#263238'; ctx.fillRect(-11, -9, 22, 17);
            ctx.strokeStyle = `hsla(170, 100%, 70%, ${0.7+Math.sin(frame*0.2)*0.3})`;
            ctx.lineWidth = 1;
            for (let y = -9; y < 8; y+=4) ctx.beginPath(), ctx.moveTo(-11, y), ctx.lineTo(11, y), ctx.stroke();
            break;
        }
        case 21: { // Crystal Diadem
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#b3e5fc';
            ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(-12, -2); ctx.lineTo(12, -2); ctx.fill();
            break;
        }
        case 22: { // Titan's Visor
            ctx.fillStyle = '#616161'; ctx.fillRect(-14, -12, 28, 22);
            ctx.fillStyle = '#e57373'; ctx.fillRect(-10, -4, 20, 4); // glowing visor
            break;
        }
        case 23: { // Shadow Cowl
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(0,8,14,Math.PI,0); ctx.fill();
            break;
        }
        case 24: { // Sun-Crest Helm
            ctx.fillStyle = '#ffb300'; ctx.fillRect(-11, -9, 22, 17);
            const grad = ctx.createRadialGradient(0,-2,1,0,-2,8);
            const c1 = `hsl(40, 100%, ${60 + Math.sin(frame*0.2)*5}%)`;
            grad.addColorStop(0, c1); grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad; ctx.fillRect(-8, -9, 16, 16);
            break;
        }
        case 25: { // Aetherium Crown
            const c = `hsla(320, 80%, 80%, ${0.6 + Math.sin(frame*0.1)*0.2})`;
            ctx.strokeStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 10; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2); ctx.stroke();
            break;
        }
        case 26: { // Helm of the Guardian
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(-12, -10, 24, 18);
            ctx.fillStyle = '#a5d6a7';
            ctx.beginPath(); ctx.moveTo(12,-8); ctx.lineTo(18, -4); ctx.lineTo(12, 0); ctx.fill(); // leaf R
            ctx.beginPath(); ctx.moveTo(-12,-8); ctx.lineTo(-18, -4); ctx.lineTo(-12, 0); ctx.fill(); // leaf L
            break;
        }
        case 27: { // World-Helm
            ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.arc(0,0,12,Math.PI,0); ctx.fill();
            ctx.fillStyle = '#2196f3'; ctx.beginPath(); ctx.arc(0,0,12,0,Math.PI); ctx.fill();
            break;
        }
        case 28: { // Galactic Crown
            ctx.fillStyle = '#000'; ctx.fillRect(-14, -4, 28, 6);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(frame*0.1)*0.3})`;
            ctx.fillRect(-10, -1, 1, 1); ctx.fillRect(5, -2, 1, 1);
            break;
        }
        case 29: { // Nebula Veil
            const grad = ctx.createRadialGradient(0,0,1,0,0,14);
            const c1 = `hsl(${280 + Math.sin(frame*0.1)*20}, 100%, 80%)`;
            const c2 = `hsl(${220 + Math.sin(frame*0.1)*20}, 100%, 70%)`;
            grad.addColorStop(0, c1); grad.addColorStop(1, c2);
            ctx.fillStyle = grad; ctx.shadowColor = c1; ctx.shadowBlur = 10;
            ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(0,0,14,Math.PI, 0); ctx.fill();
            break;
        }
        case 30: { // Dragon-Visage Helm
            ctx.fillStyle = '#558b2f'; ctx.fillRect(-12, -10, 24, 18);
            const eyeColor = `hsl(60, 100%, ${50+Math.sin(frame*0.1)*5}%)`;
            ctx.fillStyle = eyeColor; ctx.fillRect(-8, -4, 5, 3); ctx.fillRect(3, -4, 5, 3);
            ctx.fillStyle = '#9e9e9e';
            ctx.beginPath(); ctx.moveTo(12,-8); ctx.lineTo(20, -12); ctx.lineTo(12, 0); ctx.fill();
            ctx.beginPath(); ctx.moveTo(-12,-8); ctx.lineTo(-20, -12); ctx.lineTo(-12, 0); ctx.fill();
            break;
        }
    }
    ctx.restore();
};

const drawArmor = (ctx: CanvasRenderingContext2D, level: number, frame: number, bob: number) => {
    if (level === 0) return;
    ctx.save();
    ctx.translate(32, 30 + bob);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    let draw = () => { // Default Padded Shirt
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(-12, 0, 24, 20);
    };

    switch(level) {
        case 1: break; // Padded Shirt
        case 2: // Leather Jerkin
            draw = () => {
                ctx.fillStyle = '#a1887f'; ctx.fillRect(-12, 0, 24, 20);
                ctx.fillStyle = '#795548'; ctx.fillRect(-13, 4, 26, 2);
            };
            break;
        case 3: // Ring Mail
            draw = () => {
                ctx.fillStyle = '#bdbdbd'; ctx.fillRect(-12, 0, 24, 20);
                ctx.strokeStyle = '#9e9e9e'; ctx.lineWidth = 1;
                for(let y=2; y<20; y+=4) {
                    ctx.beginPath(); ctx.moveTo(-10, y); ctx.lineTo(10, y); ctx.stroke();
                }
            };
            break;
        case 4: // Chainmail Hauberk
             draw = () => {
                ctx.fillStyle = '#cfd8dc'; ctx.fillRect(-12, 0, 24, 20);
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                for(let y=1; y<20; y+=3) for(let x=-11; x<12; x+=3) ctx.fillRect(x,y,1,1);
            };
            break;
        case 5: // Steel Plate
            draw = () => {
                const grad = ctx.createLinearGradient(-13, 0, 13, 0);
                grad.addColorStop(0, '#b0bec5'); grad.addColorStop(0.5, '#f5f5f5'); grad.addColorStop(1, '#b0bec5');
                ctx.fillStyle = grad; ctx.fillRect(-13, 0, 26, 22);
            };
            break;
        case 6: // Mithril Coat
            draw = () => {
                const grad = ctx.createLinearGradient(-13, 0, 13, 0);
                grad.addColorStop(0, '#eceff1'); grad.addColorStop(0.5, '#ffffff'); grad.addColorStop(1, '#eceff1');
                ctx.fillStyle = grad; ctx.shadowColor = '#e3f2fd'; ctx.shadowBlur = 5;
                ctx.fillRect(-13, 0, 26, 22);
            };
            break;
        case 7: // Elven Leaf-mail
            draw = () => {
                ctx.fillStyle = '#a5d6a7'; ctx.fillRect(-12, 0, 24, 20);
                ctx.fillStyle = '#81c784';
                ctx.beginPath(); ctx.moveTo(0,4); ctx.lineTo(-8, 12); ctx.lineTo(0, 20); ctx.lineTo(8,12); ctx.fill();
            };
            break;
        case 8: // Dwarven Plating
            draw = () => {
                ctx.fillStyle = '#78909c'; ctx.fillRect(-14, -2, 28, 24);
                ctx.strokeStyle = '#546e7a'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-14, 8); ctx.lineTo(14, 8); ctx.stroke();
            };
            break;
        case 9: // Orcish War-harness
            draw = () => {
                ctx.fillStyle = '#795548'; ctx.fillRect(-14, 0, 28, 22);
                ctx.fillStyle = '#bdbdbd'; // Spikes
                ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-16, 4); ctx.lineTo(-14, 4); ctx.fill();
                ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(16, 4); ctx.lineTo(14, 4); ctx.fill();
            };
            break;
        case 10: // Obsidian Chestplate
            draw = () => {
                ctx.fillStyle = '#212121';
                ctx.beginPath(); ctx.moveTo(0,22); ctx.lineTo(-14,0); ctx.lineTo(14,0); ctx.fill();
                ctx.strokeStyle = `hsla(300, 100%, 70%, ${0.7+Math.sin(frame*0.2)*0.3})`;
                ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5, 8); ctx.lineTo(0, 12); ctx.lineTo(5, 8); ctx.stroke();
            };
            break;
        case 11: // Runic Brigandine
            draw = () => {
                ctx.fillStyle = '#455a64'; ctx.fillRect(-13, 0, 26, 22);
                ctx.fillStyle = `hsla(180, 100%, 70%, ${0.7+Math.sin(frame*0.2)*0.3})`;
                ctx.shadowColor = 'cyan'; ctx.shadowBlur = 5;
                ctx.font = '10px serif'; ctx.fillText('~', -2, 12);
            };
            break;
        case 12: // Knight's Cuirass
            draw = () => {
                const grad = ctx.createLinearGradient(-13, 0, 13, 0);
                grad.addColorStop(0, '#cfd8dc'); grad.addColorStop(0.5, '#ffffff'); grad.addColorStop(1, '#cfd8dc');
                ctx.fillStyle = grad; ctx.fillRect(-13, 0, 26, 22);
                ctx.fillStyle = '#b0bec5';
                ctx.beginPath(); ctx.moveTo(-15, -2); ctx.lineTo(-13,0); ctx.lineTo(-10,0); ctx.fill(); // Pauldron L
                ctx.beginPath(); ctx.moveTo(15, -2); ctx.lineTo(13,0); ctx.lineTo(10,0); ctx.fill(); // Pauldron R
            };
            break;
        case 13: // Holy Vestments
            draw = () => {
                ctx.fillStyle = '#fffde7'; ctx.fillRect(-13, 0, 26, 22);
                ctx.fillStyle = '#ffeb3b'; ctx.fillRect(-14, 4, 28, 4);
            };
            break;
        case 14: // Demonbone Armor
            draw = () => {
                ctx.fillStyle = '#ede7f6';
                ctx.fillRect(-12, 0, 24, 20); // Base
                ctx.fillStyle = '#d1c4e9'; // Ribs
                for (let y=2; y < 18; y+=4) {
                    ctx.beginPath(); ctx.moveTo(-12, y); ctx.quadraticCurveTo(0, y+2, 12, y); ctx.lineTo(12, y-2); ctx.quadraticCurveTo(0, y, -12, y-2); ctx.fill();
                }
            };
            break;
        case 15: // Phoenix Plume Raiment
            draw = () => {
                ctx.fillStyle = '#ff8a65'; ctx.fillRect(-12, 0, 24, 22);
                const grad = ctx.createLinearGradient(0,0,0,22);
                grad.addColorStop(0, 'rgba(255, 236, 179, 0.8)');
                grad.addColorStop(1, 'rgba(255, 209, 128, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-10, 22); ctx.lineTo(10, 22); ctx.fill();
            };
            break;
        case 16: // Dragonskin Tunic
            draw = () => {
                ctx.fillStyle = '#2e7d32'; ctx.fillRect(-12, 0, 24, 22);
                ctx.fillStyle = '#66bb6a';
                for(let y=0; y<22; y+=6) for(let x=-10; x<10; x+=6) {
                     ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI); ctx.fill();
                }
            };
            break;
        case 17: // Storm-forged Plate
            draw = () => {
                ctx.fillStyle = '#5e35b1'; ctx.fillRect(-13, 0, 26, 22);
                ctx.strokeStyle = `rgba(224, 224, 244, ${0.5 + Math.sin(frame * 0.5) * 0.5})`;
                ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-10, 2); ctx.lineTo(-2, 10); ctx.lineTo(-8, 18); ctx.stroke();
            };
            break;
        case 18: // Void Carapace
            draw = () => {
                const grad = ctx.createLinearGradient(0,0,0,22);
                grad.addColorStop(0, '#1a237e'); grad.addColorStop(1, '#000');
                ctx.fillStyle = grad; ctx.fillRect(-14, 0, 28, 22);
            };
            break;
        case 19: // Celestial Armor
            draw = () => {
                const grad = ctx.createLinearGradient(-13, 0, 13, 22);
                grad.addColorStop(0, '#1a237e'); grad.addColorStop(1, '#673ab7');
                ctx.fillStyle = grad; ctx.fillRect(-13, 0, 26, 22);
                 ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(frame*0.1)*0.3})`;
                ctx.fillRect(-5, 4, 1, 1); ctx.fillRect(8, 6, 1, 1); ctx.fillRect(0, 15, 1, 1);
            };
            break;
        case 20: // Soulforged Breastplate
            draw = () => {
                ctx.globalAlpha = 0.8;
                const grad = ctx.createLinearGradient(0,0,0,22);
                grad.addColorStop(0, '#b2dfdb'); grad.addColorStop(1, '#004d40');
                ctx.fillStyle = grad; ctx.fillRect(-13, 0, 26, 22);
            };
            break;
        case 21: // Crystal Mail
            draw = () => {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#b3e5fc'; ctx.fillRect(-13, 0, 26, 22);
                ctx.strokeStyle = '#e1f5fe'; ctx.lineWidth = 1; ctx.strokeRect(-13,0,26,22);
            };
            break;
        case 22: // Titan's Carapace
             draw = () => {
                ctx.fillStyle = '#616161'; ctx.fillRect(-16, -2, 32, 26);
                ctx.fillStyle = '#9e9e9e'; ctx.fillRect(-14, 0, 28, 22);
            };
            break;
        case 23: // Shadow-weave Tunic
            draw = () => {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#212121'; ctx.fillRect(-12, 0, 24, 22);
                const mist = ctx.createLinearGradient(0, 22, 0, 30);
                mist.addColorStop(0, '#212121'); mist.addColorStop(1, 'transparent');
                ctx.fillStyle = mist; ctx.fillRect(-13, 22, 26, 8);
            };
            break;
        case 24: // Sun-plate Armor
            draw = () => {
                ctx.fillStyle = '#ffb300'; ctx.fillRect(-14, 0, 28, 22);
                const grad = ctx.createRadialGradient(0,10,2,0,10,12);
                const c1 = `hsl(40, 100%, ${60 + Math.sin(frame*0.2)*5}%)`;
                grad.addColorStop(0, c1); grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad; ctx.fillRect(-12, -2, 24, 24);
            };
            break;
        case 25: // Aetherium Plate
            draw = () => {
                const c = `hsla(320, 80%, 80%, ${0.6 + Math.sin(frame*0.1)*0.2})`;
                ctx.fillStyle = c; ctx.shadowColor = 'magenta'; ctx.shadowBlur = 10;
                ctx.fillRect(-13, 0, 26, 22);
            };
            break;
        case 26: // Heart-Plate of the Forest
            draw = () => {
                ctx.fillStyle = '#8d6e63'; ctx.fillRect(-12, 0, 24, 22);
                ctx.strokeStyle = '#81c784'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(5, 10, 0, 22); ctx.stroke();
            };
            break;
        case 27: // World-Plate
            draw = () => {
                ctx.fillStyle = '#2196f3'; ctx.fillRect(-14, 0, 28, 11);
                ctx.fillStyle = '#4caf50'; ctx.fillRect(-14, 11, 28, 11);
            };
            break;
        case 28: // Galactic Raiment
            draw = () => {
                ctx.fillStyle = '#000'; ctx.fillRect(-13, 0, 26, 22);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(frame*0.1)*0.3})`;
                ctx.fillRect(-8, 5, 1, 1); ctx.fillRect(4, 12, 1, 1);
            };
            break;
        case 29: // Nebula Carapace
            draw = () => {
                const grad = ctx.createRadialGradient(0,10,1,0,10,16);
                const c1 = `hsl(${280 + Math.sin(frame*0.1)*20}, 100%, 80%)`;
                const c2 = `hsl(${220 + Math.sin(frame*0.1)*20}, 100%, 70%)`;
                grad.addColorStop(0, c1); grad.addColorStop(1, c2);
                ctx.fillStyle = grad; ctx.shadowColor = c1; ctx.shadowBlur = 10;
                ctx.globalAlpha = 0.9; ctx.fillRect(-14, 0, 28, 22);
            };
            break;
        case 30: // Dragonscale Platemail
            draw = () => {
                 ctx.fillStyle = '#2e7d32'; ctx.fillRect(-14, -2, 28, 24);
                ctx.fillStyle = '#c8e6c9';
                ctx.beginPath(); ctx.arc(-14, -2, 5, 0, Math.PI/2); ctx.fill();
                ctx.beginPath(); ctx.arc(14, -2, 5, Math.PI/2, Math.PI); ctx.fill();
                ctx.fillStyle = '#66bb6a';
                for(let y=-2; y<22; y+=6) for(let x=-12; x<12; x+=6) {
                     ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI); ctx.fill();
                }
            };
            break;
    }

    draw();
    ctx.restore();
};

const drawLegs = (ctx: CanvasRenderingContext2D, level: number, frame: number, bob: number) => {
    if (level === 0) return;
    ctx.save();
    ctx.translate(0, 52 + bob);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    let draw = () => { // Default shape for basic trousers
        ctx.fillRect(22, 0, 8, 12);
        ctx.fillRect(34, 0, 8, 12);
    };
    
    switch(level) {
        case 1: ctx.fillStyle = '#6d4c41'; break; // Cloth
        case 2: ctx.fillStyle = '#5d4037'; break; // Leather
        case 3: case 4: ctx.fillStyle = '#bdbdbd'; break; // Ring/Chain
        case 5: case 6: case 7: case 8: // Steel/Mithril/Elven/Dwarven
        case 10: case 11: case 12: case 13: case 16: case 17: case 21: case 22: case 24: case 25: case 26: case 27: // Other plate variants
            ctx.fillStyle = `hsl(210, 15%, ${75 - level}%)`;
            if (level === 6) { ctx.fillStyle = '#e0e0e0'; }
            if (level === 7) { ctx.fillStyle = '#c8e6c9'; }
            if (level === 8) { ctx.fillStyle = '#78909c'; }
            draw = () => {
                // Thigh plates (Cuisses)
                ctx.fillRect(22, 0, 8, 6);
                ctx.fillRect(34, 0, 8, 6);
                // Knee guards (Poleyns)
                ctx.beginPath(); ctx.arc(26, 7, 3 + level*0.05, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(38, 7, 3 + level*0.05, 0, Math.PI*2); ctx.fill();
                // Shin guards (Greaves)
                ctx.fillRect(23, 10, 6, 6);
                ctx.fillRect(35, 10, 6, 6);
            };
            break;
        case 9: ctx.fillStyle = '#795548'; break; // Orcish Loincloth (use leather color)
        case 10: ctx.fillStyle = '#212121'; break; // Obsidian
        case 14: // Demonbone Greaves
            ctx.fillStyle = '#f5f5f5';
            draw = () => {
                ctx.beginPath();
                ctx.moveTo(22, 0); ctx.lineTo(24, 14); ctx.lineTo(30, 14); ctx.lineTo(30, 0); ctx.fill(); // Left
                ctx.moveTo(42, 0); ctx.lineTo(40, 14); ctx.lineTo(34, 14); ctx.lineTo(34, 0); ctx.fill(); // Right
            };
            break;
        case 15: // Phoenixfire Pants
            const pGrad = ctx.createLinearGradient(0,0,0,16);
            pGrad.addColorStop(0, '#ff8a65'); pGrad.addColorStop(1, '#ffb74d');
            ctx.fillStyle = pGrad;
            break;
        case 18: // Void-touched Leggings
            const vGrad = ctx.createLinearGradient(0,0,0,16);
            vGrad.addColorStop(0, '#1a237e'); vGrad.addColorStop(1, '#000');
            ctx.fillStyle = vGrad;
            break;
        case 19: // Celestial Kilt
            draw = () => {
                const grad = ctx.createLinearGradient(20, 0, 44, 16);
                grad.addColorStop(0, '#1a237e'); grad.addColorStop(1, '#673ab7');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(18, 16); ctx.lineTo(46, 16); ctx.lineTo(44, 0); ctx.fill();
                // Stars
                ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(frame*0.1)*0.3})`;
                ctx.fillRect(25, 4, 1, 1); ctx.fillRect(38, 6, 1, 1); ctx.fillRect(30, 12, 1, 1);
            };
            break;
        case 20: // Soul-woven Greaves
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#b2dfdb';
            break;
        case 23: // Shadow-Stalkers
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#212121';
            break;
        case 28: // Galactic Striders
             ctx.fillStyle = '#000';
             break;
        case 29: // Nebula Leggings
            const nGrad = ctx.createLinearGradient(0,0,0,16);
            const c1 = `hsl(${280 + Math.sin(frame*0.1)*20}, 100%, 80%)`;
            const c2 = `hsl(${220 + Math.sin(frame*0.1)*20}, 100%, 70%)`;
            nGrad.addColorStop(0, c1); nGrad.addColorStop(1, c2);
            ctx.fillStyle = nGrad;
            break;
        case 30: // Dragon-bone Greaves
            ctx.fillStyle = '#fffde7';
            draw = () => {
                ctx.fillRect(23, 0, 6, 14);
                ctx.fillRect(35, 0, 6, 14);
                ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(23, 4); ctx.lineTo(29, 4);
                ctx.moveTo(23, 9); ctx.lineTo(29, 9);
                ctx.moveTo(35, 4); ctx.lineTo(41, 4);
                ctx.moveTo(35, 9); ctx.lineTo(41, 9);
                ctx.stroke();
            };
            break;
        default: ctx.fillStyle = '#b0bec5'; break; // Default to plate
    }
    
    draw();
    ctx.restore();
};

const drawBoots = (ctx: CanvasRenderingContext2D, level: number, frame: number, bob: number) => {
    if (level === 0) return;
    ctx.save();
    ctx.translate(0, 60 + bob);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    let draw = () => { // Default: Basic shoes
        ctx.fillRect(22, 0, 8, 4);
        ctx.fillRect(34, 0, 8, 4);
    };

    switch (level) {
        case 1: // Sandals
            ctx.strokeStyle = '#4e342e';
            draw = () => {
                ctx.beginPath(); ctx.moveTo(22, 2); ctx.lineTo(30, 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(34, 2); ctx.lineTo(42, 2); ctx.stroke();
            };
            break;
        case 2: ctx.fillStyle = '#6d4c41'; break; // Leather Shoes
        case 3: case 4: case 5: case 6: case 7: case 8: case 10: case 11: case 12: case 13: case 16: case 21: case 22: case 24: case 25: case 26: case 27:
            ctx.fillStyle = `hsl(210, 10%, ${60 - level * 2}%)`;
            if (level === 6) ctx.fillStyle = '#e0e0e0';
            if (level === 7) ctx.fillStyle = '#a5d6a7';
            if (level === 8) ctx.fillStyle = '#78909c';
            draw = () => { // Articulated plates
                ctx.beginPath(); ctx.moveTo(21, 0); ctx.lineTo(31, 0); ctx.lineTo(29, 4); ctx.lineTo(21, 4); ctx.fill();
                ctx.beginPath(); ctx.moveTo(33, 0); ctx.lineTo(43, 0); ctx.lineTo(41, 4); ctx.lineTo(33, 4); ctx.fill();
            };
            break;
        case 9: ctx.fillStyle = '#795548'; break; // Orcish War-boots (use leather color)
        case 14: // Demon-Stompers
            ctx.fillStyle = '#e53935';
            break;
        case 15: // Phoenix-Talon Boots
            ctx.fillStyle = '#ff6f00';
            draw = () => {
                for (let i=0; i<3; i++) {
                    ctx.beginPath(); ctx.moveTo(22+i*3, 0); ctx.lineTo(21+i*3, 4); ctx.lineTo(24+i*3, 4); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(34+i*3, 0); ctx.lineTo(33+i*3, 4); ctx.lineTo(36+i*3, 4); ctx.fill();
                }
            };
            break;
        case 17: // Storm-Dancer's Boots
            ctx.fillStyle = '#5e35b1';
            draw = () => {
                ctx.fillRect(22, 0, 8, 4); ctx.fillRect(34, 0, 8, 4);
                ctx.strokeStyle = `rgba(224, 224, 244, ${0.5 + Math.sin(frame * 0.5) * 0.5})`;
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(22, 2); ctx.lineTo(20, 0); ctx.moveTo(30, 2); ctx.lineTo(32, 0); ctx.stroke();
            };
            break;
        case 18: // Void-Walkers
             ctx.fillStyle = '#311b92';
             draw = () => {
                ctx.fillRect(22, 0, 8, 4); ctx.fillRect(34, 0, 8, 4);
                const mist = ctx.createLinearGradient(0, 4, 0, 8);
                mist.addColorStop(0, '#311b92'); mist.addColorStop(1, 'transparent');
                ctx.fillStyle = mist;
                ctx.fillRect(21, 4, 10, 4); ctx.fillRect(33, 4, 10, 4);
            };
            break;
        case 19: // Celestial Sandals
             ctx.strokeStyle = '#e3f2fd';
             draw = () => {
                ctx.beginPath(); ctx.moveTo(22, 2); ctx.lineTo(30, 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(34, 2); ctx.lineTo(42, 2); ctx.stroke();
             };
             break;
        case 20: // Soul-Treads
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#b2dfdb';
            break;
        case 23: // Shadow-step Boots
             ctx.globalAlpha = 0.8;
             ctx.fillStyle = '#212121';
             break;
        case 28: // Galactic Greaves
            ctx.fillStyle = '#000';
            break;
        case 29: // Nebula-Walkers
            const nGrad = ctx.createLinearGradient(0,0,0,4);
            const c1 = `hsl(${280 + Math.sin(frame*0.1)*20}, 100%, 80%)`;
            const c2 = `hsl(${220 + Math.sin(frame*0.1)*20}, 100%, 70%)`;
            nGrad.addColorStop(0, c1); nGrad.addColorStop(1, c2);
            ctx.fillStyle = nGrad;
            break;
        case 30: // Dragonflight Boots
            ctx.fillStyle = '#4caf50';
            draw = () => {
                ctx.fillRect(22, 0, 8, 4); ctx.fillRect(34, 0, 8, 4); // Boots
                ctx.fillStyle = '#a5d6a7'; // Wings
                const flap = Math.sin(frame*0.2) * 2;
                ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(18, -2 + flap); ctx.lineTo(22, 2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(42, 0); ctx.lineTo(46, -2 + flap); ctx.lineTo(42, 2); ctx.fill();
            };
            break;
        default:
            ctx.fillStyle = '#616161';
            break;
    }
    
    draw();
    ctx.restore();
};

const drawHero: DrawFunction = (ctx, frame, _color, _isSilhouette, equipment) => {
    const bob = Math.sin(frame * Math.PI / 8) * 1.5;
    const currentEquipment = equipment || initialEquipment;

    const skinColor = '#ffc8a8';

    // Back Arm (for shield)
    ctx.fillStyle = skinColor; ctx.fillRect(18, 33 + bob, 8, 14);

    // Legs & Boots Base
    ctx.fillStyle = skinColor;
    ctx.fillRect(24, 46 + bob, 8, 14); // Left leg
    ctx.fillRect(32, 46 + bob, 8, 14); // Right leg
    drawLegs(ctx, currentEquipment.LEGS, frame, bob);
    drawBoots(ctx, currentEquipment.BOOTS, frame, bob);
    
    // Torso Base
    ctx.fillStyle = skinColor;
    ctx.fillRect(22, 30 + bob, 20, 16); // Torso
    drawArmor(ctx, currentEquipment.ARMOR, frame, bob);
    
    // Head Base
    ctx.fillStyle = skinColor;
    ctx.beginPath(); ctx.arc(32, 23 + bob, 9, 0, Math.PI * 2); ctx.fill(); // Head
    drawHelmet(ctx, currentEquipment.HELMET, frame, bob);

    // Shield
    drawShield(ctx, currentEquipment.SHIELD, frame, bob);

    // Front Arm (for weapon)
    ctx.fillStyle = skinColor;
    ctx.fillRect(38, 33 + bob, 8, 14);

    // Weapon
    drawWeapon(ctx, currentEquipment.WEAPON, frame, bob);
};

const drawSlime: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8) * 3;
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    const grad = ctx.createLinearGradient(0, 24, 0, 56);
    grad.addColorStop(0, primary);
    grad.addColorStop(1, shadow);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(32, 56 + bob);
    ctx.bezierCurveTo(8, 56 + bob, 8, 24 + bob, 32, 24 + bob);
    ctx.bezierCurveTo(56, 24 + bob, 56, 56 + bob, 32, 56 + bob);
    ctx.fill();

    // Eyes
    ctx.fillStyle = getEyeColor(isSilhouette);
    ctx.beginPath(); ctx.arc(26, 38 + bob, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(40, 38 + bob, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = getPupilColor(isSilhouette);
    ctx.fillRect(27, 40 + bob, 1, 1);
    ctx.fillRect(41, 40 + bob, 1, 1);
};

const drawBat: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const flap = Math.sin(frame * Math.PI / 4) * 10;
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    // Wings
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(27, 32); ctx.quadraticCurveTo(10, 28 + flap, 27, 42); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(37, 32); ctx.quadraticCurveTo(54, 28 + flap, 37, 42); ctx.fill();

    // Body
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.ellipse(32, 35, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    
    if (!isSilhouette) {
      ctx.fillStyle = 'red';
      ctx.fillRect(30, 32, 2, 2);
      ctx.fillRect(35, 32, 2, 2);
    }
};

const drawGoblin: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;
    const leather = isSilhouette ? getShadowColor(0, true) : '#8d6e63';

    // Legs
    ctx.fillStyle = shadow;
    ctx.fillRect(26, 50 + bob, 6, 8);
    ctx.fillRect(34, 50 + bob, 6, 8);
    
    // Body
    ctx.fillStyle = leather;
    ctx.fillRect(22, 36 + bob, 22, 16); // Tunic
    
    // Head
    ctx.fillStyle = primary;
    ctx.fillRect(24, 20 + bob, 18, 18); // Head
    ctx.beginPath(); // Ears
    ctx.moveTo(20, 26 + bob); ctx.lineTo(24, 18 + bob); ctx.lineTo(28, 24 + bob); ctx.fill();
    ctx.moveTo(46, 26 + bob); ctx.lineTo(42, 18 + bob); ctx.lineTo(38, 24 + bob); ctx.fill();

    // Arms & Weapon
    ctx.fillStyle = primary;
    ctx.fillRect(18, 38 + bob, 6, 12); // L arm
    ctx.fillRect(42, 38 + bob, 6, 12); // R arm
    ctx.fillStyle = '#757575'; // Dagger
    if(isSilhouette) ctx.fillStyle = getShadowColor(0, true);
    ctx.fillRect(44, 28 + bob, 4, 12);
    ctx.fillRect(42, 26 + bob, 8, 2);

    // Eyes
    ctx.fillStyle = isSilhouette ? getShadowColor(0, true) : 'yellow';
    ctx.fillRect(28, 26 + bob, 3, 3);
    ctx.fillRect(35, 26 + bob, 3, 3);
};

const drawSkeleton: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 16) * 1;
    ctx.fillStyle = isSilhouette ? getPrimaryColor(0, true) : 'white';
    ctx.strokeStyle = isSilhouette ? getShadowColor(0, true) : '#e0e0e0';
    ctx.lineWidth = 2;

    // Pelvis
    ctx.beginPath();
    ctx.moveTo(28, 40 + bob); ctx.lineTo(36, 40 + bob);
    ctx.lineTo(38, 44 + bob); ctx.lineTo(26, 44 + bob); ctx.closePath();
    ctx.fill();

    // Legs
    ctx.fillRect(28, 44 + bob, 3, 8); // L Femur
    ctx.fillRect(33, 44 + bob, 3, 8); // R Femur
    ctx.fillRect(28, 53 + bob, 3, 8); // L Tibia
    ctx.fillRect(33, 53 + bob, 3, 8); // R Tibia

    // Spine
    ctx.fillRect(30, 28 + bob, 4, 12);

    // Ribcage
    ctx.beginPath();
    ctx.moveTo(30, 30+bob); ctx.quadraticCurveTo(22, 32+bob, 30, 34+bob);
    ctx.moveTo(34, 30+bob); ctx.quadraticCurveTo(42, 32+bob, 34, 34+bob);
    ctx.moveTo(30, 35+bob); ctx.quadraticCurveTo(23, 37+bob, 30, 39+bob);
    ctx.moveTo(34, 35+bob); ctx.quadraticCurveTo(41, 37+bob, 34, 39+bob);
    ctx.stroke();

    // Arms (holding a rusty sword)
    ctx.save();
    ctx.translate(39, 30 + bob);
    ctx.rotate(0.2);
    ctx.fillRect(0,0, 3, 8); // R Humerus
    ctx.fillRect(0,9, 3, 8); // R Forearm
    ctx.fillStyle = isSilhouette ? getShadowColor(0, true) : '#8d6e63';
    ctx.fillRect(-1, 17, 5, 15); // Sword
    ctx.restore();

    ctx.save();
    ctx.translate(25, 30 + bob);
    ctx.rotate(-0.2);
    ctx.fillRect(0,0, 3, 8); // L Humerus
    ctx.fillRect(0,9, 3, 8); // L Forearm
    ctx.restore();

    // Skull
    ctx.beginPath();
    ctx.arc(32, 22 + bob, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = getPupilColor(isSilhouette); // Eye sockets
    ctx.beginPath(); ctx.arc(30, 21 + bob, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(35, 21 + bob, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(30, 25 + bob, 4, 1); // Jaw line
};

const drawOrc: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;
    const leather = isSilhouette ? getShadowColor(0, true) : '#a1887f';

    // Legs
    ctx.fillStyle = primary;
    ctx.fillRect(22, 52 + bob, 10, 10);
    ctx.fillRect(34, 52 + bob, 10, 10);
    
    // Body
    ctx.fillStyle = leather;
    ctx.fillRect(16, 38 + bob, 32, 16); // Armor
    ctx.fillStyle = primary;
    ctx.fillRect(18, 38 + bob, 28, 14); // Torso

    // Head
    ctx.fillRect(20, 18 + bob, 24, 20); // Head
    ctx.fillStyle = getEyeColor(isSilhouette); // Tusks
    ctx.beginPath(); ctx.moveTo(24, 36+bob); ctx.lineTo(22, 39+bob); ctx.lineTo(26, 39+bob); ctx.fill();
    ctx.beginPath(); ctx.moveTo(40, 36+bob); ctx.lineTo(38, 39+bob); ctx.lineTo(42, 39+bob); ctx.fill();
    
    // Arms & Weapon
    ctx.fillStyle = primary;
    ctx.fillRect(10, 38 + bob, 8, 16); // L Arm
    ctx.fillRect(46, 38 + bob, 8, 16); // R Arm
    ctx.fillStyle = '#6d4c41'; if (isSilhouette) ctx.fillStyle = getShadowColor(0, true);
    ctx.fillRect(48, 20 + bob, 8, 32); // Club Handle
    ctx.fillStyle = '#8d6e63'; if (isSilhouette) ctx.fillStyle = getShadowColor(0, true);
    ctx.beginPath(); ctx.arc(52, 16+bob, 8, 0, Math.PI*2); ctx.fill(); // Club Head
    
    // Eyes
    ctx.fillStyle = isSilhouette ? getShadowColor(0, true) : 'red';
    ctx.fillRect(26, 26 + bob, 4, 4);
    ctx.fillRect(34, 26 + bob, 4, 4);
};

const drawDemon: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8) * 2;
    const flap = Math.sin(frame * Math.PI / 4) * 4;
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;
    
    // Wings
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(20, 36+bob); ctx.quadraticCurveTo(0, 30 + flap, 22, 50+bob); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(44, 36+bob); ctx.quadraticCurveTo(64, 30 + flap, 42, 50+bob); ctx.fill();

    // Body
    ctx.fillStyle = primary;
    ctx.fillRect(22, 16 + bob, 20, 20); // Head
    ctx.fillRect(18, 36 + bob, 28, 24); // Torso

    // Horns
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(22, 16 + bob); ctx.quadraticCurveTo(16, 4 + bob, 26, 14 + bob); ctx.fill();
    ctx.moveTo(42, 16 + bob); ctx.quadraticCurveTo(48, 4 + bob, 38, 14 + bob); ctx.fill();
    
    if (!isSilhouette) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(28, 24 + bob, 3, 3);
        ctx.fillRect(35, 24 + bob, 3, 3);
    }
};

const drawDragon: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const flap = Math.sin(frame * Math.PI / 4) * 8;
    const bob = Math.sin(frame * Math.PI / 8) * 2;
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    // Tail
    ctx.strokeStyle = primary;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(10, 50+bob);
    ctx.quadraticCurveTo(0, 55+bob, 10, 60+bob);
    ctx.stroke();
    
    // Back Wing
    ctx.fillStyle = shadow;
    ctx.beginPath(); ctx.moveTo(22, 28); ctx.quadraticCurveTo(0, 22 + flap, 22, 48); ctx.fill();

    // Back leg
    ctx.fillStyle = primary;
    ctx.fillRect(16, 48+bob, 8, 12);

    // Body
    ctx.fillRect(16, 24+bob, 24, 30); // Body

    // Front Leg
    ctx.fillRect(32, 48+bob, 8, 12);

    // Front Wing
    ctx.fillStyle = shadow;
    ctx.beginPath(); ctx.moveTo(26, 28); ctx.quadraticCurveTo(4, 22 + flap, 26, 48); ctx.fill();
    
    // Neck & Head
    ctx.fillStyle = primary;
    ctx.fillRect(30, 18+bob, 20, 18); // Head
    ctx.fillRect(48, 24+bob, 10, 8);   // Snout
};

const drawGiantRat: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    
    // Tail
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(14, 45+bob); ctx.quadraticCurveTo(5, 50+bob, 10, 55+bob); ctx.stroke();
    
    // Legs
    ctx.fillRect(24, 48+bob, 6, 8);
    ctx.fillRect(40, 48+bob, 6, 8);

    // Body
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.ellipse(32, 40 + bob, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.beginPath();
    ctx.ellipse(50, 38 + bob, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!isSilhouette) {
        ctx.fillStyle = 'red';
        ctx.fillRect(52, 37 + bob, 2, 2);
    }
};

const drawGolem: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 16);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    // Legs
    ctx.fillStyle = primary;
    ctx.fillRect(20, 50+bob, 10, 10);
    ctx.fillRect(34, 50+bob, 10, 10);

    // Body
    ctx.fillRect(18, 36 + bob, 28, 16);
    
    // Arms
    ctx.fillStyle = shadow;
    ctx.fillRect(8, 36 + bob, 10, 20); // L Arm
    ctx.fillRect(46, 36 + bob, 10, 20); // R Arm

    // Head/Shoulders
    ctx.fillStyle = primary;
    ctx.fillRect(20, 16 + bob, 24, 20); 
    
    if (!isSilhouette) {
        const glow = `hsl(0, 100%, ${60 + Math.sin(frame*0.1)*10}%)`;
        ctx.fillStyle = glow;
        ctx.shadowColor = glow;
        ctx.shadowBlur = 5;
        ctx.fillRect(30, 24 + bob, 4, 4);
        ctx.shadowBlur = 0;
    }
};

const drawSpider: DrawFunction = (ctx, frame, color, isSilhouette) => {
    ctx.fillStyle = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;
    
    // Abdomen
    ctx.beginPath();
    ctx.ellipse(32, 42, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cephalothorax
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(32, 28, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 3;
    const legFlap = Math.sin(frame * Math.PI / 4) * 3;
    for (let i = 0; i < 4; i++) {
        // Left legs
        ctx.beginPath();
        ctx.moveTo(26, 28 + i * 2);
        ctx.lineTo(16, 24 + i * 4 + legFlap);
        ctx.lineTo(8, 36 + i * 6);
        ctx.stroke();
        // Right legs
        ctx.beginPath();
        ctx.moveTo(38, 28 + i * 2);
        ctx.lineTo(48, 24 + i * 4 - legFlap);
        ctx.lineTo(56, 36 + i * 6);
        ctx.stroke();
    }
    if (!isSilhouette) {
        ctx.fillStyle = 'red';
        ctx.fillRect(30, 27, 1, 1); ctx.fillRect(34, 27, 1, 1);
    }
};

const drawWorm: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    for (let i = 8; i > 0; i--) {
        const bob = Math.sin((frame * Math.PI / 8) + i / 2) * 5;
        const radius = 8 + i * 0.5;
        const grad = ctx.createLinearGradient(0, 12 + i * 5 - radius, 0, 12 + i * 5 + radius);
        grad.addColorStop(0, primary);
        grad.addColorStop(1, shadow);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(32 + bob, 12 + i * 5, radius, 5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
};

const drawElemental: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    for (let i = 0; i < 15; i++) {
        const angle = frame * 0.05 + (i * (Math.PI * 2 / 15));
        const radius = 10 + Math.sin(frame * 0.1 + i) * 5;
        const x = 32 + Math.cos(angle) * radius;
        const y = 35 + Math.sin(angle) * radius;
        const size = 3 + Math.cos(frame * 0.15 + i) * 2;
        ctx.globalAlpha = 0.5 + Math.sin(frame * 0.2 + i) * 0.3;
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
};

const drawMimic: DrawFunction = (ctx, frame, color, isSilhouette) => {
    // Box
    ctx.fillStyle = isSilhouette ? getPrimaryColor(0, true) : '#7b5e53';
    ctx.fillRect(10, 26, 44, 28);
    // Lid
    ctx.fillStyle = isSilhouette ? getShadowColor(0, true) : '#91786f';
    ctx.beginPath();
    ctx.moveTo(8, 26);
    ctx.quadraticCurveTo(32, 8, 56, 26);
    ctx.fill();
    // Metal parts
    ctx.fillStyle = isSilhouette ? getShadowColor(0, true) : '#bcaaa4';
    ctx.fillRect(8, 24, 48, 4);
    
    // Eye and teeth animation
    if (frame % 120 < 20) {
        const eyeOpen = Math.sin((frame % 120) * (Math.PI / 20));
        if (eyeOpen > 0) {
            ctx.fillStyle = '#0c0a09';
            ctx.fillRect(12, 26, 40, 2);
            ctx.fillStyle = isSilhouette ? getShadowColor(0, true) : 'red';
            ctx.beginPath();
            ctx.ellipse(32, 27, 5, 3 * eyeOpen, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white'; // Teeth
            for (let i=0; i<8; i++) {
                ctx.beginPath();
                ctx.moveTo(14 + i*5, 26);
                ctx.lineTo(16 + i*5, 28);
                ctx.lineTo(12 + i*5, 28);
                ctx.fill();
            }
        }
    } else {
        ctx.fillRect(28, 36, 8, 8); // Lock
    }
};

const drawTroll: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    // Legs
    ctx.fillStyle = primary;
    ctx.fillRect(18, 50+bob, 10, 12);
    ctx.fillRect(36, 50+bob, 10, 12);

    // Body
    ctx.beginPath();
    ctx.moveTo(10, 40+bob); ctx.lineTo(54, 40+bob); ctx.lineTo(44, 60+bob); ctx.lineTo(20, 60+bob);
    ctx.fill();
    
    // Arms
    ctx.fillRect(4, 38+bob, 12, 20);
    
    // Head
    ctx.fillRect(22, 18+bob, 20, 22);

    // Club
    ctx.fillStyle = isSilhouette ? shadow : '#6d4c41';
    ctx.fillRect(48, 28 + bob, 10, 32); // Handle
    ctx.beginPath(); ctx.arc(53, 24+bob, 10, 0, Math.PI*2); ctx.fill(); // Head
};

const drawGhoul: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;

    // Legs
    ctx.fillRect(26, 48 + bob, 6, 10);
    ctx.fillRect(34, 48 + bob, 6, 10);
    
    // Body (hunched over)
    ctx.beginPath();
    ctx.moveTo(20, 56); ctx.quadraticCurveTo(32, 20 + bob, 44, 56);
    ctx.fill();
    // Arms
    ctx.fillRect(20, 38 + bob, 6, 16);
    ctx.fillRect(40, 38 + bob, 6, 16);
    
    // Head
    ctx.beginPath();
    ctx.arc(36, 30 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    if (!isSilhouette) {
        ctx.fillStyle = 'red';
        ctx.fillRect(38, 28+bob, 2, 2);
    }
};

const drawWraith: DrawFunction = (ctx, frame, color, isSilhouette) => {
    ctx.globalAlpha = 0.7;
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    
    // Wispy tail
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.moveTo(32, 60);
    ctx.quadraticCurveTo(20 + Math.sin(frame*0.1)*5, 50, 32, 40);
    ctx.quadraticCurveTo(44 + Math.cos(frame*0.1)*5, 50, 32, 60);
    ctx.fill();
    
    // Body and Head
    ctx.beginPath();
    ctx.moveTo(32, 10);
    ctx.bezierCurveTo(10, 20, 54, 40, 32, 45);
    ctx.bezierCurveTo(10, 40, 54, 20, 32, 10);
    ctx.fill();
    
    ctx.globalAlpha = 1;
};

const drawLivingArmor: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    // Legs
    ctx.fillStyle = shadow;
    ctx.fillRect(24, 48+bob, 8, 12); ctx.fillRect(34, 48+bob, 8, 12);
    // Body
    ctx.fillStyle = primary;
    ctx.fillRect(20, 28+bob, 24, 20);
    // Arms
    ctx.fillRect(14, 28+bob, 6, 18); ctx.fillRect(44, 28+bob, 6, 18);
    // Helmet
    ctx.fillRect(24, 16+bob, 16, 14);
    
    if(!isSilhouette) {
        ctx.fillStyle = `hsl(60, 100%, ${50+Math.sin(frame*0.1)*5}%)`;
        ctx.shadowColor = 'yellow';
        ctx.shadowBlur = 5;
        ctx.fillRect(28, 24+bob, 8, 2);
        ctx.shadowBlur = 0;
    }
};

const drawMyconid: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * Math.PI / 8);
    // Stem/Body
    const shadow = isSilhouette ? getShadowColor(0, true) : '#e0e0e0';
    ctx.fillStyle = shadow;
    ctx.fillRect(28, 28 + bob, 8, 28);
    // Arms
    ctx.fillRect(22, 34+bob, 6, 10);
    ctx.fillRect(36, 34+bob, 6, 10);

    // Cap
    ctx.fillStyle = isSilhouette ? getPrimaryColor(0, true) : color;
    ctx.beginPath();
    ctx.arc(32, 28 + bob, 16, Math.PI, 0);
    ctx.fill();

    // Spores
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.2) * 0.3;
    for (let i=0; i<3; i++) {
        const x = 32 + Math.sin(frame*0.1 + i*2) * 20;
        const y = 32 + Math.cos(frame*0.1 + i*2) * 20;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
};

const drawShadow: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    ctx.fillStyle = primary;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    const x1 = 32 + Math.sin(frame * 0.05) * 5;
    const y1 = 32 + Math.cos(frame * 0.05) * 5;
    const r1 = 15 + Math.sin(frame * 0.05) * 3;
    const x2 = 32 + Math.cos(frame * 0.05) * 5;
    const y2 = 32 + Math.sin(frame * 0.05) * 5;
    const r2 = 15 + Math.cos(frame * 0.05) * 3;
    ctx.ellipse(x1, y1, r1, r2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (!isSilhouette) {
        ctx.fillStyle = 'white';
        ctx.fillRect(28, 28, 2, 2);
        ctx.fillRect(36, 28, 2, 2);
    }
};

const drawLich: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * 0.1);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    // Robes
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(10, 60); ctx.quadraticCurveTo(32, 10 + bob, 54, 60); ctx.closePath();
    ctx.fill();
    
    // Skull
    ctx.fillStyle = isSilhouette ? getPrimaryColor(0, true) : '#f5f5f5';
    ctx.beginPath(); ctx.arc(32, 20 + bob, 8, 0, Math.PI*2); ctx.fill();
    
    // Staff
    ctx.fillStyle = isSilhouette ? getShadowColor(0, true) : '#5d4037';
    ctx.fillRect(45, 15 + bob, 4, 45);
    
    // Staff orb
    const orbColor = `hsl(120, 100%, ${70 + Math.sin(frame * 0.2) * 20}%)`;
    ctx.fillStyle = isSilhouette ? getPrimaryColor(0, true) : orbColor;
    ctx.shadowColor = orbColor;
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(47, 12 + bob, 5, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
};

const drawGazer: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * 0.1) * 2;
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;
    
    // Body
    const grad = ctx.createRadialGradient(32, 32 + bob, 5, 32, 32 + bob, 20);
    grad.addColorStop(0, primary);
    grad.addColorStop(1, shadow);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(32, 32 + bob, 20, 0, Math.PI*2); ctx.fill();
    
    // Eye stalks
    for (let i = 0; i < 5; i++) {
        const angle = (i/5) * Math.PI*2 + frame * 0.05;
        const startX = 32 + Math.cos(angle) * 18;
        const startY = 32 + bob + Math.sin(angle) * 18;
        const endX = 32 + Math.cos(angle) * 25 + Math.sin(frame*0.2 + i) * 3;
        const endY = 32 + bob + Math.sin(angle) * 25 + Math.cos(frame*0.2 + i) * 3;
        ctx.strokeStyle = shadow; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke();
        ctx.fillStyle = 'red'; if(isSilhouette) ctx.fillStyle = getShadowColor(0, true);
        ctx.beginPath(); ctx.arc(endX, endY, 2, 0, Math.PI*2); ctx.fill();
    }

    // Central Eye
    const blink = frame % 150;
    const eyeHeight = blink < 10 ? Math.sin(blink * Math.PI / 10) * 12 : 12;
    if(eyeHeight > 0) {
        ctx.fillStyle = getEyeColor(isSilhouette);
        ctx.beginPath(); ctx.ellipse(32, 32 + bob, 10, eyeHeight, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = getPupilColor(isSilhouette);
        ctx.beginPath(); ctx.ellipse(32, 32 + bob, 4, eyeHeight * 0.8, 0, 0, Math.PI * 2); ctx.fill();
    }
};

const drawGargoyle: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const bob = Math.sin(frame * 0.05);
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;

    // Wings
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(20, 30); ctx.lineTo(5, 15 + bob); ctx.lineTo(22, 45); ctx.fill();
    ctx.moveTo(44, 30); ctx.lineTo(59, 15 + bob); ctx.lineTo(42, 45); ctx.fill();
    // Body
    ctx.fillStyle = primary;
    ctx.fillRect(24, 25, 16, 25);
    // Head
    ctx.fillRect(26, 18, 12, 10);
};

const drawHydra: DrawFunction = (ctx, frame, color, isSilhouette) => {
    const primary = isSilhouette ? getPrimaryColor(0, true) : color;
    const shadow = isSilhouette ? getShadowColor(0, true) : `hsl(${parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')}, 60%, 30%)`;
    
    // Main Body
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.moveTo(10, 60); ctx.quadraticCurveTo(32, 40, 54, 60); ctx.quadraticCurveTo(32, 50, 10, 60);
    ctx.fill();

    const drawHead = (index: number, x: number, y: number) => {
        const bob = Math.sin(frame * 0.1 + index*2) * 5;
        // Neck
        ctx.strokeStyle = primary; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(32, 50); ctx.quadraticCurveTo(x+bob*2, y-10, x+bob, y); ctx.stroke();
        // Head
        ctx.fillStyle = shadow;
        ctx.beginPath(); ctx.arc(x+bob, y, 10, 0, Math.PI*2); ctx.fill();
        if(!isSilhouette) {
            ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(x+bob+5, y, 2, 0, Math.PI*2); ctx.fill();
        }
    }
    
    drawHead(0, 32, 20); // Center head
    drawHead(1, 15, 25); // Left head
    drawHead(2, 49, 25); // Right head
};


const drawMap: Record<string, DrawFunction> = {
    HERO: drawHero,
    SLIME: drawSlime,
    BAT: drawBat,
    GOBLIN: drawGoblin,
    SKELETON: drawSkeleton,
    ORC: drawOrc,
    DEMON: drawDemon,
    DRAGON: drawDragon,
    GIANT_RAT: drawGiantRat,
    GOLEM: drawGolem,
    SPIDER: drawSpider,
    WORM: drawWorm,
    ELEMENTAL: drawElemental,
    MIMIC: drawMimic,
    TROLL: drawTroll,
    GHOUL: drawGhoul,
    WRAITH: drawWraith,
    LIVING_ARMOR: drawLivingArmor,
    MYCONID: drawMyconid,
    SHADOW: drawShadow,
    LICH: drawLich,
    GAZER: drawGazer,
    GARGOYLE: drawGargoyle,
    HYDRA: drawHydra,
};

export const drawCharacter = (
    ctx: CanvasRenderingContext2D,
    spriteKey: string,
    frame: number,
    options: {
      coloration: { hueRotate: number },
      equipment?: EquipmentLevels,
      isSilhouette?: boolean,
    }
) => {
    ctx.clearRect(0, 0, 64, 64);
    const drawFn = drawMap[spriteKey] || drawMap['SLIME'];
    const color = getPrimaryColor(options.coloration.hueRotate, options.isSilhouette);
    
    // Pass all options to the drawing function
    drawFn(ctx, frame, color, options.isSilhouette, options.equipment);
};

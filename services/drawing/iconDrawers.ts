export const drawDirtIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    ctx.fillStyle = '#6b4f3a';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#8e7a6b';
    ctx.fillRect(size*0.2, size*0.3, size*0.2, size*0.2);
    ctx.fillRect(size*0.6, size*0.7, size*0.25, size*0.25);
};
export const drawStoneIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#5a5a5a';
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.moveTo(size*0.1, size*0.2);
    ctx.lineTo(size*0.8, size*0.9);
    ctx.stroke();
};
export const drawMineralIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    const glow = 0.8 + Math.sin(frame * 0.1) * 0.2;
    ctx.shadowColor = `hsla(187, 100%, 70%, ${glow})`;
    ctx.shadowBlur = size * 0.3;
    const grad = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size*0.5);
    grad.addColorStop(0, '#e0ffff');
    grad.addColorStop(1, '#4dd0e1');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size*0.4, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
};
export const drawSilverIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    const grad = ctx.createRadialGradient(size*0.4, size*0.4, size*0.05, size/2, size/2, size*0.6);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#e0e0e0');
    grad.addColorStop(1, '#9e9e9e');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size*0.45, 0, Math.PI*2);
    ctx.fill();
};
export const drawGoldIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    const grad = ctx.createRadialGradient(size*0.4, size*0.4, size*0.05, size/2, size/2, size*0.6);
    grad.addColorStop(0, '#ffff8d');
    grad.addColorStop(0.5, '#fbc02d');
    grad.addColorStop(1, '#f57f17');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size*0.45, 0, Math.PI*2);
    ctx.fill();

    const glintProgress = (frame % 50);
    if (glintProgress < 5) {
        ctx.fillStyle = `rgba(255, 255, 224, ${0.9 - (glintProgress)*0.18})`;
        const x = size * 0.3;
        const y = size * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, y - size*0.1); ctx.lineTo(x + size*0.05, y); ctx.lineTo(x, y + size*0.1); ctx.lineTo(x - size*0.05, y);
        ctx.fill();
    }
};

export const drawDynamiteIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    // Draw 3 sticks of dynamite
    const drawStick = (x: number, y: number) => {
        ctx.fillStyle = '#b71c1c'; // Dark red
        ctx.fillRect(x, y, size * 0.2, size * 0.6);
        ctx.fillStyle = '#d32f2f'; // Lighter red
        ctx.fillRect(x, y, size * 0.1, size * 0.6);
    }
    drawStick(size * 0.25, size * 0.2);
    drawStick(size * 0.45, size * 0.2);
    drawStick(size * 0.35, size * 0.15); // Middle one on top

    // Fuse
    ctx.strokeStyle = '#424242';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.moveTo(size * 0.45, size * 0.15);
    ctx.quadraticCurveTo(size * 0.7, size * 0.05, size * 0.8, size * 0.2);
    ctx.stroke();

    // Spark
    const spark = frame % 20;
    if (spark < 10) {
      const sparkSize = size * (0.05 + spark * 0.01);
      const sparkAlpha = 1 - (spark / 10);
      ctx.fillStyle = `rgba(255, 193, 7, ${sparkAlpha})`;
      ctx.shadowColor = 'orange';
      ctx.shadowBlur = size * 0.2;
      ctx.beginPath();
      ctx.arc(size * 0.8, size * 0.2, sparkSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
};

export const drawDepthIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    ctx.fillStyle = '#6b4f3a'; ctx.fillRect(0, size*0.5, size, size*0.5);
    ctx.fillStyle = '#8a8a8a'; ctx.fillRect(0, size*0.7, size, size*0.3);
    const grad = ctx.createLinearGradient(0,0,size,0);
    grad.addColorStop(0, '#e0e0e0'); grad.addColorStop(0.5, '#f5f5f5'); grad.addColorStop(1, '#bdbdbd');
    ctx.fillStyle = grad; ctx.beginPath();
    ctx.moveTo(size*0.5, size*0.9); ctx.lineTo(size*0.2, size*0.6); ctx.lineTo(size*0.5, size*0.5); ctx.lineTo(size*0.8, size*0.6);
    ctx.fill();
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(size*0.45, size*0.1, size*0.1, size*0.5);
};
export const drawShopIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(size*0.1, size*0.1, size*0.8, size*0.8);
    ctx.fillStyle = '#5d4037';
    ctx.strokeRect(size*0.1, size*0.1, size*0.8, size*0.8);
    drawGoldIcon(ctx, frame, size);
};
export const drawBestiaryIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(size*0.1, size*0.1, size*0.8, size*0.8);
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(size*0.15, size*0.15, size*0.7, size*0.7);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(size*0.48, size*0.15, size*0.04, size*0.7);

    // Eye that blinks
    const blink = frame % 100;
    if (blink > 5) {
        ctx.fillStyle = 'red';
        ctx.beginPath(); ctx.arc(size*0.5, size*0.5, size*0.1, 0, Math.PI*2); ctx.fill();
    }
};
export const drawSettingsIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    const angle = frame * 0.05;
    ctx.save();
    ctx.translate(size/2, size/2);
    ctx.rotate(angle);
    ctx.fillStyle = '#8a8a8a';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i/6) * Math.PI*2;
        ctx.rect(size*0.3 * Math.cos(a) - size*0.1, size*0.3 * Math.sin(a) - size*0.1, size*0.2, size*0.2);
    }
    ctx.arc(0,0,size*0.25,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
};

export const drawSuperpowerIcon = (ctx: CanvasRenderingContext2D, frame: number, size: number) => {
    const glow = 0.7 + Math.sin(frame * 0.2) * 0.3;
    ctx.shadowColor = `hsla(50, 100%, 70%, ${glow})`;
    ctx.shadowBlur = size * 0.4;
    
    const grad = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size*0.5);
    grad.addColorStop(0, '#ffff8d');
    grad.addColorStop(1, '#fbc02d');
    ctx.fillStyle = grad;

    ctx.beginPath();
    let rotation = Math.PI / 2 * 3;
    let x = size / 2;
    let y = size / 2;
    let step = Math.PI / 5;
    let outerRadius = size * 0.45;
    let innerRadius = size * 0.2;

    ctx.moveTo(x, y - outerRadius)
    for (let i = 0; i < 5; i++) {
        x = size / 2 + Math.cos(rotation) * outerRadius;
        y = size / 2 + Math.sin(rotation) * outerRadius;
        ctx.lineTo(x, y)
        rotation += step

        x = size / 2 + Math.cos(rotation) * innerRadius;
        y = size / 2 + Math.sin(rotation) * innerRadius;
        ctx.lineTo(x, y)
        rotation += step
    }
    ctx.lineTo(size / 2, size / 2 - outerRadius);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
};
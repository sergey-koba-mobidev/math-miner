import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { TileData } from '../types';
import { TILE_SIZE_PX } from '../constants';
import { drawTile, getTileBaseColor } from '../services/drawing/tileDrawers';
import { TileType } from '../types';

interface MineProps {
  grid: TileData[][];
  onDig: (row: number, col: number) => void;
  deepestRow: number;
  diggingAnimationTarget: { row: number; col: number; isDynamite: boolean } | null;
}

// Helper function to determine if a tile is adjacent to an empty space
const isDiggable = (row: number, col: number, grid: TileData[][]): boolean => {
  if (grid[row][col].type === TileType.EMPTY) return false;
  const neighbors = [
    grid[row - 1]?.[col],
    grid[row + 1]?.[col],
    grid[row]?.[col - 1],
    grid[row]?.[col + 1],
  ];
  return neighbors.some(n => n && n.type === TileType.EMPTY);
};

// --- New High-Impact Animation System ---

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    life: number;
    color: string;
    size: number;
}

const drawImprovedPickaxe = (ctx: CanvasRenderingContext2D, progress: number) => {
    ctx.save();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const swingProgress = easeOutCubic(Math.min(1, progress / 0.5));
    const recoilProgress = Math.max(0, (progress - 0.5) / 0.5);

    let rot = -135; let x = 40; let y = -40;

    if (progress <= 0.5) { // Swinging in
        rot = -135 + (180 * swingProgress);
        x = 40 * (1 - swingProgress);
        y = -40 * (1 - swingProgress);
    } else { // Recoiling
        rot = 45 - (30 * recoilProgress);
        x = 0; y = 0;
    }

    ctx.translate(x, y);
    ctx.rotate(rot * Math.PI / 180);
    ctx.scale(1.2, 1.2);

    // Handle
    const handleGrad = ctx.createLinearGradient(0, -20, 0, 20);
    handleGrad.addColorStop(0, '#a1887f');
    handleGrad.addColorStop(1, '#6d4c41');
    ctx.fillStyle = handleGrad;
    ctx.fillRect(-2, -25, 4, 30);

    // Head
    const headGrad = ctx.createLinearGradient(-15, 0, 15, 0);
    headGrad.addColorStop(0, '#e0e0e0');
    headGrad.addColorStop(0.5, '#f5f5f5');
    headGrad.addColorStop(1, '#bdbdbd');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.moveTo(0, -28); ctx.lineTo(-4, -25);
    ctx.lineTo(-15, -23); ctx.quadraticCurveTo(-12, -27, -4, -27);
    ctx.lineTo(4, -27); ctx.quadraticCurveTo(12, -27, 15, -23);
    ctx.lineTo(4, -25); ctx.closePath();
    ctx.fill();

    ctx.restore();
};


export const Mine = React.forwardRef<HTMLDivElement, MineProps>(({ grid, onDig, deepestRow, diggingAnimationTarget }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticBackgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const frameCounter = useRef(0);
  const [viewport, setViewport] = useState({ top: 0, height: 0, width: 0 });
  
  const diggingAnimationState = useRef<{
    progress: number;
    target: { row: number; col: number };
    particles: Particle[];
    impactTriggered: boolean;
    isDynamite: boolean;
  } | null>(null);
  
  const mineWidth = grid[0].length * TILE_SIZE_PX;
  const mineHeight = grid.length * TILE_SIZE_PX;

  useEffect(() => {
    const backgroundCanvas = document.createElement('canvas');
    backgroundCanvas.width = mineWidth;
    backgroundCanvas.height = mineHeight;
    const ctx = backgroundCanvas.getContext('2d');
    if (!ctx) return;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const tile = grid[r][c];
        const isAnimated = tile.type === TileType.CHEST || tile.type === TileType.EASTER_EGG;
        if (!isAnimated) {
          ctx.save();
          ctx.translate(c * TILE_SIZE_PX, r * TILE_SIZE_PX);
          drawTile(ctx, tile.type, tile.variant, 0, tile.id);
          ctx.restore();
        }
      }
    }
    staticBackgroundCanvasRef.current = backgroundCanvas;
  }, [grid, mineWidth, mineHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !staticBackgroundCanvasRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;

    const render = (timestamp: number) => {
      frameCounter.current += 1;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(
        staticBackgroundCanvasRef.current!,
        0, viewport.top, mineWidth, viewport.height,
        0, 0, mineWidth, viewport.height
      );

      const startRow = Math.floor(viewport.top / TILE_SIZE_PX);
      const endRow = Math.min(grid.length - 1, Math.ceil((viewport.top + viewport.height) / TILE_SIZE_PX));

      for (let r = startRow; r <= endRow; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const tile = grid[r][c];
          const isAnimated = tile.type === TileType.CHEST || tile.type === TileType.EASTER_EGG;

          if (isAnimated) {
            ctx.save();
            ctx.translate(c * TILE_SIZE_PX, r * TILE_SIZE_PX - viewport.top);
            drawTile(ctx, tile.type, tile.variant, frameCounter.current, tile.id);
            ctx.restore();
          }

          if (isDiggable(r, c, grid)) {
            ctx.save();
            ctx.translate(c * TILE_SIZE_PX, r * TILE_SIZE_PX - viewport.top);
            const glow = 0.6 + Math.sin(frameCounter.current * 0.1 + r * 0.5 + c * 0.3) * 0.4;
            ctx.shadowColor = `rgba(255, 235, 150, ${glow * 0.7})`;
            ctx.shadowBlur = 20;
            ctx.strokeStyle = `rgba(255, 255, 224, ${glow})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(2, 2, TILE_SIZE_PX - 4, TILE_SIZE_PX - 4);
            ctx.restore();
          }
        }
      }
      
      if (diggingAnimationState.current) {
        diggingAnimationState.current.progress += deltaTime / 600;
        const { progress, target, particles, impactTriggered, isDynamite } = diggingAnimationState.current;
        const impactTime = 0.5;

        if (progress >= impactTime && !impactTriggered) {
          const particleCount = isDynamite ? 100 : 20;
          const speedMultiplier = isDynamite ? 2.5 : 1;

          const createParticles = (r: number, c: number) => {
              const tile = grid[r]?.[c];
              if (!tile) return;
              const colors = getTileBaseColor(tile.type);
              for (let i = 0; i < particleCount / (isDynamite ? 9 : 1); i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = (Math.random() * 5 + 2) * speedMultiplier;
                particles.push({
                  x: (c + 0.5) * TILE_SIZE_PX, 
                  y: (r + 0.5) * TILE_SIZE_PX,
                  vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                  life: Math.random() * 30 + 30, // 30-60 frames
                  color: colors[Math.floor(Math.random() * colors.length)],
                  size: Math.random() * 3 + 2,
                });
              }
          }
          if (isDynamite) {
              for (let rOffset = -1; rOffset <= 1; rOffset++) {
                  for (let cOffset = -1; cOffset <= 1; cOffset++) {
                      createParticles(target.row + rOffset, target.col + cOffset);
                  }
              }
          } else {
              createParticles(target.row, target.col);
          }
          diggingAnimationState.current.impactTriggered = true;
        }

        ctx.save();
        ctx.translate(0, -viewport.top);
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.2; // gravity
          p.life -= 1;
          ctx.globalAlpha = Math.max(0, p.life / 60);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        diggingAnimationState.current.particles = particles.filter(p => p.life > 0);
        ctx.globalAlpha = 1;
        ctx.restore();
        
        ctx.save();
        ctx.translate(
            (target.col + 0.5) * TILE_SIZE_PX,
            (target.row + 0.5) * TILE_SIZE_PX - viewport.top
        );

        if (isDynamite) {
          // Explosion Animation
          if (progress < 1) {
              const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
              const explosionProgress = easeOutQuint(progress);
              const radius = explosionProgress * TILE_SIZE_PX * 2.5;
              const alpha = 1 - progress;

              const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
              grad.addColorStop(0, `rgba(255, 204, 0, ${alpha * 0.9})`);
              grad.addColorStop(0.5, `rgba(255, 107, 0, ${alpha * 0.7})`);
              grad.addColorStop(1, `rgba(183, 28, 28, 0)`);
              
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.fill();
          }
        } else {
          // Pickaxe Animation
           if (progress >= impactTime) {
            // Draw empty tile under particles after impact
            ctx.save();
            ctx.translate(-TILE_SIZE_PX/2, -TILE_SIZE_PX/2);
            drawTile(ctx, TileType.EMPTY, 0, 0, '0-0');
            ctx.restore();
          }

          if (progress > impactTime && progress < impactTime + 0.2) {
              const flashAlpha = 1 - (progress - impactTime) / 0.2;
              ctx.fillStyle = `rgba(255, 255, 224, ${flashAlpha * 0.9})`;
              ctx.shadowColor = 'white'; ctx.shadowBlur = 20;
              ctx.beginPath();
              for(let i=0; i<5; i++) {
                  const angle = (i/5) * Math.PI * 2;
                  ctx.moveTo(0,0);
                  ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
                  ctx.lineTo(Math.cos(angle + 0.1) * 15, Math.sin(angle + 0.1) * 15);
              }
              ctx.fill();
              ctx.shadowBlur = 0;
          }
          drawImprovedPickaxe(ctx, progress);
        }
        
        ctx.restore();
        if (progress >= 1) diggingAnimationState.current = null;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [grid, viewport]);

  useEffect(() => {
    if (diggingAnimationTarget) {
      diggingAnimationState.current = { 
        progress: 0, 
        target: { row: diggingAnimationTarget.row, col: diggingAnimationTarget.col }, 
        particles: [], 
        impactTriggered: false,
        isDynamite: diggingAnimationTarget.isDynamite,
      };
    }
  }, [diggingAnimationTarget]);

  const handleScroll = useCallback(() => {
    const scrollContainer = (ref as React.RefObject<HTMLDivElement>)?.current;
    if (scrollContainer) {
      setViewport({
        top: scrollContainer.scrollTop,
        height: scrollContainer.clientHeight,
        width: scrollContainer.clientWidth,
      });
    }
  }, [ref]);

  useEffect(() => {
    const scrollContainer = (ref as React.RefObject<HTMLDivElement>)?.current;
    scrollContainer?.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [handleScroll, ref]);
  
  useEffect(() => {
    const scrollContainer = (ref as React.RefObject<HTMLDivElement>)?.current;
    if (scrollContainer && deepestRow > 5) {
      const targetScrollTop = Math.max(0, (deepestRow - 3) * TILE_SIZE_PX);
      if(Math.abs(scrollContainer.scrollTop - targetScrollTop) > TILE_SIZE_PX * 2) {
        scrollContainer.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth',
        });
      }
    }
  }, [deepestRow, ref]);

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const scrollContainer = (ref as React.RefObject<HTMLDivElement>)?.current;
    if (!scrollContainer || !canvasRef.current || diggingAnimationState.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const row = Math.floor((y + viewport.top) / TILE_SIZE_PX);
    const col = Math.floor(x / TILE_SIZE_PX);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        if (isDiggable(row, col, grid)) {
            onDig(row, col);
        }
    }
  };

  return (
    <div ref={ref} className="flex-grow overflow-y-auto flex justify-center" style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: `${mineWidth}px`, height: `${mineHeight}px` }}>
        <canvas
          ref={canvasRef}
          width={mineWidth}
          height={viewport.height}
          onClick={handleInteraction}
          style={{ position: 'absolute', top: `${viewport.top}px`, left: '0' }}
        />
      </div>
    </div>
  );
});

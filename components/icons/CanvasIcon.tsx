import React, { useRef, useEffect } from 'react';

interface CanvasIconProps {
  draw: (ctx: CanvasRenderingContext2D, frame: number, size: number) => void;
  className?: string;
  resolution?: number;
}

const CanvasIcon: React.FC<CanvasIconProps> = ({ draw, className = 'w-8 h-8', resolution = 32 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frameCounter = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (timestamp - lastTime > 100) { // ~10 FPS for icons
        lastTime = timestamp;
        frameCounter.current += 1;
        ctx.clearRect(0, 0, resolution, resolution);
        draw(ctx, frameCounter.current, resolution);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw, resolution]);

  return <canvas ref={canvasRef} width={resolution} height={resolution} className={className} style={{ imageRendering: 'pixelated' }} />;
};

export default CanvasIcon;

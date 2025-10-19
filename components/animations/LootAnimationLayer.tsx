

import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for RESOURCE_ICONS. It is exported from GameIcons.tsx, not constants.tsx.
import { RESOURCE_ICONS } from '../icons/GameIcons';
import type { LootAnimation, ResourceType } from '../../types';

interface FloatingLootIconProps {
  animation: LootAnimation;
  onEnd: (resource: ResourceType) => void;
}

const FloatingLootIcon: React.FC<FloatingLootIconProps> = ({ animation, onEnd }) => {
  const { resource, startRect, endRect } = animation;
  const [phase, setPhase] = useState('start');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('end'), 50);
    return () => clearTimeout(timer);
  }, []);

  const startX = startRect.x + startRect.width / 2;
  const startY = startRect.y + startRect.height / 2;
  const endX = endRect.x + endRect.width / 2;
  const endY = endRect.y + endRect.height / 2;

  const style: React.CSSProperties = {
    position: 'fixed',
    left: startX,
    top: startY,
    transform: 'translate(-50%, -50%) scale(1.5)',
    transition: 'all 0.8s cubic-bezier(0.5, 0, 1, 0.5)',
    opacity: 1,
    zIndex: 100,
  };

  if (phase === 'end') {
    style.left = endX;
    style.top = endY;
    style.transform = 'translate(-50%, -50%) scale(0.5)';
    style.opacity = 0;
  }

  return (
    <div style={style} onTransitionEnd={() => onEnd(resource)}>
      {React.cloneElement(RESOURCE_ICONS[resource] as React.ReactElement<{ className?: string }>, { className: 'w-8 h-8' })}
    </div>
  );
};

interface LootAnimationLayerProps {
  animations: LootAnimation[];
  onAnimationEnd: (id: number, resource: ResourceType) => void;
}

export const LootAnimationLayer: React.FC<LootAnimationLayerProps> = ({ animations, onAnimationEnd }) => (
  <>
    {animations.map(anim => (
      <FloatingLootIcon
        key={anim.id}
        animation={anim}
        onEnd={(resource) => onAnimationEnd(anim.id, resource)}
      />
    ))}
  </>
);

import React from 'react';
import CanvasIcon from './CanvasIcon';
import type { ResourceType } from '../../types';
import {
  drawDirtIcon,
  drawStoneIcon,
  drawMineralIcon,
  drawSilverIcon,
  drawGoldIcon,
  drawDynamiteIcon,
  drawDepthIcon,
  drawShopIcon,
  drawBestiaryIcon,
  drawSettingsIcon,
} from '../../services/drawing/iconDrawers';

const DirtIcon = ({ className }: { className?: string }) => <CanvasIcon draw={drawDirtIcon} className={className} />;
const StoneIcon = ({ className }: { className?: string }) => <CanvasIcon draw={drawStoneIcon} className={className} />;
const MineralIcon = ({ className }: { className?: string }) => <CanvasIcon draw={drawMineralIcon} className={className} />;
const SilverIcon = ({ className }: { className?: string }) => <CanvasIcon draw={drawSilverIcon} className={className} />;
const GoldIcon = ({ className }: { className?: string }) => <CanvasIcon draw={drawGoldIcon} className={className} />;

export const DynamiteIcon = ({ className }: { className?: string }) => <CanvasIcon draw={drawDynamiteIcon} className={className} />;
export const DepthIcon = () => <CanvasIcon draw={drawDepthIcon} className="h-8 w-8" />;
export const ShopIcon = () => <CanvasIcon draw={drawShopIcon} className="h-8 w-8" />;
export const BestiaryIcon = () => <CanvasIcon draw={drawBestiaryIcon} className="h-8 w-8" />;
export const SettingsIcon = () => <CanvasIcon draw={drawSettingsIcon} className="h-8 w-8" />;

export const RESOURCE_ICONS: Record<ResourceType, React.ReactElement> = {
  DIRT: <DirtIcon />,
  STONE: <StoneIcon />,
  MINERAL: <MineralIcon />,
  SILVER: <SilverIcon />,
  GOLD: <GoldIcon />,
  DYNAMITE: <DynamiteIcon />,
};

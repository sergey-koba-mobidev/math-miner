import { useState } from 'react';
import type { Problem } from '../types';

export interface MathModalState {
  problem: Problem;
  type: 'dig' | 'superpower';
  row?: number;
  col?: number;
}

export const useModalState = () => {
    const [mathModalState, setMathModalState] = useState<MathModalState | null>(null);
    const [rewardMessage, setRewardMessage] = useState<string | null>(null);
    const [freeUpgradeInfo, setFreeUpgradeInfo] = useState<{ name: string; stats: string } | null>(null);
    
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    
    const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
    const [isRegenerateConfirmationOpen, setIsRegenerateConfirmationOpen] = useState(false);

    return {
        mathModalState, setMathModalState,
        rewardMessage, setRewardMessage,
        freeUpgradeInfo, setFreeUpgradeInfo,
        isShopOpen, setIsShopOpen,
        isBestiaryOpen, setIsBestiaryOpen,
        isSettingsOpen, setIsSettingsOpen,
        isTutorialOpen, setIsTutorialOpen,
        isResetConfirmationOpen, setIsResetConfirmationOpen,
        isRegenerateConfirmationOpen, setIsRegenerateConfirmationOpen,
    };
};

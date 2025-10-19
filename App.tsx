
import React from 'react';
import { TopBar } from './components/TopBar';
import { Mine } from './components/Mine';
import { MathModal } from './components/MathModal';
import { ShopModal } from './components/ShopModal';
import { BestiaryModal } from './components/BestiaryModal';
import { LootAnimationLayer } from './components/animations/LootAnimationLayer';
import { FreeUpgradeModal } from './components/modals/FreeUpgradeModal';
import { RewardModal } from './components/modals/RewardModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { TutorialModal } from './components/modals/TutorialModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { useGame } from './hooks/useGame';
import { t } from './services/translation';

const App: React.FC = () => {
  const {
    // State & Refs
    mineContainerRef,
    lootAnimations,
    resources,
    accessibleDepth,
    combatants,
    floatingTexts,
    equipmentLevels,
    heroAnimation,
    mobAnimation,
    blinkingResources,
    language,
    mineGrid,
    deepestRow,
    diggingAnimationTarget,
    modalState,
    rewardMessage,
    isShopOpen,
    freeUpgradeInfo,
    isBestiaryOpen,
    currentMobIndex,
    isSettingsOpen,
    isTestingMode,
    mathDifficulty,
    resourceMultiplier,
    isTutorialOpen,
    isResetConfirmationOpen,
    // Handlers
    handleLootAnimationEnd,
    setIsShopOpen,
    setIsBestiaryOpen,
    setIsSettingsOpen,
    handleSolveProblem,
    setRewardMessage,
    handleUpgradeEquipment,
    setFreeUpgradeInfo,
    setIsTutorialOpen,
    setIsResetConfirmationOpen,
    handleResetGame,
    setIsTestingMode,
    setMathDifficulty,
    setResourceMultiplier,
    setLanguage,
    handleDig,
  } = useGame();

  return (
    <div className="h-screen w-screen flex flex-col font-mono bg-[#3a2d27]">
      {/* FIX: The prop is called onAnimationEnd, not onEnd. */}
      <LootAnimationLayer animations={lootAnimations} onAnimationEnd={handleLootAnimationEnd} />
      <TopBar 
        resources={resources} 
        accessibleDepth={accessibleDepth} 
        hero={combatants.hero}
        mob={combatants.mob}
        floatingTexts={floatingTexts}
        onShopOpen={() => setIsShopOpen(true)}
        onBestiaryOpen={() => setIsBestiaryOpen(true)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        equipmentLevels={equipmentLevels}
        heroAnimation={heroAnimation}
        mobAnimation={mobAnimation}
        blinkingResources={blinkingResources}
        language={language}
      />
      <Mine 
        ref={mineContainerRef}
        grid={mineGrid} 
        onDig={handleDig} 
        deepestRow={deepestRow} 
        diggingAnimationTarget={diggingAnimationTarget}
      />
      {modalState && (
        <MathModal 
          problem={modalState.problem} 
          onSolve={handleSolveProblem}
          dynamiteCount={resources.DYNAMITE}
          language={language}
        />
      )}
      {rewardMessage && (
        <RewardModal
            title={t('treasureFoundTitle', language)}
            message={rewardMessage}
            onClose={() => setRewardMessage(null)}
            language={language}
        />
      )}
      {isShopOpen && (
        <ShopModal
          onClose={() => setIsShopOpen(false)}
          onUpgrade={handleUpgradeEquipment}
          equipmentLevels={equipmentLevels}
          resources={resources}
          isTestingMode={isTestingMode}
          language={language}
        />
      )}
       {freeUpgradeInfo && (
        <FreeUpgradeModal
            item={freeUpgradeInfo}
            onClose={() => setFreeUpgradeInfo(null)}
            language={language}
        />
      )}
      {isBestiaryOpen && (
        <BestiaryModal
          isOpen={isBestiaryOpen}
          onClose={() => setIsBestiaryOpen(false)}
          highestMobIndexEncountered={currentMobIndex}
          language={language}
        />
      )}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isTestingMode={isTestingMode}
        onToggleTestingMode={() => setIsTestingMode(prev => !prev)}
        onResetGame={() => setIsResetConfirmationOpen(true)}
        mathDifficulty={mathDifficulty}
        onDifficultyChange={setMathDifficulty}
        resourceMultiplier={resourceMultiplier}
        onResourceMultiplierChange={setResourceMultiplier}
        onOpenTutorial={() => {
          setIsSettingsOpen(false);
          setIsTutorialOpen(true);
        }}
        language={language}
        onLanguageChange={setLanguage}
      />
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        language={language}
      />
      <ConfirmationModal
        isOpen={isResetConfirmationOpen}
        onCancel={() => setIsResetConfirmationOpen(false)}
        onConfirm={handleResetGame}
        title={t('resetGameTitle', language)}
        message={t('resetGameMessage', language)}
        language={language}
      />
    </div>
  );
};

export default App;

"use client";

import { useGameStore, STORAGE_KEY } from "@/store/gameStore";
import styles from "./Menu.module.css";

/**
 * Main menu component
 * Displays options to continue or start a new run
 */
export function Menu() {
  const resetGame = useGameStore((state) => state.resetGame);
  const startRound = useGameStore((state) => state.startRound);
  const phase = useGameStore((state) => state.phase);
  const run = useGameStore((state) => state.run);
  
  const handleNewRun = () => {
    // Clear localStorage first
    localStorage.removeItem(STORAGE_KEY);
    // Reset to initial state
    resetGame();
    // Queue startRound to run after reset completes
    // This ensures the game state is fully reset before starting a new round
    setTimeout(() => startRound(), 0);
  };

  const handleContinueRun = () => {
    // Start the round with current state
    startRound();
  };

  // Check if there's an existing run (not at initial state)
  // We have an existing run if:
  // - We're not in the MENU phase (actively playing, shopping, or game over)
  // - OR we've made any progress (hands played, score earned, money changed, etc.)
  const combat = useGameStore((state) => state.combat);
  const hasExistingRun = 
    phase !== "MENU" || 
    combat.handsPlayed > 0 ||
    combat.currentScore > 0 ||
    run.ante > 1 || 
    run.currentBlind !== "small" ||
    run.money !== 4;

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h1 className={styles.title}>Balatro-Like</h1>
        <p className={styles.subtitle}>Stack the deck. Break the game.</p>
        
        <div className={styles.buttonGroup}>
          {hasExistingRun && (
            <button className={styles.primaryButton} onClick={handleContinueRun}>
              Continue Run
            </button>
          )}
          <button 
            className={hasExistingRun ? styles.secondaryButton : styles.primaryButton} 
            onClick={handleNewRun}
          >
            New Run
          </button>
        </div>

        <div className={styles.info}>
          <p>Your progress is automatically saved.</p>
          <p>Starting a new run will clear your current progress.</p>
        </div>
      </div>
    </div>
  );
}

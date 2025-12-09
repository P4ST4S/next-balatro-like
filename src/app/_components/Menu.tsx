"use client";

import { useGameStore } from "@/store/gameStore";
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
    // Clear localStorage and reset game state
    localStorage.removeItem("balatro-like-game-state");
    resetGame();
  };

  const handleContinueRun = () => {
    // Start the round with current state
    startRound();
  };

  // Check if there's an existing run (not at initial state)
  const hasExistingRun = phase !== "MENU" || run.ante > 1 || run.money !== 4;

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

"use client";

import { useGameStore, selectors } from "@/store/gameStore";
import styles from "./GameStoreDebug.module.css";

/**
 * Debug component to visualize and interact with the game store
 * Useful for development and testing
 */
export function GameStoreDebug() {
  const phase = useGameStore((state) => state.phase);
  const run = useGameStore((state) => state.run);
  const combat = useGameStore((state) => state.combat);
  const inventory = useGameStore((state) => state.inventory);
  const deck = useGameStore((state) => state.deck);
  const currentHand = useGameStore((state) => state.currentHand);
  const discardPile = useGameStore((state) => state.discardPile);

  const setPhase = useGameStore((state) => state.setPhase);
  const addMoney = useGameStore((state) => state.addMoney);
  const spendMoney = useGameStore((state) => state.spendMoney);
  const nextBlind = useGameStore((state) => state.nextBlind);
  const playHand = useGameStore((state) => state.playHand);
  const useDiscard = useGameStore((state) => state.useDiscard);
  const addScore = useGameStore((state) => state.addScore);
  const resetGame = useGameStore((state) => state.resetGame);

  const canPlayHand = useGameStore(selectors.canPlayHand);
  const canDiscard = useGameStore(selectors.canDiscard);
  const hasWon = useGameStore(selectors.hasWon);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎮 Game Store Debug</h2>

      <div className={styles.grid}>
        {/* Phase */}
        <section>
          <h3 className={styles.sectionTitle}>Phase</h3>
          <p className={styles.paragraph}>
            Current: <strong>{phase}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => setPhase("MENU")}>
              Menu
            </button>
            <button className={styles.button} onClick={() => setPhase("PLAYING_HAND")}>
              Playing
            </button>
            <button className={styles.button} onClick={() => setPhase("SHOP")}>
              Shop
            </button>
            <button className={styles.button} onClick={() => setPhase("GAME_OVER")}>
              Game Over
            </button>
          </div>
        </section>

        {/* Run State */}
        <section>
          <h3 className={styles.sectionTitle}>Run State</h3>
          <p className={styles.paragraph}>
            💰 Money: <strong>${run.money}</strong>
          </p>
          <p className={styles.paragraph}>
            📊 Ante: <strong>{run.ante}</strong>
          </p>
          <p className={styles.paragraph}>
            🎯 Blind: <strong>{run.currentBlind}</strong>
          </p>
          <p className={styles.paragraph}>
            🔄 Round: <strong>{run.currentRound}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => addMoney(5)}>
              +$5
            </button>
            <button className={styles.button} onClick={() => spendMoney(3)}>
              -$3
            </button>
            <button className={styles.button} onClick={nextBlind}>
              Next Blind
            </button>
          </div>
        </section>

        {/* Combat State */}
        <section>
          <h3 className={styles.sectionTitle}>Combat State</h3>
          <p className={styles.paragraph}>
            🃏 Hands Played: <strong>{combat.handsPlayed}</strong>
          </p>
          <p className={styles.paragraph}>
            🗑️ Discards Left: <strong>{combat.discardsRemaining}</strong>
          </p>
          <p className={styles.paragraph}>
            📈 Score: <strong>{combat.currentScore}</strong> / {combat.targetScore}
          </p>
          <p className={styles.paragraph}>Status: {hasWon ? "🎉 Won!" : "🎯 In Progress"}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={playHand} disabled={!canPlayHand}>
              Play Hand
            </button>
            <button className={styles.button} onClick={useDiscard} disabled={!canDiscard}>
              Use Discard
            </button>
            <button className={styles.button} onClick={() => addScore(100)}>
              +100 Score
            </button>
          </div>
        </section>

        {/* Inventory */}
        <section>
          <h3 className={styles.sectionTitle}>Inventory</h3>
          <p className={styles.paragraph}>
            🃏 Jokers: <strong>{inventory.jokers.length}</strong>
          </p>
          <p className={styles.paragraph}>
            ✨ Consumables: <strong>{inventory.consumables.length}</strong>
          </p>
        </section>

        {/* Deck Info */}
        <section>
          <h3 className={styles.sectionTitle}>Deck</h3>
          <p className={styles.paragraph}>
            📚 Cards in Deck: <strong>{deck.length}</strong>
          </p>
          <p className={styles.paragraph}>
            🖐️ Current Hand: <strong>{currentHand.length}</strong>
          </p>
          <p className={styles.paragraph}>
            🗑️ Discard Pile: <strong>{discardPile.length}</strong>
          </p>
        </section>

        {/* Actions */}
        <section>
          <h3 className={styles.sectionTitle}>Actions</h3>
          <button className={styles.resetButton} onClick={resetGame}>
            🔄 Reset Game
          </button>
        </section>
      </div>

      <div className={styles.tip}>
        <p>💡 Tip: Open React DevTools to inspect Zustand store state and actions</p>
      </div>
    </div>
  );
}

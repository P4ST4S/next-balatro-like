"use client";

import { useGameStore } from "@/store/gameStore";
import styles from "./JokerSlots.module.css";

interface JokerSlotsProps {
  triggeredJokers?: string[];
}

/**
 * Component to display joker slots at the top of the screen
 * Shows equipped jokers with visual highlighting when triggered
 */
export function JokerSlots({ triggeredJokers = [] }: JokerSlotsProps) {
  const jokers = useGameStore((state) => state.inventory.jokers);
  const removeJoker = useGameStore((state) => state.removeJoker);
  const phase = useGameStore((state) => state.phase);

  // Maximum number of joker slots (can be expanded later)
  const MAX_JOKER_SLOTS = 5;

  const handleDeleteJoker = (jokerId: string) => {
    removeJoker(jokerId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Jokers</h3>
        <span className={styles.count}>
          {jokers.length} / {MAX_JOKER_SLOTS}
        </span>
      </div>
      <div className={styles.slots}>
        {Array.from({ length: MAX_JOKER_SLOTS }).map((_, index) => {
          const joker = jokers[index];
          const isTriggered = joker && triggeredJokers.includes(joker.id);

          return (
            <div
              key={index}
              className={`${styles.slot} ${joker ? styles.slotFilled : ""} ${isTriggered ? styles.slotTriggered : ""}`}
            >
              {joker ? (
                <div className={styles.jokerCard}>
                  <div className={styles.jokerHeader}>
                    <span className={styles.jokerName}>{joker.name}</span>
                    <span className={`${styles.jokerRarity} ${styles[`rarity${joker.rarity.charAt(0).toUpperCase() + joker.rarity.slice(1)}`]}`}>
                      {joker.rarity}
                    </span>
                  </div>
                  <p className={styles.jokerDescription}>{joker.description}</p>
                  <div className={styles.jokerFooter}>
                    <span className={styles.sellValue}>Sell: ${joker.sellValue}</span>
                    {phase === "PLAYING_HAND" && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteJoker(joker.id)}
                        title="Delete joker"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.emptySlot}>
                  <span className={styles.emptyText}>Empty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

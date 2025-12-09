"use client";

import { useGameStore } from "@/store/gameStore";
import { JokerSlots } from "../_components/JokerSlots";
import { GameStoreDebug } from "../_components/GameStoreDebug";
import { Shop } from "../_components/Shop";
import styles from "./page.module.css";

export default function GamePage() {
  const phase = useGameStore((state) => state.phase);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Balatro-Like Card Game</h1>
        
        {/* Joker Slots at the top */}
        <JokerSlots />
        
        {/* Conditional rendering based on game phase */}
        {phase === "SHOP" ? (
          <Shop />
        ) : (
          <GameStoreDebug />
        )}
      </main>
    </div>
  );
}

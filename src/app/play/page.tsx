"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { JokerSlots } from "../_components/JokerSlots";
import { Game } from "../_components/Game";
import { Shop } from "../_components/Shop";
import { Menu } from "../_components/Menu";
import styles from "./page.module.css";

export default function PlayPage() {
  const phase = useGameStore((state) => state.phase);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Manually hydrate the store from localStorage on client mount
  useEffect(() => {
    useGameStore.persist.rehydrate();
    
    // Using a microtask to avoid setState during effect warning
    Promise.resolve().then(() => setHasHydrated(true));
  }, []);

  // Wait for hydration to complete before rendering store-dependent content
  // This prevents hydration mismatches when localStorage state differs from initial state
  if (!hasHydrated) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>Balatro-Like Card Game</h1>
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Balatro-Like Card Game</h1>
        
        {/* Joker Slots at the top (except in menu) */}
        {phase !== "MENU" && <JokerSlots />}
        
        {/* Conditional rendering based on game phase */}
        {phase === "MENU" ? (
          <Menu />
        ) : phase === "SHOP" ? (
          <Shop />
        ) : (
          <Game />
        )}
      </main>
    </div>
  );
}

import { JokerSlots } from "../_components/JokerSlots";
import { GameStoreDebug } from "../_components/GameStoreDebug";
import styles from "./page.module.css";

export default function GamePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Balatro-Like Card Game</h1>
        
        {/* Joker Slots at the top */}
        <JokerSlots />
        
        {/* Game Store Debug Panel */}
        <GameStoreDebug />
      </main>
    </div>
  );
}

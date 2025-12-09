"use client";

import { useGameStore, selectors } from "@/store/gameStore";

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
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        fontFamily: "monospace",
        borderRadius: "8px",
        margin: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#4ade80" }}>🎮 Game Store Debug</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Phase */}
        <section>
          <h3 style={{ color: "#60a5fa", marginBottom: "10px" }}>Phase</h3>
          <p style={{ marginBottom: "10px" }}>
            Current: <strong>{phase}</strong>
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => setPhase("MENU")}>Menu</button>
            <button onClick={() => setPhase("PLAYING_HAND")}>Playing</button>
            <button onClick={() => setPhase("SHOP")}>Shop</button>
            <button onClick={() => setPhase("GAME_OVER")}>Game Over</button>
          </div>
        </section>

        {/* Run State */}
        <section>
          <h3 style={{ color: "#60a5fa", marginBottom: "10px" }}>Run State</h3>
          <p>
            💰 Money: <strong>${run.money}</strong>
          </p>
          <p>
            📊 Ante: <strong>{run.ante}</strong>
          </p>
          <p>
            🎯 Blind: <strong>{run.currentBlind}</strong>
          </p>
          <p>
            🔄 Round: <strong>{run.currentRound}</strong>
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            <button onClick={() => addMoney(5)}>+$5</button>
            <button onClick={() => spendMoney(3)}>-$3</button>
            <button onClick={nextBlind}>Next Blind</button>
          </div>
        </section>

        {/* Combat State */}
        <section>
          <h3 style={{ color: "#60a5fa", marginBottom: "10px" }}>Combat State</h3>
          <p>
            🃏 Hands Played: <strong>{combat.handsPlayed}</strong>
          </p>
          <p>
            🗑️ Discards Left: <strong>{combat.discardsRemaining}</strong>
          </p>
          <p>
            📈 Score: <strong>{combat.currentScore}</strong> / {combat.targetScore}
          </p>
          <p>Status: {hasWon ? "🎉 Won!" : "🎯 In Progress"}</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            <button onClick={playHand} disabled={!canPlayHand}>
              Play Hand
            </button>
            <button onClick={useDiscard} disabled={!canDiscard}>
              Use Discard
            </button>
            <button onClick={() => addScore(100)}>+100 Score</button>
          </div>
        </section>

        {/* Inventory */}
        <section>
          <h3 style={{ color: "#60a5fa", marginBottom: "10px" }}>Inventory</h3>
          <p>
            🃏 Jokers: <strong>{inventory.jokers.length}</strong>
          </p>
          <p>
            ✨ Consumables: <strong>{inventory.consumables.length}</strong>
          </p>
        </section>

        {/* Deck Info */}
        <section>
          <h3 style={{ color: "#60a5fa", marginBottom: "10px" }}>Deck</h3>
          <p>
            📚 Cards in Deck: <strong>{deck.length}</strong>
          </p>
          <p>
            🖐️ Current Hand: <strong>{currentHand.length}</strong>
          </p>
          <p>
            🗑️ Discard Pile: <strong>{discardPile.length}</strong>
          </p>
        </section>

        {/* Actions */}
        <section>
          <h3 style={{ color: "#60a5fa", marginBottom: "10px" }}>Actions</h3>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔄 Reset Game
          </button>
        </section>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#2a2a2a",
          borderRadius: "4px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#888" }}>
          💡 Tip: Open React DevTools to inspect Zustand store state and actions
        </p>
      </div>

      <style jsx>{`
        button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        button:hover:not(:disabled) {
          background-color: #2563eb;
        }
        button:disabled {
          background-color: #4b5563;
          cursor: not-allowed;
          opacity: 0.5;
        }
        p {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
}

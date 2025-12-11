"use client";

import { useGameStore } from "@/store/gameStore";
import styles from "./Shop.module.css";

/**
 * Shop component for purchasing jokers between rounds
 * Displays 3 random jokers for sale, with buy, reroll, and continue options
 */
export function Shop() {
  const money = useGameStore((state) => state.run.money);
  const shopItems = useGameStore((state) => state.shop.items);
  const rerollCost = useGameStore((state) => state.shop.rerollCost);
  const jokers = useGameStore((state) => state.inventory.jokers);
  const jokerCount = jokers.length;
  const currentBlind = useGameStore((state) => state.run.currentBlind);
  const ante = useGameStore((state) => state.run.ante);

  const buyJoker = useGameStore((state) => state.buyJoker);
  const sellJoker = useGameStore((state) => state.sellJoker);
  const rerollShop = useGameStore((state) => state.rerollShop);
  const leaveShop = useGameStore((state) => state.leaveShop);
  const startRound = useGameStore((state) => state.startRound);

  const maxJokerSlots = 5;
  const hasJokerSpace = jokerCount < maxJokerSlots;
  const canAffordReroll = money >= rerollCost;

  const handleBuy = (index: number) => {
    buyJoker(index);
  };

  const handleReroll = () => {
    if (canAffordReroll) {
      rerollShop();
    }
  };

  const handleNextRound = () => {
    leaveShop();
    startRound();
  };

  const handleSell = (jokerId: string) => {
    sellJoker(jokerId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>🛒 Shop</h1>
          <p className={styles.subtitle}>
            Ante {ante} - {currentBlind.charAt(0).toUpperCase() + currentBlind.slice(1)} Blind
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Money</span>
            <span className={styles.statValue}>${money}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Jokers</span>
            <span className={styles.statValue}>
              {jokerCount} / {maxJokerSlots}
            </span>
          </div>
        </div>
      </div>

      {jokers.length > 0 && (
        <div className={styles.shopSection}>
          <h2 className={styles.sectionTitle}>Your Jokers</h2>
          <div className={styles.itemGrid}>
            {jokers.map((joker) => (
              <div key={joker.id} className={styles.itemCard}>
                <div className={styles.jokerCard}>
                  <div className={styles.jokerHeader}>
                    <span className={styles.jokerName}>{joker.name}</span>
                    <span
                      className={`${styles.jokerRarity} ${styles[`rarity${joker.rarity.charAt(0).toUpperCase() + joker.rarity.slice(1)}`]}`}
                    >
                      {joker.rarity}
                    </span>
                  </div>
                  <p className={styles.jokerDescription}>{joker.description}</p>
                  <div className={styles.jokerStats}>
                    <span className={styles.sellValue}>Sell: ${joker.sellValue}</span>
                  </div>
                </div>
                <div className={styles.purchaseSection}>
                  <span className={styles.price}>${joker.sellValue}</span>
                  <button
                    className={styles.sellButton}
                    onClick={() => handleSell(joker.id)}
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.shopSection}>
        <h2 className={styles.sectionTitle}>Available Jokers</h2>
        
        {shopItems.length === 0 ? (
          <div className={styles.emptyShop}>
            <p>No items available. Click reroll to refresh!</p>
          </div>
        ) : (
          <div className={styles.itemGrid}>
            {shopItems.map((item, index) => {
              const canBuy = money >= item.price && hasJokerSpace;
              
              return (
                <div key={`${item.joker.id}-${index}`} className={styles.itemCard}>
                  <div className={styles.jokerCard}>
                    <div className={styles.jokerHeader}>
                      <span className={styles.jokerName}>{item.joker.name}</span>
                      <span
                        className={`${styles.jokerRarity} ${styles[`rarity${item.joker.rarity.charAt(0).toUpperCase() + item.joker.rarity.slice(1)}`]}`}
                      >
                        {item.joker.rarity}
                      </span>
                    </div>
                    <p className={styles.jokerDescription}>{item.joker.description}</p>
                    <div className={styles.jokerStats}>
                      <span className={styles.sellValue}>Sell: ${item.joker.sellValue}</span>
                    </div>
                  </div>
                  <div className={styles.purchaseSection}>
                    <span className={styles.price}>${item.price}</span>
                    <button
                      className={styles.buyButton}
                      onClick={() => handleBuy(index)}
                      disabled={!canBuy}
                    >
                      {!hasJokerSpace
                        ? "Full"
                        : money < item.price
                          ? "Can't Afford"
                          : "Buy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.rerollButton}
          onClick={handleReroll}
          disabled={!canAffordReroll}
        >
          🎲 Reroll (${rerollCost})
        </button>
        <button className={styles.nextButton} onClick={handleNextRound}>
          ▶️ Next Round
        </button>
      </div>

      {!hasJokerSpace && (
        <div className={styles.warning}>
          ⚠️ Your joker slots are full! You cannot buy more jokers.
        </div>
      )}
    </div>
  );
}

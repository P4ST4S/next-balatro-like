/**
 * Example usage of deck utilities in the game
 *
 * This file demonstrates how to integrate the deck functions
 * with the game store and state management.
 */

import { createShuffledDeck } from "@/lib/deck";
import { useGameStore } from "@/store/gameStore";
import type { Card } from "@/types/game";

/**
 * Example: Initialize game with a fresh shuffled deck
 *
 * This would typically be called when starting a new run
 */
export function initializeNewRun() {
  const store = useGameStore.getState();

  // Create and shuffle a new deck
  const newDeck = createShuffledDeck();

  // Set the deck in the store
  store.setDeck(newDeck);

  // Reset game state
  store.resetCombat();
  store.resetHand();

  // Draw initial hand (typically 8 cards in Balatro)
  store.drawCards(8);

  console.log("New run initialized with shuffled deck");
}

/**
 * Example: Get card display information
 */
export function getCardDisplay(card: Card): string {
  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  } as const;

  return `${card.rank}${suitSymbols[card.suit]}`;
}

/**
 * Example: Filter deck by suit
 */
export function filterBySuit(cards: Card[], suit: Card["suit"]): Card[] {
  return cards.filter((card) => card.suit === suit);
}

/**
 * Example: Count cards by rank
 */
export function countByRank(cards: Card[]): Record<string, number> {
  return cards.reduce(
    (acc, card) => {
      acc[card.rank] = (acc[card.rank] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

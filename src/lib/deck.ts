import type { Card, Suit, Rank } from "@/types/game";

/**
 * All valid card suits in a standard deck
 */
export const SUITS: readonly Suit[] = ["hearts", "diamonds", "clubs", "spades"] as const;

/**
 * All valid card ranks in a standard deck
 */
export const RANKS: readonly Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

/**
 * Generates a UUID v4 compatible with both browser and Node.js environments
 * Uses crypto.randomUUID() when available, falls back to Math.random()
 *
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  // Use crypto.randomUUID() if available (modern browsers and Node.js 19+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation using Math.random()
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a standard 52-card deck
 * Each card has a unique ID, suit, and rank
 * Cards are returned in a predictable order (by suit, then by rank)
 *
 * @returns Array of 52 playing cards
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: generateUUID(),
        suit,
        rank,
      });
    }
  }

  return deck;
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * This is an in-place shuffle that ensures uniform distribution
 *
 * Time complexity: O(n)
 * Space complexity: O(1)
 *
 * @param array - The array to shuffle (will be mutated)
 * @returns The shuffled array (same reference as input)
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  // Start from the end and swap with a random element before it
  for (let i = array.length - 1; i > 0; i--) {
    // Generate random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Creates a new shuffled deck
 * Convenience function that combines createDeck and shuffle
 *
 * @returns Array of 52 shuffled playing cards
 */
export function createShuffledDeck(): Card[] {
  const deck = createDeck();
  return fisherYatesShuffle(deck);
}

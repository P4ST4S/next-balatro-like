import type { Joker, ShopItem } from "@/types/game";
import { JOKER_POOL } from "./jokers";

/**
 * Base shop configuration
 */
export const SHOP_CONFIG = {
  itemCount: 3,
  baseRerollCost: 5,
  maxJokerSlots: 5,
} as const;

/**
 * Calculate joker price based on rarity
 */
export function calculateJokerPrice(joker: Joker): number {
  const rarityPrices: Record<Joker["rarity"], number> = {
    common: 4,
    uncommon: 6,
    rare: 8,
    legendary: 12,
  };
  return rarityPrices[joker.rarity];
}

/**
 * Generate random shop items from the joker pool
 * Uses Fisher-Yates shuffle for unbiased random selection
 */
export function generateShopItems(itemCount: number = SHOP_CONFIG.itemCount): ShopItem[] {
  // Create a copy of the joker pool to shuffle
  const availableJokers = [...JOKER_POOL];
  
  // Fisher-Yates shuffle to randomize
  for (let i = availableJokers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableJokers[i], availableJokers[j]] = [availableJokers[j], availableJokers[i]];
  }
  
  // Take the first N items and create shop items with prices
  return availableJokers.slice(0, itemCount).map((joker) => ({
    joker: { ...joker }, // Create a copy to avoid reference issues
    price: calculateJokerPrice(joker),
  }));
}

/**
 * Check if player can afford an item
 */
export function canAffordItem(playerMoney: number, itemPrice: number): boolean {
  return playerMoney >= itemPrice;
}

/**
 * Check if player has room for more jokers
 */
export function hasJokerSlots(currentJokerCount: number): boolean {
  return currentJokerCount < SHOP_CONFIG.maxJokerSlots;
}

/**
 * Core game type definitions for the Balatro-like card game
 */

export type GamePhase = "MENU" | "PLAYING_HAND" | "SHOP" | "GAME_OVER";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

/**
 * Represents a playing card in the deck
 */
export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  isEnhanced?: boolean;
  enhancement?: "bonus" | "mult" | "wild" | "glass" | "steel" | "stone";
  edition?: "foil" | "holographic" | "polychrome";
}

/**
 * Joker cards that modify scoring
 */
export interface Joker {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  chipsBonus?: number;
  multBonus?: number;
  effect?: string;
  sellValue: number;
}

/**
 * Consumable items (tarot cards, planet cards, spectral cards)
 */
export interface Consumable {
  id: string;
  name: string;
  type: "tarot" | "planet" | "spectral";
  description: string;
  uses: number;
}

/**
 * Run state tracking progression through the game
 */
export interface RunState {
  money: number;
  ante: number;
  currentBlind: "small" | "big" | "boss";
  currentRound: number;
}

/**
 * Combat state for active hand play
 */
export interface CombatState {
  handsPlayed: number;
  discardsRemaining: number;
  currentScore: number;
  targetScore: number;
}

/**
 * Player inventory
 */
export interface InventoryState {
  jokers: Joker[];
  consumables: Consumable[];
}

/**
 * Complete game state
 */
export interface GameState {
  phase: GamePhase;
  run: RunState;
  combat: CombatState;
  inventory: InventoryState;
  deck: Card[];
  currentHand: Card[];
  discardPile: Card[];
}

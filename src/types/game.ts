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
  selected?: boolean;
  isEnhanced?: boolean;
  enhancement?: "bonus" | "mult" | "wild" | "glass" | "steel" | "stone";
  edition?: "foil" | "holographic" | "polychrome";
}

/**
 * Trigger context for joker callbacks
 */
export interface JokerTriggerContext {
  handType?: string;
  scoringCards?: Card[];
  chips: number;
  mult: number;
}

/**
 * Joker trigger result
 */
export interface JokerTriggerResult {
  chipsAdd?: number;
  multAdd?: number;
  multMultiply?: number;
  triggered: boolean;
}

/**
 * Joker trigger types
 */
export type JokerTriggerType = "onScore" | "onEndCalculation";

/**
 * Joker cards that modify scoring
 */
export interface Joker {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  sellValue: number;
  triggerType: JokerTriggerType;
  trigger: (context: JokerTriggerContext) => JokerTriggerResult;
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
  handsRemaining: number;
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
 * Shop item with pricing
 */
export interface ShopItem {
  joker: Joker;
  price: number;
}

/**
 * Shop state
 */
export interface ShopState {
  items: ShopItem[];
  rerollCost: number;
}

/**
 * Complete game state
 */
export interface GameState {
  phase: GamePhase;
  run: RunState;
  combat: CombatState;
  inventory: InventoryState;
  shop: ShopState;
  deck: Card[];
  currentHand: Card[];
  discardPile: Card[];
}

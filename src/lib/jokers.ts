import type { Joker } from "@/types/game";

/**
 * Example Joker implementations
 * These demonstrate the 3 types of joker triggers:
 * 1. Add flat mult (+4 Mult)
 * 2. Add flat chips (+15 Chips)
 * 3. Conditional multiplier (x3 Mult if hand is Flush)
 */

/**
 * Simple joker that adds +4 to multiplier
 */
export const JOKER_PLUS_MULT: Joker = {
  id: "plus-4-mult",
  name: "+4 Mult",
  description: "Adds +4 to multiplier",
  rarity: "common",
  sellValue: 2,
  triggerType: "onScore",
  trigger: () => ({
    multAdd: 4,
    triggered: true,
  }),
};

/**
 * Simple joker that adds +15 to chips
 */
export const JOKER_PLUS_CHIPS: Joker = {
  id: "plus-15-chips",
  name: "+15 Chips",
  description: "Adds +15 to chips",
  rarity: "common",
  sellValue: 2,
  triggerType: "onScore",
  trigger: () => ({
    chipsAdd: 15,
    triggered: true,
  }),
};

/**
 * Conditional joker that multiplies mult by 3 if hand is a Flush
 */
export const JOKER_FLUSH_MULTIPLIER: Joker = {
  id: "flush-x3-mult",
  name: "Flush x3",
  description: "x3 Mult if hand is a Flush",
  rarity: "uncommon",
  sellValue: 4,
  triggerType: "onScore",
  trigger: (context) => {
    const isFlush = context.handType?.toLowerCase().includes("flush");
    if (isFlush) {
      // Multiply current mult by 3, subtract original to get the additive amount
      const multAddition = context.mult * 2; // mult * 3 - mult = mult * 2
      return {
        multAdd: multAddition,
        triggered: true,
      };
    }
    return {
      triggered: false,
    };
  },
};

/**
 * Joker that adds +20 chips
 */
export const JOKER_BIG_CHIPS: Joker = {
  id: "plus-20-chips",
  name: "+20 Chips",
  description: "Adds +20 to chips",
  rarity: "common",
  sellValue: 3,
  triggerType: "onScore",
  trigger: () => ({
    chipsAdd: 20,
    triggered: true,
  }),
};

/**
 * Joker that adds +8 mult
 */
export const JOKER_BIG_MULT: Joker = {
  id: "plus-8-mult",
  name: "+8 Mult",
  description: "Adds +8 to multiplier",
  rarity: "uncommon",
  sellValue: 5,
  triggerType: "onScore",
  trigger: () => ({
    multAdd: 8,
    triggered: true,
  }),
};

/**
 * Conditional joker for pairs
 */
export const JOKER_PAIR_BONUS: Joker = {
  id: "pair-bonus",
  name: "Pair Bonus",
  description: "+30 Chips if hand contains a Pair",
  rarity: "common",
  sellValue: 3,
  triggerType: "onScore",
  trigger: (context) => {
    const hasPair = context.handType?.toLowerCase().includes("pair");
    if (hasPair) {
      return {
        chipsAdd: 30,
        triggered: true,
      };
    }
    return {
      triggered: false,
    };
  },
};

/**
 * Conditional joker for straights
 */
export const JOKER_STRAIGHT_MULT: Joker = {
  id: "straight-mult",
  name: "Straight Mult",
  description: "+10 Mult if hand is a Straight",
  rarity: "uncommon",
  sellValue: 5,
  triggerType: "onScore",
  trigger: (context) => {
    const isStraight = context.handType?.toLowerCase().includes("straight");
    if (isStraight) {
      return {
        multAdd: 10,
        triggered: true,
      };
    }
    return {
      triggered: false,
    };
  },
};

/**
 * Rare joker that doubles mult
 */
export const JOKER_DOUBLE_MULT: Joker = {
  id: "double-mult",
  name: "Double Mult",
  description: "x2 Mult",
  rarity: "rare",
  sellValue: 8,
  triggerType: "onScore",
  trigger: (context) => ({
    multAdd: context.mult,
    triggered: true,
  }),
};

/**
 * Legendary high-value joker
 */
export const JOKER_JACKPOT: Joker = {
  id: "jackpot",
  name: "Jackpot",
  description: "+100 Chips and +10 Mult",
  rarity: "legendary",
  sellValue: 15,
  triggerType: "onScore",
  trigger: () => ({
    chipsAdd: 100,
    multAdd: 10,
    triggered: true,
  }),
};

/**
 * All example jokers
 */
export const EXAMPLE_JOKERS = [
  JOKER_PLUS_MULT,
  JOKER_PLUS_CHIPS,
  JOKER_FLUSH_MULTIPLIER,
] as const;

/**
 * Full joker pool available for purchase in the shop
 */
export const JOKER_POOL: Joker[] = [
  JOKER_PLUS_MULT,
  JOKER_PLUS_CHIPS,
  JOKER_BIG_CHIPS,
  JOKER_BIG_MULT,
  JOKER_FLUSH_MULTIPLIER,
  JOKER_PAIR_BONUS,
  JOKER_STRAIGHT_MULT,
  JOKER_DOUBLE_MULT,
  JOKER_JACKPOT,
];

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
 * All example jokers
 */
export const EXAMPLE_JOKERS = [
  JOKER_PLUS_MULT,
  JOKER_PLUS_CHIPS,
  JOKER_FLUSH_MULTIPLIER,
] as const;

import type { Card, Rank } from "@/types/game";
import type { PokerHandType } from "./pokerEvaluator";

/**
 * Base statistics for each poker hand type in Balatro
 * These values are based on standard Balatro scoring
 */
export interface HandStats {
  baseChips: number;
  baseMult: number;
}

/**
 * Base stats for each hand type
 * Values from Balatro standard scoring
 */
export const HAND_BASE_STATS: Record<PokerHandType, HandStats> = {
  "High Card": { baseChips: 5, baseMult: 1 },
  Pair: { baseChips: 10, baseMult: 2 },
  "Two Pair": { baseChips: 20, baseMult: 2 },
  "Three of a Kind": { baseChips: 30, baseMult: 3 },
  Straight: { baseChips: 30, baseMult: 4 },
  Flush: { baseChips: 35, baseMult: 4 },
  "Full House": { baseChips: 40, baseMult: 4 },
  "Four of a Kind": { baseChips: 60, baseMult: 7 },
  "Straight Flush": { baseChips: 100, baseMult: 8 },
};

/**
 * Chip values for each card rank
 * Face cards have standard Balatro values
 */
export const CARD_CHIP_VALUES: Record<Rank, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 11,
};

/**
 * Result of score calculation
 */
export interface ScoreResult {
  baseChips: number;
  cardChips: number;
  totalChips: number;
  baseMult: number;
  totalMult: number;
  finalScore: number;
}

/**
 * Calculate the score for a played hand following Balatro scoring rules
 *
 * Formula: Score = (Base Chips + Card Chips) × (Base Mult + Additional Mult)
 *
 * @param scoringCards - The cards that contribute to scoring (from evaluatePokerHand)
 * @param handType - The type of poker hand being played
 * @returns Detailed breakdown of the score calculation
 *
 * @example
 * // Pair of Kings (2 cards score, each worth 10 chips)
 * const result = calculateScore([K♥, K♠], "Pair");
 * // Returns: {
 * //   baseChips: 10,
 * //   cardChips: 20,
 * //   totalChips: 30,
 * //   baseMult: 2,
 * //   totalMult: 2,
 * //   finalScore: 60 (30 × 2)
 * // }
 */
export function calculateScore(scoringCards: Card[], handType: PokerHandType): ScoreResult {
  // Get base stats for this hand type
  const handStats = HAND_BASE_STATS[handType];
  const baseChips = handStats.baseChips;
  const baseMult = handStats.baseMult;

  // Step 1: Calculate total chips (Base Chips + Sum of Card Chips)
  const cardChips = scoringCards.reduce((sum, card) => {
    return sum + CARD_CHIP_VALUES[card.rank];
  }, 0);

  const totalChips = baseChips + cardChips;

  // Step 2: Calculate total multiplier (Base Mult + additional multipliers)
  // Note: Architecture is open for joker triggers to add to totalMult in future
  const totalMult = baseMult;

  // Step 3: Calculate final score
  const finalScore = totalChips * totalMult;

  return {
    baseChips,
    cardChips,
    totalChips,
    baseMult,
    totalMult,
    finalScore,
  };
}

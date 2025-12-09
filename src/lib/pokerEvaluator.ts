import type { Card, Rank } from "@/types/game";

/**
 * Poker hand types in order of strength (weakest to strongest)
 */
export type PokerHandType =
  | "High Card"
  | "Pair"
  | "Two Pair"
  | "Three of a Kind"
  | "Straight"
  | "Flush"
  | "Full House"
  | "Four of a Kind"
  | "Straight Flush";

/**
 * Result of evaluating a poker hand
 * In Balatro, only scoring cards matter - they trigger "On Score" effects
 */
export interface PokerHandResult {
  handType: PokerHandType;
  scoringCards: Card[];
}

/**
 * Rank values for comparison and straight detection
 * Ace can be high (14) or low (1) in straights
 */
const RANK_VALUES: Record<Rank, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

/**
 * Groups cards by rank
 */
function groupByRank(cards: Card[]): Map<Rank, Card[]> {
  const groups = new Map<Rank, Card[]>();

  for (const card of cards) {
    const existing = groups.get(card.rank) || [];
    groups.set(card.rank, [...existing, card]);
  }

  return groups;
}

/**
 * Groups cards by suit
 */
function groupBySuit(cards: Card[]): Map<Card["suit"], Card[]> {
  const groups = new Map<Card["suit"], Card[]>();

  for (const card of cards) {
    const existing = groups.get(card.suit) || [];
    groups.set(card.suit, [...existing, card]);
  }

  return groups;
}

/**
 * Checks if cards form a straight
 * Returns the cards in straight order if true, null otherwise
 */
function checkStraight(cards: Card[]): Card[] | null {
  if (cards.length < 5) return null;

  // Get unique ranks and sort by value
  const uniqueRanks = Array.from(new Set(cards.map((c) => c.rank)));
  const sortedValues = uniqueRanks
    .map((rank) => RANK_VALUES[rank])
    .sort((a, b) => a - b);

  // Check for 5 consecutive values
  if (sortedValues.length >= 5) {
    for (let i = 0; i <= sortedValues.length - 5; i++) {
      const slice = sortedValues.slice(i, i + 5);
      const isConsecutive = slice.every((val, idx) => idx === 0 || val === slice[idx - 1] + 1);

      if (isConsecutive) {
        // Return cards in straight order
        const straightRanks = slice.map(
          (val) => Object.keys(RANK_VALUES).find((k) => RANK_VALUES[k as Rank] === val) as Rank
        );
        return straightRanks.map((rank) => cards.find((c) => c.rank === rank)!);
      }
    }
  }

  // Check for ace-low straight (A-2-3-4-5)
  if (
    uniqueRanks.includes("A") &&
    uniqueRanks.includes("2") &&
    uniqueRanks.includes("3") &&
    uniqueRanks.includes("4") &&
    uniqueRanks.includes("5")
  ) {
    const lowStraightRanks: Rank[] = ["A", "2", "3", "4", "5"];
    return lowStraightRanks.map((rank) => cards.find((c) => c.rank === rank)!);
  }

  return null;
}

/**
 * Evaluates a poker hand and returns the hand type and scoring cards
 * According to Balatro rules, only the cards that form the hand are scoring cards
 *
 * @param cards - Array of 5 cards to evaluate (the played hand)
 * @returns Object containing the hand type and array of scoring cards
 *
 * @example
 * // Pair of Kings with a 7, 8, 9
 * const result = evaluatePokerHand([K♥, K♠, 7♦, 8♣, 9♥]);
 * // Returns: { handType: "Pair", scoringCards: [K♥, K♠] }
 */
export function evaluatePokerHand(cards: Card[]): PokerHandResult {
  if (cards.length !== 5) {
    throw new Error("Poker hand must contain exactly 5 cards");
  }

  const rankGroups = groupByRank(cards);
  const suitGroups = groupBySuit(cards);

  // Get group sizes sorted by count (descending)
  const groupSizes = Array.from(rankGroups.values())
    .map((group) => group.length)
    .sort((a, b) => b - a);

  // Check for flush (all same suit)
  const isFlush = suitGroups.size === 1;

  // Check for straight
  const straightCards = checkStraight(cards);
  const isStraight = straightCards !== null;

  // Straight Flush (strongest hand)
  if (isStraight && isFlush) {
    return {
      handType: "Straight Flush",
      scoringCards: cards, // All 5 cards score in a straight flush
    };
  }

  // Four of a Kind
  if (groupSizes[0] === 4) {
    const fourOfAKindGroup = Array.from(rankGroups.values()).find((group) => group.length === 4)!;
    return {
      handType: "Four of a Kind",
      scoringCards: fourOfAKindGroup, // Only the 4 matching cards score
    };
  }

  // Full House (3 of a kind + pair)
  if (groupSizes[0] === 3 && groupSizes[1] === 2) {
    const threeOfAKindGroup = Array.from(rankGroups.values()).find((group) => group.length === 3)!;
    const pairGroup = Array.from(rankGroups.values()).find((group) => group.length === 2)!;
    return {
      handType: "Full House",
      scoringCards: [...threeOfAKindGroup, ...pairGroup], // All 5 cards score (3 + 2)
    };
  }

  // Flush (all same suit, not a straight)
  if (isFlush) {
    return {
      handType: "Flush",
      scoringCards: cards, // All 5 cards score in a flush
    };
  }

  // Straight (consecutive ranks, not all same suit)
  if (isStraight) {
    return {
      handType: "Straight",
      scoringCards: straightCards, // All 5 cards score in a straight
    };
  }

  // Three of a Kind
  if (groupSizes[0] === 3) {
    const threeOfAKindGroup = Array.from(rankGroups.values()).find((group) => group.length === 3)!;
    return {
      handType: "Three of a Kind",
      scoringCards: threeOfAKindGroup, // Only the 3 matching cards score
    };
  }

  // Two Pair
  if (groupSizes[0] === 2 && groupSizes[1] === 2) {
    const pairs = Array.from(rankGroups.values()).filter((group) => group.length === 2);
    return {
      handType: "Two Pair",
      scoringCards: [...pairs[0], ...pairs[1]], // Both pairs score (4 cards)
    };
  }

  // Pair
  if (groupSizes[0] === 2) {
    const pairGroup = Array.from(rankGroups.values()).find((group) => group.length === 2)!;
    return {
      handType: "Pair",
      scoringCards: pairGroup, // Only the 2 matching cards score
    };
  }

  // High Card (no matching ranks, no straight, no flush)
  // Find the highest card by rank value
  const highestCard = cards.reduce((highest, card) =>
    RANK_VALUES[card.rank] > RANK_VALUES[highest.rank] ? card : highest
  );

  return {
    handType: "High Card",
    scoringCards: [highestCard], // Only the highest card scores
  };
}

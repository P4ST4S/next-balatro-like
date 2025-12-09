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
 * Reverse lookup map for O(1) value-to-rank conversion
 */
const VALUE_TO_RANK: Record<number, Rank> = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
  14: "A",
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

  // Build a map for O(1) rank-to-card lookup
  const rankToCard = new Map<Rank, Card>();
  for (const card of cards) {
    if (!rankToCard.has(card.rank)) {
      rankToCard.set(card.rank, card);
    }
  }

  // Get unique ranks and sort by value
  const uniqueRanks = Array.from(rankToCard.keys());
  const sortedValues = uniqueRanks
    .map((rank) => RANK_VALUES[rank])
    .sort((a, b) => a - b);

  // Check for 5 consecutive values
  if (sortedValues.length >= 5) {
    for (let i = 0; i <= sortedValues.length - 5; i++) {
      const slice = sortedValues.slice(i, i + 5);
      const isConsecutive = slice.every((val, idx) => idx === 0 || val === slice[idx - 1] + 1);

      if (isConsecutive) {
        // Return cards in straight order using O(1) lookups
        // Safe to use ! because slice values are guaranteed to be in VALUE_TO_RANK
        const straightRanks = slice.map((val) => VALUE_TO_RANK[val]);
        // Safe to use ! because we built rankToCard from these exact cards
        return straightRanks.map((rank) => rankToCard.get(rank)!);
      }
    }
  }

  // Check for ace-low straight (A-2-3-4-5)
  if (
    rankToCard.has("A") &&
    rankToCard.has("2") &&
    rankToCard.has("3") &&
    rankToCard.has("4") &&
    rankToCard.has("5")
  ) {
    const lowStraightRanks: Rank[] = ["A", "2", "3", "4", "5"];
    // Safe to use ! because we just verified these ranks exist in rankToCard
    return lowStraightRanks.map((rank) => rankToCard.get(rank)!);
  }

  return null;
}

/**
 * Evaluates a poker hand and returns the hand type and scoring cards
 * According to Balatro rules, only the cards that form the hand are scoring cards
 *
 * Note: Straights and Straight Flushes require exactly 5 cards to be detected.
 * With fewer than 5 cards, the best possible hand types are:
 * - Four of a Kind (4 cards)
 * - Three of a Kind (3 cards)
 * - Two Pair (4 cards)
 * - Pair (2 cards)
 * - High Card (1 card)
 * - Flush (exactly 5 cards of same suit)
 *
 * @param cards - Array of 1-5 cards to evaluate (the played hand)
 * @returns Object containing the hand type and array of scoring cards
 *
 * @example
 * // Pair of Kings with a 7, 8, 9
 * const result = evaluatePokerHand([K♥, K♠, 7♦, 8♣, 9♥]);
 * // Returns: { handType: "Pair", scoringCards: [K♥, K♠] }
 */
export function evaluatePokerHand(cards: Card[]): PokerHandResult {
  if (cards.length < 1 || cards.length > 5) {
    throw new Error("Poker hand must contain between 1 and 5 cards");
  }

  const rankGroups = groupByRank(cards);
  const suitGroups = groupBySuit(cards);

  // Get group sizes sorted by count (descending)
  const groupSizes = Array.from(rankGroups.values())
    .map((group) => group.length)
    .sort((a, b) => b - a);

  // Check for flush (all same suit AND exactly 5 cards)
  const isFlush = suitGroups.size === 1 && cards.length === 5;

  // Check for straight
  const straightCards = checkStraight(cards);
  const isStraight = straightCards !== null;

  // Straight Flush (strongest hand)
  if (isStraight && isFlush) {
    return {
      handType: "Straight Flush",
      scoringCards: cards, // All cards score in a straight flush
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
      scoringCards: cards, // All cards score in a flush
    };
  }

  // Straight (consecutive ranks, not all same suit)
  if (isStraight) {
    return {
      handType: "Straight",
      scoringCards: straightCards, // All cards score in a straight
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

/**
 * Comprehensive test suite for poker hand evaluator
 * 
 * Since the project doesn't have a formal test framework configured yet,
 * this is a standalone test file that can be run directly with:
 * npx tsx src/lib/__tests__/pokerEvaluator.test.ts
 * 
 * Tests all poker hand types including edge cases.
 */

import type { Card } from "@/types/game";
import { evaluatePokerHand } from "../pokerEvaluator";

// Helper function to create a test card
function createCard(rank: Card["rank"], suit: Card["suit"]): Card {
  return {
    id: `${rank}-${suit}`,
    rank,
    suit,
  };
}

// Test cases
const tests = [
  {
    name: "High Card - Ace High",
    cards: [
      createCard("A", "hearts"),
      createCard("K", "diamonds"),
      createCard("7", "clubs"),
      createCard("5", "spades"),
      createCard("3", "hearts"),
    ],
    expectedType: "High Card",
    expectedScoringCount: 1, // Only the Ace
  },
  {
    name: "Pair of Kings",
    cards: [
      createCard("K", "hearts"),
      createCard("K", "spades"),
      createCard("7", "diamonds"),
      createCard("8", "clubs"),
      createCard("9", "hearts"),
    ],
    expectedType: "Pair",
    expectedScoringCount: 2, // Only the two Kings
  },
  {
    name: "Two Pair - Queens and Fives",
    cards: [
      createCard("Q", "hearts"),
      createCard("Q", "diamonds"),
      createCard("5", "clubs"),
      createCard("5", "spades"),
      createCard("A", "hearts"),
    ],
    expectedType: "Two Pair",
    expectedScoringCount: 4, // Both pairs
  },
  {
    name: "Three of a Kind - Three Jacks",
    cards: [
      createCard("J", "hearts"),
      createCard("J", "diamonds"),
      createCard("J", "clubs"),
      createCard("4", "spades"),
      createCard("2", "hearts"),
    ],
    expectedType: "Three of a Kind",
    expectedScoringCount: 3, // Only the three Jacks
  },
  {
    name: "Straight - 5 to 9",
    cards: [
      createCard("5", "hearts"),
      createCard("6", "diamonds"),
      createCard("7", "clubs"),
      createCard("8", "spades"),
      createCard("9", "hearts"),
    ],
    expectedType: "Straight",
    expectedScoringCount: 5, // All cards in straight
  },
  {
    name: "Straight - Ace Low (A-2-3-4-5)",
    cards: [
      createCard("A", "hearts"),
      createCard("2", "diamonds"),
      createCard("3", "clubs"),
      createCard("4", "spades"),
      createCard("5", "hearts"),
    ],
    expectedType: "Straight",
    expectedScoringCount: 5, // All cards in straight
  },
  {
    name: "Straight - 10 to Ace (Broadway)",
    cards: [
      createCard("10", "hearts"),
      createCard("J", "diamonds"),
      createCard("Q", "clubs"),
      createCard("K", "spades"),
      createCard("A", "hearts"),
    ],
    expectedType: "Straight",
    expectedScoringCount: 5, // All cards in straight
  },
  {
    name: "Flush - All Hearts",
    cards: [
      createCard("A", "hearts"),
      createCard("K", "hearts"),
      createCard("7", "hearts"),
      createCard("5", "hearts"),
      createCard("3", "hearts"),
    ],
    expectedType: "Flush",
    expectedScoringCount: 5, // All cards in flush
  },
  {
    name: "Full House - Three Aces and Two Kings",
    cards: [
      createCard("A", "hearts"),
      createCard("A", "diamonds"),
      createCard("A", "clubs"),
      createCard("K", "spades"),
      createCard("K", "hearts"),
    ],
    expectedType: "Full House",
    expectedScoringCount: 5, // All cards (3+2)
  },
  {
    name: "Four of a Kind - Four Tens",
    cards: [
      createCard("10", "hearts"),
      createCard("10", "diamonds"),
      createCard("10", "clubs"),
      createCard("10", "spades"),
      createCard("A", "hearts"),
    ],
    expectedType: "Four of a Kind",
    expectedScoringCount: 4, // Only the four Tens
  },
  {
    name: "Straight Flush - 5 to 9 of Diamonds",
    cards: [
      createCard("5", "diamonds"),
      createCard("6", "diamonds"),
      createCard("7", "diamonds"),
      createCard("8", "diamonds"),
      createCard("9", "diamonds"),
    ],
    expectedType: "Straight Flush",
    expectedScoringCount: 5, // All cards
  },
  {
    name: "Royal Flush - 10 to Ace of Spades",
    cards: [
      createCard("10", "spades"),
      createCard("J", "spades"),
      createCard("Q", "spades"),
      createCard("K", "spades"),
      createCard("A", "spades"),
    ],
    expectedType: "Straight Flush", // Royal Flush is a Straight Flush
    expectedScoringCount: 5, // All cards
  },
];

// Run tests
let passed = 0;
let failed = 0;

console.log("🃏 Testing Poker Hand Evaluator\n");

for (const test of tests) {
  try {
    const result = evaluatePokerHand(test.cards);

    const typeMatch = result.handType === test.expectedType;
    const countMatch = result.scoringCards.length === test.expectedScoringCount;

    if (typeMatch && countMatch) {
      console.log(`✅ ${test.name}`);
      console.log(`   Type: ${result.handType}, Scoring Cards: ${result.scoringCards.length}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: ${test.expectedType} with ${test.expectedScoringCount} scoring cards`);
      console.log(`   Got: ${result.handType} with ${result.scoringCards.length} scoring cards`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    failed++;
  }
  console.log("");
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

// Exit with error code if any tests failed
if (failed > 0) {
  process.exit(1);
}

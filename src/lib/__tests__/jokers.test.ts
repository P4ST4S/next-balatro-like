/**
 * Test suite for joker mechanics
 * 
 * Tests the joker trigger system and scoring modifications
 * 
 * Can be run with: npx tsx src/lib/__tests__/jokers.test.ts
 */

import type { Card } from "@/types/game";
import { calculateScore } from "../scoringEngine";
import { JOKER_PLUS_MULT, JOKER_PLUS_CHIPS, JOKER_FLUSH_MULTIPLIER } from "../jokers";

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
    name: "Pair with +4 Mult Joker",
    scoringCards: [createCard("K", "hearts"), createCard("K", "spades")],
    handType: "Pair" as const,
    jokers: [JOKER_PLUS_MULT],
    expectedBaseChips: 10,
    expectedCardChips: 20,
    expectedTotalChips: 30,
    expectedBaseMult: 2,
    expectedTotalMult: 6, // 2 base + 4 from joker
    expectedFinalScore: 180, // 30 × 6
  },
  {
    name: "Pair with +15 Chips Joker",
    scoringCards: [createCard("K", "hearts"), createCard("K", "spades")],
    handType: "Pair" as const,
    jokers: [JOKER_PLUS_CHIPS],
    expectedBaseChips: 10,
    expectedCardChips: 20,
    expectedTotalChips: 45, // 30 base + 15 from joker
    expectedBaseMult: 2,
    expectedTotalMult: 2,
    expectedFinalScore: 90, // 45 × 2
  },
  {
    name: "Flush with x3 Flush Multiplier Joker",
    scoringCards: [
      createCard("A", "hearts"),
      createCard("K", "hearts"),
      createCard("7", "hearts"),
      createCard("5", "hearts"),
      createCard("3", "hearts"),
    ],
    handType: "Flush" as const,
    jokers: [JOKER_FLUSH_MULTIPLIER],
    expectedBaseChips: 35,
    expectedCardChips: 36,
    expectedTotalChips: 71,
    expectedBaseMult: 4,
    expectedTotalMult: 12, // 4 base × 3 = 12
    expectedFinalScore: 852, // 71 × 12
  },
  {
    name: "Pair with x3 Flush Multiplier Joker (should not trigger)",
    scoringCards: [createCard("K", "hearts"), createCard("K", "spades")],
    handType: "Pair" as const,
    jokers: [JOKER_FLUSH_MULTIPLIER],
    expectedBaseChips: 10,
    expectedCardChips: 20,
    expectedTotalChips: 30,
    expectedBaseMult: 2,
    expectedTotalMult: 2,
    expectedFinalScore: 60, // No multiplier since not a flush
  },
  {
    name: "Pair with all three jokers",
    scoringCards: [createCard("K", "hearts"), createCard("K", "spades")],
    handType: "Pair" as const,
    jokers: [JOKER_PLUS_MULT, JOKER_PLUS_CHIPS, JOKER_FLUSH_MULTIPLIER],
    expectedBaseChips: 10,
    expectedCardChips: 20,
    expectedTotalChips: 45, // 30 + 15
    expectedBaseMult: 2,
    expectedTotalMult: 6, // 2 + 4
    expectedFinalScore: 270, // 45 × 6, flush multiplier doesn't trigger
  },
  {
    name: "Flush with all three jokers",
    scoringCards: [
      createCard("A", "hearts"),
      createCard("K", "hearts"),
      createCard("7", "hearts"),
      createCard("5", "hearts"),
      createCard("3", "hearts"),
    ],
    handType: "Flush" as const,
    jokers: [JOKER_PLUS_MULT, JOKER_PLUS_CHIPS, JOKER_FLUSH_MULTIPLIER],
    expectedBaseChips: 35,
    expectedCardChips: 36,
    expectedTotalChips: 86, // 71 + 15
    expectedBaseMult: 4,
    expectedTotalMult: 24, // 4 + 4 = 8, then 8 × 3 = 24 (actually: 8 + 16 = 24)
    expectedFinalScore: 2064, // 86 × 24
  },
  {
    name: "Straight Flush with Flush Multiplier (should trigger)",
    scoringCards: [
      createCard("5", "diamonds"),
      createCard("6", "diamonds"),
      createCard("7", "diamonds"),
      createCard("8", "diamonds"),
      createCard("9", "diamonds"),
    ],
    handType: "Straight Flush" as const,
    jokers: [JOKER_FLUSH_MULTIPLIER],
    expectedBaseChips: 100,
    expectedCardChips: 35,
    expectedTotalChips: 135,
    expectedBaseMult: 8,
    expectedTotalMult: 24, // 8 × 3 = 24
    expectedFinalScore: 3240, // 135 × 24
  },
];

// Run tests
let passed = 0;
let failed = 0;

console.log("🃏 Testing Joker Mechanics\n");

for (const test of tests) {
  try {
    const result = calculateScore(test.scoringCards, test.handType, test.jokers);

    const baseChipsMatch = result.baseChips === test.expectedBaseChips;
    const cardChipsMatch = result.cardChips === test.expectedCardChips;
    const totalChipsMatch = result.totalChips === test.expectedTotalChips;
    const baseMultMatch = result.baseMult === test.expectedBaseMult;
    const totalMultMatch = result.totalMult === test.expectedTotalMult;
    const finalScoreMatch = result.finalScore === test.expectedFinalScore;

    if (
      baseChipsMatch &&
      cardChipsMatch &&
      totalChipsMatch &&
      baseMultMatch &&
      totalMultMatch &&
      finalScoreMatch
    ) {
      console.log(`✅ ${test.name}`);
      console.log(
        `   Score: ${result.totalChips} chips × ${result.totalMult} mult = ${result.finalScore}`
      );
      if (result.triggeredJokers && result.triggeredJokers.length > 0) {
        console.log(`   Triggered Jokers: ${result.triggeredJokers.join(", ")}`);
      }
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected:`);
      console.log(
        `     Base Chips: ${test.expectedBaseChips}, Card Chips: ${test.expectedCardChips}`
      );
      console.log(
        `     Total Chips: ${test.expectedTotalChips}, Base Mult: ${test.expectedBaseMult}, Total Mult: ${test.expectedTotalMult}`
      );
      console.log(`     Final Score: ${test.expectedFinalScore}`);
      console.log(`   Got:`);
      console.log(
        `     Base Chips: ${result.baseChips}, Card Chips: ${result.cardChips}`
      );
      console.log(
        `     Total Chips: ${result.totalChips}, Base Mult: ${result.baseMult}, Total Mult: ${result.totalMult}`
      );
      console.log(`     Final Score: ${result.finalScore}`);
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

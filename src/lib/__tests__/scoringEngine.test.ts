/**
 * Test suite for the scoring engine
 * 
 * Tests the Balatro scoring formula:
 * Score = (Base Chips + Card Chips) × (Base Mult)
 * 
 * Can be run with: npx tsx src/lib/__tests__/scoringEngine.test.ts
 */

import type { Card } from "@/types/game";
import type { PokerHandType } from "../pokerEvaluator";
import { calculateScore, HAND_BASE_STATS, CARD_CHIP_VALUES } from "../scoringEngine";

// Helper function to create a test card
function createCard(rank: Card["rank"], suit: Card["suit"]): Card {
  return {
    id: `${rank}-${suit}`,
    rank,
    suit,
  };
}

// Test cases organized by hand type
const tests = [
  {
    name: "High Card - Ace High",
    handType: "High Card" as PokerHandType,
    scoringCards: [createCard("A", "hearts")],
    expectedBaseChips: 5,
    expectedCardChips: 11, // Ace = 11
    expectedTotalChips: 16,
    expectedBaseMult: 1,
    expectedFinalScore: 16, // 16 × 1
  },
  {
    name: "High Card - King High",
    handType: "High Card" as PokerHandType,
    scoringCards: [createCard("K", "spades")],
    expectedBaseChips: 5,
    expectedCardChips: 10, // King = 10
    expectedTotalChips: 15,
    expectedBaseMult: 1,
    expectedFinalScore: 15, // 15 × 1
  },
  {
    name: "Pair of Kings",
    handType: "Pair" as PokerHandType,
    scoringCards: [createCard("K", "hearts"), createCard("K", "spades")],
    expectedBaseChips: 10,
    expectedCardChips: 20, // 10 + 10
    expectedTotalChips: 30,
    expectedBaseMult: 2,
    expectedFinalScore: 60, // 30 × 2
  },
  {
    name: "Pair of Twos",
    handType: "Pair" as PokerHandType,
    scoringCards: [createCard("2", "hearts"), createCard("2", "spades")],
    expectedBaseChips: 10,
    expectedCardChips: 4, // 2 + 2
    expectedTotalChips: 14,
    expectedBaseMult: 2,
    expectedFinalScore: 28, // 14 × 2
  },
  {
    name: "Two Pair - Queens and Fives",
    handType: "Two Pair" as PokerHandType,
    scoringCards: [
      createCard("Q", "hearts"),
      createCard("Q", "diamonds"),
      createCard("5", "clubs"),
      createCard("5", "spades"),
    ],
    expectedBaseChips: 20,
    expectedCardChips: 30, // 10 + 10 + 5 + 5
    expectedTotalChips: 50,
    expectedBaseMult: 2,
    expectedFinalScore: 100, // 50 × 2
  },
  {
    name: "Three of a Kind - Three Jacks",
    handType: "Three of a Kind" as PokerHandType,
    scoringCards: [
      createCard("J", "hearts"),
      createCard("J", "diamonds"),
      createCard("J", "clubs"),
    ],
    expectedBaseChips: 30,
    expectedCardChips: 30, // 10 + 10 + 10
    expectedTotalChips: 60,
    expectedBaseMult: 3,
    expectedFinalScore: 180, // 60 × 3
  },
  {
    name: "Straight - 5 to 9",
    handType: "Straight" as PokerHandType,
    scoringCards: [
      createCard("5", "hearts"),
      createCard("6", "diamonds"),
      createCard("7", "clubs"),
      createCard("8", "spades"),
      createCard("9", "hearts"),
    ],
    expectedBaseChips: 30,
    expectedCardChips: 35, // 5 + 6 + 7 + 8 + 9
    expectedTotalChips: 65,
    expectedBaseMult: 4,
    expectedFinalScore: 260, // 65 × 4
  },
  {
    name: "Straight - Ace Low (A-2-3-4-5)",
    handType: "Straight" as PokerHandType,
    scoringCards: [
      createCard("A", "hearts"),
      createCard("2", "diamonds"),
      createCard("3", "clubs"),
      createCard("4", "spades"),
      createCard("5", "hearts"),
    ],
    expectedBaseChips: 30,
    expectedCardChips: 25, // 11 + 2 + 3 + 4 + 5 (Ace still scores 11)
    expectedTotalChips: 55,
    expectedBaseMult: 4,
    expectedFinalScore: 220, // 55 × 4
  },
  {
    name: "Flush - All Hearts",
    handType: "Flush" as PokerHandType,
    scoringCards: [
      createCard("A", "hearts"),
      createCard("K", "hearts"),
      createCard("7", "hearts"),
      createCard("5", "hearts"),
      createCard("3", "hearts"),
    ],
    expectedBaseChips: 35,
    expectedCardChips: 36, // 11 + 10 + 7 + 5 + 3
    expectedTotalChips: 71,
    expectedBaseMult: 4,
    expectedFinalScore: 284, // 71 × 4
  },
  {
    name: "Full House - Three Aces and Two Kings",
    handType: "Full House" as PokerHandType,
    scoringCards: [
      createCard("A", "hearts"),
      createCard("A", "diamonds"),
      createCard("A", "clubs"),
      createCard("K", "spades"),
      createCard("K", "hearts"),
    ],
    expectedBaseChips: 40,
    expectedCardChips: 53, // 11 + 11 + 11 + 10 + 10
    expectedTotalChips: 93,
    expectedBaseMult: 4,
    expectedFinalScore: 372, // 93 × 4
  },
  {
    name: "Four of a Kind - Four Tens",
    handType: "Four of a Kind" as PokerHandType,
    scoringCards: [
      createCard("10", "hearts"),
      createCard("10", "diamonds"),
      createCard("10", "clubs"),
      createCard("10", "spades"),
    ],
    expectedBaseChips: 60,
    expectedCardChips: 40, // 10 + 10 + 10 + 10
    expectedTotalChips: 100,
    expectedBaseMult: 7,
    expectedFinalScore: 700, // 100 × 7
  },
  {
    name: "Straight Flush - 5 to 9 of Diamonds",
    handType: "Straight Flush" as PokerHandType,
    scoringCards: [
      createCard("5", "diamonds"),
      createCard("6", "diamonds"),
      createCard("7", "diamonds"),
      createCard("8", "diamonds"),
      createCard("9", "diamonds"),
    ],
    expectedBaseChips: 100,
    expectedCardChips: 35, // 5 + 6 + 7 + 8 + 9
    expectedTotalChips: 135,
    expectedBaseMult: 8,
    expectedFinalScore: 1080, // 135 × 8
  },
  {
    name: "Royal Flush - 10 to Ace of Spades",
    handType: "Straight Flush" as PokerHandType,
    scoringCards: [
      createCard("10", "spades"),
      createCard("J", "spades"),
      createCard("Q", "spades"),
      createCard("K", "spades"),
      createCard("A", "spades"),
    ],
    expectedBaseChips: 100,
    expectedCardChips: 51, // 10 + 10 + 10 + 10 + 11
    expectedTotalChips: 151,
    expectedBaseMult: 8,
    expectedFinalScore: 1208, // 151 × 8
  },
];

// Run tests
let passed = 0;
let failed = 0;

console.log("🎲 Testing Scoring Engine\n");

for (const test of tests) {
  try {
    const result = calculateScore(test.scoringCards, test.handType);

    const baseChipsMatch = result.baseChips === test.expectedBaseChips;
    const cardChipsMatch = result.cardChips === test.expectedCardChips;
    const totalChipsMatch = result.totalChips === test.expectedTotalChips;
    const baseMultMatch = result.baseMult === test.expectedBaseMult;
    const finalScoreMatch = result.finalScore === test.expectedFinalScore;

    if (
      baseChipsMatch &&
      cardChipsMatch &&
      totalChipsMatch &&
      baseMultMatch &&
      finalScoreMatch
    ) {
      console.log(`✅ ${test.name}`);
      console.log(
        `   Score: ${result.totalChips} chips × ${result.totalMult} mult = ${result.finalScore}`
      );
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected:`);
      console.log(
        `     Base Chips: ${test.expectedBaseChips}, Card Chips: ${test.expectedCardChips}`
      );
      console.log(
        `     Total Chips: ${test.expectedTotalChips}, Base Mult: ${test.expectedBaseMult}`
      );
      console.log(`     Final Score: ${test.expectedFinalScore}`);
      console.log(`   Got:`);
      console.log(
        `     Base Chips: ${result.baseChips}, Card Chips: ${result.cardChips}`
      );
      console.log(
        `     Total Chips: ${result.totalChips}, Base Mult: ${result.baseMult}`
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

// Test that all hand types have base stats defined
console.log("🔍 Validating Hand Base Stats Coverage\n");
const allHandTypes: PokerHandType[] = [
  "High Card",
  "Pair",
  "Two Pair",
  "Three of a Kind",
  "Straight",
  "Flush",
  "Full House",
  "Four of a Kind",
  "Straight Flush",
];

let allHandTypesCovered = true;
for (const handType of allHandTypes) {
  const stats = HAND_BASE_STATS[handType];
  if (!stats) {
    console.log(`❌ Missing base stats for: ${handType}`);
    allHandTypesCovered = false;
    failed++;
  } else {
    console.log(`✅ ${handType}: ${stats.baseChips} chips × ${stats.baseMult} mult`);
  }
}

if (allHandTypesCovered) {
  passed++;
  console.log("");
}

// Test that all card ranks have chip values defined
console.log("🔍 Validating Card Chip Values Coverage\n");
const allRanks: Card["rank"][] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

let allRanksCovered = true;
for (const rank of allRanks) {
  const chipValue = CARD_CHIP_VALUES[rank];
  if (chipValue === undefined) {
    console.log(`❌ Missing chip value for rank: ${rank}`);
    allRanksCovered = false;
    failed++;
  } else {
    console.log(`✅ ${rank}: ${chipValue} chips`);
  }
}

if (allRanksCovered) {
  passed++;
  console.log("");
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

// Exit with error code if any tests failed
if (failed > 0) {
  process.exit(1);
}

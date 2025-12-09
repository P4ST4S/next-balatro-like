/**
 * Integration test for scoring engine and poker evaluator
 * 
 * Tests the complete flow: evaluate hand -> calculate score
 * Can be run with: npx tsx src/lib/__tests__/integration.test.ts
 */

import type { Card } from "@/types/game";
import { evaluatePokerHand } from "../pokerEvaluator";
import { calculateScore } from "../scoringEngine";

// Helper function to create a test card
function createCard(rank: Card["rank"], suit: Card["suit"]): Card {
  return {
    id: `${rank}-${suit}`,
    rank,
    suit,
  };
}

// Integration test cases
const tests = [
  {
    name: "Pair of Kings - Full Flow",
    hand: [
      createCard("K", "hearts"),
      createCard("K", "spades"),
      createCard("7", "diamonds"),
      createCard("8", "clubs"),
      createCard("9", "hearts"),
    ],
    expectedHandType: "Pair",
    expectedScore: 60, // (10 base chips + 20 card chips) × 2 mult
  },
  {
    name: "Flush - Full Flow",
    hand: [
      createCard("A", "hearts"),
      createCard("K", "hearts"),
      createCard("7", "hearts"),
      createCard("5", "hearts"),
      createCard("3", "hearts"),
    ],
    expectedHandType: "Flush",
    expectedScore: 284, // (35 base chips + 36 card chips) × 4 mult
  },
  {
    name: "Straight Flush - Full Flow",
    hand: [
      createCard("5", "diamonds"),
      createCard("6", "diamonds"),
      createCard("7", "diamonds"),
      createCard("8", "diamonds"),
      createCard("9", "diamonds"),
    ],
    expectedHandType: "Straight Flush",
    expectedScore: 1080, // (100 base chips + 35 card chips) × 8 mult
  },
  {
    name: "High Card - Full Flow",
    hand: [
      createCard("A", "hearts"),
      createCard("K", "diamonds"),
      createCard("7", "clubs"),
      createCard("5", "spades"),
      createCard("3", "hearts"),
    ],
    expectedHandType: "High Card",
    expectedScore: 16, // (5 base chips + 11 card chips for Ace) × 1 mult
  },
  {
    name: "Full House - Full Flow",
    hand: [
      createCard("A", "hearts"),
      createCard("A", "diamonds"),
      createCard("A", "clubs"),
      createCard("K", "spades"),
      createCard("K", "hearts"),
    ],
    expectedHandType: "Full House",
    expectedScore: 372, // (40 base chips + 53 card chips) × 4 mult
  },
];

// Run tests
let passed = 0;
let failed = 0;

console.log("🎯 Testing Integration: Poker Evaluator + Scoring Engine\n");

for (const test of tests) {
  try {
    // Step 1: Evaluate the poker hand
    const handResult = evaluatePokerHand(test.hand);
    
    // Step 2: Calculate the score
    const scoreResult = calculateScore(handResult.scoringCards, handResult.handType);
    
    // Verify results
    const handTypeMatch = handResult.handType === test.expectedHandType;
    const scoreMatch = scoreResult.finalScore === test.expectedScore;
    
    if (handTypeMatch && scoreMatch) {
      console.log(`✅ ${test.name}`);
      console.log(`   Hand Type: ${handResult.handType}`);
      console.log(`   Score: ${scoreResult.totalChips} chips × ${scoreResult.totalMult} mult = ${scoreResult.finalScore}`);
      console.log(`   Scoring Cards: ${handResult.scoringCards.length} cards`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: ${test.expectedHandType} with score ${test.expectedScore}`);
      console.log(`   Got: ${handResult.handType} with score ${scoreResult.finalScore}`);
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

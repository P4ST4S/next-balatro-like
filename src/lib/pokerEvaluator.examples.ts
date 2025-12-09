/**
 * Example usage of the poker hand evaluator
 * This demonstrates how the evaluator integrates with the game
 */

import type { Card } from "@/types/game";
import { evaluatePokerHand } from "./pokerEvaluator";
import { createDeck } from "./deck";

// Example: Evaluating a hand during gameplay
function exampleGameplayScenario() {
  console.log("🎮 Poker Hand Evaluator - Example Usage\n");

  // Get a deck
  const deck = createDeck();

  // Simulate a player selecting 5 cards to play
  const selectedCards: Card[] = [
    deck[0], // 2 of hearts
    deck[13], // 2 of diamonds
    deck[26], // 2 of clubs
    deck[5], // 7 of hearts
    deck[10], // Queen of hearts
  ];

  console.log("Cards played:");
  selectedCards.forEach((card) => {
    console.log(`  ${card.rank} of ${card.suit}`);
  });

  // Evaluate the hand
  const result = evaluatePokerHand(selectedCards);

  console.log(`\n✨ Hand Type: ${result.handType}`);
  console.log(`\n🎯 Scoring Cards (${result.scoringCards.length}):`);
  result.scoringCards.forEach((card) => {
    console.log(`  ${card.rank} of ${card.suit}`);
  });

  console.log("\n📝 Game Logic:");
  console.log("  - Only the scoring cards trigger 'On Score' effects from Jokers");
  console.log("  - Other cards in the hand don't contribute to these effects");
  console.log("  - This matches Balatro's core mechanic");
}

// Example: Checking different hand types
function exampleHandTypes() {
  console.log("\n\n🃏 Common Hand Type Examples\n");

  // Example hands
  const examples = [
    {
      name: "Pair",
      cards: [
        { id: "1", rank: "K" as const, suit: "hearts" as const },
        { id: "2", rank: "K" as const, suit: "spades" as const },
        { id: "3", rank: "7" as const, suit: "diamonds" as const },
        { id: "4", rank: "3" as const, suit: "clubs" as const },
        { id: "5", rank: "2" as const, suit: "hearts" as const },
      ],
    },
    {
      name: "Flush",
      cards: [
        { id: "1", rank: "A" as const, suit: "hearts" as const },
        { id: "2", rank: "K" as const, suit: "hearts" as const },
        { id: "3", rank: "7" as const, suit: "hearts" as const },
        { id: "4", rank: "5" as const, suit: "hearts" as const },
        { id: "5", rank: "3" as const, suit: "hearts" as const },
      ],
    },
    {
      name: "Straight",
      cards: [
        { id: "1", rank: "5" as const, suit: "hearts" as const },
        { id: "2", rank: "6" as const, suit: "diamonds" as const },
        { id: "3", rank: "7" as const, suit: "clubs" as const },
        { id: "4", rank: "8" as const, suit: "spades" as const },
        { id: "5", rank: "9" as const, suit: "hearts" as const },
      ],
    },
  ];

  examples.forEach((example) => {
    const result = evaluatePokerHand(example.cards);
    console.log(`${example.name}:`);
    console.log(`  Hand Type: ${result.handType}`);
    console.log(`  Scoring Cards: ${result.scoringCards.length}/${example.cards.length}`);
    console.log("");
  });
}

// Run examples
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleGameplayScenario();
  exampleHandTypes();
}

export { exampleGameplayScenario, exampleHandTypes };

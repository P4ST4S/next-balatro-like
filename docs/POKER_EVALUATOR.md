# Poker Hand Evaluator

This module provides the core poker hand evaluation logic for the Balatro-like game. It's the "brain" that determines what type of poker hand has been played and which cards should score.

## Overview

The poker evaluator is located in `src/lib/pokerEvaluator.ts` and provides:

- **Complete poker hand detection** - Identifies all standard poker hands from High Card to Straight Flush
- **Balatro-specific mechanics** - Returns only the scoring cards (cards that form the hand)
- **Performance optimized** - Uses O(1) lookups for efficient evaluation
- **Type-safe** - Fully typed with TypeScript for compile-time safety

## Core Concept: Scoring Cards

In Balatro, **only the cards that form the poker hand trigger "On Score" effects**. This is a crucial mechanic that differentiates Balatro from traditional poker:

- If you play a **Pair of Kings** + 7 + 8 + 9, only the **two Kings** are scoring cards
- If you play a **Flush** (all same suit), **all 5 cards** are scoring cards
- If you play a **Full House** (3 of a kind + pair), **all 5 cards** are scoring cards

This means Jokers and other effects that trigger "on score" will only apply to the specific cards that make up the hand.

## API Reference

### Types

#### `PokerHandType`

```typescript
type PokerHandType =
  | "High Card"
  | "Pair"
  | "Two Pair"
  | "Three of a Kind"
  | "Straight"
  | "Flush"
  | "Full House"
  | "Four of a Kind"
  | "Straight Flush";
```

All possible poker hand types, ordered from weakest to strongest.

#### `PokerHandResult`

```typescript
interface PokerHandResult {
  handType: PokerHandType;
  scoringCards: Card[];
}
```

The result of evaluating a poker hand:
- `handType`: The type of poker hand detected
- `scoringCards`: Only the cards that form the hand (trigger "On Score" effects)

### Functions

#### `evaluatePokerHand(cards: Card[]): PokerHandResult`

Evaluates a 5-card poker hand and returns the hand type and scoring cards.

**Parameters:**
- `cards: Card[]` - Array of exactly 5 cards to evaluate

**Returns:**
- `PokerHandResult` - Object containing the hand type and scoring cards

**Throws:**
- `Error` - If the input doesn't contain exactly 5 cards

**Example:**

```typescript
import { evaluatePokerHand } from "@/lib/pokerEvaluator";
import type { Card } from "@/types/game";

// Pair of Kings with random cards
const cards: Card[] = [
  { id: "1", rank: "K", suit: "hearts" },
  { id: "2", rank: "K", suit: "spades" },
  { id: "3", rank: "7", suit: "diamonds" },
  { id: "4", rank: "8", suit: "clubs" },
  { id: "5", rank: "9", suit: "hearts" },
];

const result = evaluatePokerHand(cards);
console.log(result.handType); // "Pair"
console.log(result.scoringCards.length); // 2 (only the Kings)
```

## Poker Hand Types

### 1. High Card
**Scoring Cards:** 1 (the highest card)

No matching ranks, no straight, no flush.

```typescript
const cards = [A♥, K♦, 7♣, 5♠, 3♥];
// Result: { handType: "High Card", scoringCards: [A♥] }
```

### 2. Pair
**Scoring Cards:** 2 (the matching pair)

Two cards of the same rank.

```typescript
const cards = [K♥, K♠, 7♦, 8♣, 9♥];
// Result: { handType: "Pair", scoringCards: [K♥, K♠] }
```

### 3. Two Pair
**Scoring Cards:** 4 (both pairs)

Two different pairs.

```typescript
const cards = [Q♥, Q♦, 5♣, 5♠, A♥];
// Result: { handType: "Two Pair", scoringCards: [Q♥, Q♦, 5♣, 5♠] }
```

### 4. Three of a Kind
**Scoring Cards:** 3 (the three matching cards)

Three cards of the same rank.

```typescript
const cards = [J♥, J♦, J♣, 4♠, 2♥];
// Result: { handType: "Three of a Kind", scoringCards: [J♥, J♦, J♣] }
```

### 5. Straight
**Scoring Cards:** 5 (all cards in the straight)

Five consecutive ranks. Ace can be high (10-J-Q-K-A) or low (A-2-3-4-5).

```typescript
const cards = [5♥, 6♦, 7♣, 8♠, 9♥];
// Result: { handType: "Straight", scoringCards: [5♥, 6♦, 7♣, 8♠, 9♥] }

// Ace-low straight
const cards2 = [A♥, 2♦, 3♣, 4♠, 5♥];
// Result: { handType: "Straight", scoringCards: [A♥, 2♦, 3♣, 4♠, 5♥] }
```

### 6. Flush
**Scoring Cards:** 5 (all cards)

All five cards of the same suit.

```typescript
const cards = [A♥, K♥, 7♥, 5♥, 3♥];
// Result: { handType: "Flush", scoringCards: [A♥, K♥, 7♥, 5♥, 3♥] }
```

### 7. Full House
**Scoring Cards:** 5 (all cards: 3 + 2)

Three of a kind plus a pair.

```typescript
const cards = [A♥, A♦, A♣, K♠, K♥];
// Result: { handType: "Full House", scoringCards: [A♥, A♦, A♣, K♠, K♥] }
```

### 8. Four of a Kind
**Scoring Cards:** 4 (the four matching cards)

Four cards of the same rank.

```typescript
const cards = [10♥, 10♦, 10♣, 10♠, A♥];
// Result: { handType: "Four of a Kind", scoringCards: [10♥, 10♦, 10♣, 10♠] }
```

### 9. Straight Flush
**Scoring Cards:** 5 (all cards)

Five consecutive ranks, all of the same suit. This includes Royal Flush (10-J-Q-K-A of same suit).

```typescript
const cards = [5♦, 6♦, 7♦, 8♦, 9♦];
// Result: { handType: "Straight Flush", scoringCards: [5♦, 6♦, 7♦, 8♦, 9♦] }

// Royal Flush
const royalFlush = [10♠, J♠, Q♠, K♠, A♠];
// Result: { handType: "Straight Flush", scoringCards: [10♠, J♠, Q♠, K♠, A♠] }
```

## Usage Examples

### Basic Usage

```typescript
import { evaluatePokerHand } from "@/lib/pokerEvaluator";
import { createDeck } from "@/lib/deck";

const deck = createDeck();
const selectedCards = deck.slice(0, 5);
const result = evaluatePokerHand(selectedCards);

console.log(`Hand Type: ${result.handType}`);
console.log(`Scoring Cards: ${result.scoringCards.length}`);
```

### Integration with Game Store

```typescript
import { useGameStore } from "@/store/gameStore";
import { evaluatePokerHand } from "@/lib/pokerEvaluator";

function playHand() {
  const store = useGameStore.getState();
  
  // Get selected cards from current hand
  const selectedCards = store.currentHand.filter(c => c.selected);
  
  if (selectedCards.length !== 5) {
    console.error("Must select exactly 5 cards");
    return;
  }
  
  // Evaluate the hand
  const result = evaluatePokerHand(selectedCards);
  
  // Use result to calculate score
  console.log(`You played a ${result.handType}!`);
  console.log(`${result.scoringCards.length} cards will trigger scoring effects`);
  
  // Process scoring cards with Joker effects
  result.scoringCards.forEach(card => {
    // Apply "On Score" effects from Jokers
    // Calculate chips and multiplier based on card and Jokers
  });
}
```

### With Joker Effects

```typescript
import { evaluatePokerHand } from "@/lib/pokerEvaluator";
import type { Card, Joker } from "@/types/game";

function calculateScore(cards: Card[], jokers: Joker[]) {
  const result = evaluatePokerHand(cards);
  
  let chips = 0;
  let mult = 0;
  
  // Base hand chips and mult (would come from a config)
  const baseChips = 100;
  const baseMult = 5;
  
  // Process scoring cards
  result.scoringCards.forEach(card => {
    // Add card value
    chips += getCardChips(card);
    
    // Apply Joker effects that trigger "on score"
    jokers.forEach(joker => {
      if (joker.effect === "on_score") {
        chips += joker.chipsBonus || 0;
        mult += joker.multBonus || 0;
      }
    });
  });
  
  const finalScore = (baseChips + chips) * (baseMult + mult);
  return { score: finalScore, handType: result.handType };
}
```

## Implementation Details

### Performance Optimizations

The evaluator uses several optimizations for efficient hand evaluation:

1. **O(1) Rank Lookups**: Uses `Map<Rank, Card>` for constant-time card lookups
2. **Reverse Lookup Map**: `VALUE_TO_RANK` provides O(1) value-to-rank conversion
3. **Early Returns**: Checks stronger hands first and returns immediately on match

### Hand Priority

Hands are checked in order from strongest to weakest:
1. Straight Flush
2. Four of a Kind
3. Full House
4. Flush
5. Straight
6. Three of a Kind
7. Two Pair
8. Pair
9. High Card

This ensures the highest possible hand is always returned.

### Edge Cases

- **Ace Straights**: Ace can be high (10-J-Q-K-A) or low (A-2-3-4-5)
- **Royal Flush**: Treated as a Straight Flush (as is standard in poker)
- **Multiple Pairs**: When multiple pairs exist, both pairs are included in scoring cards

## Testing

The evaluator includes comprehensive test coverage. Run tests with:

```bash
npx tsx src/lib/__tests__/pokerEvaluator.test.ts
```

The test suite covers:
- ✅ All 9 poker hand types
- ✅ Edge cases (Ace-low straight, Royal Flush)
- ✅ Correct scoring card identification
- ✅ Error handling for invalid input

All tests validate both the hand type detection and the correct identification of scoring cards.

## Example Output

Run the examples file to see the evaluator in action:

```bash
npx tsx src/lib/pokerEvaluator.examples.ts
```

This demonstrates:
- Real gameplay scenarios
- Different hand types
- Scoring card identification
- Integration with game mechanics

## Design Decisions

### Why Only Scoring Cards?

In Balatro, the distinction between "cards played" and "scoring cards" is fundamental to the game's strategy:

1. **Joker Effects**: Most Jokers trigger on scoring cards, not all played cards
2. **Strategy Depth**: Players must consider which cards will actually contribute to their score
3. **Resource Management**: Playing a weak hand with good cards can preserve them for later

### Type Safety

All functions use strict TypeScript typing:
- Input cards must be exactly 5
- Return types are explicitly defined
- Rank and Suit use literal types for compile-time validation

### Extensibility

While the current implementation handles standard 5-card hands, it's designed to be extensible:
- Could support variable hand sizes in future
- Easy to add new hand types if game mechanics expand
- Scoring card logic is centralized and consistent

## Future Enhancements

Potential future additions (not in current scope):

- **Hand Strength Comparison**: Compare two hands to determine winner
- **Variable Hand Sizes**: Support 3-4 card hands (some Balatro variants)
- **Special Hands**: Secret hands or custom hands from game mechanics
- **Performance Metrics**: Detailed scoring breakdown
- **Probability Calculator**: Calculate odds of making specific hands

## Related Documentation

- [Deck Utilities](./DECK_UTILITIES.md) - Card deck creation and shuffling
- [Game Types](../types/game.ts) - TypeScript type definitions
- [Game Store](../store/gameStore.ts) - State management integration

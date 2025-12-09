# Deck Utilities

This module provides core utilities for creating and manipulating playing card decks in the Balatro-like game.

## Overview

The deck utilities are located in `src/lib/deck.ts` and provide:

- **Standard deck generation** - Creates a 52-card deck with all suits and ranks
- **Fisher-Yates shuffle** - Industry-standard shuffling algorithm with uniform distribution
- **Convenience functions** - Combined operations for common use cases

## API Reference

### Constants

#### `SUITS`

```typescript
export const SUITS: readonly Suit[] = ["hearts", "diamonds", "clubs", "spades"];
```

Array of all valid card suits in a standard deck.

#### `RANKS`

```typescript
export const RANKS: readonly Rank[] = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "J", "Q", "K", "A"
];
```

Array of all valid card ranks in a standard deck, ordered from lowest to highest.

### Functions

#### `generateUUID()`

Generates a UUID v4 compatible with both browser and Node.js environments.

**Returns:** `string` - A UUID v4 string

**Example:**
```typescript
import { generateUUID } from "@/lib/deck";

const id = generateUUID();
console.log(id); // "550e8400-e29b-41d4-a716-446655440000"
```

**Implementation Details:**
- Uses `crypto.randomUUID()` when available (modern browsers and Node.js 19+)
- Falls back to `Math.random()` for compatibility with older environments
- No external dependencies required

#### `createDeck()`

Creates a standard 52-card deck.

**Returns:** `Card[]` - Array of 52 playing cards in predictable order (by suit, then by rank)

**Example:**
```typescript
import { createDeck } from "@/lib/deck";

const deck = createDeck();
console.log(deck.length); // 52
console.log(deck[0]); // { id: "...", suit: "hearts", rank: "2" }
```

**Characteristics:**
- Each card has a unique UUID
- Cards are ordered by suit (hearts, diamonds, clubs, spades)
- Within each suit, cards are ordered by rank (2-A)
- No enhancements or editions by default (MVP implementation)

#### `fisherYatesShuffle<T>(array: T[])`

Shuffles an array using the Fisher-Yates algorithm.

**Parameters:**
- `array: T[]` - The array to shuffle (will be mutated in-place)

**Returns:** `T[]` - The shuffled array (same reference as input)

**Time Complexity:** O(n)
**Space Complexity:** O(1)

**Example:**
```typescript
import { fisherYatesShuffle } from "@/lib/deck";

const cards = createDeck();
const shuffled = fisherYatesShuffle(cards); // cards is mutated
console.log(shuffled === cards); // true (same reference)
```

**Note:** This function mutates the input array. If you need to preserve the original, create a copy first:

```typescript
const shuffled = fisherYatesShuffle([...originalArray]);
```

#### `createShuffledDeck()`

Creates a new shuffled deck.

**Returns:** `Card[]` - Array of 52 shuffled playing cards

**Example:**
```typescript
import { createShuffledDeck } from "@/lib/deck";

const shuffledDeck = createShuffledDeck();
console.log(shuffledDeck.length); // 52
// Cards are in random order
```

This is a convenience function equivalent to:
```typescript
const deck = createDeck();
fisherYatesShuffle(deck);
```

## Usage Examples

### Initializing a New Game

```typescript
import { createShuffledDeck } from "@/lib/deck";
import { useGameStore } from "@/store/gameStore";

function startNewGame() {
  const store = useGameStore.getState();
  
  // Create and set a new shuffled deck
  const deck = createShuffledDeck();
  store.setDeck(deck);
  
  // Draw initial hand (8 cards like Balatro)
  store.drawCards(8);
}
```

### Working with Card Display

```typescript
import type { Card } from "@/types/game";

function getCardSymbol(card: Card): string {
  const symbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };
  
  return `${card.rank}${symbols[card.suit]}`;
}

const card = deck[0];
console.log(getCardSymbol(card)); // "2♥"
```

### Filtering and Analysis

```typescript
import { SUITS, RANKS } from "@/lib/deck";
import type { Card } from "@/types/game";

// Filter by suit
function getBySuit(cards: Card[], suit: Card["suit"]) {
  return cards.filter(card => card.suit === suit);
}

// Count cards by rank
function countRanks(cards: Card[]) {
  return RANKS.reduce((acc, rank) => {
    acc[rank] = cards.filter(card => card.rank === rank).length;
    return acc;
  }, {} as Record<string, number>);
}
```

## Design Decisions

### UUID Generation

The `createDeck()` function uses `crypto.randomUUID()` when available (modern browsers and Node.js 19+), with a Math.random() fallback for compatibility. This ensures:

- Unique card IDs across all decks
- Works in both browser and server environments
- No external dependencies needed

### Fisher-Yates Algorithm

We use the Fisher-Yates shuffle because:

- **Uniform distribution** - Every permutation is equally likely
- **Efficient** - O(n) time complexity
- **In-place** - O(1) space complexity
- **Industry standard** - Well-tested and proven

### Type Safety

All functions use TypeScript's strict typing:

```typescript
// Generic shuffle works with any type
fisherYatesShuffle<Card>(deck);
fisherYatesShuffle<number>([1, 2, 3]);

// Constants are readonly to prevent modification
SUITS[0] = "invalid"; // ❌ TypeScript error
```

## Future Enhancements

The current implementation supports the MVP requirements. Future iterations may include:

- **Card enhancements** - Bonus, mult, wild, glass, steel, stone
- **Card editions** - Foil, holographic, polychrome
- **Card seals** - Special markers that affect gameplay
- **Deck variations** - Different deck sizes or custom card sets
- **Deck builder** - Tools to create custom decks

These features are already supported in the `Card` type (see `src/types/game.ts`) but are not created by default in this initial implementation.

## Testing

The deck utilities can be tested manually:

```typescript
import { createDeck, SUITS, RANKS } from "@/lib/deck";

const deck = createDeck();

// Verify deck size
console.assert(deck.length === 52);

// Verify all suits present
const suits = new Set(deck.map(c => c.suit));
console.assert(suits.size === 4);

// Verify all ranks present
const ranks = new Set(deck.map(c => c.rank));
console.assert(ranks.size === 13);

// Verify unique IDs
const ids = new Set(deck.map(c => c.id));
console.assert(ids.size === 52);
```

## Integration with Game Store

The deck utilities integrate seamlessly with the Zustand game store:

```typescript
import { useGameStore } from "@/store/gameStore";
import { createShuffledDeck } from "@/lib/deck";

// In a component or action
const setDeck = useGameStore(state => state.setDeck);
const drawCards = useGameStore(state => state.drawCards);

// Initialize
setDeck(createShuffledDeck());
drawCards(8);
```

See `src/lib/deck-examples.ts` for more integration patterns.

# Game Store Architecture

This document describes the Zustand-based state management architecture for the Balatro-like card game.

## Overview

The game uses [Zustand](https://github.com/pmndrs/zustand) for global state management with DevTools integration for easy debugging.

## Store Location

- **Store Definition**: `src/store/gameStore.ts`
- **Type Definitions**: `src/types/game.ts`

## State Structure

### GameState Interface

The complete game state is organized into several sections:

#### 1. Phase Management
- `phase`: Current game phase (`"MENU" | "PLAYING_HAND" | "SHOP" | "GAME_OVER"`)

#### 2. Run State
Tracks progression through the game:
- `money`: Player's current money
- `ante`: Current ante level
- `currentBlind`: Current blind type (`"small" | "big" | "boss"`)
- `currentRound`: Current round number

#### 3. Combat State
Manages active gameplay:
- `handsPlayed`: Number of hands played in current round
- `discardsRemaining`: Number of discards left
- `currentScore`: Current score achieved
- `targetScore`: Score needed to win the blind

#### 4. Inventory State
Player's items:
- `jokers`: Array of Joker cards that modify scoring
- `consumables`: Array of consumable items (tarot, planet, spectral cards)

#### 5. Card Management
- `deck`: Cards remaining in the deck
- `currentHand`: Cards currently in hand
- `discardPile`: Discarded cards

## Available Actions

### Phase Management
- `setPhase(phase)`: Change the game phase

### Run Management
- `updateRun(updates)`: Update multiple run properties at once
- `addMoney(amount)`: Add money to the player
- `spendMoney(amount)`: Spend money (returns boolean if successful)
- `nextBlind()`: Progress to the next blind
- `nextAnte()`: Progress to the next ante

### Combat Management
- `updateCombat(updates)`: Update multiple combat properties
- `playHand()`: Increment hands played
- `useDiscard()`: Decrement discards remaining
- `addScore(points)`: Add to current score
- `resetCombat()`: Reset combat state for new blind

### Inventory Management
- `addJoker(joker)`: Add a joker to inventory
- `removeJoker(jokerId)`: Remove a joker by ID
- `addConsumable(consumable)`: Add a consumable item
- `removeConsumable(consumableId)`: Remove a consumable by ID

### Deck Management
- `setDeck(cards)`: Set the deck of cards
- `drawCards(count)`: Draw cards from deck to hand
- `discardCard(cardId)`: Move a card from hand to discard pile
- `resetHand()`: Clear current hand and discard pile

### Game Control
- `resetGame()`: Reset entire game to initial state

## Selectors

Pre-built selectors for common queries:
- `selectors.canPlayHand(state)`: Check if player can play a hand
- `selectors.canDiscard(state)`: Check if player can discard
- `selectors.hasWon(state)`: Check if target score is reached
- `selectors.jokerSlots(state)`: Get number of joker slots used
- `selectors.consumableSlots(state)`: Get number of consumable slots used

## Usage Examples

### Basic Usage

```typescript
import { useGameStore, selectors } from "@/store/gameStore";

function MyComponent() {
  // Subscribe to specific state
  const money = useGameStore((state) => state.run.money);
  const phase = useGameStore((state) => state.phase);
  
  // Get actions
  const addMoney = useGameStore((state) => state.addMoney);
  const setPhase = useGameStore((state) => state.setPhase);
  
  // Use selectors
  const canPlay = useGameStore(selectors.canPlayHand);
  
  return (
    <div>
      <p>Money: ${money}</p>
      <p>Phase: {phase}</p>
      <button onClick={() => addMoney(10)}>Add $10</button>
      <button disabled={!canPlay}>Play Hand</button>
    </div>
  );
}
```

### Client Component Example

```typescript
"use client";

import { useGameStore } from "@/store/gameStore";

export function GameUI() {
  const { run, combat, addMoney, playHand } = useGameStore((state) => ({
    run: state.run,
    combat: state.combat,
    addMoney: state.addMoney,
    playHand: state.playHand,
  }));

  return (
    <div>
      <h2>Ante {run.ante} - {run.currentBlind} Blind</h2>
      <p>Score: {combat.currentScore} / {combat.targetScore}</p>
      <button onClick={() => playHand()}>Play Hand</button>
    </div>
  );
}
```

## DevTools

The store includes Zustand DevTools integration. To debug:

1. Install React DevTools browser extension
2. Open your app in development mode
3. Open React DevTools
4. Look for the "GameStore" in the Components tab
5. You can inspect state and track action history

## Type Safety

All state and actions are fully typed with TypeScript. The store provides:
- Type-safe state access
- Type-safe action parameters
- IntelliSense support in your IDE
- Compile-time error checking

## Testing

To test the store in development, use the `GameStoreDebug` component:

```typescript
import { GameStoreDebug } from "@/app/_components/GameStoreDebug";

// Add to your page
<GameStoreDebug />
```

This provides an interactive UI to test all store actions and view state changes in real-time.

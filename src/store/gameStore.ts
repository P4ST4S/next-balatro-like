import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { GameState } from "@/types/game";
import { evaluatePokerHand } from "@/lib/pokerEvaluator";
import { calculateScore } from "@/lib/scoringEngine";
import { getBlindConfig } from "@/lib/blindConfig";
import { createShuffledDeck } from "@/lib/deck";
import { generateShopItems, SHOP_CONFIG } from "@/lib/shop";

/**
 * Game constants
 */
const MAX_HAND_SIZE = 8;
const MAX_CARDS_SELECTED = 5;

/**
 * Initial game state with default values
 * - Starting money: $4 (standard Balatro starting amount)
 * - Ante 1, Round 1, Small Blind (beginning of run)
 * - 4 hands, 3 discards and target score of 300 for first blind
 */
const initialState: GameState = {
  phase: "MENU",
  run: {
    money: 4,
    ante: 1,
    currentBlind: "small",
    currentRound: 1,
  },
  combat: {
    handsPlayed: 0,
    handsRemaining: 4,
    discardsRemaining: 3,
    currentScore: 0,
    targetScore: 300,
  },
  inventory: {
    jokers: [],
    consumables: [],
  },
  shop: {
    items: [],
    rerollCost: SHOP_CONFIG.baseRerollCost,
  },
  deck: [],
  currentHand: [],
  discardPile: [],
};

/**
 * Game store actions
 */
interface GameActions {
  // Phase management
  setPhase: (phase: GameState["phase"]) => void;

  // Run management
  updateRun: (updates: Partial<GameState["run"]>) => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => void;
  nextBlind: () => void;
  nextAnte: () => void;

  // Combat management
  updateCombat: (updates: Partial<GameState["combat"]>) => void;
  playHand: () => void;
  useDiscard: () => void;
  addScore: (points: number) => void;
  resetCombat: () => void;
  startRound: () => void;
  checkRoundEnd: () => void;

  // Inventory management
  addJoker: (joker: GameState["inventory"]["jokers"][number]) => void;
  removeJoker: (jokerId: string) => void;
  addConsumable: (consumable: GameState["inventory"]["consumables"][number]) => void;
  removeConsumable: (consumableId: string) => void;

  // Shop management
  initializeShop: () => void;
  buyJoker: (jokerIndex: number) => void;
  rerollShop: () => void;
  leaveShop: () => void;

  // Deck management
  setDeck: (cards: GameState["deck"]) => void;
  drawCards: (count: number) => void;
  drawHand: (maxHandSize?: number) => void;
  selectCard: (cardId: string) => void;
  discardHand: () => void;
  discardCard: (cardId: string) => void;
  resetHand: () => void;

  // Game reset
  resetGame: () => void;
}

/**
 * Combined store type
 */
type GameStore = GameState & GameActions;

/**
 * Main game store using Zustand
 * Includes persist middleware for localStorage and devtools middleware for debugging
 */
export const useGameStore = create<GameStore>()(
  persist(
    devtools(
      (set) => ({
        ...initialState,

        // Phase management
        setPhase: (phase) => set({ phase }, false, "setPhase"),

        // Run management
      updateRun: (updates) =>
        set((state) => ({ run: { ...state.run, ...updates } }), false, "updateRun"),

      addMoney: (amount) =>
        set(
          (state) => ({ run: { ...state.run, money: state.run.money + amount } }),
          false,
          "addMoney"
        ),

      spendMoney: (amount) =>
        set(
          (state) => {
            if (state.run.money >= amount) {
              return { run: { ...state.run, money: state.run.money - amount } };
            }
            return state;
          },
          false,
          "spendMoney"
        ),

      nextBlind: () =>
        set(
          (state) => {
            const blindOrder: Array<GameState["run"]["currentBlind"]> = ["small", "big", "boss"];
            const currentIndex = blindOrder.indexOf(state.run.currentBlind);
            const nextBlind = blindOrder[currentIndex + 1];

            if (nextBlind) {
              return { run: { ...state.run, currentBlind: nextBlind } };
            }
            // If boss was completed, move to next ante
            return {
              run: {
                ...state.run,
                ante: state.run.ante + 1,
                currentBlind: "small",
              },
            };
          },
          false,
          "nextBlind"
        ),

      nextAnte: () =>
        set(
          (state) => ({
            run: { ...state.run, ante: state.run.ante + 1, currentBlind: "small" },
          }),
          false,
          "nextAnte"
        ),

      // Combat management
      updateCombat: (updates) =>
        set((state) => ({ combat: { ...state.combat, ...updates } }), false, "updateCombat"),

      playHand: () => {
        set(
          (state) => {
            // Can't play if no hands remaining
            if (state.combat.handsRemaining <= 0) {
              return state;
            }

            // Get selected cards from current hand
            const selectedCards = state.currentHand.filter((c) => c.selected);
            
            // Need at least 1 card and at most 5 cards to play a hand
            if (selectedCards.length < 1 || selectedCards.length > 5) {
              return state;
            }

            // Evaluate the poker hand
            const handResult = evaluatePokerHand(selectedCards);
            
            // Calculate the score with jokers
            const scoreResult = calculateScore(
              handResult.scoringCards, 
              handResult.handType,
              state.inventory.jokers
            );
            
            // Move selected cards to discard pile (deselect them first)
            const cardsToDiscard = selectedCards.map((c) => ({ ...c, selected: false }));
            const remainingHand = state.currentHand.filter((c) => !c.selected);
            
            // Draw new cards to replenish hand
            const cardsNeeded = MAX_HAND_SIZE - remainingHand.length;
            const cardsToDraw = state.deck.slice(0, cardsNeeded);
            const remainingDeck = state.deck.slice(cardsNeeded);

            // Calculate new combat state
            const newHandsRemaining = state.combat.handsRemaining - 1;
            const newScore = state.combat.currentScore + scoreResult.finalScore;

            // Check for round end conditions after this hand
            const hasWon = newScore >= state.combat.targetScore;
            const hasLost = newHandsRemaining === 0 && !hasWon;

            // If player won the blind
            if (hasWon) {
              const blindConfig = getBlindConfig(state.run.currentBlind, state.run.ante);
              const newMoney = state.run.money + blindConfig.rewardMoney;

              // Move to next blind
              const blindOrder: Array<GameState["run"]["currentBlind"]> = ["small", "big", "boss"];
              const currentIndex = blindOrder.indexOf(state.run.currentBlind);
              const nextBlind = blindOrder[currentIndex + 1];

              if (nextBlind) {
                return {
                  phase: "SHOP" as const,
                  run: {
                    ...state.run,
                    money: newMoney,
                    currentBlind: nextBlind,
                  },
                  combat: {
                    ...state.combat,
                    handsPlayed: state.combat.handsPlayed + 1,
                    handsRemaining: newHandsRemaining,
                    currentScore: newScore,
                  },
                  shop: {
                    items: generateShopItems(),
                    rerollCost: SHOP_CONFIG.baseRerollCost,
                  },
                  currentHand: [...remainingHand, ...cardsToDraw],
                  discardPile: [...state.discardPile, ...cardsToDiscard],
                  deck: remainingDeck,
                };
              } else {
                // Boss was completed, move to next ante
                return {
                  phase: "SHOP" as const,
                  run: {
                    ...state.run,
                    money: newMoney,
                    ante: state.run.ante + 1,
                    currentBlind: "small",
                  },
                  combat: {
                    ...state.combat,
                    handsPlayed: state.combat.handsPlayed + 1,
                    handsRemaining: newHandsRemaining,
                    currentScore: newScore,
                  },
                  shop: {
                    items: generateShopItems(),
                    rerollCost: SHOP_CONFIG.baseRerollCost,
                  },
                  currentHand: [...remainingHand, ...cardsToDraw],
                  discardPile: [...state.discardPile, ...cardsToDiscard],
                  deck: remainingDeck,
                };
              }
            }

            // If player lost (no hands remaining and didn't reach target)
            if (hasLost) {
              return {
                phase: "GAME_OVER" as const,
                combat: {
                  ...state.combat,
                  handsPlayed: state.combat.handsPlayed + 1,
                  handsRemaining: newHandsRemaining,
                  currentScore: newScore,
                },
                currentHand: [...remainingHand, ...cardsToDraw],
                discardPile: [...state.discardPile, ...cardsToDiscard],
                deck: remainingDeck,
              };
            }

            // No end condition met, continue playing
            return {
              combat: {
                ...state.combat,
                handsPlayed: state.combat.handsPlayed + 1,
                handsRemaining: newHandsRemaining,
                currentScore: newScore,
              },
              currentHand: [...remainingHand, ...cardsToDraw],
              discardPile: [...state.discardPile, ...cardsToDiscard],
              deck: remainingDeck,
            };
          },
          false,
          "playHand"
        );
      },

      useDiscard: () =>
        set(
          (state) => {
            if (state.combat.discardsRemaining > 0) {
              return {
                combat: {
                  ...state.combat,
                  discardsRemaining: state.combat.discardsRemaining - 1,
                },
              };
            }
            return state;
          },
          false,
          "useDiscard"
        ),

      addScore: (points) =>
        set(
          (state) => ({
            combat: { ...state.combat, currentScore: state.combat.currentScore + points },
          }),
          false,
          "addScore"
        ),

      resetCombat: () =>
        set(
          {
            combat: {
              handsPlayed: 0,
              handsRemaining: 4,
              discardsRemaining: 3,
              currentScore: 0,
              targetScore: 300,
            },
          },
          false,
          "resetCombat"
        ),

      startRound: () =>
        set(
          (state) => {
            // Get blind configuration for current blind and ante
            const blindConfig = getBlindConfig(state.run.currentBlind, state.run.ante);

            // Create a new shuffled deck
            const newDeck = createShuffledDeck();

            // Draw initial hand
            const initialHand = newDeck.slice(0, MAX_HAND_SIZE);
            const remainingDeck = newDeck.slice(MAX_HAND_SIZE);

            return {
              phase: "PLAYING_HAND" as const,
              combat: {
                handsPlayed: 0,
                handsRemaining: blindConfig.hands,
                discardsRemaining: blindConfig.discards,
                currentScore: 0,
                targetScore: blindConfig.targetScore,
              },
              deck: remainingDeck,
              currentHand: initialHand,
              discardPile: [],
            };
          },
          false,
          "startRound"
        ),

      checkRoundEnd: () =>
        set(
          (state) => {
            // Only check if we're in playing phase
            if (state.phase !== "PLAYING_HAND") {
              return state;
            }

            const hasWon = state.combat.currentScore >= state.combat.targetScore;
            const hasLost = state.combat.handsRemaining === 0 && !hasWon;

            // If player has won the blind
            if (hasWon) {
              const blindConfig = getBlindConfig(state.run.currentBlind, state.run.ante);
              
              // Award money
              const newMoney = state.run.money + blindConfig.rewardMoney;

              // Move to next blind
              const blindOrder: Array<GameState["run"]["currentBlind"]> = ["small", "big", "boss"];
              const currentIndex = blindOrder.indexOf(state.run.currentBlind);
              const nextBlind = blindOrder[currentIndex + 1];

              if (nextBlind) {
                // Move to next blind, transition to shop
                return {
                  phase: "SHOP" as const,
                  run: {
                    ...state.run,
                    money: newMoney,
                    currentBlind: nextBlind,
                  },
                  shop: {
                    items: generateShopItems(),
                    rerollCost: SHOP_CONFIG.baseRerollCost,
                  },
                };
              } else {
                // Boss was completed, move to next ante
                return {
                  phase: "SHOP" as const,
                  run: {
                    ...state.run,
                    money: newMoney,
                    ante: state.run.ante + 1,
                    currentBlind: "small",
                  },
                  shop: {
                    items: generateShopItems(),
                    rerollCost: SHOP_CONFIG.baseRerollCost,
                  },
                };
              }
            }

            // If player has lost (no hands remaining and didn't reach target)
            if (hasLost) {
              return {
                phase: "GAME_OVER" as const,
              };
            }

            // No end condition met yet
            return state;
          },
          false,
          "checkRoundEnd"
        ),

      // Inventory management
      addJoker: (joker) =>
        set(
          (state) => ({
            inventory: { ...state.inventory, jokers: [...state.inventory.jokers, joker] },
          }),
          false,
          "addJoker"
        ),

      removeJoker: (jokerId) =>
        set(
          (state) => ({
            inventory: {
              ...state.inventory,
              jokers: state.inventory.jokers.filter((j) => j.id !== jokerId),
            },
          }),
          false,
          "removeJoker"
        ),

      addConsumable: (consumable) =>
        set(
          (state) => ({
            inventory: {
              ...state.inventory,
              consumables: [...state.inventory.consumables, consumable],
            },
          }),
          false,
          "addConsumable"
        ),

      removeConsumable: (consumableId) =>
        set(
          (state) => ({
            inventory: {
              ...state.inventory,
              consumables: state.inventory.consumables.filter((c) => c.id !== consumableId),
            },
          }),
          false,
          "removeConsumable"
        ),

      // Shop management
      initializeShop: () =>
        set(
          {
            shop: {
              items: generateShopItems(),
              rerollCost: SHOP_CONFIG.baseRerollCost,
            },
          },
          false,
          "initializeShop"
        ),

      buyJoker: (jokerIndex) =>
        set(
          (state) => {
            const shopItem = state.shop.items[jokerIndex];
            
            // Validate the purchase
            if (!shopItem) return state;
            if (state.run.money < shopItem.price) return state;
            if (state.inventory.jokers.length >= SHOP_CONFIG.maxJokerSlots) return state;
            
            // Create a unique instance of the joker for the player's inventory
            const jokerInstance = {
              ...shopItem.joker,
              id: `${shopItem.joker.id}-${crypto.randomUUID()}`, // Make it unique
            };
            
            // Deduct money and add joker to inventory
            return {
              run: {
                ...state.run,
                money: state.run.money - shopItem.price,
              },
              inventory: {
                ...state.inventory,
                jokers: [...state.inventory.jokers, jokerInstance],
              },
              shop: {
                ...state.shop,
                items: state.shop.items.filter((_, idx) => idx !== jokerIndex),
              },
            };
          },
          false,
          "buyJoker"
        ),

      rerollShop: () =>
        set(
          (state) => {
            // Check if player can afford reroll
            if (state.run.money < state.shop.rerollCost) return state;
            
            return {
              run: {
                ...state.run,
                money: state.run.money - state.shop.rerollCost,
              },
              shop: {
                items: generateShopItems(),
                rerollCost: state.shop.rerollCost,
              },
            };
          },
          false,
          "rerollShop"
        ),

      leaveShop: () =>
        set(
          {
            phase: "PLAYING_HAND" as const,
            shop: {
              items: [],
              rerollCost: SHOP_CONFIG.baseRerollCost,
            },
          },
          false,
          "leaveShop"
        ),

      // Deck management
      setDeck: (cards) => set({ deck: cards }, false, "setDeck"),

      drawCards: (count) =>
        set(
          (state) => {
            const cardsToDraw = state.deck.slice(0, count);
            const remainingDeck = state.deck.slice(count);
            return {
              deck: remainingDeck,
              currentHand: [...state.currentHand, ...cardsToDraw],
            };
          },
          false,
          "drawCards"
        ),

      drawHand: (maxHandSize = MAX_HAND_SIZE) =>
        set(
          (state) => {
            const cardsNeeded = maxHandSize - state.currentHand.length;
            if (cardsNeeded <= 0) return state;

            const cardsToDraw = state.deck.slice(0, cardsNeeded);
            const remainingDeck = state.deck.slice(cardsNeeded);
            return {
              deck: remainingDeck,
              currentHand: [...state.currentHand, ...cardsToDraw],
            };
          },
          false,
          "drawHand"
        ),

      selectCard: (cardId) =>
        set(
          (state) => {
            const card = state.currentHand.find((c) => c.id === cardId);
            if (!card) return state;

            // If card is already selected, deselect it
            if (card.selected) {
              return {
                currentHand: state.currentHand.map((c) =>
                  c.id === cardId ? { ...c, selected: false } : c
                ),
              };
            }

            // Count currently selected cards
            const selectedCount = state.currentHand.filter((c) => c.selected).length;

            // Don't allow more than MAX_CARDS_SELECTED to be selected
            if (selectedCount >= MAX_CARDS_SELECTED) return state;

            // Select the card
            return {
              currentHand: state.currentHand.map((c) =>
                c.id === cardId ? { ...c, selected: true } : c
              ),
            };
          },
          false,
          "selectCard"
        ),

      discardHand: () =>
        set(
          (state) => {
            // Can't discard if no discards remaining
            if (state.combat.discardsRemaining <= 0) return state;

            // Get selected cards
            const selectedCards = state.currentHand.filter((c) => c.selected);
            if (selectedCards.length === 0) return state;

            // Remove selected cards from hand and add to discard pile (deselecting them)
            const remainingHand = state.currentHand.filter((c) => !c.selected);
            const cardsToDiscard = selectedCards.map((c) => ({ ...c, selected: false }));

            // Draw new cards to replenish hand
            const cardsNeeded = MAX_HAND_SIZE - remainingHand.length;
            const cardsToDraw = state.deck.slice(0, cardsNeeded);
            const remainingDeck = state.deck.slice(cardsNeeded);

            return {
              currentHand: [...remainingHand, ...cardsToDraw],
              discardPile: [...state.discardPile, ...cardsToDiscard],
              deck: remainingDeck,
              combat: {
                ...state.combat,
                discardsRemaining: state.combat.discardsRemaining - 1,
              },
            };
          },
          false,
          "discardHand"
        ),

      discardCard: (cardId) =>
        set(
          (state) => {
            const card = state.currentHand.find((c) => c.id === cardId);
            if (!card) return state;
            return {
              currentHand: state.currentHand.filter((c) => c.id !== cardId),
              discardPile: [...state.discardPile, { ...card, selected: false }],
            };
          },
          false,
          "discardCard"
        ),

      resetHand: () => set({ currentHand: [], discardPile: [] }, false, "resetHand"),

      // Game reset
      resetGame: () => set(initialState, false, "resetGame"),
    }),
      { name: "GameStore" }
    ),
    {
      name: "balatro-like-game-state",
      // Only persist the actual game state, not the action methods
      partialize: (state) => ({
        phase: state.phase,
        run: state.run,
        combat: state.combat,
        inventory: state.inventory,
        shop: state.shop,
        deck: state.deck,
        currentHand: state.currentHand,
        discardPile: state.discardPile,
      }),
    }
  )
);

/**
 * Selectors for common state queries
 */
export const selectors = {
  canPlayHand: (state: GameStore) => {
    const selectedCount = state.currentHand.filter((c) => c.selected).length;
    return state.combat.handsRemaining > 0 && selectedCount >= 1 && selectedCount <= 5;
  },
  canDiscard: (state: GameStore) =>
    state.combat.discardsRemaining > 0 && state.currentHand.length > 0,
  canDiscardHand: (state: GameStore) =>
    state.combat.discardsRemaining > 0 &&
    state.currentHand.filter((c) => c.selected).length > 0,
  selectedCardsCount: (state: GameStore) => state.currentHand.filter((c) => c.selected).length,
  hasWon: (state: GameStore) => state.combat.currentScore >= state.combat.targetScore,
  hasLost: (state: GameStore) => 
    state.combat.handsRemaining === 0 && 
    state.combat.currentScore < state.combat.targetScore,
  jokerSlots: (state: GameStore) => state.inventory.jokers.length,
  consumableSlots: (state: GameStore) => state.inventory.consumables.length,
};

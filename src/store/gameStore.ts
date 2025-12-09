import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { GameState } from "@/types/game";

/**
 * Initial game state with default values
 * - Starting money: $4 (standard Balatro starting amount)
 * - Ante 1, Round 1, Small Blind (beginning of run)
 * - 3 discards and target score of 300 for first blind
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
    discardsRemaining: 3,
    currentScore: 0,
    targetScore: 300,
  },
  inventory: {
    jokers: [],
    consumables: [],
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

  // Inventory management
  addJoker: (joker: GameState["inventory"]["jokers"][number]) => void;
  removeJoker: (jokerId: string) => void;
  addConsumable: (consumable: GameState["inventory"]["consumables"][number]) => void;
  removeConsumable: (consumableId: string) => void;

  // Deck management
  setDeck: (cards: GameState["deck"]) => void;
  drawCards: (count: number) => void;
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
 * Includes devtools middleware for debugging
 */
export const useGameStore = create<GameStore>()(
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

      playHand: () =>
        set(
          (state) => ({
            combat: { ...state.combat, handsPlayed: state.combat.handsPlayed + 1 },
          }),
          false,
          "playHand"
        ),

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
              discardsRemaining: 3,
              currentScore: 0,
              targetScore: 300,
            },
          },
          false,
          "resetCombat"
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

      discardCard: (cardId) =>
        set(
          (state) => {
            const card = state.currentHand.find((c) => c.id === cardId);
            if (!card) return state;
            return {
              currentHand: state.currentHand.filter((c) => c.id !== cardId),
              discardPile: [...state.discardPile, card],
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
  )
);

/**
 * Selectors for common state queries
 */
export const selectors = {
  canPlayHand: (state: GameStore) => state.currentHand.length > 0,
  canDiscard: (state: GameStore) =>
    state.combat.discardsRemaining > 0 && state.currentHand.length > 0,
  hasWon: (state: GameStore) => state.combat.currentScore >= state.combat.targetScore,
  jokerSlots: (state: GameStore) => state.inventory.jokers.length,
  consumableSlots: (state: GameStore) => state.inventory.consumables.length,
};

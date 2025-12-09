"use client";

import { useGameStore, selectors } from "@/store/gameStore";
import styles from "./GameStoreDebug.module.css";
import type { Card } from "@/types/game";
import { evaluatePokerHand } from "@/lib/pokerEvaluator";
import { calculateScore } from "@/lib/scoringEngine";
import { JOKER_PLUS_MULT, JOKER_PLUS_CHIPS, JOKER_FLUSH_MULTIPLIER } from "@/lib/jokers";
import { AnimatedCard } from "./AnimatedCard";
import { ScoreAnimation } from "./ScoreAnimation";
import { useState } from "react";

// Animation timing constants
const PLAY_HAND_DELAY_MS = 100;
const SCORE_ANIMATION_COMPLETE_DELAY_MS = 1000;

/**
 * Debug component to visualize and interact with the game store
 * Useful for development and testing
 */
export function GameStoreDebug() {
  const phase = useGameStore((state) => state.phase);
  const run = useGameStore((state) => state.run);
  const combat = useGameStore((state) => state.combat);
  const inventory = useGameStore((state) => state.inventory);
  const deck = useGameStore((state) => state.deck);
  const currentHand = useGameStore((state) => state.currentHand);
  const discardPile = useGameStore((state) => state.discardPile);

  const setPhase = useGameStore((state) => state.setPhase);
  const addMoney = useGameStore((state) => state.addMoney);
  const spendMoney = useGameStore((state) => state.spendMoney);
  const nextBlind = useGameStore((state) => state.nextBlind);
  const playHand = useGameStore((state) => state.playHand);
  const useDiscard = useGameStore((state) => state.useDiscard);
  const addScore = useGameStore((state) => state.addScore);
  const resetGame = useGameStore((state) => state.resetGame);
  const setDeck = useGameStore((state) => state.setDeck);
  const drawHand = useGameStore((state) => state.drawHand);
  const selectCard = useGameStore((state) => state.selectCard);
  const discardHand = useGameStore((state) => state.discardHand);
  const addJoker = useGameStore((state) => state.addJoker);
  const removeJoker = useGameStore((state) => state.removeJoker);
  const startRound = useGameStore((state) => state.startRound);
  const checkRoundEnd = useGameStore((state) => state.checkRoundEnd);

  const canPlayHand = useGameStore(selectors.canPlayHand);
  const canDiscard = useGameStore(selectors.canDiscard);
  const canDiscardHand = useGameStore(selectors.canDiscardHand);
  const selectedCardsCount = useGameStore(selectors.selectedCardsCount);
  const hasWon = useGameStore(selectors.hasWon);
  const hasLost = useGameStore(selectors.hasLost);

  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lastScoreResult, setLastScoreResult] = useState<{
    chips: number;
    mult: number;
    score: number;
  } | null>(null);

  // Initialize a test deck
  const initializeDeck = () => {
    const suits: Card["suit"][] = ["hearts", "diamonds", "clubs", "spades"];
    const ranks: Card["rank"][] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    
    const newDeck: Card[] = [];
    let idCounter = 0;
    
    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push({
          id: `card-${idCounter++}`,
          suit,
          rank,
        });
      }
    }
    
    // Shuffle the deck
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    setDeck(newDeck);
  };

  // Evaluate current selected hand if 1-5 cards are selected
  const selectedCards = currentHand.filter((c) => c.selected);
  let handEvaluation: { handType: string; score: number; breakdown: string } | null = null;
  
  if (selectedCards.length >= 1 && selectedCards.length <= 5) {
    const handResult = evaluatePokerHand(selectedCards);
    const scoreResult = calculateScore(handResult.scoringCards, handResult.handType, inventory.jokers);
    handEvaluation = {
      handType: handResult.handType,
      score: scoreResult.finalScore,
      breakdown: `${scoreResult.totalChips} chips × ${scoreResult.totalMult} mult = ${scoreResult.finalScore}`,
    };
  }

  const handlePlayHand = () => {
    if (selectedCards.length >= 1 && selectedCards.length <= 5) {
      const handResult = evaluatePokerHand(selectedCards);
      const scoreResult = calculateScore(handResult.scoringCards, handResult.handType, inventory.jokers);
      
      setLastScoreResult({
        chips: scoreResult.totalChips,
        mult: scoreResult.totalMult,
        score: scoreResult.finalScore,
      });
      setShowScoreAnimation(true);
      
      // Play the hand after a brief delay to let animation start
      setTimeout(() => {
        playHand();
      }, PLAY_HAND_DELAY_MS);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎮 Game Store Debug</h2>

      <div className={styles.grid}>
        {/* Phase */}
        <section>
          <h3 className={styles.sectionTitle}>Phase</h3>
          <p className={styles.paragraph}>
            Current: <strong>{phase}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => setPhase("MENU")}>
              Menu
            </button>
            <button className={styles.button} onClick={() => setPhase("PLAYING_HAND")}>
              Playing
            </button>
            <button className={styles.button} onClick={() => setPhase("SHOP")}>
              Shop
            </button>
            <button className={styles.button} onClick={() => setPhase("GAME_OVER")}>
              Game Over
            </button>
          </div>
        </section>

        {/* Run State */}
        <section>
          <h3 className={styles.sectionTitle}>Run State</h3>
          <p className={styles.paragraph}>
            💰 Money: <strong>${run.money}</strong>
          </p>
          <p className={styles.paragraph}>
            📊 Ante: <strong>{run.ante}</strong>
          </p>
          <p className={styles.paragraph}>
            🎯 Blind: <strong>{run.currentBlind}</strong>
          </p>
          <p className={styles.paragraph}>
            🔄 Round: <strong>{run.currentRound}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => addMoney(5)}>
              +$5
            </button>
            <button className={styles.button} onClick={() => spendMoney(3)}>
              -$3
            </button>
            <button className={styles.button} onClick={nextBlind}>
              Next Blind
            </button>
          </div>
        </section>

        {/* Combat State */}
        <section>
          <h3 className={styles.sectionTitle}>Combat State</h3>
          <p className={styles.paragraph}>
            🃏 Hands: <strong>{combat.handsPlayed}</strong> played / <strong>{combat.handsRemaining}</strong> remaining
          </p>
          <p className={styles.paragraph}>
            🗑️ Discards Left: <strong>{combat.discardsRemaining}</strong>
          </p>
          <p className={styles.paragraph}>
            📈 Score: <strong>{combat.currentScore}</strong> / {combat.targetScore}
          </p>
          <p className={styles.paragraph}>
            Status: {hasWon ? "🎉 Won!" : hasLost ? "💀 Lost!" : "🎯 In Progress"}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={handlePlayHand} disabled={!canPlayHand}>
              Play Hand
            </button>
            <button className={styles.button} onClick={useDiscard} disabled={!canDiscard}>
              Use Discard
            </button>
            <button className={styles.button} onClick={() => addScore(100)}>
              +100 Score
            </button>
          </div>
          <div className={styles.buttonGroup} style={{ marginTop: '0.5rem' }}>
            <button className={styles.button} onClick={startRound}>
              🎬 Start Round
            </button>
            <button className={styles.button} onClick={checkRoundEnd}>
              🏁 Check Round End
            </button>
          </div>
        </section>

        {/* Inventory */}
        <section>
          <h3 className={styles.sectionTitle}>Inventory</h3>
          <p className={styles.paragraph}>
            🃏 Jokers: <strong>{inventory.jokers.length}</strong>
          </p>
          <p className={styles.paragraph}>
            ✨ Consumables: <strong>{inventory.consumables.length}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button 
              className={styles.button} 
              onClick={() => addJoker(JOKER_PLUS_MULT)}
              disabled={inventory.jokers.some(j => j.id === JOKER_PLUS_MULT.id)}
            >
              Add +4 Mult
            </button>
            <button 
              className={styles.button} 
              onClick={() => addJoker(JOKER_PLUS_CHIPS)}
              disabled={inventory.jokers.some(j => j.id === JOKER_PLUS_CHIPS.id)}
            >
              Add +15 Chips
            </button>
            <button 
              className={styles.button} 
              onClick={() => addJoker(JOKER_FLUSH_MULTIPLIER)}
              disabled={inventory.jokers.some(j => j.id === JOKER_FLUSH_MULTIPLIER.id)}
            >
              Add Flush x3
            </button>
          </div>
          {inventory.jokers.length > 0 && (
            <div className={styles.buttonGroup} style={{ marginTop: '0.5rem' }}>
              {inventory.jokers.map((joker) => (
                <button
                  key={joker.id}
                  className={styles.button}
                  onClick={() => removeJoker(joker.id)}
                  style={{ fontSize: '0.8rem' }}
                >
                  Remove {joker.name}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Deck Info */}
        <section>
          <h3 className={styles.sectionTitle}>Deck</h3>
          <p className={styles.paragraph}>
            📚 Cards in Deck: <strong>{deck.length}</strong>
          </p>
          <p className={styles.paragraph}>
            🖐️ Current Hand: <strong>{currentHand.length}</strong>
          </p>
          <p className={styles.paragraph}>
            🗑️ Discard Pile: <strong>{discardPile.length}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={initializeDeck}>
              Initialize Deck
            </button>
            <button className={styles.button} onClick={() => drawHand(8)} disabled={deck.length === 0}>
              Draw Hand
            </button>
          </div>
        </section>

        {/* Hand Management */}
        <section>
          <h3 className={styles.sectionTitle}>Hand Management</h3>
          <p className={styles.paragraph}>
            ✅ Selected: <strong>{selectedCardsCount}</strong> / 5 (play 1-5 cards)
          </p>
          {handEvaluation && (
            <>
              <p className={styles.paragraph}>
                🃏 Hand: <strong>{handEvaluation.handType}</strong>
              </p>
              <p className={styles.paragraph}>
                💯 Score: <strong>{handEvaluation.score}</strong>
              </p>
              <p className={styles.paragraph} style={{ fontSize: "0.9em", opacity: 0.8 }}>
                {handEvaluation.breakdown}
              </p>
            </>
          )}
          <div className={styles.buttonGroup}>
            <button 
              className={styles.button} 
              onClick={discardHand} 
              disabled={!canDiscardHand}
            >
              Discard Selected ({selectedCardsCount})
            </button>
          </div>
        </section>

        {/* Actions */}
        <section>
          <h3 className={styles.sectionTitle}>Actions</h3>
          <button className={styles.resetButton} onClick={resetGame}>
            🔄 Reset Game
          </button>
        </section>
      </div>

      {/* Current Hand Display */}
      {currentHand.length > 0 && (
        <div className={styles.handSection}>
          <h3 className={styles.sectionTitle}>Current Hand (Click to Select/Deselect)</h3>
          <div className={styles.cardGrid}>
            {currentHand.map((card, index) => (
              <AnimatedCard
                key={card.id}
                card={card}
                index={index}
                onClick={() => selectCard(card.id)}
                isSelected={card.selected || false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Score Animation */}
      {showScoreAnimation && lastScoreResult && (
        <div className={styles.scoreAnimationContainer}>
          <ScoreAnimation
            chips={lastScoreResult.chips}
            mult={lastScoreResult.mult}
            finalScore={lastScoreResult.score}
            onComplete={() => {
              setTimeout(() => setShowScoreAnimation(false), SCORE_ANIMATION_COMPLETE_DELAY_MS);
            }}
          />
        </div>
      )}

      <div className={styles.tip}>
        <p>💡 Tip: Open React DevTools to inspect Zustand store state and actions</p>
      </div>
    </div>
  );
}

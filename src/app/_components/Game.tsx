"use client";

import { useGameStore, selectors } from "@/store/gameStore";
import styles from "./Game.module.css";
import type { Card } from "@/types/game";
import { evaluatePokerHand } from "@/lib/pokerEvaluator";
import { calculateScore } from "@/lib/scoringEngine";
import { AnimatedCard } from "./AnimatedCard";
import { ScoreAnimation } from "./ScoreAnimation";
import { useState } from "react";

// Animation timing constants
const PLAY_HAND_DELAY_MS = 100;
const SCORE_ANIMATION_COMPLETE_DELAY_MS = 1000;

/**
 * Real game component without debug controls
 * Displays the actual game interface for playing hands
 */
export function Game() {
  const phase = useGameStore((state) => state.phase);
  const run = useGameStore((state) => state.run);
  const combat = useGameStore((state) => state.combat);
  const currentHand = useGameStore((state) => state.currentHand);
  const deck = useGameStore((state) => state.deck);
  const discardPile = useGameStore((state) => state.discardPile);

  const playHand = useGameStore((state) => state.playHand);
  const selectCard = useGameStore((state) => state.selectCard);
  const discardHand = useGameStore((state) => state.discardHand);

  const canPlayHand = useGameStore(selectors.canPlayHand);
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

  // Evaluate current selected hand if 1-5 cards are selected
  const selectedCards = currentHand.filter((c) => c.selected);
  let handEvaluation: { handType: string; score: number; breakdown: string } | null = null;

  if (selectedCards.length >= 1 && selectedCards.length <= 5) {
    const handResult = evaluatePokerHand(selectedCards);
    const scoreResult = calculateScore(
      handResult.scoringCards,
      handResult.handType,
      useGameStore.getState().inventory.jokers
    );
    handEvaluation = {
      handType: handResult.handType,
      score: scoreResult.finalScore,
      breakdown: `${scoreResult.totalChips} chips × ${scoreResult.totalMult} mult = ${scoreResult.finalScore}`,
    };
  }

  const handlePlayHand = () => {
    if (selectedCards.length >= 1 && selectedCards.length <= 5) {
      const handResult = evaluatePokerHand(selectedCards);
      const scoreResult = calculateScore(
        handResult.scoringCards,
        handResult.handType,
        useGameStore.getState().inventory.jokers
      );

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
      {/* Game Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            Ante {run.ante} - {run.currentBlind.charAt(0).toUpperCase() + run.currentBlind.slice(1)}{" "}
            Blind
          </h1>
          <p className={styles.round}>Round {run.currentRound}</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Money</span>
            <span className={styles.statValue}>${run.money}</span>
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className={styles.combatStats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Score</span>
          <span className={styles.statValue}>
            {combat.currentScore} / {combat.targetScore}
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min((combat.currentScore / combat.targetScore) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Hands</span>
          <span className={styles.statValue}>{combat.handsRemaining}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Discards</span>
          <span className={styles.statValue}>{combat.discardsRemaining}</span>
        </div>
      </div>

      {/* Status Messages */}
      {hasWon && (
        <div className={styles.statusMessage} style={{ backgroundColor: "#2ecc71" }}>
          🎉 You won! Moving to shop...
        </div>
      )}
      {hasLost && (
        <div className={styles.statusMessage} style={{ backgroundColor: "#e74c3c" }}>
          💀 Game Over! You ran out of hands.
        </div>
      )}

      {/* Hand Evaluation */}
      {handEvaluation && selectedCardsCount > 0 && (
        <div className={styles.handEvaluation}>
          <div className={styles.evaluationCard}>
            <span className={styles.handType}>{handEvaluation.handType}</span>
            <span className={styles.handScore}>{handEvaluation.score} points</span>
            <span className={styles.handBreakdown}>{handEvaluation.breakdown}</span>
          </div>
        </div>
      )}

      {/* Current Hand Display */}
      {currentHand.length > 0 && (
        <div className={styles.handSection}>
          <h3 className={styles.sectionTitle}>
            Your Hand ({selectedCardsCount} selected)
          </h3>
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

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.discardButton}
          onClick={discardHand}
          disabled={!canDiscardHand}
        >
          🗑️ Discard ({selectedCardsCount})
        </button>
        <button className={styles.playButton} onClick={handlePlayHand} disabled={!canPlayHand}>
          ▶️ Play Hand
        </button>
      </div>

      {/* Deck Info */}
      <div className={styles.deckInfo}>
        <span>📚 Deck: {deck.length} cards</span>
        <span>🗑️ Discard Pile: {discardPile.length} cards</span>
      </div>

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
    </div>
  );
}

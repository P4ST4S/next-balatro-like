"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./ScoreAnimation.module.css";

// Animation timing constants
const CHIPS_ANIMATION_DURATION = 0.8;
const MULT_ANIMATION_DURATION = 0.6;
const SCORE_ANIMATION_DURATION = 1.0;
const PHASE_DELAY_MS = 200;
const MULTIPLY_PHASE_DELAY_MS = 400;

interface ScoreAnimationProps {
  chips: number;
  mult: number;
  finalScore: number;
  onComplete?: () => void;
}

export function ScoreAnimation({ chips, mult, finalScore, onComplete }: ScoreAnimationProps) {
  const [phase, setPhase] = useState<"chips" | "mult" | "multiply" | "complete">("chips");
  const chipsDisplay = useMotionValue(0);
  const multDisplay = useMotionValue(0);
  const scoreDisplay = useMotionValue(0);

  useEffect(() => {
    let chipsControl: ReturnType<typeof animate> | undefined;
    let multControl: ReturnType<typeof animate> | undefined;
    let scoreControl: ReturnType<typeof animate> | undefined;

    const sequence = async () => {
      // Phase 1: Count up chips
      setPhase("chips");
      chipsControl = animate(chipsDisplay, chips, {
        duration: CHIPS_ANIMATION_DURATION,
        ease: "easeOut",
      });
      await chipsControl;

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, PHASE_DELAY_MS));

      // Phase 2: Count up mult
      setPhase("mult");
      multControl = animate(multDisplay, mult, {
        duration: MULT_ANIMATION_DURATION,
        ease: "easeOut",
      });
      await multControl;

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, PHASE_DELAY_MS));

      // Phase 3: Show multiplication
      setPhase("multiply");
      await new Promise((resolve) => setTimeout(resolve, MULTIPLY_PHASE_DELAY_MS));

      // Phase 4: Count up final score
      setPhase("complete");
      scoreControl = animate(scoreDisplay, finalScore, {
        duration: SCORE_ANIMATION_DURATION,
        ease: "easeOut",
      });
      await scoreControl;

      if (onComplete) {
        onComplete();
      }
    };

    sequence();

    return () => {
      chipsControl?.stop();
      multControl?.stop();
      scoreControl?.stop();
    };
  }, [chips, mult, finalScore, chipsDisplay, multDisplay, scoreDisplay, onComplete]);

  const roundedChips = useTransform(chipsDisplay, (value) => Math.round(value));
  const roundedMult = useTransform(multDisplay, (value) => Math.round(value));
  const roundedScore = useTransform(scoreDisplay, (value) => Math.round(value));

  return (
    <div className={styles.container}>
      <div className={styles.breakdown}>
        <motion.div
          className={styles.value}
          animate={{
            scale: phase === "chips" ? [1, 1.2, 1] : 1,
            color: phase === "chips" ? "#60a5fa" : "#9ca3af",
          }}
          transition={{ duration: 0.3 }}
        >
          <span className={styles.label}>Chips:</span>
          <motion.span className={styles.number}>{roundedChips}</motion.span>
        </motion.div>

        {phase !== "chips" && (
          <motion.div
            className={styles.operator}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            ×
          </motion.div>
        )}

        {phase !== "chips" && (
          <motion.div
            className={styles.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: phase === "mult" ? [1, 1.2, 1] : 1,
              color: phase === "mult" ? "#f59e0b" : "#9ca3af",
            }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.label}>Mult:</span>
            <motion.span className={styles.number}>{roundedMult}</motion.span>
          </motion.div>
        )}
      </div>

      {(phase === "multiply" || phase === "complete") && (
        <motion.div
          className={styles.equals}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          =
        </motion.div>
      )}

      {(phase === "multiply" || phase === "complete") && (
        <motion.div
          className={styles.finalScore}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: phase === "complete" ? [1, 1.3, 1] : 1,
          }}
          transition={{ 
            duration: phase === "multiply" ? 0.3 : 0.8,
            times: [0, 0.5, 1],
          }}
        >
          <motion.span 
            className={styles.scoreValue}
            animate={{
              textShadow: phase === "complete" 
                ? [
                    "0 0 10px #ef4444",
                    "0 0 20px #ef4444, 0 0 30px #f97316",
                    "0 0 10px #ef4444",
                  ]
                : "0 0 10px #ef4444",
            }}
            transition={{
              duration: 1.5,
              repeat: phase === "complete" ? 2 : 0,
              repeatType: "reverse",
            }}
          >
            {roundedScore}
          </motion.span>
          <span className={styles.scoreLabel}>pts</span>
        </motion.div>
      )}
    </div>
  );
}

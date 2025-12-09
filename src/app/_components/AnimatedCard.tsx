"use client";

import { motion } from "framer-motion";
import type { Card } from "@/types/game";
import styles from "./AnimatedCard.module.css";

interface AnimatedCardProps {
  card: Card;
  index: number;
  onClick: () => void;
  isSelected: boolean;
}

export function AnimatedCard({ card, index, onClick, isSelected }: AnimatedCardProps) {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";
  
  const suitSymbol = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  }[card.suit];

  return (
    <motion.button
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${isRed ? styles.cardRed : styles.cardBlack}`}
      onClick={onClick}
      initial={{ opacity: 0, y: -50, rotateY: 180 }}
      animate={{ 
        opacity: 1, 
        y: isSelected ? -20 : 0, 
        rotateY: 0,
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.05,
      }}
      whileHover={{ 
        y: isSelected ? -20 : -10,
        scale: isSelected ? 1.05 : 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className={styles.cardContent}>
        <span className={styles.cardRank}>{card.rank}</span>
        <span className={styles.cardSuit}>{suitSymbol}</span>
      </div>
    </motion.button>
  );
}

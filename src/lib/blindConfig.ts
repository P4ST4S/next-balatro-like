/**
 * Blind configuration system
 * Defines target scores and rewards for each blind type across all antes
 */

export type BlindType = "small" | "big" | "boss";

/**
 * Configuration for a specific blind
 */
export interface BlindConfig {
  type: BlindType;
  targetScore: number;
  rewardMoney: number;
  hands: number;
  discards: number;
}

/**
 * Base configurations for each blind type at Ante 1
 * These serve as the foundation for exponential scaling
 */
const BASE_BLIND_CONFIGS = {
  small: {
    baseScore: 300,
    rewardMoney: 3,
    hands: 4,
    discards: 3,
  },
  big: {
    baseScore: 450,
    rewardMoney: 4,
    hands: 4,
    discards: 3,
  },
  boss: {
    baseScore: 600,
    rewardMoney: 5,
    hands: 4,
    discards: 3,
  },
} as const;

/**
 * Calculates the target score for a blind using exponential scaling
 * Formula: baseScore * (scalingFactor ^ (ante - 1))
 * 
 * This creates increasingly difficult blinds as antes progress:
 * - Ante 1: Base scores (300, 450, 600)
 * - Ante 2: ~450, ~675, ~900
 * - Ante 3: ~675, ~1012, ~1350
 * - Ante 8: ~7700, ~11550, ~15400
 * 
 * @param baseScore - The base score for this blind type
 * @param ante - The current ante number (1-indexed)
 * @param scalingFactor - Multiplier for each ante (default: 1.5)
 * @returns The calculated target score, rounded to nearest integer
 */
export function calculateTargetScore(
  baseScore: number,
  ante: number,
  scalingFactor: number = 1.5
): number {
  return Math.round(baseScore * Math.pow(scalingFactor, ante - 1));
}

/**
 * Gets the complete configuration for a specific blind
 * 
 * @param blindType - The type of blind (small, big, boss)
 * @param ante - The current ante number
 * @returns Complete blind configuration with scaled target score
 */
export function getBlindConfig(blindType: BlindType, ante: number): BlindConfig {
  const baseConfig = BASE_BLIND_CONFIGS[blindType];
  
  return {
    type: blindType,
    targetScore: calculateTargetScore(baseConfig.baseScore, ante),
    rewardMoney: baseConfig.rewardMoney,
    hands: baseConfig.hands,
    discards: baseConfig.discards,
  };
}

/**
 * Gets the display name for a blind type
 */
export function getBlindDisplayName(blindType: BlindType): string {
  const names = {
    small: "Small Blind",
    big: "Big Blind",
    boss: "Boss Blind",
  };
  return names[blindType];
}

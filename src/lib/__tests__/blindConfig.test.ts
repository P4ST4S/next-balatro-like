/**
 * Test suite for the blind configuration system
 * 
 * Tests blind configurations, scaling, and game progression logic
 * 
 * Can be run with: npx tsx src/lib/__tests__/blindConfig.test.ts
 */

import { 
  getBlindConfig, 
  calculateTargetScore, 
  getBlindDisplayName,
  type BlindType 
} from "../blindConfig";

// Test cases for blind configurations
const tests = [
  {
    name: "Small Blind - Ante 1",
    blindType: "small" as BlindType,
    ante: 1,
    expectedTargetScore: 300,
    expectedRewardMoney: 3,
    expectedHands: 4,
    expectedDiscards: 3,
  },
  {
    name: "Big Blind - Ante 1",
    blindType: "big" as BlindType,
    ante: 1,
    expectedTargetScore: 450,
    expectedRewardMoney: 4,
    expectedHands: 4,
    expectedDiscards: 3,
  },
  {
    name: "Boss Blind - Ante 1",
    blindType: "boss" as BlindType,
    ante: 1,
    expectedTargetScore: 600,
    expectedRewardMoney: 5,
    expectedHands: 4,
    expectedDiscards: 3,
  },
  {
    name: "Small Blind - Ante 2 (1.5x scaling)",
    blindType: "small" as BlindType,
    ante: 2,
    expectedTargetScore: 450, // 300 * 1.5
    expectedRewardMoney: 3,
    expectedHands: 4,
    expectedDiscards: 3,
  },
  {
    name: "Big Blind - Ante 2 (1.5x scaling)",
    blindType: "big" as BlindType,
    ante: 2,
    expectedTargetScore: 675, // 450 * 1.5
    expectedRewardMoney: 4,
    expectedHands: 4,
    expectedDiscards: 3,
  },
  {
    name: "Boss Blind - Ante 2 (1.5x scaling)",
    blindType: "boss" as BlindType,
    ante: 2,
    expectedTargetScore: 900, // 600 * 1.5
    expectedRewardMoney: 5,
    expectedHands: 4,
    expectedDiscards: 3,
  },
  {
    name: "Small Blind - Ante 3 (2.25x scaling)",
    blindType: "small" as BlindType,
    ante: 3,
    expectedTargetScore: 675, // 300 * 1.5^2
    expectedRewardMoney: 3,
    expectedHands: 4,
    expectedDiscards: 3,
  },
  {
    name: "Boss Blind - Ante 8 (exponential growth)",
    blindType: "boss" as BlindType,
    ante: 8,
    expectedTargetScore: 10252, // 600 * 1.5^7 ≈ 10252
    expectedRewardMoney: 5,
    expectedHands: 4,
    expectedDiscards: 3,
  },
];

// Test scaling formula
const scalingTests = [
  {
    name: "Ante 1 has no scaling (1.5^0 = 1)",
    baseScore: 300,
    ante: 1,
    scalingFactor: 1.5,
    expectedScore: 300,
  },
  {
    name: "Ante 2 has 1.5x scaling",
    baseScore: 300,
    ante: 2,
    scalingFactor: 1.5,
    expectedScore: 450,
  },
  {
    name: "Ante 3 has 2.25x scaling (1.5^2)",
    baseScore: 300,
    ante: 3,
    scalingFactor: 1.5,
    expectedScore: 675,
  },
  {
    name: "Ante 5 has 5.0625x scaling (1.5^4)",
    baseScore: 100,
    ante: 5,
    scalingFactor: 1.5,
    expectedScore: 506, // 100 * 5.0625 rounded
  },
  {
    name: "Custom scaling factor 2.0",
    baseScore: 500,
    ante: 3,
    scalingFactor: 2.0,
    expectedScore: 2000, // 500 * 2^2
  },
];

// Test display names
const displayNameTests = [
  { blindType: "small" as BlindType, expectedName: "Small Blind" },
  { blindType: "big" as BlindType, expectedName: "Big Blind" },
  { blindType: "boss" as BlindType, expectedName: "Boss Blind" },
];

// Run blind configuration tests
let passed = 0;
let failed = 0;

console.log("🎯 Testing Blind Configuration System\n");

console.log("📊 Testing getBlindConfig():\n");
for (const test of tests) {
  try {
    const config = getBlindConfig(test.blindType, test.ante);
    
    const targetScoreMatch = config.targetScore === test.expectedTargetScore;
    const rewardMatch = config.rewardMoney === test.expectedRewardMoney;
    const handsMatch = config.hands === test.expectedHands;
    const discardsMatch = config.discards === test.expectedDiscards;
    
    if (targetScoreMatch && rewardMatch && handsMatch && discardsMatch) {
      console.log(`✅ ${test.name}`);
      console.log(`   Target: ${config.targetScore}, Reward: $${config.rewardMoney}`);
      console.log(`   Hands: ${config.hands}, Discards: ${config.discards}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: Target ${test.expectedTargetScore}, Reward $${test.expectedRewardMoney}`);
      console.log(`   Got: Target ${config.targetScore}, Reward $${config.rewardMoney}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    failed++;
  }
  console.log("");
}

console.log("\n📈 Testing calculateTargetScore():\n");
for (const test of scalingTests) {
  try {
    const score = calculateTargetScore(test.baseScore, test.ante, test.scalingFactor);
    
    if (score === test.expectedScore) {
      console.log(`✅ ${test.name}`);
      console.log(`   Formula: ${test.baseScore} × ${test.scalingFactor}^${test.ante - 1} = ${score}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: ${test.expectedScore}`);
      console.log(`   Got: ${score}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    failed++;
  }
  console.log("");
}

console.log("\n📝 Testing getBlindDisplayName():\n");
for (const test of displayNameTests) {
  try {
    const name = getBlindDisplayName(test.blindType);
    
    if (name === test.expectedName) {
      console.log(`✅ ${test.blindType} -> "${name}"`);
      passed++;
    } else {
      console.log(`❌ ${test.blindType}`);
      console.log(`   Expected: "${test.expectedName}"`);
      console.log(`   Got: "${name}"`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.blindType}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    failed++;
  }
  console.log("");
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

// Exit with error code if any tests failed
if (failed > 0) {
  process.exit(1);
}

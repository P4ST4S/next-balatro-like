# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-10

### 🎉 Initial V1 Release

The first production-ready release of the Balatro-Like Card Game! A fully playable poker-based roguelike deck-builder with smooth animations and persistent state.

### ✨ Added - Game Features

#### Core Gameplay

- **Complete Poker Hand Evaluation** - All 9 standard poker hands (High Card through Straight Flush)
- **5-Card Hand System** - Select 1-5 cards to play poker hands
- **Scoring System** - Base chips + multipliers with real-time score calculation
- **Blind Progression** - Small, Big, and Boss blinds with increasing difficulty
- **Ante System** - Progress through multiple antes with scaling score requirements
- **Combat Mechanics** - Limited hands (4) and discards (3) per blind

#### Joker System

- **Multiple Joker Types** - Common, Uncommon, Rare, and Legendary rarities
- **Trigger System** - Jokers activate `onScore` or `onEndCalculation`
- **Joker Effects** - Flat chip bonuses, multiplier bonuses, conditional multipliers
- **Joker Slots** - Up to 5 Joker slots with visual management
- **Sell System** - Sell Jokers for half their purchase price

#### Shop & Economy

- **Shop Interface** - Visit shop after each blind victory
- **Random Joker Generation** - 3 random Jokers available per shop visit
- **Dynamic Pricing** - Prices based on rarity (Common $5, Uncommon $7, Rare $10, Legendary $15)
- **Reroll System** - Refresh shop inventory for $5 (cost increases per reroll)
- **Money Rewards** - Earn money from winning blinds (Small $3-4, Big $5, Boss $8)
- **Starting Money** - Begin each run with $4

#### UI/UX

- **Main Menu** - New Run and Continue Run options
- **Auto-Save** - Game progress automatically saved to localStorage
- **Smooth Animations** - Card flip animations powered by Framer Motion
- **Score Counter Animation** - Animated score tallying with motion effects
- **Responsive Layout** - Mobile-friendly design with CSS modules
- **Visual Feedback** - Real-time hand evaluation preview
- **Joker Display** - Visual slots showing active Jokers

#### Game Flow

- **Menu Phase** - Start new runs or continue existing progress
- **Playing Hand Phase** - Draw cards, select hands, play or discard
- **Shop Phase** - Purchase Jokers and manage inventory
- **Game Over Detection** - Win condition (beat all blinds) and lose condition (run out of hands)

### 🏗️ Added - Technical Implementation

#### State Management

- **Zustand Store** - Centralized game state with DevTools integration
- **State Persistence** - Auto-save to localStorage with `persist` middleware
- **Selectors** - Optimized state selectors for performance
- **Type-Safe Actions** - 30+ typed store actions for game management

#### Core Libraries

- **Poker Evaluator** (`src/lib/pokerEvaluator.ts`) - Hand type detection and scoring card identification
- **Scoring Engine** (`src/lib/scoringEngine.ts`) - Calculate final scores with Joker effects
- **Deck Utilities** (`src/lib/deck.ts`) - Standard 52-card deck with Fisher-Yates shuffle
- **Joker System** (`src/lib/jokers.ts`) - Joker definitions and trigger logic
- **Blind Configuration** (`src/lib/blindConfig.ts`) - Blind difficulty scaling
- **Shop Generator** (`src/lib/shop.ts`) - Random shop item generation

#### Testing

- **Unit Tests** - Comprehensive test coverage for core game logic
  - Poker hand evaluation tests
  - Scoring engine tests
  - Joker mechanics tests
  - Blind configuration tests
  - Integration tests for complete game flows
- **Test Files** - 5 test files with edge case coverage

#### Components

- **Game.tsx** - Main game interface with hand playing logic
- **Menu.tsx** - Main menu with New Run/Continue Run
- **Shop.tsx** - Shop interface for Joker purchases
- **JokerSlots.tsx** - Visual Joker management with sell functionality
- **AnimatedCard.tsx** - Card component with flip animations
- **ScoreAnimation.tsx** - Animated score counter
- **GameStoreDebug.tsx** - Debug panel for development

#### Type Safety

- **Full TypeScript** - 100% typed codebase (2,900+ lines)
- **Strict Mode** - No `any` types in production code
- **Type Definitions** (`src/types/game.ts`) - Comprehensive interfaces:
  - `Card` - Playing card with enhancements and editions
  - `Joker` - Joker cards with trigger callbacks
  - `GameState` - Complete game state structure
  - `RunState`, `CombatState`, `InventoryState` - Organized state sections

#### Documentation

- **README.md** - Comprehensive project documentation
- **STORE_ARCHITECTURE.md** - Game state management guide
- **POKER_EVALUATOR.md** - Hand evaluation system documentation
- **DECK_UTILITIES.md** - Deck creation and shuffling guide
- **CHANGELOG.md** - Version history (this file)

### 🛠️ Technical Stack

- **Next.js 16.0.8** - App Router with React 19 support and Turbopack
- **React 19.2.1** - Latest React with concurrent rendering
- **TypeScript 5** - Strict typing for all code
- **Zustand 5.0.9** - Lightweight state management with DevTools
- **Framer Motion 12.23.25** - Smooth animations and transitions
- **CSS Modules** - Scoped component styling
- **Prettier 3.7.4** - Consistent code formatting
- **ESLint 9** - Code quality and linting
- **pnpm** - Fast, efficient package management

### 📋 Game Design Decisions

#### Balatro-Inspired Mechanics

- **Scoring Cards Only** - Only cards that form the hand trigger Joker effects (core Balatro mechanic)
- **Joker Stacking** - Multiple Jokers combine for powerful synergies
- **Progressive Difficulty** - Blinds scale with ante level for long-term challenge
- **Resource Management** - Balance hands, discards, and money spending

#### Technical Choices

- **Fisher-Yates Shuffle** - Cryptographically sound shuffling for fair randomness
- **Zustand over Redux** - Simpler API, smaller bundle, no Provider boilerplate
- **CSS Modules over Tailwind** - Type-safe styles with zero runtime overhead
- **Server + Client Components** - Landing page uses Server Components, game uses Client Components

### 🎯 Performance & Quality

- **Production Ready** - Fully tested and optimized for deployment
- **Type Safe** - Zero runtime type errors with strict TypeScript
- **Tested** - Unit tests for all core game logic
- **Documented** - Comprehensive documentation for all systems
- **Accessible** - Semantic HTML and responsive design
- **Fast** - Optimized bundle size and rendering performance

### 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Visit http://localhost:3000/play to start playing!
```

### 🔗 Links

- **Repository**: [P4ST4S/next-balatro-like](https://github.com/P4ST4S/next-balatro-like)
- **Documentation**: See [README.md](./README.md) for full documentation

---

## Future Roadmap

While V1 is feature-complete, potential future enhancements include:

### Planned Features (V2+)

- **Boss Blind Mechanics** - Special rules that modify gameplay (e.g., locked suits, burning Jokers)
- **Card Enhancements** - Bonus, mult, wild, glass, steel, stone cards
- **Card Editions** - Foil, holographic, polychrome variants
- **Planet Cards** - Level up specific poker hands
- **Tarot Cards** - One-time use cards that modify deck/hand
- **Spectral Cards** - High-risk, high-reward consumables
- **Deck Variants** - Different starting decks with unique properties
- **Achievements** - Track milestones and unlock rewards
- **Seed System** - Shareable seeds for reproducible runs
- **Statistics** - Track wins, losses, high scores
- **Sound Effects** - Audio feedback for actions
- **Music** - Background music and ambient sounds
- **Multiplayer** - Compare runs with friends

### Technical Improvements

- **Database Integration** - Save runs to cloud database
- **Leaderboards** - Global high score tracking
- **Replay System** - Watch previous runs
- **Mobile App** - Native mobile version
- **Performance Metrics** - Detailed analytics

---

**[1.0.0]** marks the first stable release ready for public use!

# Balatro-Like Card Game

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/P4ST4S/next-balatro-like)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.1-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **Status:** Production-ready V1 release. Built with Next.js 16.0.8 App Router and React 19.2.1. \
> **Documentation source:** [Next.js installation (Node >= 20.9)](https://nextjs.org/docs/app/getting-started/installation#system-requirements)

## 🚀 What is this?

A fully playable **Balatro-inspired roguelike deck-building card game** built with modern web technologies. Experience the addictive poker-based gameplay where you build powerful hands, collect game-changing Jokers, and progress through increasingly challenging blinds.

**Play it now:** Navigate to `/play` to start your run, or visit the landing page at `/` for an overview.

### Key Features

✨ **Complete Poker Gameplay** - Full 5-card poker hand evaluation (High Card to Straight Flush) with real-time scoring  
🃏 **Joker System** - Collect and combine Jokers that modify your scoring in powerful ways  
💰 **Shop & Economy** - Earn money from rounds, buy Jokers, and reroll for better options  
🎯 **Progressive Blinds** - Battle through Small, Big, and Boss blinds with escalating difficulty  
🎨 **Smooth Animations** - Card animations and score counters powered by Framer Motion  
💾 **Auto-Save** - Your progress is automatically saved to localStorage  
📱 **Responsive Design** - Beautiful UI that works on desktop and mobile

## 🎮 How to Play

1. **Start a New Run** - Begin with $4 and a standard 52-card deck
2. **Play Hands** - Select 1-5 cards and play poker hands to score points
3. **Beat Blinds** - Reach the target score before running out of hands
4. **Visit the Shop** - Spend money on Jokers to boost your scoring power
5. **Progress Through Antes** - Each ante increases difficulty with higher score targets

**Game Flow:** Menu → Playing Hand → Shop → Next Blind → Repeat

## 📦 Technology Stack

This project uses cutting-edge web technologies verified for production use in 2025:

- **[Next.js 16.0.8](https://nextjs.org)** (App Router) — Modern routing, React 19 support, Turbopack dev server; requires Node >= 20.9 per [official docs](https://nextjs.org/docs/app/getting-started/installation#system-requirements)
- **[React 19.2.1](https://react.dev)** — Latest React with concurrent rendering features
- **[Zustand 5.0.9](https://github.com/pmndrs/zustand)** — Lightweight state management with DevTools integration for game logic
- **[Framer Motion 12.23.25](https://www.framer.com/motion/)** — Smooth card animations and score counters
- **[TypeScript 5](https://www.typescriptlang.org)** — Strict typing for all game state and actions (2,900+ lines of type-safe code)
- **CSS Modules** — Component-scoped styling for maintainable UI
- **[Prettier 3.7.4](https://prettier.io)** — Consistent code formatting
- **pnpm** — Fast, disk-efficient package manager (tracked via `pnpm-lock.yaml`)

## 🛠 Prerequisites

- **Node.js >= 20.9** ([Next.js system requirements](https://nextjs.org/docs/app/getting-started/installation#system-requirements))
- **pnpm >= 8** (enable with `corepack enable` if not installed)

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit **http://localhost:3000/play** to start playing!

### Available Scripts

```bash
pnpm dev          # Start dev server with Turbopack (http://localhost:3000)
pnpm build        # Create production build
pnpm start        # Serve production build (after pnpm build)
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

## 🧭 Project Structure

```
next-balatro-like/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page with game overview
│   │   ├── play/page.tsx      # Main game interface
│   │   ├── game/page.tsx      # Debug game view with controls
│   │   └── _components/       # React components
│   │       ├── Game.tsx       # Main game component
│   │       ├── Menu.tsx       # Main menu (New Run/Continue)
│   │       ├── Shop.tsx       # Joker shop interface
│   │       ├── JokerSlots.tsx # Joker display and management
│   │       ├── AnimatedCard.tsx    # Card animations
│   │       ├── ScoreAnimation.tsx  # Score counter effects
│   │       └── GameStoreDebug.tsx  # Debug panel
│   ├── store/
│   │   └── gameStore.ts       # Zustand game state (300+ lines)
│   ├── lib/                    # Core game logic
│   │   ├── pokerEvaluator.ts  # Hand evaluation (9 hand types)
│   │   ├── scoringEngine.ts   # Score calculation with Jokers
│   │   ├── deck.ts            # Deck creation & shuffling
│   │   ├── jokers.ts          # Joker definitions
│   │   ├── blindConfig.ts     # Blind difficulty configuration
│   │   ├── shop.ts            # Shop generation logic
│   │   └── __tests__/         # Comprehensive test suite
│   └── types/
│       └── game.ts            # TypeScript type definitions
├── docs/                       # Detailed documentation
│   ├── STORE_ARCHITECTURE.md  # State management guide
│   ├── POKER_EVALUATOR.md     # Hand evaluation docs
│   └── DECK_UTILITIES.md      # Deck utilities docs
└── public/                     # Static assets
```

## 🎯 Game Mechanics

### Poker Hands

The game evaluates 9 standard poker hands (weakest to strongest):

1. **High Card** - Highest single card (1 scoring card)
2. **Pair** - Two matching ranks (2 scoring cards)
3. **Two Pair** - Two different pairs (4 scoring cards)
4. **Three of a Kind** - Three matching ranks (3 scoring cards)
5. **Straight** - Five consecutive ranks (5 scoring cards)
6. **Flush** - Five cards of same suit (5 scoring cards)
7. **Full House** - Three of a kind + pair (5 scoring cards)
8. **Four of a Kind** - Four matching ranks (4 scoring cards)
9. **Straight Flush** - Straight + Flush combo (5 scoring cards)

Each hand type has base chips and multiplier values. Your final score is: `(Base Chips + Card Chips + Joker Chips) × (Base Mult + Joker Mult)`

### Joker System

Jokers are special cards that modify your scoring:

- **Common Jokers** - Simple flat bonuses (+4 Mult, +20 Chips)
- **Uncommon Jokers** - Conditional bonuses (x3 Mult if Flush)
- **Rare Jokers** - Powerful combinations
- **Legendary Jokers** - Game-changing effects

Each Joker triggers at specific times:
- `onScore` - Applied when hand is played
- `onEndCalculation` - Applied after all scoring

**Max Joker Slots:** 5

### Blind Structure

Each Ante consists of 3 blinds:

1. **Small Blind** - Standard difficulty, modest score requirement
2. **Big Blind** - Higher score target, more money reward
3. **Boss Blind** - Special mechanics that twist the rules (future)

Score requirements scale with Ante level. Beat all 3 blinds to advance to the next Ante.

### Shop System

After beating each blind, you visit the shop:

- **3 Random Jokers** available for purchase
- Prices vary by rarity: Common ($5), Uncommon ($7), Rare ($10), Legendary ($15)
- **Reroll** - Refresh shop items for $5 (increases by $1 each reroll)
- **Sell Jokers** - Get back half their purchase price
- Money earned from blinds: Small ($3-4), Big ($5), Boss ($8)

## 🎮 Game State Management

The game uses a sophisticated Zustand store with persistence. See [`docs/STORE_ARCHITECTURE.md`](./docs/STORE_ARCHITECTURE.md) for complete documentation.

### Store Features

- **Phase Management** - MENU, PLAYING_HAND, SHOP, GAME_OVER
- **Run State** - Money, ante, current blind tracking
- **Combat State** - Hands remaining, discards, scores
- **Inventory** - Jokers and consumables
- **Deck Management** - Draw, discard, shuffle
- **Shop Management** - Item generation, purchases, rerolls
- **Auto-Persistence** - Saves to localStorage automatically

### Quick Example

```tsx
"use client";

import { useGameStore } from "@/store/gameStore";

export function GameComponent() {
  const money = useGameStore((state) => state.run.money);
  const addMoney = useGameStore((state) => state.addMoney);
  const jokers = useGameStore((state) => state.inventory.jokers);

  return (
    <div>
      <p>Money: ${money}</p>
      <p>Jokers: {jokers.length}/5</p>
      <button onClick={() => addMoney(5)}>Add $5</button>
    </div>
  );
}
```

### Testing the Store

1. **Development Mode** - Visit http://localhost:3000 to see the debug panel
2. **Debug View** - Go to `/game` for full debug controls
3. **React DevTools** - Install the extension to inspect Zustand state

## 🧪 Code Quality

### Testing

The project includes comprehensive test coverage:

```bash
# Tests are located in src/lib/__tests__/
- pokerEvaluator.test.ts    # Hand evaluation tests
- scoringEngine.test.ts     # Score calculation tests
- jokers.test.ts            # Joker mechanics tests
- blindConfig.test.ts       # Blind configuration tests
- integration.test.ts       # End-to-end scenarios
```

### Type Safety

- **100% TypeScript** - All code is strictly typed
- **2,900+ lines** of type-safe game logic
- Zero `any` types in production code
- Comprehensive interfaces in `src/types/game.ts`

## ✅ Deployment

- Compatible with Vercel or any Next.js 16 runtime. Run `pnpm build` then serve via `pnpm start` or your platform’s adapter.

## 🚀 Deployment

The application is production-ready and can be deployed to any platform that supports Next.js 16:

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Manual Build

```bash
pnpm install
pnpm build
pnpm start
```

The production server runs on port 3000 by default.

## 📚 Documentation

- **[Store Architecture](./docs/STORE_ARCHITECTURE.md)** - Complete guide to game state management
- **[Poker Evaluator](./docs/POKER_EVALUATOR.md)** - Hand evaluation system documentation
- **[Deck Utilities](./docs/DECK_UTILITIES.md)** - Deck creation and shuffling guide

## 🎨 Design Decisions

### Why Zustand?

- **Lightweight** - 1.2kB gzipped, no Provider boilerplate
- **DevTools** - Built-in integration with Redux DevTools
- **Simple API** - Easier than Redux for game state
- **Performance** - No unnecessary re-renders

### Why Next.js 16 App Router?

- **React 19 Support** - Latest React features out of the box
- **Turbopack** - Fast development server ([official announcement](https://nextjs.org/blog/next-16))
- **Built-in Optimization** - Automatic code splitting, image optimization
- **Server Components** - For static pages (landing page)

### Why CSS Modules?

- **Scoped Styles** - No naming conflicts
- **Type Safety** - Import styles as typed objects
- **Zero Runtime** - Styles compile to plain CSS
- **Simple** - No additional dependencies

### Fisher-Yates Shuffle

We use the [Fisher-Yates algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) for deck shuffling because:
- **Uniform Distribution** - Every permutation equally likely
- **Efficient** - O(n) time, O(1) space
- **Industry Standard** - Proven and well-tested

## 🤝 Contributing

This is a learning project and demonstration of modern web development practices. Feel free to:

- Report bugs via GitHub issues
- Suggest features or improvements
- Fork and experiment with your own variant

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Balatro** - Original game by LocalThunk that inspired this project
- **Next.js Team** - For the amazing framework
- **Zustand Team** - For the elegant state management library
- **Framer** - For the smooth animation library

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

**Built with ❤️ using Next.js 16, React 19, and TypeScript**

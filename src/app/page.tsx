import styles from "./page.module.css";
import Link from "next/link";

type Feature = {
  title: string;
  text: string;
  tag: string;
  stat?: string;
};

type Archetype = {
  name: string;
  chips: string;
  modifier: string;
  edge: string;
};

type RunLog = {
  title: string;
  detail: string;
  reward: string;
};

const features: Feature[] = [
  {
    title: "Procedural decks",
    text: "Draft from 500+ cards and jokers, fuse synergies, and bend probability in your favor.",
    tag: "Roguelite core",
    stat: "500+",
  },
  {
    title: "Momentum multiplier",
    text: "Every hand stacks chips and multipliers. Keep the run alive with risky discards and redraws.",
    tag: "Score flow",
    stat: "x64",
  },
  {
    title: "Boss blinds",
    text: "Iconic bosses twist the rules: locked suits, burning jokers, shrinking hands—adapt or bust.",
    tag: "Pressure",
  },
  {
    title: "Meta progression",
    text: "Unlock decks, trinkets, and seeds. Each run alters the odds for the next shuffle.",
    tag: "Persistence",
    stat: "8 decks",
  },
];

const archetypes: Archetype[] = [
  {
    name: "Orbiting Stars",
    chips: "+320 chips",
    modifier: "x6.5 mult",
    edge: "Chain straights with cosmic jokers.",
  },
  {
    name: "Grifters",
    chips: "+140 chips",
    modifier: "x9 mult",
    edge: "Discard to grow interest—profit every shuffle.",
  },
  {
    name: "Wild Bloom",
    chips: "+260 chips",
    modifier: "x4 mult",
    edge: "Wild suits, blooming flushes, safe risk ceiling.",
  },
  {
    name: "Rust & Ruin",
    chips: "+90 chips",
    modifier: "x12 mult",
    edge: "Corrupted jokers with glass-cannon payout.",
  },
];

const runLog: RunLog[] = [
  {
    title: "Flipped the Eclipse Blind",
    detail: "Clutched with a five-card flush after burning the final discard.",
    reward: "+2 Spectral Packs",
  },
  {
    title: "Joker Fusion",
    detail: "Merged Double Down + Vagrant for compounding multipliers.",
    reward: "+x3 carry",
  },
  {
    title: "Debt Paid in Full",
    detail: "Bought out the backroom shop, unlocked the Obsidian Deck.",
    reward: "New start bonus",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <main className={styles.main}>
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.kicker}>Balatro-inspired roguelite</p>
            <h1>Stack the deck. Break the game.</h1>
            <p className={styles.lede}>
              Draft chaotic jokers, chase impossible multipliers, and dance around ruthless blinds.
              Every shuffle is a bet against the house.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/play">
                Play Real Game
              </Link>
              <Link className={styles.secondary} href="/game">
                Debug Mode
              </Link>
            </div>
            <div className={styles.heroStats}>
              <span>
                <strong>Rogue runs</strong>
                <em>15–20 min loops</em>
              </span>
              <span>
                <strong>Boss blinds</strong>
                <em>Remix the rules</em>
              </span>
              <span>
                <strong>Endless seeds</strong>
                <em>Shareable chaos</em>
              </span>
            </div>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardLabel}>Current hand</p>
                <h2>Stellar Flush</h2>
              </div>
              <span className={styles.badge}>x12.5</span>
            </div>
            <div className={styles.cardRow}>
              <div className={styles.cardPip}>A♠</div>
              <div className={styles.cardPip}>K♠</div>
              <div className={styles.cardPip}>Q♠</div>
              <div className={styles.cardPip}>J♠</div>
              <div className={styles.cardPip}>10♠</div>
            </div>
            <div className={styles.cardMeta}>
              <span>Chips: 1,240</span>
              <span>Multiplier: x12.5</span>
              <span>Bonus: +2 redraws</span>
            </div>
            <div className={styles.cardFooter}>
              <p>Joker combo online — discard once to double chips.</p>
              <button className={styles.ghostButton} type="button">
                Peek deck
              </button>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>What makes a run sing</p>
              <h3>Neon-lit systems tuned for momentum</h3>
            </div>
            <p className={styles.sectionNote}>
              Built to feel like Balatro: tactile chips, greedy multipliers, and bosses that rewrite
              your plan mid-hand.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <div className={styles.featureTag}>{feature.tag}</div>
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
                {feature.stat ? <span className={styles.featureStat}>{feature.stat}</span> : null}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Deck paths</p>
              <h3>Archetypes to gamble with</h3>
            </div>
            <p className={styles.sectionNote}>
              Each deck bends probability. Pair them with jokers to discover busted lines.
            </p>
          </div>
          <div className={styles.archetypeGrid}>
            {archetypes.map((deck) => (
              <article key={deck.name} className={styles.archetypeCard}>
                <div className={styles.archetypeTop}>
                  <h4>{deck.name}</h4>
                  <span className={styles.badge}>{deck.modifier}</span>
                </div>
                <p className={styles.archetypeEdge}>{deck.edge}</p>
                <div className={styles.archetypeMeta}>
                  <span>{deck.chips}</span>
                  <span>{deck.modifier}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Run log</p>
              <h3>Moments worth replaying</h3>
            </div>
            <p className={styles.sectionNote}>
              Break the seed, share it with friends, and race for the highest chip stack.
            </p>
          </div>
          <div className={styles.logList}>
            {runLog.map((entry) => (
              <article key={entry.title} className={styles.logCard}>
                <div>
                  <h4>{entry.title}</h4>
                  <p>{entry.detail}</p>
                </div>
                <span className={styles.featureStat}>{entry.reward}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

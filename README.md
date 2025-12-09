# Balatro-like Landing

> **Status:** Verified with Next.js 16.0.8 on 2025-12-09. Built for the App Router and React 19.2.1. \
> **Documentation source:** [Next.js installation (Node >= 20.9)](https://nextjs.org/docs/app/getting-started/installation#system-requirements)

## 🚀 Why this exists

- Showcase a Balatro-inspired roguelite landing with neon cards, archetype highlights, and run logs.
- Single-page marketing surface living in `src/app/page.tsx`, styled via CSS modules for easy iteration.

## 📦 Stack decisions

- **Next.js 16.0.8 (App Router)** — modern routing, React 19 support, Turbopack dev server; requires Node >= 20.9 per docs.
- **React 19.2.1** — concurrent-ready features ship with App Router.
- **CSS Modules** — scoped styling in `src/app/page.module.css` to keep the neon theme isolated.
- **pnpm** — chosen package manager (tracked via `pnpm-lock.yaml`) for fast, content-addressable installs.

## 🛠 Prerequisites

- Node.js >= 20.9 ([Next.js system requirements](https://nextjs.org/docs/app/getting-started/installation#system-requirements)).
- pnpm >= 8 (use `corepack enable` if needed).

## ⚡ Quick start

```bash
pnpm install
pnpm dev
```

- Dev server: http://localhost:3000
- Production build: `pnpm build`
- Preview prod: `pnpm start` (after build)
- Lint: `pnpm lint`

## 🧭 Project layout

- `src/app/page.tsx` — Balatro landing composition (hero, features, archetypes, run log).
- `src/app/page.module.css` — neon card-table aesthetic and responsive grid.
- `src/app/layout.tsx` — root layout and metadata.
- `src/app/globals.css` — base resets and typography.

## 🎮 Usage

Key sections of the landing page:

```tsx
// Hero CTA + stats
<header className={styles.hero}>
  <div className={styles.heroText}>
    <h1>Stack the deck. Break the game.</h1>
    <div className={styles.actions}>
      <a className={styles.primary} href="#">
        Play the demo
      </a>
      <a className={styles.secondary} href="#">
        Watch a run
      </a>
    </div>
  </div>
  <div className={styles.heroCard}>...card preview...</div>
</header>;

// Feature tiles
{
  features.map((feature) => (
    <article key={feature.title} className={styles.featureCard}>
      <div className={styles.featureTag}>{feature.tag}</div>
      <h4>{feature.title}</h4>
      <p>{feature.text}</p>
    </article>
  ));
}
```

CTA links currently point to `#`; swap in real demo/video URLs when ready.

## ✅ Deployment

- Compatible with Vercel or any Next.js 16 runtime. Run `pnpm build` then serve via `pnpm start` or your platform’s adapter.

## 📚 References

- [Next.js 16 system requirements](https://nextjs.org/docs/app/getting-started/installation#system-requirements)
- [Next.js App Router docs](https://nextjs.org/docs/app)

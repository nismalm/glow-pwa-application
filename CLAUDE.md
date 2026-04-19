# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Glow** is a personal daily progress tracker PWA (React 18 + TypeScript + Vite + Tailwind). The original design reference is `glow-prototype.html` — a single-file HTML mockup. The production app is being built phase-by-phase per `PLAN.md`.

**Current phase:** Phase 2 (Dashboard screen) complete.

## Architecture

### Stack
- **React 18 + TypeScript** — strict mode
- **Vite** — build tool, PWA via `vite-plugin-pwa`
- **Tailwind CSS v3** — all design tokens in `tailwind.config.ts`
- **React Router v6** — tab-based navigation: `/`, `/water`, `/exercise`, `/myspace`
- **Zustand** — global state stores, one per domain
- **Recharts** — charts (replaces Chart.js from prototype)
- **date-fns** — date formatting and arithmetic
- **lucide-react** — tab bar icons

### Screens
| Route | Screen | Status |
|---|---|---|
| `/` | Dashboard | Phase 2 ✅ |
| `/water` | Water tracker | Phase 3 |
| `/exercise` | Exercise log | Phase 4 |
| `/myspace` | Rituals + calendar | Phase 5 |

---

## Mock Data Architecture (Phases 1–5)

> **Rule: no hardcoded values inside components.** All data — counts, names, labels, quotes, week history — must come from one of the sources below.

### Where data lives

| Source | Path | Used for |
|---|---|---|
| Type contracts | `src/types/models.ts` | `DailyLog`, `Streak`, `UserProfile`, `WeekDay`, etc. |
| Today's log mock | `src/mocks/todayLog.ts` | Water glasses, exercise, rituals, mood |
| Week history mock | `src/mocks/weekLogs.ts` | Chart data (last 7 days) |
| User profile mock | `src/mocks/user.ts` | Display name, avatar initial, water goal |
| Quotes | `src/mocks/quotes.ts` | Daily quote rotated by day-of-year |
| Zustand stores | `src/stores/use*Store.ts` | Runtime-mutable state that components read |

### Stores (Phase 2–5)
Each store is initialized from the matching mock and exposes typed actions:

| Store | Source mock | Key state |
|---|---|---|
| `useWaterStore` | `mockTodayLog.water` | `glasses`, `goal` |
| `useExerciseStore` | `mockTodayLog.exercise` | `didWorkout`, `durationMin`, `intensity` |
| `useRitualsStore` | `mockTodayLog.rituals` | `rituals` (Record), `completedCount()` |
| `useStreakStore` | inline mock streak | `count`, `best` |

### Phase 6 swap pattern
Every store file has a `// Phase 6:` comment explaining the one-line Firestore swap. The component import path never changes — only the store's internal source.

```
// Before (Phase 2–5)
glasses: mockTodayLog.water.glasses,

// After (Phase 6)
glasses: useDailyLog(today).log.water.glasses,
```

---

## Design Tokens

All tokens from the prototype CSS variables are mapped to Tailwind in `tailwind.config.ts`. Use Tailwind classes (`text-ink`, `bg-card`, `text-ok`, etc.) — avoid raw hex values in JSX except for inline radial/linear gradients that Tailwind can't express.

| Token | Class |
|---|---|
| `--bg` | `bg-bg` |
| `--card` | `bg-card` |
| `--ink` | `text-ink` |
| `--ink-soft` | `text-ink-soft` |
| `--ink-mute` | `text-ink-mute` |
| `--accent` | `bg-accent` / `text-accent` |
| `--water` | `bg-water` |
| `--coral` | `bg-coral` |
| `--lilac` | `bg-lilac` |
| `--ok` | `text-ok` |
| `--shadow` | `shadow-card` |

---

## Development Notes

- `glow-prototype.html` is the **design reference only** — it is not built upon. Treat it as a Figma file in HTML form.
- The prototype's phone frame and fake status bar are **not** reproduced in the app. The app is a proper responsive PWA.
- Body SVG path data for the Water screen must be copied verbatim from the prototype (Phase 3).
- Week strips use realistic mock data — `Math.random()` from the prototype is replaced by `mockWeekLogs`.
- Charts are Recharts `BarChart` / `AreaChart`, not Chart.js.
- Path alias `@/` resolves to `src/`.

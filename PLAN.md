# Glow — Production Implementation Plan

> A phased roadmap to turn the `glow-prototype.html` single-file prototype into a production-grade, installable **iOS PWA** built with **React 18 + TypeScript + Vite**, backed by **Firebase**, and deployed to **Vercel**.
>
> Each phase is **self-contained** — you can run "implement Phase N" and receive a complete, working deliverable without needing later phases.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Final Folder Structure](#final-folder-structure)
3. [Design Token Mapping](#design-token-mapping)
4. [Firestore Schema](#firestore-schema)
5. [Phase 1 — Project Scaffold & Design System](#phase-1--project-scaffold--design-system)
6. [Phase 2 — Dashboard Screen](#phase-2--dashboard-screen)
7. [Phase 3 — Water Screen](#phase-3--water-screen)
8. [Phase 4 — Exercise Screen](#phase-4--exercise-screen)
9. [Phase 5 — My Space Screen](#phase-5--my-space-screen)
10. [Phase 6 — Firebase Integration](#phase-6--firebase-integration)
11. [Phase 7 — Push Notifications & PWA Polish](#phase-7--push-notifications--pwa-polish)
12. [Phase 8 — Production Polish & Vercel Deploy](#phase-8--production-polish--vercel-deploy)
13. [Vercel Deployment Checklist](#vercel-deployment-checklist)
14. [Firebase Security Rules](#firebase-security-rules)

---

## Tech Stack Overview

| Layer | Choice | Reason |
|---|---|---|
| Framework | **React 18** + **TypeScript** (strict) | Industry standard, type safety |
| Build tool | **Vite 5** | Fast HMR, tiny prod builds, first-class PWA plugin |
| Routing | **React Router v6** | Tab-based nav with URL persistence |
| Styling | **Tailwind CSS v3** | Utility-first, maps cleanly to prototype's CSS variables |
| UI primitives | **shadcn/ui** | Copy-in components (Dialog, Slider, Switch, Toggle) |
| Charts | **Recharts 2** | React-native, composable — replaces Chart.js |
| State | **Zustand** | Minimal, no boilerplate global store |
| Forms | **React Hook Form** + **Zod** | Typed schema validation |
| Dates | **date-fns** | Tree-shakable calendar/date helpers |
| Animation | **Framer Motion** | Tab transitions, confetti, spring physics |
| Backend | **Firebase** (Auth, Firestore, FCM, App Check) | Zero-ops, offline persistence, push |
| PWA | **vite-plugin-pwa** + Workbox | Service worker, offline, installable |
| Hosting | **Vercel** | Preview deploys, edge, SPA rewrites |
| Icons | **lucide-react** | Clean line icons for tab bar / actions |

---

## Final Folder Structure

```
progress-tracker/
├── public/
│   ├── icons/                    # 192, 512, maskable, apple-touch (all sizes)
│   ├── splash/                   # iOS splash screens (all device sizes)
│   ├── firebase-messaging-sw.js  # FCM background handler
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   ├── vite-env.d.ts
│   │
│   ├── app/
│   │   ├── TabBar.tsx
│   │   └── ScreenTransition.tsx
│   │
│   ├── screens/
│   │   ├── Dashboard/
│   │   │   ├── index.tsx
│   │   │   ├── Greeting.tsx
│   │   │   ├── QuoteCard.tsx
│   │   │   ├── StatGrid.tsx
│   │   │   ├── WeeklyChart.tsx
│   │   │   ├── ProgressRings.tsx
│   │   │   └── CtaBanner.tsx
│   │   ├── Water/
│   │   │   ├── index.tsx
│   │   │   ├── WeekStrip.tsx
│   │   │   ├── WaterHero.tsx
│   │   │   ├── BodyFigure.tsx
│   │   │   ├── GlassGrid.tsx
│   │   │   └── Confetti.tsx
│   │   ├── Exercise/
│   │   │   ├── index.tsx
│   │   │   ├── WorkoutForm.tsx
│   │   │   ├── TypeChips.tsx
│   │   │   ├── DurationSlider.tsx
│   │   │   ├── IntensityPicker.tsx
│   │   │   └── ExerciseChart.tsx
│   │   └── MySpace/
│   │       ├── index.tsx
│   │       ├── RitualsHeader.tsx
│   │       ├── RitualsList.tsx
│   │       ├── Calendar.tsx
│   │       ├── TaskList.tsx
│   │       └── MoodChart.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn primitives
│   │   ├── WeekStrip.tsx         # shared across Water/Exercise
│   │   ├── Card.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── stores/
│   │   ├── useAuthStore.ts
│   │   ├── useWaterStore.ts
│   │   ├── useExerciseStore.ts
│   │   ├── useRitualsStore.ts
│   │   └── useStreakStore.ts
│   │
│   ├── lib/
│   │   ├── firebase.ts           # app init
│   │   ├── firestore.ts          # typed converters
│   │   ├── auth.ts
│   │   ├── messaging.ts          # FCM token + listeners
│   │   ├── dates.ts              # today key, week range helpers
│   │   └── cn.ts                 # classnames util
│   │
│   ├── hooks/
│   │   ├── useDailyLog.ts
│   │   ├── useWeekData.ts
│   │   ├── useHaptic.ts
│   │   └── useInstallPrompt.ts
│   │
│   ├── types/
│   │   └── models.ts             # DailyLog, User, Streak zod schemas
│   │
│   └── styles/
│       └── globals.css           # tailwind layers + CSS vars
│
├── .env.local                    # Firebase keys (gitignored)
├── .env.example
├── firebase.json                 # rules + indexes deploy
├── firestore.rules
├── firestore.indexes.json
├── vercel.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Design Token Mapping

Prototype CSS variable → Tailwind config key → Usage example

| Prototype `:root` var | Tailwind token | Example class |
|---|---|---|
| `--bg #f5f3ef` | `colors.bg` | `bg-bg` |
| `--card #ffffff` | `colors.card` | `bg-card` |
| `--ink #1a1a1a` | `colors.ink.DEFAULT` | `text-ink` |
| `--ink-soft #6b6b6b` | `colors.ink.soft` | `text-ink-soft` |
| `--ink-mute #a0a0a0` | `colors.ink.mute` | `text-ink-mute` |
| `--line #ececec` | `colors.line` | `border-line` |
| `--accent #cdde3f` | `colors.accent.DEFAULT` | `bg-accent` |
| `--accent-deep #a8b92f` | `colors.accent.deep` | `bg-accent-deep` |
| `--coral #ff7a6b` | `colors.coral` | `bg-coral` |
| `--lilac #b8a4ff` | `colors.lilac` | `bg-lilac` |
| `--sky #5ec8ff` | `colors.sky` | `bg-sky` |
| `--water #2aa7ff` | `colors.water.DEFAULT` | `bg-water` |
| `--water-2 #1989e8` | `colors.water.deep` | `bg-water-deep` |
| `--ok #3ec97a` | `colors.ok` | `text-ok` |
| `--amber #ffb347` | `colors.amber` | `bg-amber` |
| `--shadow` | `boxShadow.card` | `shadow-card` |

Typography: single family **Inter** (400/500/600/700/800/900). Add `fontFamily.sans: ['Inter', ...system]`.

Runtime-mutable token: when daily water goal is exceeded, swap `--water` to `--accent` via a CSS custom property on the `.water-screen` root (keeps Tailwind static, lets animation use `bg-[var(--water)]`).

---

## Firestore Schema

```
users/{uid}
  ├── displayName: string
  ├── photoURL: string | null
  ├── email: string | null
  ├── createdAt: Timestamp
  ├── timezone: string                  # IANA tz, e.g. "Asia/Kolkata"
  ├── waterGoal: number (default 10)
  ├── fcmTokens: string[]
  └── preferences: { reminders: bool, theme: 'light'|'dark' }

users/{uid}/dailyLogs/{yyyy-MM-dd}
  ├── date: string (yyyy-MM-dd)         # redundant for queries
  ├── water: { glasses: number, goal: number, completedAt?: Timestamp }
  ├── exercise: {
  │     didWorkout: boolean,
  │     types: string[],                # ['walk','yoga',...]
  │     durationMin: number,
  │     intensity: 1|2|3|4|5,
  │     notes: string
  │   } | null
  ├── rituals: { [ritualId: string]: boolean }   # 6 keys, true if done
  ├── mood: 1..5 | null
  └── updatedAt: Timestamp

users/{uid}/streaks/current
  ├── count: number
  ├── lastCompletedDate: string (yyyy-MM-dd)
  └── best: number

users/{uid}/tasks/{taskId}              # phase 5 reminders
  ├── title: string
  ├── dueAt: Timestamp
  ├── color: 'coral'|'lilac'|'sky'|'accent'
  ├── repeat: 'none'|'daily'|'weekly'
  └── done: boolean
```

Queries:
- Week chart: `dailyLogs where date >= weekStart && date <= weekEnd orderBy date asc` (single composite index on `date`).
- Calendar dots: `dailyLogs` for current month range.

---

## Phase 1 — Project Scaffold & Design System

**Goal:** A deployable empty shell that renders the iPhone phone frame, 4 empty tabs, status bar, and ships as an installable PWA with all design tokens wired.

### Deliverables
- [x] `npm create vite@latest` with `react-ts` template, React 18.
- [x] `tsconfig.json` with `"strict": true`, path alias `@/* → src/*`.
- [x] Tailwind v3 installed; `tailwind.config.ts` mirrors every token from the [mapping table](#design-token-mapping).
- [x] Inter font loaded via `@fontsource/inter` (not CDN — offline-friendly).
- [x] `TabBar` component: 4 tabs with `lucide-react` icons (Home, Droplet, Dumbbell, Sparkles), glassmorphic (`backdrop-blur-xl bg-white/80`), safe-area padding, fixed to bottom.
- [x] React Router v6 with routes `/`, `/water`, `/exercise`, `/myspace`. `NavLink` active state drives accent pill.
- [x] Empty `Screen` placeholders rendered per route.
- [x] `vite-plugin-pwa` installed and configured with `registerType: 'autoUpdate'`, basic manifest.
- [x] iOS meta tags in `index.html` (`apple-mobile-web-app-capable`, `viewport-fit=cover`, `theme-color`).
- [x] `vercel.json` with SPA rewrite and SW/FCM cache headers.
- [x] `.env.example` with `VITE_FIREBASE_*` placeholders; `src/lib/firebase.ts` stub reads `import.meta.env`.

### Files to create
`vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/router.tsx`, `src/styles/globals.css`, `src/app/TabBar.tsx`, `src/lib/firebase.ts`, `vercel.json`, `.env.example`.

### Key decisions
- **No phone frame.** The app is a proper responsive web app — mobile-first, `max-w-md` centered on desktop, full-width on phones. The prototype's phone chrome was a design mockup only.
- **No fake StatusBar.** The browser/OS renders the real status bar. The app uses `env(safe-area-inset-*)` for notch-aware padding.
- **No `localStorage` in Phase 1.** All state lives in Zustand; persistence arrives in Phase 6 via Firestore offline cache.
- **Router over conditional rendering** so deep links work (`/water` installs as a shareable state).

---

## Phase 2 — Dashboard Screen

**Goal:** Pixel-match the prototype's Dashboard. All data from mocks/stores — no hardcoded values in components. No Firebase yet.

### Mock data rule (applies to ALL phases)
> **Never write literal values inside components.** Every number, name, label, and quote must come from `src/mocks/` or a Zustand store in `src/stores/`. This keeps Phase 6 a clean swap: stores swap their `mockTodayLog` source for a `useDailyLog()` Firestore hook, component code is untouched.

Data sources:
- `src/types/models.ts` — `DailyLog`, `Streak`, `UserProfile`, `WeekDay` interfaces
- `src/mocks/todayLog.ts` — today's water/exercise/rituals/mood
- `src/mocks/weekLogs.ts` — last 7 days of chart data (computed from today with `date-fns`)
- `src/mocks/user.ts` — display name, avatar initial, water goal
- `src/mocks/quotes.ts` — 30-entry quotes array, rotated by day-of-year
- `src/stores/useWaterStore.ts` — `{ glasses, goal }` + actions
- `src/stores/useExerciseStore.ts` — `{ didWorkout, durationMin, intensity, ... }` + `setLog()`
- `src/stores/useRitualsStore.ts` — `{ rituals, toggle(), completedCount() }`
- `src/stores/useStreakStore.ts` — `{ count, best, lastCompletedDate, increment() }`

### Deliverables
- [x] `Greeting`: time-based ("Good morning/afternoon/evening") + user name from `mockUser.displayName` + live date string. Avatar from `mockUser.avatarInitial`.
- [x] `QuoteCard`: dark gradient with decorative accent bubble; quote picked from `getDailyQuote()` (30-entry array, day-of-year rotation).
- [x] `StatGrid`: 2×2 grid, each stat card reads from Zustand store — Water `glasses/goal`, Movement `durationMin`, My Space `ritualsCompleted/6`, Streak `count`. Trend copy is derived, not hardcoded.
- [x] `WeeklyChart` (Recharts `BarChart`): three bars per day (`water`, `exerciseMin`, `ritualsCompleted`) from `mockWeekLogs`. Day labels are real last-7-day dates via `date-fns`. Custom legend.
- [x] `ProgressRings`: 4 SVG rings computing pct from store values — waterPct, exercisePct (vs 30 min goal), ritualsPct, overallPct (average). Stroke-dasharray = `(pct/100) × 94.25`.
- [x] `CtaBanner`: accent gradient; heading + subtext derived from `glassesLeft` and `streak`; "Open" button navigates to `/water`; shows completion state when goal hit.
- [x] Types in `src/types/models.ts`.

### Files created
`src/types/models.ts`, `src/mocks/user.ts`, `src/mocks/quotes.ts`, `src/mocks/todayLog.ts`, `src/mocks/weekLogs.ts`, `src/stores/useWaterStore.ts`, `src/stores/useExerciseStore.ts`, `src/stores/useRitualsStore.ts`, `src/stores/useStreakStore.ts`, `src/screens/Dashboard/index.tsx`.

### Key decisions
- **Recharts over Chart.js**: `BarChart` with `radius={[4,4,0,0]}` on each `Bar`, no y-axis lines, responsive container.
- **Rings via SVG stroke-dasharray**: circumference = 2π×15 = 94.25; `strokeDasharray="${dash} ${CIRC}"` where `dash = (pct/100) × CIRC`.
- **No Framer Motion on rings yet** — animation deferred to Phase 8 polish pass.
- **Week x-axis labels** use `format(date, 'EEE')` so they reflect the actual calendar days, not hard-coded Mon–Sun.

---

## Phase 3 — Water Screen

**Goal:** Full water tracker — tap to add/remove a glass, body fills with water, confetti at 10, overflow celebration.

### Deliverables
- [ ] `WeekStrip` (shared): 7 days centered on today; past days show `done` dot (mocked); today has accent ring.
- [ ] `WaterHero` card:
  - Big percentage ("40%") animated with Framer Motion `animate={{scale:[1,1.08,1]}}` on change.
  - `BodyFigure`: SVG human silhouette ported **verbatim** from prototype; water fill via `<clipPath>` + a `<rect>` whose `y` attribute animates from 100% (bottom) to 0% (top) as glasses increase.
  - Vertical slider track (right side) with draggable knob; dragging sets glasses.
  - `GlassGrid`: 10 glass icons in 5×2; filled state toggles on click.
- [ ] Motivational copy with 5 states by glass count:
  - `0` — "Let's hydrate ✨"
  - `1–4` — "Keep sipping 💧"
  - `5–9` — "Over halfway — you got this"
  - `=10` — "Goal hit! 🎉"
  - `>10` — "Overflow mode 🌊"
- [ ] `Badge` chip reflects state and recolors.
- [ ] `+Add` / `−Remove` buttons with haptic (`navigator.vibrate(10)`).
- [ ] `Confetti` on hitting 10: 30 `motion.span` particles with randomized `x`, `y`, `rotate`, `opacity` keyframes; unmount after 1.6s.
- [ ] Daily goal card with streak chip.
- [ ] When `glasses > 10`, flip `--water` CSS var on hero root to `var(--accent)`.
- [ ] State in `useWaterStore` (Zustand): `{ glasses, goal, increment(), decrement(), setGlasses(n) }`.

### Files
`src/screens/Water/*`, `src/stores/useWaterStore.ts`, `src/components/WeekStrip.tsx`, `src/hooks/useHaptic.ts`.

### Key decisions
- **Body SVG:** copy the exact path data from `glow-prototype.html` — don't redraw. The clip-path fill is the only thing that needs re-wiring.
- **Slider:** use `@radix-ui/react-slider` (already shipped with shadcn) rotated 90°, not a custom drag — keyboard-accessible for free.
- **Confetti:** avoid libraries — 30 hand-rolled `motion.span`s stay under 2KB gzipped.

---

## Phase 4 — Exercise Screen

**Goal:** Workout logging form with validation + weekly line chart.

### Deliverables
- [ ] `WeekStrip` reused.
- [ ] `WorkoutForm` (React Hook Form + Zod):
  ```ts
  const schema = z.object({
    didWorkout: z.boolean(),
    types: z.array(z.enum(['walk','yoga','strength','run','dance','cycle'])).min(1).optional(),
    durationMin: z.number().min(5).max(180),
    intensity: z.number().int().min(1).max(5),
    notes: z.string().max(280).optional(),
  }).refine(d => d.didWorkout ? d.types?.length : true, { path: ['types'] });
  ```
- [ ] Yes/Rest toggle (shadcn `ToggleGroup`). When "Rest", type/duration/intensity disabled + greyed.
- [ ] `TypeChips`: 6 emoji chips (🚶 🧘 💪 🏃 💃 🚴), multi-select, accent bg on selected.
- [ ] `DurationSlider`: custom-styled range. **Port the thumb CSS from prototype** (`::-webkit-slider-thumb` with accent bg, 28px, shadow).
- [ ] `IntensityPicker`: 5 emoji pills (😌 🙂 😤 🔥 🚀); single-select.
- [ ] `Notes` textarea, 280 char counter.
- [ ] Save button — disabled until valid; on submit, write to `useExerciseStore` (and Firestore in Phase 6).
- [ ] `ExerciseChart`: Recharts `AreaChart`, accent stroke, gradient fill (`linearGradient` from accent-70% to accent-0%), smooth monotone curve.

### Files
`src/screens/Exercise/*`, `src/stores/useExerciseStore.ts`, `src/types/models.ts`.

### Key decisions
- **Slider:** fall back to native `<input type="range">` wrapped in a styled label — radix slider doesn't support webkit thumb imagery as cleanly, and the prototype's custom thumb CSS is a signature element.
- **Form mode:** `mode: 'onChange'` so save button reactivity feels snappy.

---

## Phase 5 — My Space Screen

**Goal:** Rituals + calendar + tasks + mood chart.

### Deliverables
- [ ] `RitualsHeader`: dark-gradient card, "X of 6 done", animated progress bar (`motion.div` width %).
- [ ] `RitualsList`: 6 items with icons (Meditate, Read, Journal, Stretch, Gratitude, Walk). Tap toggles done; checkbox spring-animates a check path. Strike-through + 50% opacity on done.
- [ ] `Calendar` (built with `date-fns`):
  - Weekday header row (S M T W T F S).
  - Month grid 6 rows × 7 cols.
  - Prev/Next via `addMonths / subMonths`.
  - States: `today` (ink bg / bg-card text), `selected` (accent bg), `taskDot` (3px dot under number), `outOfMonth` (muted).
- [ ] `TaskList`: each task = colored dot + title + time + bell icon; tap opens day detail (modal stub — full edit in Phase 7).
- [ ] "Add reminder" CTA button (opens modal in Phase 7).
- [ ] `MoodChart`: Recharts area, lilac (`--lilac`) stroke + gradient fill.
- [ ] Store: `useRitualsStore` with `{ [date]: { [ritualId]: boolean } }` keyed by yyyy-MM-dd.

### Files
`src/screens/MySpace/*`, `src/stores/useRitualsStore.ts`.

### Key decisions
- **Calendar:** use `eachDayOfInterval({ start: startOfWeek(startOfMonth(m)), end: endOfWeek(endOfMonth(m)) })` for a stable 6-row grid.
- **Task dots on calendar** read from `tasks` store grouped by date — memoize with `useMemo`.

---

## Phase 6 — Firebase Integration

**Goal:** Replace all mocked data with real-time Firestore. Anonymous auth for demo + Google sign-in.

### Deliverables
- [ ] Firebase project created; config lives in `.env.local` (VITE_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, VAPID_KEY).
- [ ] `src/lib/firebase.ts`: `initializeApp`, export typed `db`, `auth`, `messaging`.
- [ ] `enableIndexedDbPersistence(db)` for offline cache.
- [ ] **App Check** with reCAPTCHA v3 in prod (debug token in dev).
- [ ] `useAuthStore`: `signInAnonymously`, `signInWithPopup(GoogleAuthProvider)`, `signOut`, `user: User|null`.
- [ ] Typed converters in `src/lib/firestore.ts`:
  ```ts
  export const dailyLogConverter: FirestoreDataConverter<DailyLog> = { ... }
  ```
- [ ] `useDailyLog(date)` hook: returns `{ log, update }`, subscribes via `onSnapshot`, debounces writes (500ms).
- [ ] `useWeekData(weekStart)` hook: `where('date','>=',...)` range query, feeds dashboard + charts.
- [ ] Replace all Zustand in-memory data with Firestore-backed state. Stores become thin wrappers over `useDailyLog`.
- [ ] **Streak logic** (client-side for v1):
  ```
  onLogCompleted(date):
    if lastCompletedDate == yesterday → count += 1
    else if lastCompletedDate == today → no-op
    else → count = 1
    best = max(best, count)
  ```
  Run in a Firestore `runTransaction` to avoid races.
- [ ] Seed script (`scripts/seed.ts`) populates 14 days of demo data for new users.
- [ ] `firestore.rules` (see [Security Rules](#firebase-security-rules)).
- [ ] `firestore.indexes.json` with composite index on `dailyLogs(date ASC)`.

### Files
`src/lib/firebase.ts`, `src/lib/firestore.ts`, `src/lib/auth.ts`, `src/stores/useAuthStore.ts`, `src/hooks/useDailyLog.ts`, `src/hooks/useWeekData.ts`, `firestore.rules`, `firestore.indexes.json`, `firebase.json`, `scripts/seed.ts`.

### Key decisions
- **Document key by date string, not push ID** — upserts are trivial, range queries fast.
- **Streaks on client** first; migrate to a Cloud Function trigger (`onWrite dailyLogs/{date}`) only when we need cross-device atomicity.
- **Offline-first:** Firestore persistence handles writes while offline; UI writes optimistically via Zustand local state that resolves on snapshot echo.

---

## Phase 7 — Push Notifications & PWA Polish

**Goal:** Installable on iOS 16.4+ with working push reminders.

### Deliverables
- [ ] `public/firebase-messaging-sw.js`:
  ```js
  importScripts('https://www.gstatic.com/firebasejs/10/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10/firebase-messaging-compat.js');
  firebase.initializeApp({ /* config */ });
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(payload => { ... });
  ```
- [ ] `src/lib/messaging.ts`: `getToken(messaging, { vapidKey })` → save to `users/{uid}.fcmTokens` (arrayUnion).
- [ ] Permission request flow: soft prompt modal ("Get gentle nudges?") → native `Notification.requestPermission()`.
- [ ] **iOS install detection**: check `window.matchMedia('(display-mode: standalone)')` + `navigator.standalone`. If iOS + not installed, show "Add to Home Screen" bottom-sheet with share icon illustration.
- [ ] `vite-plugin-pwa` `manifest` filled out:
  ```ts
  manifest: {
    name: 'Glow — Daily Progress',
    short_name: 'Glow',
    description: 'Your daily progress, beautifully.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f5f3ef',
    theme_color: '#f5f3ef',
    icons: [ /* 192, 512, maskable */ ],
  }
  ```
- [ ] iOS splash screens for every device (generated via `pwa-asset-generator`), linked in `index.html`:
  ```html
  <link rel="apple-touch-startup-image" media="..." href="/splash/...png">
  ```
  Cover: iPhone SE, 12/13 mini, 12/13/14/15, Plus, Pro Max.
- [ ] **Workbox strategies:**
  - App shell (HTML/JS/CSS) — `CacheFirst` with revision.
  - Google Fonts — `StaleWhileRevalidate`.
  - Firestore domains — **never cache** (`NetworkOnly`; Firestore handles its own offline).
  - Images — `CacheFirst`, 30-day expiry.
- [ ] Offline fallback page (`/offline`) with retry button.
- [ ] **Background Sync** for offline writes: queue Firestore writes via Workbox `BackgroundSyncPlugin` fallback — also relies on Firestore built-in queue.
- [ ] Reminder scheduler UI in MySpace (modal for add reminder) that writes to `users/{uid}/tasks` + triggers a Cloud Function to send FCM at `dueAt`.

### Files
`vite.config.ts` (PWA section), `src/lib/messaging.ts`, `public/firebase-messaging-sw.js`, `src/hooks/useInstallPrompt.ts`, `src/components/AddToHomeSheet.tsx`, `src/screens/Offline.tsx`, `functions/src/sendReminder.ts` (Cloud Function).

### Key decisions
- **iOS Push requires installed PWA.** The AddToHomeSheet gating is not optional — without it, permissions will silently fail on Safari.
- **VAPID key** goes in `.env.local` as `VITE_FIREBASE_VAPID_KEY`.
- **Do not cache Firestore requests in Workbox** — double-caching corrupts offline state.

---

## Phase 8 — Production Polish & Vercel Deploy

**Goal:** Ship. Lighthouse PWA ≥ 95, smooth transitions, safe areas, error handling, live URL.

### Deliverables
- [ ] **Route-level code splitting:** `const Dashboard = lazy(() => import('./screens/Dashboard'))`; wrap `<Routes>` in `<Suspense fallback={<ScreenSkeleton/>}>`.
- [ ] **Loading skeletons** for every screen (shimmer via Tailwind `animate-pulse`).
- [ ] **Error boundaries** at the screen level; friendly fallback + Sentry hook (optional).
- [ ] **Safe areas:**
  ```css
  .phone { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }
  .tab-bar { padding-bottom: calc(10px + env(safe-area-inset-bottom)); }
  ```
- [ ] **Haptics** on: tab change, glass add, ritual toggle, form submit — via `useHaptic()`.
- [ ] **Page transitions:** `AnimatePresence mode="wait"` around routes with `initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}`.
- [ ] **Lighthouse budget:** JS < 180KB gzipped initial route; preload Inter; images as AVIF/WebP.
- [ ] **Analytics:** Vercel Analytics (`@vercel/analytics/react`) + Web Vitals.
- [ ] **Vercel deploy:**
  - Link repo, set env vars (all `VITE_FIREBASE_*` + `VITE_FIREBASE_VAPID_KEY`).
  - Framework preset: Vite.
  - Production branch: `main`; Preview deploys on PRs.
  - Custom domain + auto HTTPS.
- [ ] **Firebase deploy:** `firebase deploy --only firestore:rules,firestore:indexes,functions`.
- [ ] **README** updated with live URL, screenshots, env setup, Firebase bootstrap.

### Files
`src/components/ErrorBoundary.tsx`, `src/components/Skeleton.tsx`, `src/app/ScreenTransition.tsx`, `vercel.json` (headers + rewrites), `README.md`.

---

## Vercel Deployment Checklist

- [ ] Repo pushed to GitHub.
- [ ] Vercel project created, linked to repo.
- [ ] Build command: `npm run build` (default) • Output: `dist`.
- [ ] Env vars added in Vercel dashboard (Production + Preview + Development):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_VAPID_KEY`
  - `VITE_FIREBASE_APPCHECK_SITE_KEY`
- [ ] `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/((?!firebase-messaging-sw.js|sw.js|manifest.webmanifest|icons/.*|splash/.*).*)", "destination": "/" }],
    "headers": [
      { "source": "/firebase-messaging-sw.js", "headers": [{ "key": "Service-Worker-Allowed", "value": "/" }, { "key": "Cache-Control", "value": "no-cache" }] },
      { "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
    ]
  }
  ```
- [ ] Custom domain added, DNS verified.
- [ ] Add authorized domains to Firebase Auth (Vercel prod + preview wildcard).
- [ ] App Check enforcement turned on in production only.

---

## Firebase Security Rules

`firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isOwner(uid) { return request.auth != null && request.auth.uid == uid; }

    match /users/{uid} {
      allow read, write: if isOwner(uid);

      match /dailyLogs/{date} {
        allow read, write: if isOwner(uid)
          && date.matches('^\\d{4}-\\d{2}-\\d{2}$');
      }
      match /streaks/{doc}  { allow read, write: if isOwner(uid); }
      match /tasks/{taskId} { allow read, write: if isOwner(uid); }
    }
  }
}
```

Rules to verify in the emulator before deploy:
- Anonymous user A cannot read user B's `dailyLogs`.
- Malformed date key (e.g. `2026-4-1`) is rejected.
- Unauthenticated read returns permission denied.

---

## Commands Cheat Sheet

```bash
# dev
npm run dev

# prod build
npm run build && npm run preview

# firebase
firebase emulators:start
firebase deploy --only firestore:rules,firestore:indexes

# vercel
vercel              # preview
vercel --prod       # production
```

---

**End of plan.** Invoke "implement phase N" to build any section in isolation.

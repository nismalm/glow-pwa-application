# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Glow** is a single-file HTML prototype of a personal daily progress tracker app with a mobile-first design styled to look like an iPhone app. It has no build system — open `glow-prototype.html` directly in a browser.

## Architecture

The entire app lives in `glow-prototype.html` — inline CSS, HTML, and JavaScript with no external dependencies except:
- Google Fonts (Inter) via CDN
- Chart.js 4.4.0 via CDN

### Screen / Tab System

Four screens managed by CSS `.active` class toggling via `switchTab(name)`:
- `dashboard` — overview with stat grid, weekly chart, progress rings, CTA banner
- `water` — glass-by-glass hydration tracker with SVG body fill animation
- `exercise` — workout form (type chips, duration slider, intensity picker) + line chart
- `myspace` — daily rituals checklist + month calendar + mood chart

Tab navigation uses `data-tab` / `data-screen` attributes matched in `switchTab()`.

### State

All state is in-memory JS variables (no localStorage, no backend). Water tracker uses `glasses` (int) and `goal` (const 10). Charts are lazy-initialized and cached in `weeklyChart`, `exerciseChart`, `moodChart` to avoid re-rendering on tab switch.

### CSS Design Tokens

All colors and shadows are CSS custom properties on `:root` (e.g. `--accent`, `--bg`, `--ink`, `--card`). The water color token (`--water`) is dynamically updated via JS when the goal is exceeded.

### Key JS Functions

- `switchTab(name)` — show/hide screens and trigger lazy chart init
- `changeGlasses(delta)` — update water count, re-render figure fill + slider
- `renderWeek(el)` — build 7-day strip centered on today
- `renderCal()` — full month calendar grid with today/task dot/selected states
- `confettiBurst()` — 30-particle confetti animation on goal completion

## Development Notes

- The phone frame (`.phone`) renders at 390×844px on desktop; on screens ≤430px wide it goes full-viewport.
- Week strips use `Math.random()` for past-day "done" state — replace with real data when wiring to a backend.
- The comment `Data auto-saves to Firestore · Reminders via FCM` in the water screen indicates planned Firebase integration.
- Charts are lazily initialized only when their tab first becomes active.

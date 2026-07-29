# Development Plan

This document captures Queener's product direction, platform direction, and implementation priorities. Use [checklist.md](./checklist.md) for concrete follow-up tasks, and use [architecture.md](./architecture.md) for current architecture boundaries and the next repository target.

## Planning Principles

- keep the core game loop playable and polished before expanding scope
- preserve a clear boundary between the UI layer and the game engine
- favor reusable game logic over one-off UI-coupled implementations
- add infrastructure when product needs become concrete, not only because it might be useful later
- keep implementation checklists focused on unfinished work instead of using them as changelogs
- choose tools that match Queener's product needs and current project constraints

## Implemented Baseline

The current product baseline includes the playable single-player loop, hearts, run timing, configurable keyboard input, player naming, settings, Reka-based non-board controls, asset preloading, sound and replay settings, per-run puzzle variants, declarative puzzle data, board skins, queen skins, board textures, compressed result replay, scoring helpers, and the current soft visual direction.

The local game record domain type, IndexedDB repository, Pinia store, and leaderboard projection helpers are implemented. Saving a record from the win flow and presenting a leaderboard are still unfinished.

## Product Direction

The immediate goal is to make the single-player experience feel complete and polished from level selection through win, loss, restart, replay, and next-level flow.

Short-term product work should prioritize:

- tutorial levels and guided rule teaching for first-time players
- win and loss flow polish
- tactile board feedback for notes, queens, mistakes, and hints
- clearer hint behavior without blocking the player's flow
- stronger keyboard and screen reader support for core board interactions
- intentional puzzle progression and campaign structure
- connecting completed wins to local game records

Longer-term work should expand from the single-player foundation into local leaderboard presentation, replay controls, backend-backed game record synchronization, ghost runs, and eventually competition modes.

## Platform Direction

Queener should stay Bun-first as it grows beyond the current web app.

The current platform foundation is:

- workspace: Bun workspace
- frontend app core: Vue + Vite

The next platform additions are:

- backend: Elysia
- database: PostgreSQL
- ORM: Prisma
- mobile packaging: Capacitor

This direction keeps the project aligned with how it started while leaving room for persistence, app packaging, and future competition features.

Rationale:

- Bun workspace keeps package management and backend runtime choices coherent
- Vue + Vite remains the fastest path for the existing custom game UI
- Elysia fits the first backend scope without turning the project into a heavy server framework exercise
- PostgreSQL and Prisma are enough for users, game records, replays, and leaderboards
- Capacitor matches the product's mobile direction because the current UI should be reused rather than rewritten

## Backend Direction

The first backend should be small and persistence-oriented.

Elysia is the preferred framework because it keeps the backend close to Bun and fits a small API surface centered on users, runs, replays, and leaderboards.

The first backend scope should cover:

- guest user creation and naming
- game record upload
- replay retrieval
- per-level leaderboard queries
- storage for future ghost-run selection

The backend should not become the live gameplay authority in the first phase. `QueenGame` should remain the place where gameplay rules are executed during active play. Backend validation can be added later around persisted runs and leaderboard trust.

## App Strategy

Queener is a strong fit for an eventual app version because the game loop is self-contained, interaction-heavy, and friendly to repeat play.

The recommended app strategy is:

- keep the main product UI as a Vue web app
- package the mobile app with Capacitor
- treat the first app release as a mobile hybrid build backed by the same web interface and backend APIs

Capacitor is preferred because it matches the current product shape:

- the project already has a custom game UI rather than standard form-heavy screens
- the fastest path to an app is to preserve the existing web interface
- mobile packaging should add a shell around the current app instead of forcing a UI rewrite

## Tauri Evaluation

Tauri is not the primary mobile app strategy for this project.

Tauri should instead be treated as a future desktop packaging option.

Why Tauri is not the first choice here:

- the current app packaging priority is mobile hybrid delivery
- Capacitor is a more direct fit for mobile webview packaging
- Tauri adds value more clearly when the project is targeting a desktop app shell

Why Tauri still matters later:

- Queener is also a good candidate for a desktop puzzle app
- a desktop shell could benefit from lightweight web-based packaging
- Tauri can stay on the roadmap as a desktop-specific evaluation once the mobile path is stable

## UI And Visual Direction

The current visual direction is `Soft Garden Puzzle`: a quiet, hand-made puzzle-book UI inspired by soft garden animation moods rather than literal cartoon styling.

Design principles:

- use low-saturation ivory, sage green, powder blue, pale pink, and warm graphite
- avoid blue as the primary action color even when powder blue appears as a supporting color
- keep the outer app UI calm so board skins and queen skins remain the visual focus
- avoid black outlines on general UI containers and controls, heavy shadows, glossy gradients, or paper-card styling
- use spacing, gentle borders, rounded shapes, and restrained color blocks for hierarchy
- keep shared semantic CSS variables in `App.vue`
- keep the board and cell interaction layer highly controllable because it is part of the product identity

Reka UI should remain the behavior and accessibility layer for generic non-board controls when focus management, keyboard navigation, ARIA relationships, portals, or outside interaction handling are useful. Reka should not define the game's visual identity, and board/cell gestures should stay tied to the documented game interaction state machine.

## Skin And Asset Direction

Board skins should start from custom palette exploration, often drafted with [Coolors](https://coolors.co/), and then be adjusted for board readability and accessibility. Some accessibility-oriented palettes may be adapted from public color-blind safe palette references such as Paul Tol color schemes, IBM's color-blind safe palette, and the Okabe-Ito / Bang Wong palette.

Board skin rules:

- all board skins should define quantitative color-difference checks for common color vision deficiencies
- accessibility skins should prioritize luminance contrast and perceptual color separation
- board textures should stay independent from board skins so non-color region cues can combine with any palette
- texture class names should continue to match `CellTextureType` values

Queen skin rules:

- marked queen icons should keep the current sticker-like treatment with protective black and white outlines
- queen skin assets may reference [3D Icons](https://3dicons.co/) or similar colorful 3D icon styles
- note icon SVGs should use `viewBox="0 0 500 500"` for consistent scaling
- note icon SVG strokes should generally use `stroke-width="80"` unless a shape needs optical adjustment
- long-term queen skin work should include prepared found, note, and wrong variants so contrast can be tuned directly in source assets

## Accessibility Direction

Accessibility work should focus on practical game access without pretending the spatial N-Queens puzzle is equally suitable for every workflow.

Priorities:

- keyboard board interaction
- visible focus treatment across all board skins
- non-color cues for note, wrong, found, selected, and focused states
- `prefers-reduced-motion` support for repeated interaction and result feedback
- optional and controllable sound effects
- screen reader labels for board cells with row, column, region, and current status

## Phase Overview

1. Core Product Polish, including tutorial mode
2. Local Game History, Leaderboard, And Replay Controls
3. Shared Package Extraction When Needed
4. Elysia Backend And PostgreSQL Persistence
5. Puzzle Generator
6. Mobile Hybrid Packaging With Capacitor
7. Ghost Competition Mode
8. Realtime Competition Mode
9. Desktop Packaging Evaluation

These phases are planning order, not strict release boundaries. Product polish should continue alongside larger feature work when it improves the main game loop.

## Later-Stage Direction

Leaderboard and run replay should remain local-first until the persistence model is stable enough to sync confidently.

Backend persistence should land before competition features. Ghost competition should build on recorded run playback and synchronized game records. Realtime competition should wait for a more mature backend model, clearer session rules, and a stronger understanding of which game state must become authoritative.

Desktop packaging should be evaluated only after the mobile hybrid path is understood well enough to avoid solving both app-shell problems at once.

## Out Of Scope For Now

- mandatory account systems
- large-scale backend architecture before product needs are clear
- forcing the backend to become the active gameplay authority in the first pass
- realtime multiplayer as a near-term feature
- desktop packaging before the mobile hybrid direction is validated
- turning the project into a multi-game portal before Queener itself feels complete

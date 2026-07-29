# Web App Guide

This guide applies to `apps/web`, the active Queener Vue app.

## App Overview

The web app is a Vue 3 + Vite puzzle game based on the N-Queens problem.

The current route-level structure is:

- `HomeView`: level selection and game entry
- `GameView`: active puzzle, run recording, replay, and result flow
- `SettingView`: skin, texture, sound, and reset settings
- `PrepareView`: asset preloading before the main app flow

## Directory Guide

### `src/views`

Views own screen composition and route-level behavior.

Good fits:

- coordinating router state
- starting, restarting, quitting, or advancing levels
- coordinating stores and composables
- composing named UI sections

Avoid putting detailed board rules directly in views.

### `src/components`

Components render reusable UI and feature-specific UI blocks.

Current groups:

- `src/components/common`
- `src/components/game`
- `src/components/home`
- `src/components/setting`

Extract a component when a template block has its own props, rendering rules, or domain meaning.

### `src/modules/game`

This folder owns gameplay state and rules.

Responsibilities:

- board creation
- per-run puzzle variants
- hearts and hints
- win/loss detection
- run recording
- replay helpers
- scoring helpers

`QueenGame` should remain the main entry point for rule changes. `BoardCell` should stay focused on cell-local state.

### `src/modules/types`

Reusable TypeScript models and aliases belong here while they are web-app local.

Types that become API contracts can move to a shared package after another consumer exists.

### `src/modules/puzzles`

Puzzle definitions are declarative source data.

Do not mutate puzzle definitions when creating per-run variants.

### `src/modules/constants`

Shared runtime constants such as board skins, queen skins, texture types, and sound enums belong here when they are still web-app local.

Board skin notes:

- board skins should define `BOARD_SKIN_COLOR_COUNT` palette colors
- `GameBoard` should derive board colors through `pickDistributedColors(...)`
- boards smaller than the palette size should still use colors spread across the full palette
- board texture should remain independent from board skin
- texture class names should match `CellTextureType` values
- keep pattern CSS definitions centralized in `src/assets/texture.module.scss`
- board palette audit tests should use the color-distance helpers in `src/modules/utils/colorDistance.ts`
- current CIELAB delta E thresholds are at least `15` for accessibility board skins and at least `8` for baseline board skins

### `src/modules/stores`

Pinia stores should hold app-level state such as settings, level progress, skin preferences, audio preferences, and global modal state.

Do not move core puzzle rules into Pinia.

Game records are split across two layers:

- `useGameRecordsStore` is the application-facing state and action boundary
- `GameRecordRepository` owns persistence through IndexedDB now and an API or local-first adapter later

Views and gameplay flow should call the Pinia store instead of importing the IndexedDB repository directly.

### `src/modules/repositories`

Repositories isolate persistent data access from Pinia and UI code.

Keep repository contracts focused on product operations rather than browser-specific request objects. When remote game records arrive, preserve the `useGameRecordsStore` API and replace or compose the repository implementation underneath it.

For IndexedDB schema changes, bump the database version and handle migration in `onupgradeneeded`. Do not rename stores or indexes without a versioned migration.

### `src/modules/utils`

Utilities should be small, pure, and reusable.

Do not move one-off logic into `utils` too early.

## Engine-First Rule

Preserve this direction:

`UI -> player intent -> QueenGame -> BoardCell state`

Avoid:

`UI -> direct cell mutation -> scattered rule handling`

In practice:

- `GameCell` emits player intent
- `GameBoard` resolves gesture behavior
- `GameView` and composables coordinate run flow and recording
- `QueenGame` applies rules
- `BoardCell` reflects resulting cell state

This is especially important for queen marking, wrong guesses, hint usage, heart changes, win/loss transitions, and replay data.

## Interaction And State

Use [../../docs/state.md](../../docs/state.md) for detailed state machines and transition tables.

When a feature gains meaningful state complexity, document it there instead of scattering the rules across comments.

## Reka UI

Use Reka UI for generic app controls that need accessibility behavior:

- dialogs and alert dialogs
- focus trapping or focus restoration
- keyboard navigation across composite widgets
- ARIA roles and relationships for non-native controls
- portals, popovers, selects, tabs, switches, sliders, and similar primitives

Prefer project-owned components and native HTML for simple display-oriented UI and game-specific board interactions.

## Accessibility And Labels

Use [../../docs/a11y.md](../../docs/a11y.md) for keyboard-layer, board-control, and shortcut-setting principles.

For `aria-label`, use short sentence-case action labels for icon-only or symbol-only controls.

Good examples:

- `Open settings`
- `Previous level`
- `Next level`

Describe what the control does rather than what it looks like. Do not include "button" because assistive technology already announces the control type.

## CSS Selector Conventions

Vue component styles are scoped, but class names should still describe structure and state clearly.

Prefer classes for styling hooks:

- use readable component-local class names such as `game-cell`, `board-skin-option`, or `setting-panel`
- use modifier-style classes for visual states such as `base-button--icon`, `hint--used`, or `game-cell--locked`
- keep `data-*` attributes for tests, semantic state exposure, or integration hooks instead of ordinary CSS selectors

Only style against `data-*` attributes when the attribute is owned by a third-party primitive or browser behavior and there is no clearer class hook. Reka state attributes such as `data-state='checked'` are acceptable because they are part of the primitive's public styling API.

## Responsive Target

Treat iPhone SE width (`375px`) as the smallest supported responsive viewport unless a feature explicitly needs a narrower target.

## Testing Guidance

Use a layered testing strategy:

- unit tests for engine rules, puzzle validation, scoring, replay, and pure utilities
- component tests for UI interaction contracts and component state coordination
- Cypress for a small number of critical browser flows

Testing priorities:

- `QueenGame` rule correctness
- `BoardCell` state transitions
- `GameBoard` gesture behavior
- critical player flows such as starting a game and interacting with the board

For board interactions:

- keep most gesture edge cases in Vitest tests around `GameBoard`
- use Cypress for a smaller set of real browser flows
- test Pinia game record coordination with a mocked repository
- test native IndexedDB repository behavior in Cypress because the Vitest jsdom environment does not provide a real browser database
- set `window.__QUEENER_E2E_SKIP_PRELOAD__ = true` in `cy.visit(... onBeforeLoad)` for specs that do not cover app startup or preloading
- do not set that flag in specs that intentionally verify prepare view or preload behavior

Avoid brittle assertions against framework internals, incidental styling details, or DOM structure that is not part of the feature contract.

Prefer colocated `*.test.ts` files.

## Working Style

- keep views focused on screen flow
- prefer small, named components over long anonymous template blocks
- keep game rules centralized in `QueenGame`
- prefer solving TypeScript typing issues without `as` assertions when practical
- avoid `any`; prefer explicit types, `unknown`, generics, or narrower utility types
- choose readability over clever abstraction
- avoid duplicating rule logic across multiple files

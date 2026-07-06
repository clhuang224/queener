# Queener Web

This is the active Queener game client.

It is a Vue 3 + Vite single-page application that contains the current game UI, local gameplay engine, settings, replay flow, and browser tests.

## Overview

The goal is to place `N` queens on an `N x N` board without breaking the puzzle rules.
The current built-in campaign is designed for `N <= 10`.

Unlike the plain textbook version of N-Queens, Queener adds region-based board layouts and a game-like interaction model:

- each row can contain only one queen
- each column can contain only one queen
- each region can contain only one queen
- queens cannot be adjacent, including diagonally

Players solve the board by marking notes on cells and confirming queen positions directly on the game board.

## Features

### Home Screen

- Landing screen with the project tagline
- Level picker for unlocked campaign puzzles
- Board size and heart count preview for the selected level
- Entry points for starting a puzzle and opening settings

### Puzzle Gameplay

- Playable board rendered from predefined puzzle data
- Each new game and restart creates a puzzle variant by rotating the board and remapping region colors
- Click to toggle notes, or drag from an empty/noted cell to mark/remove notes in one consistent stroke
- Double click to mark a queen
- Use arrow keys to move between board cells
- Use Space as the keyboard version of the board press: single press toggles a note, double press marks a queen, and holding Space while moving focus marks/removes notes across cells
- Heart-based mistake system where hearts scale by board size
- One-time hint button and configurable shortcut that reveal a valid queen position
- End-of-game replay before the result action flow
- Board skins define ten palette colors; smaller boards sample across the full palette

### Settings

- Queen skin selection
- Board skin selection
- Board texture toggle
- Queen hint keyboard shortcut
- Sound volume control and sound preview
- Reset settings action

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Reka UI
- Vitest
- Cypress
- ESLint, oxlint, oxfmt

## Structure

```text
apps/web/
  src/
    assets/      # Icons, note icons, sounds, and texture styles
    components/  # Shared UI and game-specific Vue components
    modules/     # Game logic, data, stores, types, constants, and helpers
    router/      # Vue Router configuration
    test/        # Test helpers
    views/       # Route-level screens
  cypress/       # End-to-end tests
  public/        # Static assets
```

The web app currently owns the game engine because it is still the only runtime consumer. Future shared packages should be extracted only when `apps/api`, app packaging, or another consumer needs the same code.

## Architecture

Gameplay stays engine-first:

```text
GameCell
  -> emits player intent
GameBoard
  -> resolves gesture behavior
GameView / useGameRun
  -> coordinates run flow and recording
QueenGame
  -> applies game rules
BoardCell
  -> exposes cell state
```

`QueenGame` creates a fresh per-run puzzle variant whenever a game starts or restarts. The original puzzle data stays unchanged, while the active board may rotate by quarter turns and remap region ids so players cannot memorize fixed queen coordinates through repeated restarts.

Generic app UI can use unstyled Reka UI primitives for accessibility-heavy behavior such as dialogs and sliders. Board and cell gestures remain custom and engine-driven.

## Commands

Run these from the repository root:

```bash
bun run web:dev
bun run web:build
bun run web:lint
bun run web:type-check
bun run web:test:unit
bun run web:test:e2e
```

Or run inside `apps/web`:

```bash
bun run dev
bun run build
bun run lint
bun run type-check
bun run test:unit
bun run test:e2e
```

## Testing

- `QueenGame` tests cover initialization, per-run puzzle variants, queen marking, hint behavior, reset behavior, win detection, and game-over conditions
- `BoardCell` tests cover cell-level state transitions
- `GameBoard` tests cover pointer, keyboard, click, double-click, drag, and mobile gesture coordination
- Cypress covers a small set of browser-level player flows

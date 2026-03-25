# Queener

Place the queens. Become the winner.

Queener is a puzzle-focused single-page application inspired by the N-Queens problem. It combines classic queen-placement constraints with region-based puzzle layouts, mistake limits, and light in-browser interaction.

## Overview

The goal is to place `N` queens on an `N x N` board without breaking the puzzle rules.

Unlike the plain textbook version of N-Queens, this project adds region-based board layouts and a more game-like interaction model:

- each row can contain only one queen
- each column can contain only one queen
- each region can contain only one queen
- queens cannot be adjacent, including diagonally

Players currently solve the board by marking notes on cells and confirming queen positions directly on the game board.

## Current Features

### Home Screen

- Simple landing screen with the project tagline
- One-click entry into the playable puzzle screen

### Puzzle Gameplay

- Playable board rendered from predefined puzzle data
- Click or drag to mark cells with `X` notes
- Double click to mark a queen
- Heart-based mistake system with `3` total hearts
- One-time hint button that reveals a valid queen position
- Quit button that returns to the home screen

### Built-In Puzzle Data

- A handcrafted `7 x 7` puzzle is currently used in the main game flow
- An `8 x 8` puzzle definition already exists in the repository and is covered by engine tests

## Project Direction

The project is currently at the stage of shaping its product direction and deciding what to build next around the core puzzle loop.

The current implementation proves out:

- the core board interaction model
- the engine-driven rule system
- the basic game flow from home screen to playable puzzle

The next phase will likely focus on turning that solid core into a fuller game experience.

## Future Plans

The following areas are not fully implemented yet and are better treated as roadmap items rather than current features:

- Replace temporary browser alerts with proper in-app feedback for hints, game over, and victory
- Add a clearer restart flow after losing or finishing a puzzle
- Expose more built-in puzzles and puzzle selection in the UI
- Improve the overall game progression and presentation around winning and losing
- Continue refining pointer, drag, and input behavior on the board

## Tech Stack

- **Framework:** Vue 3 SPA
- **Language:** TypeScript
- **Routing:** Vue Router
- **State Management:** Pinia
- **Unit Testing:** Vitest
- **E2E Testing:** Cypress
- **Tooling:** Vite, ESLint, oxlint, oxfmt
- **Package Manager:** Bun

## Architecture Overview

At a high level, the project keeps gameplay rules separate from the UI layer.

Current interaction flow:

```text
GameCell (UI)
   ↓ emits event
GameBoard (UI container)
   ↓ calls
QueenGame (game engine)
   ↓ updates
BoardCell (game state)
```

This keeps the game rules centralized in `QueenGame`, while Vue components stay focused on rendering and user interaction.

## Project Structure

```text
src/
├── components/
│   ├── common/          # Shared UI such as buttons and heart display
│   └── game/            # Board and cell rendering components
├── game/                # Core gameplay classes such as QueenGame and BoardCell
├── puzzles/             # Built-in puzzle definitions
├── router/              # Vue Router configuration
├── stores/              # Pinia stores
├── types/               # Shared TypeScript models and aliases
├── utils/               # Small reusable helpers
├── views/               # Route-level screens
├── App.vue              # Root app shell
└── main.ts              # App bootstrap

cypress/                 # End-to-end tests
public/                  # Static assets
```

## Development

### Install dependencies

```bash
bun install
```

### Run locally

```bash
bun run dev
```

The Vite development server starts at `http://localhost:5173`.

### Build

```bash
bun run build
```

### Lint

```bash
bun run lint
```

### Type check

```bash
bun run type-check
```

### Unit tests

```bash
bun run test:unit
```

### End-to-end tests

```bash
bun run test:e2e
```

## Testing

- `QueenGame` tests cover initialization, queen marking, hint behavior, reset behavior, win detection, and game-over conditions
- `BoardCell` tests cover cell-level state transitions
- Cypress is available for browser-level interaction testing

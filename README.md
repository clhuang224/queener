# Queener

Place the queens. Become the winner.

Queener is a puzzle-focused single-page application inspired by the N-Queens problem. It combines classic queen-placement constraints with region-based puzzle layouts, mistake limits, and light in-browser interaction.

## Screenshots

<p>
  <img src="./docs/screenshots/demo-home.png" alt="Home screen" width="260" />
  <img src="./docs/screenshots/demo-game.png" alt="Game screen" width="260" />
  <img src="./docs/screenshots/demo-setting.png" alt="Settings screen" width="260" />
</p>

## Overview

The goal is to place `N` queens on an `N x N` board without breaking the puzzle rules.
The current built-in campaign is designed for `N <= 10`.

Unlike the plain textbook version of N-Queens, this project adds region-based board layouts and a more game-like interaction model:

- each row can contain only one queen
- each column can contain only one queen
- each region can contain only one queen
- queens cannot be adjacent, including diagonally

Players currently solve the board by marking notes on cells and confirming queen positions directly on the game board.

## Current Features

### Home Screen

- Simple landing screen with the project tagline
- Level picker for unlocked campaign puzzles
- Board size and heart count preview for the selected level
- Entry points for starting a puzzle and opening settings

### Puzzle Gameplay

- Playable board rendered from predefined puzzle data
- Each new game and restart creates a puzzle variant by rotating the board and remapping region colors
- Click to toggle notes, or drag from an empty/noted cell to mark/remove notes in one consistent stroke
- Double click to mark a queen
- Heart-based mistake system where hearts scale by board size (`N=5-7 => 2`, `N=8-10 => 3`)
- One-time hint button that reveals a valid queen position
- Quit button that returns to the home screen
- Board skins define ten palette colors; smaller boards sample across the full palette so the first and last colors are always used

### Built-In Puzzle Data

- Built-in puzzles are defined as static data in the repository
- Each puzzle includes board regions, queen positions, and per-puzzle rule settings
- The current puzzle set is intended to support a curated single-player campaign rather than fully dynamic generation
- The current campaign supports board sizes up to `10 x 10`
- The current campaign uses the default rule set: regions stay connected, and each row, column, and region contains exactly one queen
- The puzzle model already supports future variants such as disconnected regions or rules that require two queens per row, column, and region

## Current Focus

The project is currently focused on turning the existing prototype into a complete and polished single-player experience.

Current priorities include:

- completing the win and loss flow
- improving restart, hint, and result feedback
- expanding the built-in puzzle set
- defining a stronger UI and visual design direction
- refining the overall feel of the board and player interaction

## Tech Stack

- **Framework:** Vue 3 SPA
- **Language:** TypeScript
- **Routing:** Vue Router
- **State Management:** Pinia
- **UI Primitives:** Reka UI
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

`QueenGame` creates a fresh per-run puzzle variant whenever a game starts or restarts. The original puzzle data stays unchanged, while the active board may rotate by quarter turns and remap region ids so players cannot memorize fixed queen coordinates through repeated restarts.

Generic app UI can use unstyled Reka UI primitives for accessibility-heavy behavior such as dialogs, while game-specific board interactions remain custom and engine-driven.

## Project Structure

```text
src/
├── assets/              # Visual assets such as icons and board texture styles
├── components/
│   ├── common/          # Shared UI such as buttons and heart display
│   ├── game/            # Board and cell rendering components
│   ├── home/            # Home screen components such as level picking
│   └── setting/         # Settings UI and skin previews
├── modules/             # Non-UI gameplay, data, stores, types, constants, and helpers
│   ├── constants/       # Shared runtime constants such as board skin palettes
│   ├── enums/           # Shared enum definitions
│   ├── game/            # Core gameplay classes such as QueenGame and BoardCell
│   ├── puzzles/         # Built-in puzzle definitions
│   ├── stores/          # Pinia stores
│   ├── types/           # Shared TypeScript models and aliases
│   └── utils/           # Small reusable helpers
├── router/              # Vue Router configuration
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

- `QueenGame` tests cover initialization, per-run puzzle variants, queen marking, hint behavior, reset behavior, win detection, and game-over conditions
- `BoardCell` tests cover cell-level state transitions
- Cypress is available for browser-level interaction testing

## Resources And Licensing

Queener uses a small set of external visual and audio references. The goal is to keep the game playful while choosing resources that are clear enough for public project use.

- Board skin palettes are selected with color accessibility in mind. Most palettes are custom choices drafted with [Coolors](https://coolors.co/) and then adjusted through accessibility review, including color-distance checks for board readability. Some palette options are adapted from public color-blind safe palette references:
  - Paul Tol's color scheme work
  - IBM's color-blind safe palette
  - the Okabe-Ito / Bang Wong color-blind palette
- Queen icons and possible favicon directions may reference [3D Icons](https://3dicons.co/) or a similar colorful 3D icon style. 3D Icons describes its assets as CC0 / Creative Commons Zero, which is suitable for project artwork, but shared CC0 assets should not be treated as exclusive brand marks or registrable trademarks without further review.
- UI icons and the favicon direction use [Tabler Icons](https://tabler.io/icons), which are licensed under MIT.
- Sound effects come from [Pixabay](https://pixabay.com/) and are used under Pixabay's royalty-free content license.

# Queener

Place the queens. Become the winner.

## Introduction

A puzzle game based on the classic **N-Queens problem**.

The goal is to place **N queens on an N × N board** so that no two queens threaten each other.

## Tech Stack

- **Framework:** Vue (SPA)
- **Language:** TypeScript
- **Routing:** Vue Router
- **State management:** Pinia
- **Unit test:** Vitest
- **E2E test:** Cypress
- **Linting:** ESLint
- **Formatting:** oxfmt
- **Bundler:** Vite
- **Package Manager:** Bun

## Features

### Pages

#### Home

- Welcome message
- Start button

#### Game

- Game Board
- Quit button (returns to Home)
- Hint button (reveals one queen's position, usable once per game)

### Game Rules

The board is an **N × N grid** containing **N queens**.

Each queen must satisfy the following conditions:

- Only one queen **per row**
- Only one queen **per column**
- Only one queen **per region**
- Queens **cannot be adjacent**, including diagonally

The player starts with **3 hearts** and must find all **N queens** before running out of hearts.

### Player Interaction

Users can interact with each square on the board:

- **Single click / drag**
  - Mark the square with **X** (indicating no queen)
- **Double click**
  - Mark the square with **👸** (indicating a queen)

If the selected square **does not contain a queen**:

- One heart is deducted
- If all three hearts are lost, a **Game Over** message is shown

If the selected square is the **final queen**:

- A **Victory** message is displayed

### Question Generation

Puzzle boards are **manually created**.

## Architecture Overview

The game logic follows a simple separation between the game engine and the UI layer.

The core idea is that all game rules are handled by `QueenGame`, while Vue components are only responsible for rendering and forwarding user interactions.

### Data Flow

User interactions follow this flow:

```
GameCell (UI)
   ↓ emits event
GameBoard (UI container)
   ↓ calls
QueenGame (game engine)
   ↓ updates
BoardCell (game state)
```

### Responsibilities

#### QueenGame.ts

- The main game engine
- Holds the single source of truth for the game state
- Manages:
  - the board
  - hearts
  - hints
  - win / lose conditions
- Applies game rules (for example, losing a heart when marking the wrong queen)

Example:

```ts
game.markQueen(position)
```

#### BoardCell.ts

Represents the state of a single cell on the board.

It only stores local state and simple behaviors, such as:

- whether the cell contains a queen
- whether it has been marked
- the region it belongs to

`BoardCell` **does not implement game rules.**

#### GameBoard.vue

A container component responsible for rendering the grid of cells.

It receives the `QueenGame` instance and forwards events from `GameCell` to the game engine.

#### GameCell.vue

The smallest UI unit representing one cell.

It does **not modify the game state directly.**
Instead, it emits events describing user actions.

Example:

```ts
dblclick → emit('markQueen', position)
```

### Why This Design

This architecture ensures that:

- Game rules are centralized in the engine
- UI components remain simple and predictable
- State changes happen in a single place
- The game logic is easier to test

For example, the engine can be tested independently:

```ts
game.markQueen([2, 3])
expect(game.hearts).toBe(2)
```

without involving any UI components.

## Key Principle

UI components **should not mutate the game state directly.**

Instead, they emit user intentions, and the game engine decides how the state should change.

```
UI → intent → engine → state update
```

This keeps the system predictable and maintainable.

### Project Status

Work in progress.

## Folder Structure

```
/
├── public/                       # Static assets
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── common/
│   │   │   ├── BaseButton.vue
│   │   │   └── HeartCounter.vue
│   │   │
│   │   └── game/                 # Game-related components
│   │       ├── GameBoard.vue
│   │       └── GameCell.vue
│   │
│   ├── views/                    # Route-level pages
│   │   ├── HomeView.vue
│   │   └── GameView.vue
│   │
│   ├── router/                   # Vue Router configuration
│   │   └── index.ts
│   │
│   ├── stores/                   # Pinia stores
│   │   ├── game.ts
│   │   └── ui.ts
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── board.ts
│   │   └── game.ts
│   │
│   ├── constants/                # Game constants
│   │   ├── board.ts
│   │   └── game.ts
│   │
│   ├── composables/              # Vue composables
│   │   ├── useBoardInteraction.ts
│   │   └── useGameStatus.ts
│   │
│   ├── utils/                    # Helper utilities
│   │   ├── board-validator.ts
│   │   └── puzzle-loader.ts
│   │
│   ├── puzzles/                  # Puzzle definitions
│   │   ├── n7.ts
│   │   └── n8.ts
│   │
│   ├── App.vue
│   └── main.ts
│
├── cypress/                      # End-to-end tests
│   ├── e2e/
│   │   ├── home.cy.ts
│   │   └── game.cy.ts
│   └── support/
│
├── vitest.config.ts
├── cypress.config.ts
└── README.md
```

## How to Run

### Install dependencies

```bash
bun install
```

### Start development server

```bash
bun run dev
```

The app will start at:

```
http://localhost:5173
```

### Run unit tests

```bash
bun run test:unit
```

### Run E2E tests

```bash
bun run test:e2e
```

### Lint Code

```bash
bun run lint
```

### Format Code

```bash
bun run format
```

### Build

```bash
bun run build
```

## License

MIT

## AI Assistance

AI assistants should refer to `.github/copilot-instructions.md`
for project guidelines.

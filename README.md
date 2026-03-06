# Queener

Place the queens. Become the winner.

## Introduction

A puzzle game based on the classic **N-Queens problem**.

The N-Queens puzzle is a classic chess problem that asks how to place **N queens on an N × N chessboard** so that no two queens threaten each other.

Players must find the positions of all queens on an **N × N board** before running out of hearts.

## Tech Stack

- **Framework:** Vue (SPA)
- **Language:** TypeScript
- **Routing: Vue** Router
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
- Hint button

### Game Rules

The board is an **N × N grid** containing **N queens**.

Each queen must satisfy the following conditions:
- Only one queen **per row**
- Only one queen **per column**
- Only one queen **per region**
- Queens **cannot be adjacent**, including diagonals

The player starts with **3 hearts** and must find all **N queens** before running out of hearts.

### Player Interaction

Users can interact with each square on the board:

- **Single click / drag**
  - Mark the square with **X** (indicating no queen)
- **Double click**
  - Mark the square with **O** (indicating a queen)

If the selected square **does not contain a queen**:

- One heart is deducted
- If all three hearts are lost, a **Game Over** message is shown

If the selected square is the **final queen**:

- A **Victory** message is displayed

### Question Generation

Puzzle boards are **manually created**.

### Project Status

Work in progress.

## Folder Structure

```
/
├── public/                       # Static assets
├── src/
│   ├── assets/                   # Images, icons, and styles
│   │   ├── styles/
│   │   └── icons/
│   │
│   ├── components/               # Reusable UI components
│   │   ├── common/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseModal.vue
│   │   │   └── HeartCounter.vue
│   │   │
│   │   ├── home/                 # Home page components
│   │   │   └── HomeHero.vue
│   │   │
│   │   └── game/                 # Game-related components
│   │       ├── GameBoard.vue
│   │       ├── GameCell.vue
│   │       ├── GameToolbar.vue
│   │       └── HintPanel.vue
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
│   │   ├── n4.ts
│   │   ├── n6.ts
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

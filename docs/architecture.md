# Architecture

This document describes Queener's current architecture and the active repository direction.

## Current Shape

Queener is now organized as a Bun workspace with one active frontend app.

```text
queener/
  apps/
    web/
      src/
        views/
        components/
        modules/
          game/
          types/
          puzzles/
          constants/
          repositories/
          stores/
          utils/
        router/
      cypress/
  docs/
```

The workspace boundary exists now, but most domain code still intentionally lives inside `apps/web`. That is the correct tradeoff at the current stage: there is only one active consumer, so forcing early package extraction would add overhead without reducing duplication.

The current runtime architecture is intentionally simple:

1. Route views own screen-level flow.
2. Components render UI and emit player intent.
3. `QueenGame` applies gameplay rules.
4. `BoardCell` instances expose the resulting cell state.
5. Pinia stores hold app-level preferences, cross-view UI state, transient game-route session state, and game record state.
6. Repositories isolate persistent data access from views and Pinia stores.

The most important boundary is still:

`UI -> player intent -> QueenGame -> BoardCell state`

UI code should not duplicate core gameplay rules. When the game changes hearts, consumes hints, detects win/loss, creates puzzle variants, or decides whether an action is valid, that decision should stay in the engine layer.

## Current Responsibilities

### `apps/web/src/views`

Views compose pages and coordinate route-level behavior.

Current examples:

- `HomeView`: level selection and game entry
- `GameView`: active play, run recording, replay, result flow
- `SettingView`: user preferences and app settings
- `PrepareView`: asset preloading before the app enters the main flow

Views can coordinate stores, router state, and engine instances, but they should avoid becoming the place where board rules are implemented.

### `apps/web/src/components`

Components render reusable UI and feature-specific UI blocks.

Important groups:

- `components/common`: shared UI such as buttons, panels, modal content, counters, and icons
- `components/game`: board, cell, replay board, and gesture coordination
- `components/home`: level picker UI
- `components/setting`: setting fields and setting controls

Board and cell components may handle input mechanics, but gameplay decisions should flow back to `QueenGame`.

### `apps/web/src/modules/game`

This is the engine and game-domain layer.

It owns:

- board creation
- per-run puzzle variants
- cell status transitions
- hearts and hints
- win/loss detection
- run recording helpers
- replay helpers
- scoring helpers

This layer is the first candidate for extraction into shared packages once another app or service actually consumes it.

### `apps/web/src/modules/types`

This folder contains shared TypeScript shapes used across the app.

Examples:

- board positions
- puzzle models
- run record payloads
- replay payloads

Types that become API contracts should eventually move into a shared package instead of staying web-app local.

### `apps/web/src/modules/puzzles`

Puzzle data stays declarative. Puzzle definitions are source data, not the exact board arrangement for every run.

`QueenGame` may rotate the puzzle and remap regions for a specific run. That transformation should not mutate the puzzle source.

### `apps/web/src/modules/constants`

Constants hold shared runtime values such as board skins, queen skins, sound types, and texture choices.

These constants are still web-app local today. Some may stay there permanently if they only affect presentation.

### `apps/web/src/modules/stores`

Stores hold app-level state that must outlive a single component.

Good fits:

- settings
- skin preferences
- audio preferences
- global modal state
- level progress
- transient game-route session state
- game record loading, saving, and in-memory records

Core gameplay rules should not move into Pinia unless there is a stronger architectural reason.

`useGameSessionStore` is deliberately not persisted. `HomeView` starts a session from the level picker, in-game next-level navigation updates its expected level, and the router clears it when navigation leaves the game flow. This lets the route guard reject direct URL entry, reloads, and browser returns without making Pinia responsible for puzzle rules.

### `apps/web/src/modules/repositories`

Repositories isolate persistent data access from application state.

The current `GameRecordRepository` uses native IndexedDB. Views and gameplay flow should call `useGameRecordsStore`; they should not call the IndexedDB repository directly. A future API-backed or local-first repository can replace the concrete persistence implementation without changing those consumers.

### `apps/web/src/modules/utils`

Utilities should stay small, pure, and reusable.

Do not move one-off code here until reuse is real.

## Current Data Flow

### Active Play

```text
GameCell
  -> normalizes native input into cell press and focus intents
GameBoard
  -> wires board-level input and gesture interpretation
GameView / useGameRun
  -> records the player action
QueenGame
  -> mutates game state through engine methods
BoardCell
  -> exposes display state
```

Board input intentionally has three small layers before it reaches `QueenGame`:

1. `useGameCellInputEvents` maps cell-native input such as pointer events, clicks, Space, and arrow keys into shared cell intents like `pressStart`, `pressClick`, `pressEnter`, `pressEnd`, and `moveFocus`.
2. `useGameBoardInputEvents` owns board-level input concerns such as native board listeners, touch coordinate resolution, and moving focus between board cells.
3. `useGameBoardGestures` owns the interaction state machine that turns press intents into note toggles, queen marking, drag note marking, and ignored actions on locked cells.

This keeps `GameCell` and `GameBoard` mostly declarative while preserving the engine-first boundary: UI input is normalized into player intent, and `QueenGame` remains the place where gameplay rules mutate board state. The detailed transition tables live in [state.md](./state.md).

Keyboard input should also follow the accessibility principles in [a11y.md](./a11y.md): `Tab` remains page navigation, while arrow keys and game shortcuts are additive board controls.

### Run Replay

```text
QueenGameRunRecorder
  -> collects timestamped run actions
GameView
  -> creates replay data when the run ends
GameRunReplayBoard
  -> rebuilds the puzzle variant and plays records back
QueenGameRunReplay
  -> releases actions according to replay time
```

The replay UI is presentation-only. It should not become a second gameplay engine. Playback runs at least at `3x`, and longer runs are accelerated further so result replay finishes in approximately 10 seconds or less.

### Game Records And Local Leaderboard

Game records use Pinia as the application-facing state layer and a project-owned repository as the persistence boundary:

```text
game and leaderboard UI
  -> useGameRecordsStore
  -> GameRecordRepository
  -> IndexedDB now, API or local-first sync later
```

The repository uses native IndexedDB instead of adding an IndexedDB helper dependency immediately. UI and game flow should call the Pinia store rather than access IndexedDB directly.

Current implementation:

| Layer | Current API / Schema | Responsibility |
| --- | --- | --- |
| domain type | `GameRecord` | complete persisted run data for replay and leaderboard projection |
| Pinia | `useGameRecordsStore` | `load()`, `save(record)`, `getRecordsByLevel(level)`, and loading/saving/error state |
| repository | `GameRecordRepository` | persistence contract with `save(record)` and `getAll()` |
| IndexedDB | database `queener`, version `1`, object store `gameRecords` | records keyed by `uid`, with a non-unique `level` index |
| tests | Vitest store tests and Cypress repository test | mocked repository coordination and real browser IndexedDB behavior |

The store currently loads every record and filters its in-memory list by level. The IndexedDB `level` index is reserved for a future repository query if history volume makes loading everything inappropriate.

Initial scope:

- one `gameRecords` object store
- one `GameRecord` per completed level run
- records grouped by `level`
- player name copied from the current setting username at completion time
- leaderboard rows displaying level, score, player name, and completed time

The stored record should keep enough replay data to reconstruct the run later, but leaderboard list queries should read only leaderboard-relevant fields when practical.

Current integration status:

- the domain type, IndexedDB repository, Pinia store, leaderboard projection helpers, and tests exist
- active gameplay does not create or save a `GameRecord` yet
- no leaderboard screen loads records yet
- the next integration step is the checklist item to save one record after a win

When connecting the win flow, finish the run clock first, construct the record from `useGameRun`, `QueenGame`, `useUserStore`, and `QueenGameRunScorer`, then call `useGameRecordsStore().save(record)`. The exact field sources and unresolved identity decisions are recorded in [state.md](./state.md#game-record-persistence-state).

Keep `useGameRecordsStore` as the app-facing contract when remote persistence arrives. An API repository or local-first synchronization repository should implement `GameRecordRepository`; views should not branch between IndexedDB and HTTP themselves.

Repository implementations must return `startedAt` and `endedAt` as `Date` instances. IndexedDB preserves them through structured clone; a future HTTP repository must hydrate serialized date strings before returning `GameRecord` objects.

When changing the IndexedDB schema, increment `DATABASE_VERSION` and add the migration in `onupgradeneeded`. Changing an object-store or index name without a version bump will leave existing browser databases on the old schema.

Re-evaluate a helper library such as `idb` or Dexie only after native IndexedDB code becomes repetitive, schema migrations become non-trivial, or leaderboard queries need several indexes beyond level and score.

## Next Repository Direction

The current workspace is intentionally shallow. The next architecture phase is not more moving for its own sake; it is selective extraction only when package boundaries become useful.

Target shape:

```text
queener/
  apps/
    web/
    api/
  packages/
    game/
    types/
    replay/
    scoring/
    api-contract/
    config/
  docs/
```

This is now a partially realized target. New frontend code should follow `apps/web/src`, and package extraction should happen only when a second real consumer appears.

## Target Workspace Roles

### `apps/web`

The existing Vue app lives here.

It should own:

- Vue UI and route flow
- board and cell interaction UI
- local active-play orchestration
- settings screens
- replay presentation
- backend API consumption
- future Capacitor integration

The web app can run gameplay locally, but it should rely on shared packages for types, scoring, replay utilities, and game-domain logic once those packages exist.

### `apps/api`

The backend should be Bun-first and use Elysia.

Initial responsibilities:

- health checks
- guest user creation and profile updates
- game record persistence
- replay retrieval
- per-level leaderboard queries
- future ghost-run selection data

The first backend should remain lightweight. It should persist and query game records, not become the live authority for every board interaction.

### `packages/game`

Shared game-domain logic.

Likely candidates:

- `QueenGame`
- `BoardCell`
- puzzle variant helpers
- puzzle validation helpers

Extract this only when the API or another app target needs it. Right now `QueenGame`, `BoardCell`, puzzle variant helpers, and most of `apps/web/src/modules` should stay where they are.

### `packages/types`

Shared TypeScript models used across apps and packages.

Likely candidates:

- user profile shapes
- puzzle references
- game record summaries
- leaderboard entry models
- replay metadata

Until those contracts are shared beyond the web app, local types should remain in `apps/web/src/modules/types`.

### `packages/replay`

Replay-specific helpers.

Likely candidates:

- replay payload validation
- replay versioning
- replay serialization
- replay playback helpers that are not tied to Vue rendering

### `packages/scoring`

Shared score calculation logic.

Purpose:

- keep leaderboard semantics consistent between client display and backend persistence
- make future backend-side score verification possible without duplicating formulas

### `packages/api-contract`

Shared request and response contracts.

Purpose:

- keep frontend and backend payloads aligned
- reduce drift while API endpoints evolve
- provide a clear place for schema validation if the project adopts it

### `packages/config`

Shared workspace tooling.

Likely candidates:

- TypeScript base configs
- lint config
- test config helpers
- shared path or build conventions

## Target Data Ownership

### Web App Owns

- live board interaction flow
- local gesture interpretation
- active run UI
- result and replay presentation
- settings UI
- API consumption

### Game Package Owns

- gameplay rule execution
- board and puzzle state transitions
- puzzle variant transformations
- reusable game-domain helpers

### API Owns

- persisted user identity
- game record persistence
- replay storage and retrieval
- leaderboard queries
- future ghost-run selection

### Shared Contracts Own

- request and response shapes
- replay payload shape and versioning
- score payloads and leaderboard models

## Backend Direction

The backend should be organized around small, explicit domains:

- `health`
- `users`
- `runs`
- `replays`
- `leaderboards`

Avoid deeper service decomposition until the product creates real pressure for it.

The backend should not be the live gameplay authority in the first pass. Local play should remain responsive and engine-first. Backend validation can be added later for persisted runs and leaderboard trust.

## Database Direction

The planned database stack is PostgreSQL with Prisma.

Early persisted models should focus on:

- users
- game records
- replay records or replay payloads
- leaderboard-readable run summaries

Do not over-normalize replay action records before replay query needs are clear. A versioned replay payload may be enough for the first persistence pass.

## App Packaging Direction

### Mobile

Capacitor is the preferred first packaging target.

This keeps the main product surface in Vue and lets the mobile app reuse the existing web UI. Native integration should be incremental and justified by concrete mobile needs.

### Desktop

Tauri remains a future evaluation path.

It should wait until the mobile hybrid path and backend model are better understood. Do not solve mobile and desktop packaging at the same time.

## Avoid For Now

- moving core gameplay rules into Vue components
- making the backend the live gameplay authority too early
- introducing queues, Redis, or service decomposition before the workflow needs them
- splitting packages before there is a real consumer
- solving mobile and desktop packaging in the same phase
- coupling app shell choices to backend framework choices

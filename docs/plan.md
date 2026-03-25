# Development Plan

This document captures the current planned direction of the project. The items are listed in intended planning order, though implementation details may still shift as the project evolves.

## Planning Principles

- keep the core game loop playable and polished before expanding scope
- preserve a clear boundary between the UI layer and the game engine
- favor reusable game logic over one-off UI-coupled implementations
- add infrastructure when product needs become concrete, not only because it might be useful later

## 1. Core Product Milestones

The immediate goal is to turn the current prototype into a complete and polished single-player experience.

Scope:

- complete the win and loss flow
- define and implement the relationship between board size `N` and the number of hearts
- establish a stronger visual baseline for the game
- ship a fixed set of ten built-in puzzles
- add a settings page
- allow players to choose queen and board skins

Done when:

- the full game loop feels complete from start to finish
- players can clearly understand success, failure, and restart flow
- puzzle count and progression feel intentional rather than placeholder-driven
- basic personalization options are available through settings

Notes:

- this phase should focus on product completeness rather than architecture expansion

## 2. UI And Visual Design

The project should define a clearer visual direction instead of treating presentation as only a finishing step.

Scope:

- improve the overall look and feel of the game
- decide whether the project should adopt a UI framework or continue with a lighter custom component approach
- establish consistent visual rules for layout, spacing, buttons, board presentation, and feedback states
- improve the quality of win, loss, hint, and settings-related UI

Questions to answer:

- should the project introduce a UI framework, or would that add unnecessary weight for this style of game?
- if a framework is adopted, should it be used broadly or only for non-board UI such as settings, dialogs, and panels?
- what visual identity should Queener aim for beyond being functionally playable?

Design considerations:

- the game board and cell interaction layer are part of the product identity and should remain highly controllable
- non-core UI such as settings, dialogs, and generic controls may benefit from reusable UI primitives or a lightweight framework
- introducing a UI framework too early may speed up generic screens while also pushing the project toward a more generic look
- the project should define its visual language before committing to a larger UI dependency
- if a framework is adopted later, it should support the game rather than define the game's personality

Evaluation criteria:

- does the approach preserve a distinctive game feel?
- does it reduce repeated work for non-board UI?
- does it fit the expected scale of the project?
- does it make future polish easier rather than harder?

Done when:

- the project has a clear UI direction
- the game feels intentionally designed rather than prototype-like
- the team has decided whether a UI framework is part of the long-term stack

Notes:

- if a UI framework is adopted, it should support the product direction rather than overpower the game-specific board UI

## 3. Puzzle Generator

Build a lightweight puzzle generator that can produce puzzles with different difficulty levels.

Scope:

- generate puzzles with multiple difficulty levels
- define what puzzle difficulty means in this project
- preserve puzzle quality and intended play style

Done when:

- generated puzzles are usable in the product
- difficulty levels are meaningful rather than arbitrary
- generated output meets a minimum quality bar for gameplay

Depends on:

- a clearer definition of puzzle difficulty
- a stable understanding of the intended player experience

## 4. Monorepo Structure

Evaluate moving the project to a monorepo structure.

Scope:

- separate the web app from reusable game logic
- package the core engine so it can be reused outside the current frontend
- create a structure that can support future tooling or additional games

Done when:

- the project has a clear package boundary between UI and reusable logic
- the repository layout supports future expansion without unnecessary duplication

Notes:

- this should be treated as an architecture investment, not as an end in itself
- if product needs do not yet justify the migration, it can be delayed

## 5. Backend And Data Layer

Evaluate an appropriate backend and database approach, ideally within the same monorepo if the project adopts that structure.

Scope:

- store puzzles
- support a leaderboard
- record completion time and player path history

Done when:

- the project has a practical persistence model for puzzles and run results
- leaderboard and run-history data can be stored and retrieved reliably

Depends on:

- a stable run result model
- a decision on whether monorepo migration happens first

Notes:

- the current preference is to keep the initial version lightweight and avoid mandatory user accounts
- players may submit results with a self-entered display name

## 6. Ghost Competition Mode

Add a ghost mode based on previously recorded runs.

Scope:

- replay a recorded path alongside the current player run
- compare completion times
- show both paths together on the result screen

Done when:

- a player can race against a previously recorded run
- the replay is clear enough to feel meaningful, not just technically present

Depends on:

- backend support for run recording
- a stable representation of player path history

## 7. Realtime Competition Mode

Explore a realtime multiplayer mode built with sockets.

Scope:

- live competitive matches between online players
- separate leaderboard records for realtime matches

Done when:

- online matches are playable end to end
- realtime competition results can be recorded and distinguished from single-player runs

Depends on:

- backend foundation
- networking architecture
- a more mature game-session model

Notes:

- this should be treated as a later-stage expansion, not a near-term milestone

## 8. Broader Game Platform Direction

Longer term, the project may expand beyond Queener into a small game portal.

Scope:

- create a hub or entry portal
- launch with Queener first
- gradually add other games with compatible logic or audience overlap

Potential future titles:

- Sudoku
- Minesweeper

Done when:

- the shared platform direction is clear
- the project structure can support more than one game without forcing premature abstraction

Depends on:

- reusable engine boundaries
- infrastructure and deployment planning

Notes:

- domain and migration planning should be evaluated early if this direction becomes serious

## Out Of Scope For Now

The following items should not be treated as immediate deliverables unless priorities change:

- mandatory account systems
- large-scale backend architecture before product needs are clear
- realtime multiplayer as a near-term feature
- turning the project into a multi-game portal before Queener itself feels complete

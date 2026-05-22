# Development Plan

This document captures Queener's product direction and planning context. Use [checklist.md](./checklist.md) for concrete follow-up tasks.

## Planning Principles

- keep the core game loop playable and polished before expanding scope
- preserve a clear boundary between the UI layer and the game engine
- favor reusable game logic over one-off UI-coupled implementations
- add infrastructure when product needs become concrete, not only because it might be useful later
- keep implementation checklists focused on unfinished work instead of using them as changelogs

## Implemented Baseline

The current product baseline includes the playable single-player loop, hearts, settings, Reka-based non-board controls, asset preloading, sound volume control, per-run puzzle variants, declarative puzzle data, board skins, queen skins, board textures, and the current soft visual direction.

## Product Direction

The immediate goal is to make the single-player experience feel complete and polished from level selection through win, loss, restart, replay, and next-level flow.

Short-term product work should prioritize:

- tutorial levels and guided rule teaching for first-time players
- win and loss flow polish
- tactile board feedback for notes, queens, mistakes, and hints
- clearer hint behavior without blocking the player's flow
- stronger keyboard and screen reader support for core board interactions
- intentional puzzle progression and campaign structure

Longer-term work should expand from the single-player foundation into local leaderboard records, run replay, generated puzzles, and eventually backend-backed competition modes.

## UI And Visual Direction

The current visual direction is `Soft Garden Puzzle`: a quiet, hand-made puzzle-book UI inspired by soft garden animation moods rather than literal cartoon styling.

Design principles:

- use low-saturation ivory, sage green, powder blue, pale pink, and warm graphite
- avoid blue as the primary action color even when powder blue appears as a supporting color
- keep the outer app UI calm so board skins and queen skins remain the visual focus
- avoid black outlines, heavy shadows, glossy gradients, or paper-card styling
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
2. Leaderboard And Run Replay
3. Puzzle Generator
4. Monorepo Structure
5. Backend And Data Layer
6. Ghost Competition Mode
7. Realtime Competition Mode
8. Broader Game Platform Direction

These phases are planning order, not strict release boundaries. Product polish should continue alongside larger feature work when it improves the main game loop.

## Later-Stage Direction

Leaderboard and run replay should remain local-only at first. Backend sync, realtime competition, and broader game platform work should wait until the single-player game and run record model are stable.

Ghost competition should build on recorded run playback. Realtime competition should build on a more mature game-session model and backend foundation. A broader game portal should only be considered after Queener itself feels complete enough to justify shared platform infrastructure.

## Out Of Scope For Now

- mandatory account systems
- large-scale backend architecture before product needs are clear
- realtime multiplayer as a near-term feature
- turning the project into a multi-game portal before Queener itself feels complete

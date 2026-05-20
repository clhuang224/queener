# Development Plan

This document captures the current planned direction of the project. The items are listed in intended planning order, though implementation details may still shift as the project evolves.

## Planning Principles

- keep the core game loop playable and polished before expanding scope
- preserve a clear boundary between the UI layer and the game engine
- favor reusable game logic over one-off UI-coupled implementations
- add infrastructure when product needs become concrete, not only because it might be useful later

## Implemented Baseline

The current product baseline already includes:

- hearts that scale by board size
- a settings page for board texture, board skin, and queen skin preferences
- Reka UI as the unstyled accessibility primitive layer for non-board UI
- per-run puzzle variants that rotate the board and remap region ids whenever a game starts or restarts
- a fixed campaign structure backed by declarative puzzle data

## 1. Core Product Milestones

The immediate goal is to turn the current prototype into a complete and polished single-player experience.

Scope:

- complete and polish the win and loss flow
- establish a stronger visual baseline for the game
- refine the fixed built-in puzzle campaign
- improve restart, hint, and result feedback
- make the main loop feel complete from level selection through replay or next-level navigation

Done when:

- the full game loop feels complete from start to finish
- players can clearly understand success, failure, restart, replay, and next-level flow
- puzzle count and progression feel intentional rather than placeholder-driven
- restart and replay flows feel polished rather than mechanical

Notes:

- this phase should focus on product completeness rather than architecture expansion
- puzzle variants should stay engine-owned in `QueenGame`; puzzle definition files should remain declarative source data

## 2. UI And Visual Design

The project should define a clearer visual direction instead of treating presentation as only a finishing step.

Scope:

- improve the overall look and feel of the game
- establish consistent visual rules for layout, spacing, buttons, board presentation, and feedback states
- improve the quality of win, loss, hint, and settings-related UI
- continue applying Reka UI to non-board controls when the accessibility behavior is worth the abstraction

Questions to answer:

- which remaining non-board UI should move to Reka primitives, and which pieces are simpler as native HTML or project-owned components?
- where should Queener define reusable visual styling on top of unstyled primitives?
- what visual identity should Queener aim for beyond being functionally playable?

Design considerations:

- current visual exploration direction is `Soft Garden Puzzle`: a quiet, hand-made puzzle-book UI inspired by soft garden animation moods rather than literal cartoon styling
- use low-saturation ivory, sage green, powder blue, pale pink, and warm graphite; avoid blue as the primary action color even when powder blue appears as a supporting color
- keep the outer app UI calm so board skins and queen skins remain the visual focus
- avoid black outlines, heavy shadows, glossy gradients, or paper-card styling; use spacing, gentle borders, rounded shapes, and restrained color blocks for hierarchy
- use shared semantic CSS variables in `App.vue` for page, surface, text, muted text, primary, accent, selected, border, focus, and radius values
- apply the current visual direction across shared UI, settings, modals, and board-adjacent presentation after validating small spikes in `HomeView`, `LevelPicker`, and `BaseButton`
- the game board and cell interaction layer are part of the product identity and should remain highly controllable
- non-core UI such as settings, dialogs, and generic controls may benefit from Reka primitives when they need focus management, keyboard navigation, ARIA relationships, portals, or outside interaction handling
- Reka is intentionally unstyled, so it should provide behavior and accessibility while Queener components keep ownership of visual design
- simple display components, native button flows, and game-specific interactions should not be converted to Reka only for consistency
- the board and cell gesture layer should not be generalized into Reka primitives; it should stay tied to the documented game interaction state machine

Skin direction:

- board skin palettes should generally start from palettes found on [Coolors](https://coolors.co/) and then be adjusted for board readability
- all board skins should define quantitative color-difference checks for common color vision deficiencies, using a perceptual color space rather than raw RGB distance
- standard visual skins may keep their intended mood and color family, but they should avoid palette entries that collapse below the minimum color-difference threshold in color vision deficiency simulations
- at least three board skins should be designed for color-blind accessibility, with palettes that remain distinguishable without relying on normal red / green / blue perception
- color-blind accessibility skins may use player-facing theme names, but their palette source or inspiration should remain documented separately
- current color-blind accessibility palette sources are Paul Tol color schemes, IBM's color-blind safe palette, and the Okabe-Ito / Bang Wong palette
- color-blind accessibility skins should prioritize luminance contrast and perceptual color separation
- board textures should remain a separate accessibility setting from board skins so non-color region cues can be combined with any palette
- board texture classes should be driven by `CellTextureType` values that match the corresponding texture class names
- queen skins should move toward colorful icon-based assets for marked queens
- queen skin sources should primarily use [3D Icons](https://3dicons.co/) or assets with a similar colorful 3D icon style
- 3D Icons currently describes its icons as CC0 / Creative Commons Zero, with personal and commercial use allowed without attribution
- marked queen icons should intentionally keep a sticker-like treatment with protective black and white outlines, because the icon must remain readable across highly varied board colors
- the sticker-like marked queen treatment is considered decided for now and should not be softened unless the broader board visual system changes
- note icon assets are authored directly as SVG files under `src/assets/noteIcons/`
- note icon SVGs should use `viewBox="0 0 500 500"` so they scale consistently inside board cells and settings previews
- note icon SVG strokes should generally use `stroke-width="80"` unless a specific shape needs optical adjustment
- note states should use an outline version of the selected queen icon with a white or black edge treatment for contrast
- wrong states should use a red-filled version of the selected queen icon so mistakes remain clearly distinguishable from notes and found queens
- note / wrong rendering should use prepared SVG note icon assets when available, with note shown in white and wrong shown in red
- missing note icon assets may temporarily use empty SVG placeholders so each `QueenSkinType` has a matching file
- the long-term queen skin asset set should include prepared variants for found, note, and wrong states so outlines and fills can be tuned directly in the source image files

Interaction polish:

- marking a note, removing a note, marking a queen, and making a wrong guess should each have a small animation and sound effect so board interactions feel tactile
- win and loss should have short board-level feedback before opening the result modal; the current immediate modal transition feels too abrupt
- result animations should be brief and should not block the player longer than needed
- if a persisted queen skin is no longer available, such as a seasonal Halloween skin after its availability window ends, settings should fall back to a stable default skin, currently `Pink Crown`

Small polish candidates:

- add a sound effect preview control next to the settings volume slider so players can hear the current volume before returning to the game
- show lightweight campaign progress on the home screen, such as the selected level out of total levels or unlocked progress
- make the used hint state more visually explicit after the hint has been consumed
- consider a reset settings action once settings include enough independent preferences to justify restoring defaults
- improve GameView's lightweight level information without adding visual noise around the board

Accessibility direction:

- board interactions should support keyboard play, including moving the focused cell, marking notes, and marking queens without requiring pointer input
- the focused board cell should have a visible focus treatment that remains clear across all supported board skins
- gameplay state should not rely on color alone; note, wrong, found, selected, and focused states should each have a non-color cue through icon shape, outline, motion, text alternative, or border treatment
- animation polish should respect `prefers-reduced-motion`, especially for board feedback, win / loss transitions, and repeated cell interactions
- sound effects should be optional and controllable from settings once audio polish is introduced
- screen reader support should provide a practical baseline for board cells, including row, column, region, and current cell status, while recognizing that the core N-Queens spatial puzzle may not be fully suitable for every assistive technology workflow

Evaluation criteria:

- does the approach preserve a distinctive game feel?
- does it reduce repeated work for non-board UI?
- does it fit the expected scale of the project?
- does it make future polish easier rather than harder?

Done when:

- the project has a clear UI direction
- the game feels intentionally designed rather than prototype-like
- reusable non-board controls feel consistent without making the board or game-specific interactions generic

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

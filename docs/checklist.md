# Project Checklist

Use this checklist for concrete unfinished work. Each checkbox should describe a feature, behavior, test, or file-level improvement that can be implemented directly.

## Game Flow

- [ ] Add a short board success state before opening the win result modal.
- [ ] Add a short board failure state before opening the loss result modal.

## Tutorial Mode

- [ ] Add tutorial puzzle definitions for teaching the basic Queener rules.
- [ ] Add a tutorial entry point from the home screen.
- [ ] Add a tutorial route or tutorial mode flag for guided play.
- [ ] Add a tutorial overlay component that can highlight one board cell, row, column, or region.
- [ ] Add tutorial step content for the one-queen-per-row rule.
- [ ] Add tutorial step content for the one-queen-per-column rule.
- [ ] Add tutorial step content for the one-queen-per-region rule.
- [ ] Add tutorial step content for note marking.
- [ ] Add tutorial step content for wrong guesses and hearts.
- [ ] Add tutorial step content for hint usage.
- [ ] Add tutorial controls for next, previous, skip, and finish.
- [ ] Persist whether the tutorial has been completed.
- [ ] Add a setting or home action for replaying the tutorial.
- [ ] Add tests for tutorial step progression.
- [ ] Add tests that tutorial overlays do not mutate `QueenGame` rules directly.

## Hint Items

- [ ] Add a `QueenGame.revealQueenHint()` method for the current reveal-queen behavior.
- [ ] Add a `QueenGame.revealRegionHint()` method that suggests one region where notes can be safely marked.
- [ ] Add UI for choosing between reveal-queen and reveal-region hint items.
- [ ] Add tests for reveal-queen hint behavior.
- [ ] Add tests for reveal-region hint behavior.
- [ ] Update `docs/state.md` with the two hint item states.

## Board Interaction Feedback

- [ ] Add a cell animation when a note is marked.
- [ ] Add a cell animation when a note is removed.
- [ ] Add a cell animation when a correct queen is marked.
- [ ] Add a cell animation when a wrong queen is marked.
- [ ] Add a distinct sound for note removal if the current note sound feels ambiguous.
- [ ] Add tests that note animations do not change `QueenGame` rules.
- [ ] Add `prefers-reduced-motion` handling for cell animations.

## Board Keyboard Accessibility

- [ ] Make board cells keyboard-focusable.
- [ ] Add arrow-key navigation between board cells.
- [ ] Add keyboard shortcut for marking or removing a note on the focused cell.
- [ ] Add keyboard shortcut for marking a queen on the focused cell.
- [ ] Add visible focused-cell styling that works on light board skins.
- [ ] Add visible focused-cell styling that works on dark board skins.
- [ ] Add visible focused-cell styling that works when board texture is enabled.
- [ ] Add tests for keyboard cell navigation.
- [ ] Add tests for keyboard note and queen actions.
- [ ] Update `docs/state.md` with keyboard interaction transitions.

## Settings

- [ ] Add a username field for future leaderboard records.
- [ ] Persist the username in a `userStore`.
- [ ] Generate a random username when no saved username exists.
- [ ] Add tests for generated username persistence.
- [ ] Add tests for editing the username from settings.
- [ ] Add a setting for disabling end-of-game replay.
- [ ] Persist the replay setting.
- [ ] Add tests for replay setting persistence.

## Board Skins

- [ ] Add a color-difference utility for board palette checks.
- [ ] Add tests for board palette color-distance thresholds.
- [ ] Add simulated color vision deficiency checks for board palettes.
- [ ] Add tests that accessibility board skins pass the color vision checks.
- [ ] Document board palette acceptance thresholds in `AGENTS.md`.
- [ ] Add a small visual preview fixture for board skin palette audits.

## Queen And Note Assets

- [ ] Replace note icons that still look like temporary placeholders.
- [ ] Add a source note for queen icon assets in `README.md` whenever asset sources change.
- [ ] Add found-state queen image variants for each queen skin.
- [ ] Add note-state queen image variants for each queen skin.
- [ ] Add wrong-state queen image variants for each queen skin.
- [ ] Update `QueenIcon` or `GameCell` to use prepared state-specific image variants.
- [ ] Add tests that every `QueenSkinType` has all required state assets.

## Local Leaderboard

- [ ] Choose an IndexedDB helper approach.
- [ ] Add an IndexedDB store for completed runs.
- [ ] Save completed runs after a win.
- [ ] Add a leaderboard button to `LevelPicker`.
- [ ] Add a level leaderboard view or modal.
- [ ] Show player name, score, completion time, and completion date in leaderboard rows.
- [ ] Sort leaderboard rows by score.
- [ ] Add tests for saving completed runs.
- [ ] Add tests for leaderboard sorting.

## Run Replay

- [ ] Add replay controls for play and pause.
- [ ] Skip replay after a completed run when replay is disabled.

## Puzzle Generator

- [ ] Define a puzzle difficulty type.
- [ ] Add a generator that creates valid queen positions.
- [ ] Add a generator that creates compatible regions.
- [ ] Add validation for generated puzzle uniqueness if required by the game rules.
- [ ] Add tests for generated puzzle validity.
- [ ] Add tests for generated puzzle difficulty metadata.
- [ ] Add a product note that defines where generated puzzles appear in the player flow.

## Architecture And Data

- [ ] Draft the first `apps/api` folder structure before adding backend routes.
- [ ] Draft backend data models for puzzles, users, runs, and leaderboard entries.
- [ ] Add a backend leaderboard sync plan after local leaderboard records are stable.

## Competition Modes

- [ ] Add a ghost selection entry point from leaderboard records.
- [ ] Replay a selected ghost run alongside the current run.
- [ ] Show current run and ghost run paths on the result screen.
- [ ] Draft realtime match session state.
- [ ] Draft puzzle variant synchronization rules for realtime matches.

## Platform Direction

- [ ] Add a product note comparing standalone Queener with a game portal direction.
- [ ] Add a product note for whether Sudoku fits the same platform direction.
- [ ] Add a product note for whether Minesweeper fits the same platform direction.
- [ ] Add a domain and deployment note before starting portal work.

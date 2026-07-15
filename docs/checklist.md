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

- [ ] Add a `QueenGame.revealRegionHint()` method that suggests one region where notes can be safely marked.
- [ ] Add UI for choosing between reveal-queen and reveal-region hint items.
- [ ] Use the bulb icon for the future reveal-region hint item.
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

- [ ] Add visible focused-cell styling that works on dark board skins.
- [ ] Add visible focused-cell styling that works when board texture is enabled.

## Settings


## Board Skins

- [ ] Add simulated color vision deficiency checks for board palettes.
- [ ] Add tests that accessibility board skins pass the color vision checks.
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

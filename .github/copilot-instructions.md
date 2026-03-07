# Copilot Instructions

Refer to `README.md` for the full documentation.

This project implements a puzzle game based on the N-Queens problem.

Architecture overview:

GameCell (UI)
→ emits events
GameBoard (UI container)
→ calls
QueenGame (game engine)
→ updates
BoardCell (game state)

Key rule:
UI components must not mutate the game state directly.
All game rules should be implemented in `QueenGame`.

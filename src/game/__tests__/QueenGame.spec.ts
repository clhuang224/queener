import { describe, it, expect } from 'vitest'
import QueenGame from '../QueenGame.ts'
import { N_7_PUZZLES } from '../../puzzles/n7.ts'
import { N_8_PUZZLES } from '../../puzzles/n8.ts'

describe.each([...N_7_PUZZLES, ...N_8_PUZZLES])('QueenGame', (puzzle) => {
  describe(`Puzzle ID: ${puzzle.id}`, () => {
    describe('initialization', () => {
      it(`size should be ${puzzle.regions.length}`, () => {
        const game = new QueenGame(puzzle)
        expect(game.getSize()).toBe(puzzle.regions.length)
      })
      it(`should have ${puzzle.regions.length} queens on the board`, () => {
        const game = new QueenGame(puzzle)
        const queenCount = game.board.reduce(
          (count, row) => count + row.filter((square) => square.isQueen()).length,
          0,
        )
        expect(queenCount).toBe(puzzle.regions.length)
      })
    })

    describe('markQueen', () => {
      it('should mark a correct queen as found', () => {
        const game = new QueenGame(puzzle)
        const [row, col] = puzzle.queens[0]!
        game.markQueen([row, col])
        expect(game.board[row]![col]!.isFound()).toBe(true)
      })
      it('should reduce heart when guessing wrong', () => {
        const game = new QueenGame(puzzle)
        const wrongCell = game.board.flat().find((cell) => !cell.isQueen())!
        const before = game.getHearts()
        game.markQueen(wrongCell.getPosition())
        expect(game.getHearts()).toBe(before - 1)
      })
    })

    describe('hint', () => {
      it('should reveal a queen', () => {
        const game = new QueenGame(puzzle)
        const [row, col] = game.useHint()!
        expect(game.isHintUsed()).toBe(true)
        expect(game.board[row]![col]!.isFound()).toBe(true)
      })
      it('hint should be null after being used', () => {
        const game = new QueenGame(puzzle)
        game.useHint()
        const hint = game.useHint()
        expect(game.isHintUsed()).toBe(true)
        expect(hint).toBeNull()
      })
    })

    describe('win condition', () => {
      it('should detect win when all queens are found', () => {
        const game = new QueenGame(puzzle)
        for (const pos of puzzle.queens) {
          game.markQueen(pos)
        }
        expect(game.isWin()).toBe(true)
      })
    })

    describe('reset', () => {
      it('should reset the game state', () => {
        const game = new QueenGame(puzzle)
        const [row, col] = puzzle.queens[0]!
        game.markQueen([row, col])
        game.useHint()
        game.resetGame()
        expect(game.getHearts()).toBe(3)
        expect(game.board[row]![col]!.isFound()).toBe(false)
      })
    })

    describe('game over', () => {
      it('should be game over when hearts reach zero', () => {
        const game = new QueenGame(puzzle)

        const wrongCells = game.board.flat().filter((cell) => !cell.isQueen())
        for (let i = 0; i < 3; i++) {
          game.markQueen(wrongCells[i]!.getPosition())
        }
        expect(game.isGameOver()).toBe(true)
      })
    })
  })
})

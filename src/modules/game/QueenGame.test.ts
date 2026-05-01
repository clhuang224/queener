import { describe, it, expect } from 'vitest'
import QueenGame from './QueenGame.ts'
import { SIMPLE_PUZZLES } from '../puzzles/simple.ts'

describe('QueenGame.resolveHeartsBySize', () => {
  it('returns 2 hearts for size 5 to 7', () => {
    expect(QueenGame.resolveHeartsBySize(5)).toBe(2)
    expect(QueenGame.resolveHeartsBySize(6)).toBe(2)
    expect(QueenGame.resolveHeartsBySize(7)).toBe(2)
  })

  it('returns 3 hearts for size 8 to 10', () => {
    expect(QueenGame.resolveHeartsBySize(8)).toBe(3)
    expect(QueenGame.resolveHeartsBySize(9)).toBe(3)
    expect(QueenGame.resolveHeartsBySize(10)).toBe(3)
  })
})

describe.each(SIMPLE_PUZZLES)('QueenGame', (puzzle) => {
  describe(`Puzzle ID: ${puzzle.id}`, () => {
    const expectedHearts = QueenGame.resolveHeartsBySize(puzzle.rules.size)

    describe('initialization', () => {
      it(`size should be ${puzzle.rules.size}`, () => {
        const game = new QueenGame(puzzle)
        expect(game.getSize()).toBe(puzzle.rules.size)
      })
      it(`should have ${puzzle.rules.size} queens on the board`, () => {
        const game = new QueenGame(puzzle)
        const queenCount = game.board.reduce(
          (count, row) => count + row.filter((square) => square.isQueen()).length,
          0,
        )
        expect(queenCount).toBe(puzzle.rules.size)
      })
      it(`should initialize hearts based on size ${puzzle.rules.size}`, () => {
        const game = new QueenGame(puzzle)
        expect(game.hearts).toBe(expectedHearts)
        expect(game.maxHearts).toBe(expectedHearts)
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
        const before = game.hearts
        game.markQueen(wrongCell.getPosition())
        expect(game.hearts).toBe(before - 1)
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
        expect(game.hearts).toBe(expectedHearts)
        expect(game.board[row]![col]!.isFound()).toBe(false)
      })
    })

    describe('game over', () => {
      it('should be game over when hearts reach zero', () => {
        const game = new QueenGame(puzzle)

        const wrongCells = game.board.flat().filter((cell) => !cell.isQueen())
        for (let i = 0; i < expectedHearts; i++) {
          game.markQueen(wrongCells[i]!.getPosition())
        }
        expect(game.isGameOver()).toBe(true)
      })
    })
  })
})

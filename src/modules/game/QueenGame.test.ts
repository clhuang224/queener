import { afterEach, describe, it, expect, vi } from 'vitest'
import QueenGame from './QueenGame.ts'
import { SIMPLE_PUZZLES } from '../puzzles/simple.ts'
import type { Puzzle } from '@/modules/types/puzzle'

const getQueenPositions = (game: QueenGame) => {
  return game.board
    .flat()
    .filter((cell) => cell.isQueen())
    .map((cell) => cell.getPosition())
}

const TEST_PUZZLE: Puzzle = {
  id: 'test-transform',
  rules: {
    size: 3,
    allowDisconnectedRegions: false,
    queensPerUnit: 1,
  },
  regions: [
    [0, 0, 1],
    [2, 1, 1],
    [2, 2, 0],
  ],
  queens: [
    [0, 0],
    [1, 2],
    [2, 1],
  ],
}

afterEach(() => {
  vi.restoreAllMocks()
})

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
        expect(getQueenPositions(game)).toHaveLength(puzzle.rules.size)
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
        const [row, col] = getQueenPositions(game)[0]!
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
        for (const pos of getQueenPositions(game)) {
          game.markQueen(pos)
        }
        expect(game.isWin()).toBe(true)
      })
    })

    describe('reset', () => {
      it('should reset the game state', () => {
        const game = new QueenGame(puzzle)
        const [row, col] = getQueenPositions(game)[0]!
        game.markQueen([row, col])
        game.useHint()
        game.resetGame()
        expect(game.hearts).toBe(expectedHearts)
        expect(game.board.flat().some((cell) => cell.isFound())).toBe(false)
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

describe('QueenGame puzzle transformation', () => {
  it('rotates regions and queen positions for each run', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)

    const game = new QueenGame(TEST_PUZZLE)

    expect(game.board.map((row) => row.map((cell) => cell.getRegion()))).toEqual([
      [2, 2, 0],
      [2, 1, 0],
      [0, 1, 1],
    ])
    expect(getQueenPositions(game)).toEqual([
      [0, 2],
      [1, 0],
      [2, 1],
    ])
  })

  it('remaps region ids while preserving region membership', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)

    const game = new QueenGame(TEST_PUZZLE)

    expect(game.board.map((row) => row.map((cell) => cell.getRegion()))).toEqual([
      [1, 1, 2],
      [0, 2, 2],
      [0, 0, 1],
    ])
    expect(TEST_PUZZLE.regions).toEqual([
      [0, 0, 1],
      [2, 1, 1],
      [2, 2, 0],
    ])
  })

  it('creates a new transformed puzzle when resetting the game', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)

    const game = new QueenGame(TEST_PUZZLE)
    const initialQueenPositions = getQueenPositions(game)

    game.resetGame()

    expect(getQueenPositions(game)).not.toEqual(initialQueenPositions)
    expect(game.board.flat().some((cell) => cell.isFound())).toBe(false)
  })
})

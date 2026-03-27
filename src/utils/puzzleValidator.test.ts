import { describe, expect, it } from 'vitest'
import type { Puzzle } from '@/types/puzzle'
import { PuzzleValidationError, validatePuzzle } from '@/utils/puzzleValidator'

describe('validatePuzzle', () => {
  it('accepts a valid puzzle', () => {
    const puzzle: Puzzle = {
      id: 'valid-1',
      rules: {
        size: 4,
        allowDisconnectedRegions: false,
        queensPerUnit: 1,
      },
      regions: [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
        [2, 2, 3, 3],
        [2, 2, 3, 3],
      ],
      queens: [
        [0, 1],
        [1, 3],
        [2, 0],
        [3, 2],
      ],
    }

    expect(validatePuzzle(puzzle)).toEqual([])
  })

  it('reports structural and rule errors', () => {
    const puzzle: Puzzle = {
      id: 'invalid-1',
      rules: {
        size: 4,
        allowDisconnectedRegions: false,
        queensPerUnit: 1,
      },
      regions: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [3, 3, 3, 3],
      ],
      queens: [
        [0, 0],
        [0, 1],
        [2, 0],
        [4, 4],
      ],
    }

    const errors = validatePuzzle(puzzle)

    expect(errors).toEqual(
      expect.arrayContaining([expect.any(PuzzleValidationError)]),
    )
    expect(errors.map((error) => error.message)).toEqual(
      expect.arrayContaining([
        'invalid-1: expected 1 queens in row 0, got 2',
        'invalid-1: expected 1 queens in column 0, got 2',
        'invalid-1: expected 1 queens in region 0, got 2',
        'invalid-1: queen 3 is out of bounds at (4, 4)',
        'invalid-1: queens at (0, 0) and (0, 1) are adjacent',
      ]),
    )
  })
})

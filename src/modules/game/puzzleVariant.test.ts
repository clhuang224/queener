import { describe, expect, it, vi } from 'vitest'
import type { Puzzle } from '@/modules/types/puzzle'
import { createPuzzleVariantFromMetadata, createRandomPuzzleVariant } from './puzzleVariant'

const TEST_PUZZLE: Puzzle = {
  id: 'test-puzzle',
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

describe('puzzleVariant', () => {
  it('recreates a rotated and remapped puzzle variant from metadata', () => {
    const variant = createPuzzleVariantFromMetadata(TEST_PUZZLE, {
      direction: 90,
      regionMap: {
        0: 1,
        1: 0,
        2: 2,
      },
    })

    expect(variant.puzzle.regions).toEqual([
      [2, 2, 1],
      [2, 0, 1],
      [1, 0, 0],
    ])
    expect(variant.puzzle.queens).toEqual([
      [0, 2],
      [2, 1],
      [1, 0],
    ])
    expect(variant.metadata).toEqual({
      direction: 90,
      regionMap: {
        0: 1,
        1: 0,
        2: 2,
      },
    })
  })

  it('creates a random puzzle variant with matching metadata', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)

    const variant = createRandomPuzzleVariant(TEST_PUZZLE)

    expect(variant.metadata).toEqual({
      direction: 90,
      regionMap: {
        0: 0,
        1: 1,
        2: 2,
      },
    })
    expect(variant.puzzle.regions).toEqual([
      [2, 2, 0],
      [2, 1, 0],
      [0, 1, 1],
    ])
  })

  it('does not mutate the source puzzle', () => {
    createPuzzleVariantFromMetadata(TEST_PUZZLE, {
      direction: 180,
      regionMap: {
        0: 2,
        1: 1,
        2: 0,
      },
    })

    expect(TEST_PUZZLE.regions).toEqual([
      [0, 0, 1],
      [2, 1, 1],
      [2, 2, 0],
    ])
    expect(TEST_PUZZLE.queens).toEqual([
      [0, 0],
      [1, 2],
      [2, 1],
    ])
  })
})

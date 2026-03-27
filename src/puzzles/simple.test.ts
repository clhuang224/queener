import { describe, expect, it } from 'vitest'
import { SIMPLE_PUZZLES } from '@/puzzles/simple'
import { validatePuzzles } from '@/utils/puzzleValidator'

describe('SIMPLE_PUZZLES', () => {
  it('contains only valid puzzles', () => {
    const errors = validatePuzzles(SIMPLE_PUZZLES)

    expect(errors.map((error) => error.message)).toEqual([])
  })
})

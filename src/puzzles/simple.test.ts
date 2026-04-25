import { describe, expect, it } from 'vitest'
import { SIMPLE_PUZZLES } from '@/puzzles/simple'
import { validatePuzzles } from '@/utils/puzzleValidator'

describe('SIMPLE_PUZZLES', () => {
  it('contains only valid puzzles', () => {
    const errors = validatePuzzles(SIMPLE_PUZZLES)

    expect(errors.map((error) => error.message)).toEqual([])
  })

  it('does not use row-only placeholder regions', () => {
    const rowOnlyRegions = SIMPLE_PUZZLES.flatMap((puzzle) => {
      const positionsByRegion = new Map<number, Array<[number, number]>>()

      for (const [rowIndex, row] of puzzle.regions.entries()) {
        for (const [columnIndex, region] of row.entries()) {
          const positions = positionsByRegion.get(region) ?? []
          positions.push([rowIndex, columnIndex])
          positionsByRegion.set(region, positions)
        }
      }

      return Array.from(positionsByRegion.entries()).flatMap(([region, positions]) => {
        const rows = new Set(positions.map(([row]) => row))
        const isWholeRow = rows.size === 1 && positions.length === puzzle.rules.size

        return isWholeRow ? [`${puzzle.id}: region ${region}`] : []
      })
    })

    expect(rowOnlyRegions).toEqual([])
  })
})

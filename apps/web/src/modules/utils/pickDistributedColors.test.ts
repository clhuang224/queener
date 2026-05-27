import { describe, expect, it } from 'vitest'
import { pickDistributedColors } from './pickDistributedColors'

const COLORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

describe('pickDistributedColors', () => {
  it('always includes the first and last color when picking multiple colors', () => {
    expect(pickDistributedColors(COLORS, 5)).toEqual([1, 3, 6, 8, 10])
  })

  it('spreads colors evenly for supported board sizes', () => {
    expect(pickDistributedColors(COLORS, 6)).toEqual([1, 3, 5, 6, 8, 10])
    expect(pickDistributedColors(COLORS, 7)).toEqual([1, 3, 4, 6, 7, 9, 10])
    expect(pickDistributedColors(COLORS, 8)).toEqual([1, 2, 4, 5, 6, 7, 9, 10])
    expect(pickDistributedColors(COLORS, 9)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10])
    expect(pickDistributedColors(COLORS, 10)).toEqual(COLORS)
  })

  it('handles edge counts', () => {
    expect(pickDistributedColors(COLORS, 0)).toEqual([])
    expect(pickDistributedColors(COLORS, 1)).toEqual([1])
    expect(pickDistributedColors([], 5)).toEqual([])
  })
})

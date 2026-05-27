import { describe, expect, it } from 'vitest'
import { pickRandomItems } from './pickRandomItems'

describe('pickRandomItems', () => {
  it('returns a shuffled subset with the requested count', () => {
    expect(pickRandomItems([1, 2, 3, 4], 2, () => 0)).toEqual([2, 3])
  })

  it('handles empty and non-positive requests', () => {
    expect(pickRandomItems([], 3)).toEqual([])
    expect(pickRandomItems([1, 2, 3], 0)).toEqual([])
  })
})

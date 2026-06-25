import { describe, expect, it } from 'vitest'
import { getCielabDistance, getHexCielabDistance, hexToLabColor } from './colorDistance'

describe('colorDistance', () => {
  it('returns zero distance for the same hex color', () => {
    expect(getHexCielabDistance('#7EA48C', '#7EA48C')).toBe(0)
  })

  it('returns the expected CIELAB distance between black and white', () => {
    expect(getHexCielabDistance('#000000', '#FFFFFF')).toBeCloseTo(100, 0)
  })

  it('calculates CIELAB distance symmetrically from Lab colors', () => {
    const firstColor = hexToLabColor('#7EA48C')
    const secondColor = hexToLabColor('#F4B6C2')

    expect(getCielabDistance(firstColor, secondColor)).toBeCloseTo(
      getCielabDistance(secondColor, firstColor),
      8,
    )
  })
})

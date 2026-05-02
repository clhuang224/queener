import { describe, expect, it } from 'vitest'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { getAvailableQueenSkinTypes, isQueenSkinAvailable, QUEEN_SKINS } from './queenSkins'

describe('queenSkins', () => {
  it('loads an icon for every queen skin', () => {
    for (const skin of Object.values(QueenSkinType)) {
      expect(QUEEN_SKINS[skin].icon).toBeTruthy()
      expect(QUEEN_SKINS[skin].noteIcon).toContain('<svg')
    }
  })

  it('makes seasonal queen skins available on the same dates every year', () => {
    expect(isQueenSkinAvailable(QueenSkinType.ORANGE_PUMPKIN, new Date(2026, 9, 31))).toBe(true)
    expect(isQueenSkinAvailable(QueenSkinType.ORANGE_PUMPKIN, new Date(2027, 9, 31))).toBe(true)
    expect(isQueenSkinAvailable(QueenSkinType.ORANGE_PUMPKIN, new Date(2027, 10, 1))).toBe(false)
  })

  it('includes always-available skins and current seasonal skins', () => {
    expect(getAvailableQueenSkinTypes(new Date(2026, 9, 15))).toEqual(
      expect.arrayContaining([QueenSkinType.BLACK_CHESS, QueenSkinType.ORANGE_PUMPKIN]),
    )
    expect(getAvailableQueenSkinTypes(new Date(2026, 10, 1))).not.toContain(
      QueenSkinType.ORANGE_PUMPKIN,
    )
  })
})

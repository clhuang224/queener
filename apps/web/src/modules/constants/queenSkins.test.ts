import { describe, expect, it } from 'vitest'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { isQueenSkinAvailable, QUEEN_SKINS } from './queenSkins'

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

  it('keeps always-available queen skins available year-round', () => {
    expect(isQueenSkinAvailable(QueenSkinType.BLACK_CHESS, new Date(2026, 4, 3))).toBe(true)
    expect(isQueenSkinAvailable(QueenSkinType.BLACK_CHESS, new Date(2026, 9, 15))).toBe(true)
  })
})

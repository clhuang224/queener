import { describe, expect, it } from 'vitest'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import {
  isQueenSkinAvailable,
  queenSkinIconAssetNames,
  queenSkinMapName,
  queenSkinNoteIconAssetNames,
  QUEEN_SKINS,
} from './queenSkins'

describe('queenSkins', () => {
  it('loads an icon for every queen skin', () => {
    for (const skin of Object.values(QueenSkinType)) {
      expect(QUEEN_SKINS[skin].icon).toBeTruthy()
      expect(QUEEN_SKINS[skin].noteIcon).toContain('<svg')
    }
  })

  it('keeps queen skin metadata and assets aligned with every queen skin type', () => {
    const queenSkinTypes = Object.values(QueenSkinType).sort()

    expect(Object.keys(QUEEN_SKINS).sort()).toEqual(queenSkinTypes)
    expect(Object.keys(queenSkinMapName).sort()).toEqual(queenSkinTypes)
    expect(queenSkinIconAssetNames.sort()).toEqual(queenSkinTypes)
    expect(queenSkinNoteIconAssetNames.sort()).toEqual(queenSkinTypes)
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

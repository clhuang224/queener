import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import { useSkinStore } from './skin'
import { CellSkinType } from '@/modules/enums/CellSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'

describe('skin store', () => {
  beforeEach(() => {
    installStorageMock()
    setActivePinia(createPinia())
  })

  it('loads saved skins from local storage', () => {
    window.localStorage.setItem('queen-game-cell-skin', CellSkinType.LAKE)
    window.localStorage.setItem('queen-game-queen-skin', QueenSkinType.PINK_CROWN)

    const skinStore = useSkinStore()
    skinStore.load()

    expect(skinStore.cellSkin).toBe(CellSkinType.LAKE)
    expect(skinStore.queenSkin).toBe(QueenSkinType.PINK_CROWN)
  })

  it('persists skin changes', () => {
    const skinStore = useSkinStore()

    skinStore.setCellSkin(CellSkinType.AUTUMN)
    skinStore.setQueenSkin(QueenSkinType.PINK_CROWN)

    expect(window.localStorage.getItem('queen-game-cell-skin')).toBe(CellSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe(QueenSkinType.PINK_CROWN)
  })
})

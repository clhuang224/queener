import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads saved skins from local storage', () => {
    window.localStorage.setItem('queen-game-cell-skin', CellSkinType.LAKE)
    window.localStorage.setItem('queen-game-cell-texture-enabled', 'true')
    window.localStorage.setItem('queen-game-queen-skin', QueenSkinType.PINK_CROWN)

    const skinStore = useSkinStore()
    skinStore.load()

    expect(skinStore.cellSkin).toBe(CellSkinType.LAKE)
    expect(skinStore.cellTextureEnabled).toBe(true)
    expect(skinStore.queenSkin).toBe(QueenSkinType.PINK_CROWN)
  })

  it('persists skin changes', () => {
    const skinStore = useSkinStore()

    skinStore.setCellSkin(CellSkinType.AUTUMN)
    skinStore.setCellTextureEnabled(true)
    skinStore.setQueenSkin(QueenSkinType.PINK_CROWN)

    expect(window.localStorage.getItem('queen-game-cell-skin')).toBe(CellSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-cell-texture-enabled')).toBe('true')
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe(QueenSkinType.PINK_CROWN)
  })

  it('falls back to the default queen skin when saved skin is not currently available', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 3))
    window.localStorage.setItem('queen-game-queen-skin', QueenSkinType.ORANGE_PUMPKIN)

    const skinStore = useSkinStore()
    skinStore.load()

    expect(skinStore.queenSkin).toBe(QueenSkinType.PINK_CROWN)
  })
})

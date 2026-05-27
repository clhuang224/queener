import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import { DEFAULT_SKIN_SETTINGS, useSkinStore } from './skin'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
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
    window.localStorage.setItem('queen-game-board-skin', BoardSkinType.LAKE)
    window.localStorage.setItem('queen-game-board-texture-enabled', 'true')
    window.localStorage.setItem('queen-game-queen-skin', QueenSkinType.PINK_CROWN)

    const skinStore = useSkinStore()
    skinStore.load()

    expect(skinStore.boardSkin).toBe(BoardSkinType.LAKE)
    expect(skinStore.boardTextureEnabled).toBe(true)
    expect(skinStore.queenSkin).toBe(QueenSkinType.PINK_CROWN)
  })

  it('persists skin changes', () => {
    const skinStore = useSkinStore()

    skinStore.setBoardSkin(BoardSkinType.AUTUMN)
    skinStore.setBoardTextureEnabled(true)
    skinStore.setQueenSkin(QueenSkinType.PINK_CROWN)

    expect(window.localStorage.getItem('queen-game-board-skin')).toBe(BoardSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-board-texture-enabled')).toBe('true')
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

  it('resets skin settings to defaults', () => {
    const skinStore = useSkinStore()
    skinStore.setBoardSkin(BoardSkinType.AUTUMN)
    skinStore.setBoardTextureEnabled(true)
    skinStore.setQueenSkin(QueenSkinType.BLACK_CROWN)

    skinStore.resetSkinSettings()

    expect(skinStore.boardSkin).toBe(DEFAULT_SKIN_SETTINGS.boardSkin)
    expect(skinStore.boardTextureEnabled).toBe(DEFAULT_SKIN_SETTINGS.boardTextureEnabled)
    expect(skinStore.queenSkin).toBe(DEFAULT_SKIN_SETTINGS.queenSkin)
    expect(window.localStorage.getItem('queen-game-board-skin')).toBe(
      DEFAULT_SKIN_SETTINGS.boardSkin,
    )
    expect(window.localStorage.getItem('queen-game-board-texture-enabled')).toBe(
      String(DEFAULT_SKIN_SETTINGS.boardTextureEnabled),
    )
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe(
      DEFAULT_SKIN_SETTINGS.queenSkin,
    )
  })
})

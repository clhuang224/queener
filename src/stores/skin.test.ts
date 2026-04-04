import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import { useSkinStore } from './skin'

describe('skin store', () => {
  beforeEach(() => {
    installStorageMock()
    setActivePinia(createPinia())
  })

  it('loads saved skins from local storage', () => {
    window.localStorage.setItem('queen-game-cell-skin', 'grayscale')
    window.localStorage.setItem('queen-game-queen-skin', 'rainbow')

    const skinStore = useSkinStore()
    skinStore.load()

    expect(skinStore.cellSkin).toBe('grayscale')
    expect(skinStore.queenSkin).toBe('rainbow')
  })

  it('persists skin changes', () => {
    const skinStore = useSkinStore()

    skinStore.setCellSkin('grayscale')
    skinStore.setQueenSkin('rainbow')

    expect(window.localStorage.getItem('queen-game-cell-skin')).toBe('grayscale')
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe('rainbow')
  })
})

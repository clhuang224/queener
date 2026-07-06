import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import {
  DEFAULT_GAMEPLAY_SETTINGS,
  END_REPLAY_ENABLED_STORAGE_KEY,
  QUEEN_HINT_SHORTCUT_STORAGE_KEY,
  useGameplayStore,
} from './gameplay'

describe('gameplay store', () => {
  beforeEach(() => {
    installStorageMock()
    setActivePinia(createPinia())
  })

  it('loads saved end replay setting from local storage', () => {
    window.localStorage.setItem(END_REPLAY_ENABLED_STORAGE_KEY, 'false')
    window.localStorage.setItem(QUEEN_HINT_SHORTCUT_STORAGE_KEY, 'h')

    const gameplayStore = useGameplayStore()
    gameplayStore.load()

    expect(gameplayStore.endReplayEnabled).toBe(false)
    expect(gameplayStore.queenHintShortcut).toBe('h')
  })

  it('persists end replay changes', () => {
    const gameplayStore = useGameplayStore()

    gameplayStore.setEndReplayEnabled(false)
    gameplayStore.setQueenHintShortcut('H')

    expect(gameplayStore.endReplayEnabled).toBe(false)
    expect(gameplayStore.queenHintShortcut).toBe('h')
    expect(window.localStorage.getItem(END_REPLAY_ENABLED_STORAGE_KEY)).toBe('false')
    expect(window.localStorage.getItem(QUEEN_HINT_SHORTCUT_STORAGE_KEY)).toBe('h')
  })

  it('ignores reserved queen hint shortcut keys', () => {
    const gameplayStore = useGameplayStore()

    gameplayStore.setQueenHintShortcut('ArrowUp')
    gameplayStore.setQueenHintShortcut('Tab')

    expect(gameplayStore.queenHintShortcut).toBe(DEFAULT_GAMEPLAY_SETTINGS.queenHintShortcut)
    expect(window.localStorage.getItem(QUEEN_HINT_SHORTCUT_STORAGE_KEY)).toBeNull()
  })

  it('resets gameplay settings to defaults', () => {
    const gameplayStore = useGameplayStore()
    gameplayStore.setEndReplayEnabled(false)
    gameplayStore.setQueenHintShortcut('h')

    gameplayStore.resetGameplaySettings()

    expect(gameplayStore.endReplayEnabled).toBe(DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled)
    expect(gameplayStore.queenHintShortcut).toBe(DEFAULT_GAMEPLAY_SETTINGS.queenHintShortcut)
    expect(window.localStorage.getItem(END_REPLAY_ENABLED_STORAGE_KEY)).toBe('true')
    expect(window.localStorage.getItem(QUEEN_HINT_SHORTCUT_STORAGE_KEY)).toBe('q')
  })
})

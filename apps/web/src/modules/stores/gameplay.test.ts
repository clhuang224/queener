import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import {
  DEFAULT_GAMEPLAY_SETTINGS,
  END_REPLAY_ENABLED_STORAGE_KEY,
  useGameplayStore,
} from './gameplay'

describe('gameplay store', () => {
  beforeEach(() => {
    installStorageMock()
    setActivePinia(createPinia())
  })

  it('loads saved end replay setting from local storage', () => {
    window.localStorage.setItem(END_REPLAY_ENABLED_STORAGE_KEY, 'false')

    const gameplayStore = useGameplayStore()
    gameplayStore.load()

    expect(gameplayStore.endReplayEnabled).toBe(false)
  })

  it('persists end replay changes', () => {
    const gameplayStore = useGameplayStore()

    gameplayStore.setEndReplayEnabled(false)

    expect(gameplayStore.endReplayEnabled).toBe(false)
    expect(window.localStorage.getItem(END_REPLAY_ENABLED_STORAGE_KEY)).toBe('false')
  })

  it('resets gameplay settings to defaults', () => {
    const gameplayStore = useGameplayStore()
    gameplayStore.setEndReplayEnabled(false)

    gameplayStore.resetGameplaySettings()

    expect(gameplayStore.endReplayEnabled).toBe(DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled)
    expect(window.localStorage.getItem(END_REPLAY_ENABLED_STORAGE_KEY)).toBe('true')
  })
})

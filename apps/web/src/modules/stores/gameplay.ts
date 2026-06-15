import { ref } from 'vue'
import { defineStore } from 'pinia'

export const END_REPLAY_ENABLED_STORAGE_KEY = 'queen-game-end-replay-enabled'
export const DEFAULT_GAMEPLAY_SETTINGS = {
  endReplayEnabled: true,
}

const getStoredEndReplayEnabled = (): boolean => {
  if (typeof window === 'undefined') return DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled

  const storedValue = window.localStorage.getItem(END_REPLAY_ENABLED_STORAGE_KEY)
  return storedValue === null ? DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled : storedValue === 'true'
}

const persistEndReplayEnabled = (enabled: boolean) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(END_REPLAY_ENABLED_STORAGE_KEY, String(enabled))
}

export const useGameplayStore = defineStore('gameplay', () => {
  const endReplayEnabled = ref(DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled)
  const hasLoaded = ref(false)

  const load = () => {
    endReplayEnabled.value = getStoredEndReplayEnabled()
    hasLoaded.value = true
  }

  const ensureLoaded = () => {
    if (!hasLoaded.value) {
      load()
    }
  }

  const setEndReplayEnabled = (enabled: boolean) => {
    ensureLoaded()
    endReplayEnabled.value = enabled
    persistEndReplayEnabled(endReplayEnabled.value)
  }

  const resetGameplaySettings = () => {
    endReplayEnabled.value = DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled
    hasLoaded.value = true
    persistEndReplayEnabled(endReplayEnabled.value)
  }

  return {
    endReplayEnabled,
    load,
    setEndReplayEnabled,
    resetGameplaySettings,
  }
})

import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  DEFAULT_QUEEN_HINT_SHORTCUT,
  isValidShortcutKey,
  normalizeShortcutKey,
} from '@/modules/utils/keyboardShortcut'

export const END_REPLAY_ENABLED_STORAGE_KEY = 'queen-game-end-replay-enabled'
export const QUEEN_HINT_SHORTCUT_STORAGE_KEY = 'queen-game-queen-hint-shortcut'
export const DEFAULT_GAMEPLAY_SETTINGS = {
  endReplayEnabled: true,
  queenHintShortcut: DEFAULT_QUEEN_HINT_SHORTCUT,
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

const getStoredQueenHintShortcut = () => {
  if (typeof window === 'undefined') return DEFAULT_GAMEPLAY_SETTINGS.queenHintShortcut

  const storedValue = window.localStorage.getItem(QUEEN_HINT_SHORTCUT_STORAGE_KEY)
  if (storedValue === null) return DEFAULT_GAMEPLAY_SETTINGS.queenHintShortcut

  const shortcut = normalizeShortcutKey(storedValue)
  return isValidShortcutKey(shortcut) ? shortcut : DEFAULT_GAMEPLAY_SETTINGS.queenHintShortcut
}

const persistQueenHintShortcut = (shortcut: string) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(QUEEN_HINT_SHORTCUT_STORAGE_KEY, normalizeShortcutKey(shortcut))
}

export const useGameplayStore = defineStore('gameplay', () => {
  const endReplayEnabled = ref(DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled)
  const queenHintShortcut = ref(DEFAULT_GAMEPLAY_SETTINGS.queenHintShortcut)
  const hasLoaded = ref(false)

  const load = () => {
    endReplayEnabled.value = getStoredEndReplayEnabled()
    queenHintShortcut.value = getStoredQueenHintShortcut()
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

  const setQueenHintShortcut = (shortcut: string) => {
    ensureLoaded()
    const nextShortcut = normalizeShortcutKey(shortcut)
    if (!isValidShortcutKey(nextShortcut)) return

    queenHintShortcut.value = nextShortcut
    persistQueenHintShortcut(queenHintShortcut.value)
  }

  const resetGameplaySettings = () => {
    endReplayEnabled.value = DEFAULT_GAMEPLAY_SETTINGS.endReplayEnabled
    queenHintShortcut.value = DEFAULT_GAMEPLAY_SETTINGS.queenHintShortcut
    hasLoaded.value = true
    persistEndReplayEnabled(endReplayEnabled.value)
    persistQueenHintShortcut(queenHintShortcut.value)
  }

  return {
    endReplayEnabled,
    queenHintShortcut,
    load,
    setEndReplayEnabled,
    setQueenHintShortcut,
    resetGameplaySettings,
  }
})

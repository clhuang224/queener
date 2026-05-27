import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { TOTAL_LEVELS } from '@/modules/puzzles/simple'

const STORAGE_KEY = 'queen-game-highest-completed-level'

const toLevelNumber = (value: unknown): number | null => {
  if (typeof value !== 'string') return null

  const parsedValue = Number.parseInt(value, 10)
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return null
  }

  return parsedValue
}

const getStoredHighestCompletedLevel = (): number => {
  if (typeof window === 'undefined') return 0

  const storedLevel = toLevelNumber(window.localStorage.getItem(STORAGE_KEY))
  return storedLevel ?? 0
}

const persistHighestCompletedLevel = (level: number) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, String(level))
}

const clearStoredHighestCompletedLevel = () => {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(STORAGE_KEY)
}

export const useLevelStore = defineStore('level', () => {
  const highestCompletedLevel = ref(0)
  const selectedLevel = ref(1)
  const hasInitializedSelectedLevel = ref(false)

  const highestUnlockedLevel = computed(() => {
    return Math.min(Math.max(highestCompletedLevel.value + 1, 1), TOTAL_LEVELS)
  })

  const clampLevel = (level: number) => {
    return Math.min(Math.max(level, 1), TOTAL_LEVELS)
  }

  const loadProgress = () => {
    highestCompletedLevel.value = getStoredHighestCompletedLevel()
  }

  const clampUnlockedLevel = (level: number) => {
    return Math.min(Math.max(level, 1), highestUnlockedLevel.value)
  }

  const initializeSelectedLevel = () => {
    loadProgress()

    if (!hasInitializedSelectedLevel.value) {
      selectedLevel.value = highestUnlockedLevel.value
      hasInitializedSelectedLevel.value = true
      return
    }

    selectedLevel.value = clampUnlockedLevel(selectedLevel.value)
  }

  const setSelectedLevel = (level: number) => {
    loadProgress()
    selectedLevel.value = clampUnlockedLevel(level)
    hasInitializedSelectedLevel.value = true
  }

  const selectPreviousLevel = () => {
    selectedLevel.value = clampUnlockedLevel(selectedLevel.value - 1)
    hasInitializedSelectedLevel.value = true
  }

  const selectNextLevel = () => {
    selectedLevel.value = clampUnlockedLevel(selectedLevel.value + 1)
    hasInitializedSelectedLevel.value = true
  }

  const isLevelUnlocked = (level: number) => {
    return level >= 1 && level <= highestUnlockedLevel.value
  }

  const resolvePlayableLevel = (level: number) => {
    loadProgress()

    const fallbackLevel = highestUnlockedLevel.value
    const normalizedLevel = clampLevel(level)

    return {
      activeLevel: isLevelUnlocked(normalizedLevel) ? normalizedLevel : fallbackLevel,
      fallbackLevel,
      isUnlocked: isLevelUnlocked(normalizedLevel),
    }
  }

  const completeLevel = (level: number) => {
    loadProgress()

    const normalizedLevel = clampLevel(level)
    highestCompletedLevel.value = Math.max(highestCompletedLevel.value, normalizedLevel)
    persistHighestCompletedLevel(highestCompletedLevel.value)
    selectedLevel.value = highestUnlockedLevel.value
    hasInitializedSelectedLevel.value = true

    return highestUnlockedLevel.value
  }

  const clearProgress = () => {
    highestCompletedLevel.value = 0
    selectedLevel.value = 1
    hasInitializedSelectedLevel.value = false
    clearStoredHighestCompletedLevel()
  }

  return {
    highestCompletedLevel,
    highestUnlockedLevel,
    selectedLevel,
    loadProgress,
    initializeSelectedLevel,
    setSelectedLevel,
    selectPreviousLevel,
    selectNextLevel,
    resolvePlayableLevel,
    completeLevel,
    clearProgress,
  }
})

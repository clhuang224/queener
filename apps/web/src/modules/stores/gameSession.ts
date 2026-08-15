import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameSessionStore = defineStore('gameSession', () => {
  const activeLevel = ref<number | null>(null)
  const isActive = computed(() => activeLevel.value !== null)

  const startSession = (level: number) => {
    activeLevel.value = level
  }

  const continueToLevel = (level: number): boolean => {
    if (!isActive.value) return false

    activeLevel.value = level
    return true
  }

  const canEnterLevel = (level: number): boolean => {
    return activeLevel.value === level
  }

  const endSession = () => {
    activeLevel.value = null
  }

  return {
    activeLevel,
    isActive,
    startSession,
    continueToLevel,
    canEnterLevel,
    endSession,
  }
})

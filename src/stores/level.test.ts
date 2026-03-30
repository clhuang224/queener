import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLevelStore } from './level'
import { createStorageMock } from '@/test/storageMock'

describe('level store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    Object.defineProperty(window, 'localStorage', {
      value: createStorageMock(),
      configurable: true,
    })
  })

  it('starts with only level 1 unlocked', () => {
    const levelStore = useLevelStore()

    levelStore.hydrateProgress()
    levelStore.initializeSelectedLevel()

    expect(levelStore.highestCompletedLevel).toBe(0)
    expect(levelStore.highestUnlockedLevel).toBe(1)
    expect(levelStore.selectedLevel).toBe(1)
  })

  it('keeps selected level within the unlocked range', () => {
    window.localStorage.setItem('queen-game-highest-completed-level', '4')

    const levelStore = useLevelStore()

    levelStore.setSelectedLevel(3)
    expect(levelStore.selectedLevel).toBe(3)

    levelStore.setSelectedLevel(9)
    expect(levelStore.selectedLevel).toBe(5)
  })

  it('completes a level and persists the next unlocked level progression', () => {
    const levelStore = useLevelStore()

    const nextUnlockedLevel = levelStore.completeLevel(3)

    expect(levelStore.highestCompletedLevel).toBe(3)
    expect(nextUnlockedLevel).toBe(4)
    expect(levelStore.selectedLevel).toBe(4)
    expect(window.localStorage.getItem('queen-game-highest-completed-level')).toBe('3')
  })

  it('resolves a locked route level back to the highest unlocked one', () => {
    window.localStorage.setItem('queen-game-highest-completed-level', '2')

    const levelStore = useLevelStore()
    const resolvedLevel = levelStore.resolvePlayableLevel(5)

    expect(resolvedLevel.activeLevel).toBe(3)
    expect(resolvedLevel.fallbackLevel).toBe(3)
    expect(resolvedLevel.isUnlocked).toBe(false)
  })
})

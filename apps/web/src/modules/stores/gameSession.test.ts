import { beforeEach, describe, expect, it } from 'vitest'
import { createTestingPinia } from '@/test/pinia'
import { useGameSessionStore } from './gameSession'

describe('game session store', () => {
  beforeEach(() => {
    createTestingPinia()
  })

  it('starts a session for one expected level', () => {
    const store = useGameSessionStore()

    store.startSession(3)

    expect(store.isActive).toBe(true)
    expect(store.activeLevel).toBe(3)
    expect(store.canEnterLevel(3)).toBe(true)
    expect(store.canEnterLevel(4)).toBe(false)
  })

  it('continues to another level only while a session is active', () => {
    const store = useGameSessionStore()

    expect(store.continueToLevel(2)).toBe(false)

    store.startSession(1)
    expect(store.continueToLevel(2)).toBe(true)
    expect(store.activeLevel).toBe(2)

    store.endSession()
    expect(store.isActive).toBe(false)
    expect(store.activeLevel).toBeNull()
  })
})

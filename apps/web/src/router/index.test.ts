import { beforeEach, describe, expect, it } from 'vitest'
import { createTestingPinia } from '@/test/pinia'
import { useGameSessionStore } from '@/modules/stores/gameSession'
import router from './index'

describe('router', () => {
  beforeEach(async () => {
    createTestingPinia()
    await router.replace('/')
  })

  it('updates the document title after navigation', async () => {
    await router.push('/setting')
    expect(document.title).toBe('Settings - Queener')

    useGameSessionStore().startSession(3)
    await router.push('/game/3')
    expect(document.title).toBe('Level 3 - Queener')

    await router.push('/')
    expect(document.title).toBe('Queener')
  })

  it('allows the active session to enter its expected level', async () => {
    const gameSessionStore = useGameSessionStore()
    gameSessionStore.startSession(2)

    await router.push('/game/2')

    expect(router.currentRoute.value.name).toBe('game')
    expect(router.currentRoute.value.params.level).toBe('2')
  })

  it('redirects direct game route entry to home', async () => {
    await router.push('/game/1')

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('ends the session when a different game level is requested', async () => {
    const gameSessionStore = useGameSessionStore()
    gameSessionStore.startSession(1)

    await router.push('/game/2')

    expect(router.currentRoute.value.name).toBe('home')
    expect(gameSessionStore.activeLevel).toBeNull()
  })

  it('redirects a refreshed game route when the transient session is gone', async () => {
    useGameSessionStore().startSession(2)
    await router.push('/game/2')

    createTestingPinia()
    await router.push('/game/2?refresh=1')

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('allows the session to continue to the next level', async () => {
    const gameSessionStore = useGameSessionStore()
    gameSessionStore.startSession(1)
    await router.push('/game/1')

    gameSessionStore.continueToLevel(2)
    await router.push('/game/2')

    expect(router.currentRoute.value.name).toBe('game')
    expect(router.currentRoute.value.params.level).toBe('2')
  })

  it('clears the session after leaving the game flow', async () => {
    const gameSessionStore = useGameSessionStore()
    gameSessionStore.startSession(1)
    await router.push('/game/1')

    await router.push('/setting')

    expect(gameSessionStore.activeLevel).toBeNull()

    await router.push('/game/1')
    expect(router.currentRoute.value.name).toBe('home')
  })
})

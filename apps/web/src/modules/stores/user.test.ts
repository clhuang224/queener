import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import { USERNAME_STORAGE_KEY, generateDefaultUsername, useUserStore } from './user'

describe('user store', () => {
  beforeEach(() => {
    installStorageMock()
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-26T00:00:00.123Z'))
  })

  it('generates and persists a default username when none is saved', () => {
    const userStore = useUserStore()
    userStore.load()

    expect(userStore.username).toBe('Queener-1782432000123')
    expect(window.localStorage.getItem(USERNAME_STORAGE_KEY)).toBe('Queener-1782432000123')
  })

  it('loads a saved username from local storage', () => {
    window.localStorage.setItem(USERNAME_STORAGE_KEY, 'Lynn')

    const userStore = useUserStore()
    userStore.load()

    expect(userStore.username).toBe('Lynn')
  })

  it('persists edited usernames', () => {
    const userStore = useUserStore()

    userStore.setUsername('  Ada  ')

    expect(userStore.username).toBe('Ada')
    expect(window.localStorage.getItem(USERNAME_STORAGE_KEY)).toBe('Ada')
  })

  it('can generate a default username directly', () => {
    expect(generateDefaultUsername()).toBe('Queener-1782432000123')
  })
})

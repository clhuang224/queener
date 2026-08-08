import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import {
  USERNAME_STORAGE_KEY,
  USER_UID_STORAGE_KEY,
  generateDefaultUsername,
  useUserStore,
} from './user'

const GENERATED_USER_UID = '00000000-0000-4000-8000-000000000001'

describe('user store', () => {
  beforeEach(() => {
    installStorageMock()
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-26T00:00:00.123Z'))
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(GENERATED_USER_UID)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('generates and persists a default identity when none is saved', () => {
    const userStore = useUserStore()
    userStore.load()

    expect(userStore.uid).toBe(GENERATED_USER_UID)
    expect(userStore.username).toBe('Queener-1782432000123')
    expect(window.localStorage.getItem(USER_UID_STORAGE_KEY)).toBe(GENERATED_USER_UID)
    expect(window.localStorage.getItem(USERNAME_STORAGE_KEY)).toBe('Queener-1782432000123')
  })

  it('loads a saved identity from local storage', () => {
    window.localStorage.setItem(USER_UID_STORAGE_KEY, 'saved-user-uid')
    window.localStorage.setItem(USERNAME_STORAGE_KEY, 'Lynn')

    const userStore = useUserStore()
    userStore.load()

    expect(userStore.uid).toBe('saved-user-uid')
    expect(userStore.username).toBe('Lynn')
    expect(globalThis.crypto.randomUUID).not.toHaveBeenCalled()
  })

  it('persists edited usernames', () => {
    const userStore = useUserStore()

    userStore.setUsername('  Ada  ')

    expect(userStore.username).toBe('Ada')
    expect(window.localStorage.getItem(USERNAME_STORAGE_KEY)).toBe('Ada')
  })

  it('keeps the user uid when resetting user settings', () => {
    window.localStorage.setItem(USER_UID_STORAGE_KEY, 'saved-user-uid')
    window.localStorage.setItem(USERNAME_STORAGE_KEY, 'Lynn')
    const userStore = useUserStore()

    userStore.resetUserSettings()

    expect(userStore.uid).toBe('saved-user-uid')
    expect(window.localStorage.getItem(USER_UID_STORAGE_KEY)).toBe('saved-user-uid')
    expect(userStore.username).toBe('Queener-1782432000123')
  })

  it('can generate a default username directly', () => {
    expect(generateDefaultUsername()).toBe('Queener-1782432000123')
  })
})

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const USERNAME_STORAGE_KEY = 'queen-game-username'
export const USER_UID_STORAGE_KEY = 'queen-game-user-uid'

export const generateDefaultUsername = (): string => `Queener-${Date.now()}`
export const generateUserUid = (): string => globalThis.crypto.randomUUID()

const getStoredUsername = (): string | null => {
  if (typeof window === 'undefined') return null

  const storedValue = window.localStorage.getItem(USERNAME_STORAGE_KEY)?.trim()
  return storedValue ? storedValue : null
}

const persistUsername = (nextUsername: string) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername)
}

const getStoredUserUid = (): string | null => {
  if (typeof window === 'undefined') return null

  const storedValue = window.localStorage.getItem(USER_UID_STORAGE_KEY)?.trim()
  return storedValue ? storedValue : null
}

const persistUserUid = (uid: string) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(USER_UID_STORAGE_KEY, uid)
}

export const useUserStore = defineStore('user', () => {
  const uid = ref('')
  const username = ref('')
  const hasLoaded = ref(false)

  const load = () => {
    uid.value = getStoredUserUid() ?? generateUserUid()
    username.value = getStoredUsername() ?? generateDefaultUsername()
    hasLoaded.value = true
    persistUserUid(uid.value)
    persistUsername(username.value)
  }

  const ensureLoaded = () => {
    if (!hasLoaded.value) {
      load()
    }
  }

  const setUsername = (nextUsername: string) => {
    ensureLoaded()
    const trimmedUsername = nextUsername.trim()

    username.value = trimmedUsername || generateDefaultUsername()
    persistUsername(username.value)
  }

  const resetUserSettings = () => {
    ensureLoaded()
    username.value = generateDefaultUsername()
    persistUsername(username.value)
  }

  return {
    uid,
    username,
    load,
    setUsername,
    resetUserSettings,
  }
})

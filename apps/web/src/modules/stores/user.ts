import { ref } from 'vue'
import { defineStore } from 'pinia'

export const USERNAME_STORAGE_KEY = 'queen-game-username'

export const generateDefaultUsername = (): string => `Queener-${Date.now()}`

const getStoredUsername = (): string | null => {
  if (typeof window === 'undefined') return null

  const storedValue = window.localStorage.getItem(USERNAME_STORAGE_KEY)?.trim()
  return storedValue ? storedValue : null
}

const persistUsername = (nextUsername: string) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername)
}

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const hasLoaded = ref(false)

  const load = () => {
    username.value = getStoredUsername() ?? generateDefaultUsername()
    hasLoaded.value = true
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
    username.value = generateDefaultUsername()
    hasLoaded.value = true
    persistUsername(username.value)
  }

  return {
    username,
    load,
    setUsername,
    resetUserSettings,
  }
})

export const DEFAULT_SOUND_VOLUME = 80
export const SOUND_VOLUME_STORAGE_KEY = 'queen-game-sound-volume'

export const clampSoundVolume = (volume: number) => {
  if (!Number.isFinite(volume)) return DEFAULT_SOUND_VOLUME

  return Math.min(100, Math.max(0, Math.round(volume)))
}

export const getStoredSoundVolume = () => {
  if (typeof window === 'undefined') return DEFAULT_SOUND_VOLUME

  const storedValue = window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY)
  if (storedValue === null) return DEFAULT_SOUND_VOLUME

  return clampSoundVolume(Number(storedValue))
}

export const persistSoundVolume = (volume: number) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, String(clampSoundVolume(volume)))
}

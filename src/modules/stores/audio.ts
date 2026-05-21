import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  DEFAULT_SOUND_VOLUME,
  clampSoundVolume,
  getStoredSoundVolume,
  persistSoundVolume,
} from '@/modules/utils/soundVolume'

export const useAudioStore = defineStore('audio', () => {
  const soundVolume = ref(DEFAULT_SOUND_VOLUME)
  const hasLoaded = ref(false)

  const load = () => {
    soundVolume.value = getStoredSoundVolume()
    hasLoaded.value = true
  }

  const ensureLoaded = () => {
    if (!hasLoaded.value) {
      load()
    }
  }

  const setSoundVolume = (nextVolume: number) => {
    ensureLoaded()
    soundVolume.value = clampSoundVolume(nextVolume)
    persistSoundVolume(soundVolume.value)
  }

  const resetAudioSettings = () => {
    soundVolume.value = DEFAULT_SOUND_VOLUME
    hasLoaded.value = true
    persistSoundVolume(soundVolume.value)
  }

  return {
    soundVolume,
    load,
    setSoundVolume,
    resetAudioSettings,
  }
})

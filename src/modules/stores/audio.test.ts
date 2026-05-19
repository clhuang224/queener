import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { installStorageMock } from '@/test/localStorage'
import { useAudioStore } from './audio'
import { SOUND_VOLUME_STORAGE_KEY } from '@/modules/utils/soundVolume'

describe('audio store', () => {
  beforeEach(() => {
    installStorageMock()
    setActivePinia(createPinia())
  })

  it('loads saved sound volume from local storage', () => {
    window.localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, '35')

    const audioStore = useAudioStore()
    audioStore.load()

    expect(audioStore.soundVolume).toBe(35)
  })

  it('persists sound volume changes', () => {
    const audioStore = useAudioStore()

    audioStore.setSoundVolume(65)

    expect(window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY)).toBe('65')
  })

  it('clamps invalid sound volume values', () => {
    const audioStore = useAudioStore()

    audioStore.setSoundVolume(200)
    expect(audioStore.soundVolume).toBe(100)
    expect(window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY)).toBe('100')

    audioStore.setSoundVolume(-10)
    expect(audioStore.soundVolume).toBe(0)
    expect(window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY)).toBe('0')
  })
})

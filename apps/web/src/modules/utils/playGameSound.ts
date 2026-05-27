import { GameSoundType } from '../enums/GameSoundType'
import { getEnumValues } from './getEnumValues'
import { getStoredSoundVolume } from './soundVolume'

const soundModules = import.meta.glob<string>('../../assets/sounds/*.mp3', {
  eager: true,
  import: 'default',
})

const getSoundSource = (type: GameSoundType) => {
  const source = soundModules[`../../assets/sounds/${type}.mp3`]

  if (!source) {
    throw new Error(`Missing game sound: ${type}.mp3`)
  }

  return source
}

export const GAME_SOUND_SOURCES = getEnumValues(GameSoundType).reduce(
  (map, type) => ({
    ...map,
    [type]: getSoundSource(type),
  }),
  {} as Record<GameSoundType, string>,
)

interface PlayGameSoundOptions {
  playbackRate?: number
}

export const playGameSound = (
  sound: GameSoundType,
  options: PlayGameSoundOptions = {},
): Promise<void> => {
  if (typeof Audio === 'undefined') return Promise.resolve()

  const soundVolume = getStoredSoundVolume()
  if (soundVolume <= 0) return Promise.resolve()

  return new Promise((resolve) => {
    const audio = new Audio(GAME_SOUND_SOURCES[sound])
    audio.volume = soundVolume / 100
    audio.playbackRate = options.playbackRate ?? 1
    let isDone = false

    const finish = () => {
      if (isDone) return
      isDone = true
      audio.removeEventListener('ended', finish)
      audio.removeEventListener('error', finish)
      resolve()
    }

    audio.addEventListener('ended', finish)
    audio.addEventListener('error', finish)

    try {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(finish)
      }
    } catch {
      finish()
    }
  })
}

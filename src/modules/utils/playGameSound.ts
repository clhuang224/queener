import { GameSoundType } from '../enums/GameSoundType'
import { getEnumValues } from './getEnumValues'

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

const soundSources = getEnumValues(GameSoundType).reduce(
  (map, type) => ({
    ...map,
    [type]: getSoundSource(type),
  }),
  {} as Record<GameSoundType, string>,
)

export const playGameSound = (sound: GameSoundType): Promise<void> => {
  if (typeof Audio === 'undefined') return Promise.resolve()

  return new Promise((resolve) => {
    const audio = new Audio(soundSources[sound])
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

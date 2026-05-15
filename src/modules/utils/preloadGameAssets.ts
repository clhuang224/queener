import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import { GAME_SOUND_SOURCES } from '@/modules/utils/playGameSound'

const PRELOAD_TIMEOUT_MS = 5000

const preloadWithTimeout = (preload: () => Promise<void>): Promise<void> => {
  return new Promise((resolve) => {
    const timeout = window.setTimeout(resolve, PRELOAD_TIMEOUT_MS)

    preload()
      .catch(() => undefined)
      .finally(() => {
        window.clearTimeout(timeout)
        resolve()
      })
  })
}

const preloadImage = (source: string): Promise<void> => {
  if (typeof Image === 'undefined') return Promise.resolve()

  return preloadWithTimeout(
    () =>
      new Promise((resolve, reject) => {
        const image = new Image()

        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => reject(), { once: true })
        image.src = source
      }),
  )
}

const preloadSound = (source: string): Promise<void> => {
  if (typeof fetch === 'undefined') return Promise.resolve()

  return preloadWithTimeout(async () => {
    const response = await fetch(source, {
      cache: 'force-cache',
    })

    if (!response.ok) {
      throw new Error(`Failed to preload sound: ${source}`)
    }
  })
}

export const preloadGameAssets = async (): Promise<void> => {
  const imageSources = Object.values(QUEEN_SKINS).map((skin) => skin.icon)
  const soundSources = Object.values(GAME_SOUND_SOURCES)

  await Promise.allSettled([
    ...imageSources.map(preloadImage),
    ...soundSources.map(preloadSound),
  ])
}

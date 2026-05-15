import { afterEach, describe, expect, it, vi } from 'vitest'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import { GAME_SOUND_SOURCES } from '@/modules/utils/playGameSound'
import { preloadGameAssets } from './preloadGameAssets'

const createImageMock = (status: 'load' | 'error', sources: string[]) => {
  return class ImageMock {
    private listeners = new Map<string, EventListener>()

    addEventListener(type: string, listener: EventListener) {
      this.listeners.set(type, listener)
    }

    set src(source: string) {
      sources.push(source)
      queueMicrotask(() => {
        this.listeners.get(status)?.(new Event(status))
      })
    }
  }
}

describe('preloadGameAssets', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('preloads queen skin icons and game sounds', async () => {
    const imageSources: string[] = []
    const fetchMock = vi.fn<(_: RequestInfo | URL, __?: RequestInit) => Promise<Response>>(() =>
      Promise.resolve({ ok: true } as Response),
    )

    vi.stubGlobal('Image', createImageMock('load', imageSources))
    vi.stubGlobal('fetch', fetchMock)

    await preloadGameAssets()

    expect(imageSources).toEqual(Object.values(QUEEN_SKINS).map((skin) => skin.icon))
    expect(fetchMock).toHaveBeenCalledTimes(Object.values(GAME_SOUND_SOURCES).length)
    expect(fetchMock.mock.calls.map(([source]) => source)).toEqual(Object.values(GAME_SOUND_SOURCES))
  })

  it('finishes even when assets fail to preload', async () => {
    const imageSources: string[] = []
    const fetchMock = vi.fn<(_: RequestInfo | URL, __?: RequestInit) => Promise<Response>>(() =>
      Promise.resolve({ ok: false } as Response),
    )

    vi.stubGlobal('Image', createImageMock('error', imageSources))
    vi.stubGlobal('fetch', fetchMock)

    await expect(preloadGameAssets()).resolves.toBeUndefined()
  })
})

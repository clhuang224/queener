import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@/test/pinia'
import { installStorageMock } from '@/test/localStorage'
import { installResizeObserverMock } from '@/test/resizeObserver'
import {
  BOARD_SKIN_COLOR_COUNT,
  BOARD_SKINS,
  boardSkinMapName,
} from '@/modules/constants/boardSkins'
import { isQueenSkinAvailable, queenSkinMapName } from '@/modules/constants/queenSkins'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { GameSoundType } from '@/modules/enums/GameSoundType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { END_REPLAY_ENABLED_STORAGE_KEY } from '@/modules/stores/gameplay'
import { SOUND_VOLUME_STORAGE_KEY } from '@/modules/utils/soundVolume'
import { getEnumValues } from '@/modules/utils/getEnumValues'
import SettingView from './SettingView.vue'

const push = vi.fn()
const { playGameSound } = vi.hoisted(() => ({
  playGameSound: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

vi.mock('@/modules/utils/playGameSound', () => ({
  playGameSound,
}))

describe('SettingView', () => {
  beforeEach(() => {
    installStorageMock()
    installResizeObserverMock()
    push.mockReset()
    playGameSound.mockReset()
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('updates and persists skin fields', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const findRadioGroup = (label: string) => {
      return wrapper
        .findAll('[role="radiogroup"]')
        .find((group) => group.attributes('aria-label') === label)!
    }
    const boardSkinGroup = findRadioGroup('Board skin')
    const queenSkinGroup = findRadioGroup('Queen skin')
    const findSwitch = (labelId: string) => {
      return wrapper
        .findAll('[role="switch"]')
        .find((switchControl) => switchControl.attributes('aria-labelledby') === labelId)!
    }
    const rainbowBoardRadio = boardSkinGroup
      .findAll('[role="radio"]')
      .find(
        (radio) => radio.attributes('aria-labelledby') === `board-skin-${BoardSkinType.RAINBOW}-label`,
      )!
    const autumnBoardRadio = boardSkinGroup
      .findAll('[role="radio"]')
      .find(
        (radio) => radio.attributes('aria-labelledby') === `board-skin-${BoardSkinType.AUTUMN}-label`,
      )!
    const textureSwitch = findSwitch('board-texture-label')
    const endReplaySwitch = findSwitch('end-replay-label')
    const blackCrownRadio = queenSkinGroup
      .findAll('[role="radio"]')
      .find(
        (radio) =>
          radio.attributes('aria-labelledby') === `queen-skin-${QueenSkinType.BLACK_CROWN}-label`,
      )!

    expect(rainbowBoardRadio.attributes('aria-checked')).toBe('true')
    expect(textureSwitch.attributes('aria-checked')).toBe('false')
    expect(endReplaySwitch.attributes('aria-checked')).toBe('true')
    expect(blackCrownRadio.attributes('aria-checked')).toBe('false')

    await autumnBoardRadio.trigger('click')
    await textureSwitch.trigger('click')
    await endReplaySwitch.trigger('click')
    await blackCrownRadio.trigger('click')

    expect(window.localStorage.getItem('queen-game-board-skin')).toBe(BoardSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-board-texture-enabled')).toBe('true')
    expect(window.localStorage.getItem(END_REPLAY_ENABLED_STORAGE_KEY)).toBe('false')
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe(QueenSkinType.BLACK_CROWN)
    expect(wrapper.findAll('.preview-cell')).toHaveLength(BOARD_SKIN_COLOR_COUNT * 4)
    expect(wrapper.findAll('[data-state="found"]')).toHaveLength(BOARD_SKIN_COLOR_COUNT)
    expect(wrapper.findAll('[data-state="note"]')).toHaveLength(BOARD_SKIN_COLOR_COUNT)
    expect(wrapper.findAll('[data-state="wrong"]')).toHaveLength(BOARD_SKIN_COLOR_COUNT)
    expect(wrapper.findAll('[data-state="empty"]')).toHaveLength(BOARD_SKIN_COLOR_COUNT)
    expect(wrapper.find('.preview-cell').attributes('data-color')).toBe(
      BOARD_SKINS[BoardSkinType.AUTUMN][0],
    )
    expect(wrapper.find('.preview-cell').classes().length).toBeGreaterThan(2)
  })

  it('shows skin options in enum order with unavailable queen skins hidden', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 3))

    const wrapper = mount(SettingView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const findRadioGroup = (label: string) => {
      return wrapper
        .findAll('[role="radiogroup"]')
        .find((group) => group.attributes('aria-label') === label)!
    }
    const boardSkinGroup = findRadioGroup('Board skin')
    const queenSkinGroup = findRadioGroup('Queen skin')
    const boardSkinLabels = boardSkinGroup.findAll('[role="radio"]').map((radio) => {
      const labelId = radio.attributes('aria-labelledby')!

      return wrapper.find(`#${labelId}`).text()
    })
    const queenSkinLabels = queenSkinGroup.findAll('[role="radio"]').map((radio) => {
      const labelId = radio.attributes('aria-labelledby')!

      return wrapper.find(`#${labelId}`).text()
    })
    const expectedBoardSkinLabels = getEnumValues(BoardSkinType).map(
      (skin) => boardSkinMapName[skin],
    )
    const expectedQueenSkinLabels = getEnumValues(QueenSkinType)
      .filter((skin) => isQueenSkinAvailable(skin))
      .map((skin) => queenSkinMapName[skin])

    expect(boardSkinLabels).toEqual(expectedBoardSkinLabels)
    expect(queenSkinLabels).toEqual(expectedQueenSkinLabels)
    expect(
      wrapper
        .findAll('[role="switch"]')
        .map((switchControl) => switchControl.attributes('aria-labelledby')),
    ).toEqual(['board-texture-label', 'end-replay-label'])
    expect(wrapper.findAll('.board-swatch-strip')).toHaveLength(expectedBoardSkinLabels.length)
    expect(wrapper.find('.board-swatch-strip').findAll('.board-swatch')).toHaveLength(
      BOARD_SKIN_COLOR_COUNT,
    )
    expect(wrapper.findAll('.queen-skin-icon')).toHaveLength(expectedQueenSkinLabels.length)
    expect(wrapper.find('[role="slider"]').attributes('aria-label')).toBe(
      'Sound effects volume',
    )
    expect(wrapper.text()).toContain('80%')
  })

  it('loads saved sound volume', async () => {
    window.localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, '35')

    const wrapper = mount(SettingView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('35%')
  })

  it('returns to the home page', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const backButton = wrapper
      .findAll('button')
      .find((button) => button.attributes('aria-label') === 'Back home')
    await backButton!.trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'home',
    })
  })

  it('plays a random sound preview', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    await wrapper.get('button[aria-label="Preview sound effect"]').trigger('click')

    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.CORRECT)
  })

  it('resets settings to defaults', async () => {
    window.localStorage.setItem('queen-game-board-skin', BoardSkinType.AUTUMN)
    window.localStorage.setItem('queen-game-board-texture-enabled', 'true')
    window.localStorage.setItem('queen-game-queen-skin', QueenSkinType.BLACK_CROWN)
    window.localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, '35')
    window.localStorage.setItem(END_REPLAY_ENABLED_STORAGE_KEY, 'false')

    const wrapper = mount(SettingView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    await wrapper.vm.$nextTick()

    await wrapper.get('button[aria-label="Reset settings"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(window.localStorage.getItem('queen-game-board-skin')).toBe(BoardSkinType.RAINBOW)
    expect(window.localStorage.getItem('queen-game-board-texture-enabled')).toBe('false')
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe(QueenSkinType.PINK_CROWN)
    expect(window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY)).toBe('80')
    expect(window.localStorage.getItem(END_REPLAY_ENABLED_STORAGE_KEY)).toBe('true')
    expect(wrapper.text()).toContain('80%')
  })
})

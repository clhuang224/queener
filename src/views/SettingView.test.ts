import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@/test/pinia'
import { installStorageMock } from '@/test/localStorage'
import {
  BOARD_SKIN_COLOR_COUNT,
  BOARD_SKINS,
  boardSkinMapName,
} from '@/modules/constants/boardSkins'
import { isQueenSkinAvailable, queenSkinMapName } from '@/modules/constants/queenSkins'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { getEnumValues } from '@/modules/utils/getEnumValues'
import SettingView from './SettingView.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

describe('SettingView', () => {
  beforeEach(() => {
    installStorageMock()
    push.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
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
    const textureSwitch = wrapper.find('[role="switch"]')
    const blackCrownRadio = queenSkinGroup
      .findAll('[role="radio"]')
      .find(
        (radio) =>
          radio.attributes('aria-labelledby') === `queen-skin-${QueenSkinType.BLACK_CROWN}-label`,
      )!

    expect(rainbowBoardRadio.attributes('aria-checked')).toBe('true')
    expect(textureSwitch.attributes('aria-checked')).toBe('false')
    expect(blackCrownRadio.attributes('aria-checked')).toBe('false')

    await autumnBoardRadio.trigger('click')
    await textureSwitch.trigger('click')
    await blackCrownRadio.trigger('click')

    expect(window.localStorage.getItem('queen-game-board-skin')).toBe(BoardSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-board-texture-enabled')).toBe('true')
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
    expect(wrapper.find('[role="switch"]').attributes('aria-labelledby')).toBe(
      'board-texture-label',
    )
    expect(wrapper.findAll('.board-swatch-strip')).toHaveLength(expectedBoardSkinLabels.length)
    expect(wrapper.find('.board-swatch-strip').findAll('.board-swatch')).toHaveLength(
      BOARD_SKIN_COLOR_COUNT,
    )
    expect(wrapper.findAll('.queen-skin-icon')).toHaveLength(expectedQueenSkinLabels.length)
  })

  it('returns to the home page', async () => {
    const wrapper = mount(SettingView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const backButton = wrapper.findAll('button').find((button) => button.text() === 'Back')
    await backButton!.trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'home',
    })
  })
})

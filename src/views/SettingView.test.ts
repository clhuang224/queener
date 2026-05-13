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

    const findOptionButton = (label: string) => {
      return wrapper.findAll('.option-button').find((button) => button.text() === label)!
    }
    const rainbowBoardButton = findOptionButton(boardSkinMapName[BoardSkinType.RAINBOW])
    const autumnBoardButton = findOptionButton(boardSkinMapName[BoardSkinType.AUTUMN])
    const textureOnButton = findOptionButton('On')
    const pinkCrownButton = findOptionButton(queenSkinMapName[QueenSkinType.PINK_CROWN])

    expect(rainbowBoardButton.classes()).toContain('active')

    await autumnBoardButton.trigger('click')
    await textureOnButton.trigger('click')
    await pinkCrownButton.trigger('click')

    expect(window.localStorage.getItem('queen-game-board-skin')).toBe(BoardSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-board-texture-enabled')).toBe('true')
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe(QueenSkinType.PINK_CROWN)
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

    const optionLabels = wrapper.findAll('.option-button').map((button) => button.text())
    const expectedBoardSkinLabels = getEnumValues(BoardSkinType).map(
      (skin) => boardSkinMapName[skin],
    )
    const expectedQueenSkinLabels = getEnumValues(QueenSkinType)
      .filter((skin) => isQueenSkinAvailable(skin))
      .map((skin) => queenSkinMapName[skin])

    expect(optionLabels).toEqual([
      ...expectedBoardSkinLabels,
      'Off',
      'On',
      ...expectedQueenSkinLabels,
    ])
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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@/test/pinia'
import { installStorageMock } from '@/test/localStorage'
import { CELL_SKIN_COLOR_COUNT, CELL_SKINS, cellSkinMapName } from '@/modules/constants/cellSkins'
import { isQueenSkinAvailable, queenSkinMapName } from '@/modules/constants/queenSkins'
import { CellSkinType } from '@/modules/enums/CellSkinType'
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
    const rainbowBoardButton = findOptionButton(cellSkinMapName[CellSkinType.RAINBOW])
    const autumnBoardButton = findOptionButton(cellSkinMapName[CellSkinType.AUTUMN])
    const pinkCrownButton = findOptionButton(queenSkinMapName[QueenSkinType.PINK_CROWN])

    expect(rainbowBoardButton.classes()).toContain('active')

    await autumnBoardButton.trigger('click')
    await pinkCrownButton.trigger('click')

    expect(window.localStorage.getItem('queen-game-cell-skin')).toBe(CellSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe(QueenSkinType.PINK_CROWN)
    expect(wrapper.findAll('.preview-cell')).toHaveLength(CELL_SKIN_COLOR_COUNT * 4)
    expect(wrapper.findAll('[data-state="found"]')).toHaveLength(CELL_SKIN_COLOR_COUNT)
    expect(wrapper.findAll('[data-state="note"]')).toHaveLength(CELL_SKIN_COLOR_COUNT)
    expect(wrapper.findAll('[data-state="wrong"]')).toHaveLength(CELL_SKIN_COLOR_COUNT)
    expect(wrapper.findAll('[data-state="empty"]')).toHaveLength(CELL_SKIN_COLOR_COUNT)
    expect(wrapper.find('.preview-cell').attributes('data-color')).toBe(
      CELL_SKINS[CellSkinType.AUTUMN][0],
    )
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
    const expectedCellSkinLabels = getEnumValues(CellSkinType).map((skin) => cellSkinMapName[skin])
    const expectedQueenSkinLabels = getEnumValues(QueenSkinType)
      .filter((skin) => isQueenSkinAvailable(skin))
      .map((skin) => queenSkinMapName[skin])

    expect(optionLabels).toEqual([...expectedCellSkinLabels, ...expectedQueenSkinLabels])
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

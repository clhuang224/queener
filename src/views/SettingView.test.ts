import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@/test/pinia'
import { installStorageMock } from '@/test/localStorage'
import { cellSkinMapName } from '@/constants/cellSkins'
import { CellSkinType } from '@/enums/CellSkinType'
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
    const rainbowQueenButton = wrapper.findAll('.option-button').filter((button) => {
      return button.text() === 'Rainbow'
    })[1]!

    expect(rainbowBoardButton.classes()).toContain('active')

    await autumnBoardButton.trigger('click')
    await rainbowQueenButton!.trigger('click')

    expect(window.localStorage.getItem('queen-game-cell-skin')).toBe(CellSkinType.AUTUMN)
    expect(window.localStorage.getItem('queen-game-queen-skin')).toBe('rainbow')
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

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@/test/pinia'
import { installStorageMock } from '@/test/localStorage'
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

    const optionButtons = wrapper.findAll('.option-button')
    const rainbowBoardButton = optionButtons[0]!
    const grayscaleBoardButton = optionButtons[1]!
    const rainbowQueenButton = optionButtons[2]!

    expect(rainbowBoardButton.classes()).toContain('active')

    await grayscaleBoardButton!.trigger('click')
    await rainbowQueenButton!.trigger('click')

    expect(window.localStorage.getItem('queen-game-cell-skin')).toBe('grayscale')
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

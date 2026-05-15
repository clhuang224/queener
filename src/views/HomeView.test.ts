import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { installStorageMock } from '@/test/localStorage'
import { createTestingPinia } from '@/test/pinia'
import HomeView from './HomeView.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

describe('HomeView', () => {
  beforeEach(() => {
    installStorageMock()
    push.mockReset()
  })

  it('starts at level 1 and keeps the next arrow locked before level 1 is cleared', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const buttons = wrapper.findAll('button')
    const previousButton = buttons.find(
      (button) => button.attributes('aria-label') === 'Previous level',
    )
    const nextButton = buttons.find((button) => button.attributes('aria-label') === 'Next level')

    expect(wrapper.find('.level-number').text()).toBe('1')
    expect(wrapper.text()).not.toContain('Unlocked:')
    expect(wrapper.find('.level-card').attributes('aria-live')).toBe('polite')
    expect(previousButton!.attributes('disabled')).toBeDefined()
    expect(nextButton!.attributes('disabled')).toBeDefined()
  })

  it('allows selecting only unlocked levels and starts the selected level', async () => {
    window.localStorage.setItem('queen-game-highest-completed-level', '2')

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const buttons = wrapper.findAll('button')
    const nextButton = buttons.find((button) => button.attributes('aria-label') === 'Next level')
    const previousButton = buttons.find(
      (button) => button.attributes('aria-label') === 'Previous level',
    )
    const startButton = buttons.find((button) => button.text() === 'Start')

    await nextButton!.trigger('click')
    expect(wrapper.find('.level-number').text()).toBe('3')

    expect(previousButton!.attributes('disabled')).toBeUndefined()
    expect(nextButton!.attributes('disabled')).toBeDefined()

    await startButton!.trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'game',
      params: {
        level: '3',
      },
    })
  })

  it('opens the setting page', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const settingButton = wrapper
      .findAll('button')
      .find((button) => button.attributes('aria-label') === 'Open settings')
    await settingButton!.trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'setting',
    })
  })

  it('shows board size and hearts for the selected level', async () => {
    window.localStorage.setItem('queen-game-highest-completed-level', '6')

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    await wrapper.vm.$nextTick()
    const previousButton = wrapper
      .findAll('button')
      .find((button) => button.attributes('aria-label') === 'Previous level')

    expect(wrapper.text()).toContain('Board: 8x8 · Hearts: 3')

    await previousButton!.trigger('click')

    expect(wrapper.text()).toContain('Board: 7x7 · Hearts: 2')
  })
})

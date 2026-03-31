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

    expect(wrapper.find('.level-number').text()).toBe('1')
    expect(buttons[0]!.attributes('disabled')).toBeDefined()
    expect(buttons[1]!.attributes('disabled')).toBeDefined()
  })

  it('allows selecting only unlocked levels and starts the selected level', async () => {
    window.localStorage.setItem('queen-game-highest-completed-level', '2')

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const buttons = wrapper.findAll('button')

    await buttons[1]!.trigger('click')
    expect(wrapper.find('.level-number').text()).toBe('3')

    expect(buttons[0]!.attributes('disabled')).toBeUndefined()
    expect(buttons[1]!.attributes('disabled')).toBeDefined()

    await buttons[2]!.trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'game',
      params: {
        level: '3',
      },
    })
  })
})

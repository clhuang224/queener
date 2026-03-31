import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameView from './GameView.vue'
import { installStorageMock } from '@/test/localStorage'
import { createTestingPinia } from '@/test/pinia'

const push = vi.fn()
const openAlertModal = vi.fn()
const openConfirmModal = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
  }),
}))

vi.mock('@/stores/globalModal', () => ({
  useGlobalModalStore: () => ({
    openAlertModal,
    openConfirmModal,
  }),
}))

const mountGameView = () => {
  const wrapper = mount(GameView, {
    props: {
      level: 1,
    },
    global: {
      plugins: [createTestingPinia()],
    },
  })

  return {
    wrapper,
    queenCell: wrapper.find('[data-test="cell-0-2"]'),
    restartButton: wrapper.findAll('button')[0]!,
  }
}

describe('GameView', () => {
  beforeEach(() => {
    installStorageMock()
    push.mockReset()
    openAlertModal.mockReset()
    openConfirmModal.mockReset()
  })

  it('restarts the current level after confirmation', async () => {
    openConfirmModal.mockResolvedValue(undefined)

    const { wrapper, queenCell, restartButton } = mountGameView()

    await queenCell.trigger('dblclick')
    expect(queenCell.text()).toContain('👸')

    await restartButton!.trigger('click')
    await wrapper.vm.$nextTick()

    expect(openConfirmModal).toHaveBeenCalledWith({
      title: 'Restart Level',
      content: 'Are you sure you want to restart this puzzle?',
    })
    expect(queenCell.text()).toBe('')
  })

  it('keeps current progress when restart is cancelled', async () => {
    openConfirmModal.mockRejectedValue(new Error('cancelled'))

    const { wrapper, queenCell, restartButton } = mountGameView()

    await queenCell.trigger('dblclick')
    expect(queenCell.text()).toContain('👸')

    await restartButton!.trigger('click')
    await wrapper.vm.$nextTick()

    expect(queenCell.text()).toContain('👸')
  })
})

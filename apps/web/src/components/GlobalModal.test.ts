import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createTestingPinia } from '@/test/pinia'
import { useGlobalModalStore } from '@/modules/stores/globalModal'
import GlobalModal from './GlobalModal.vue'

describe('GlobalModal', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the global modal as a dialog and settles selected actions', async () => {
    const wrapper = mount(GlobalModal, {
      attachTo: document.body,
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const store = useGlobalModalStore()
    const result = store.openResultModal({
      title: 'Puzzle complete',
      content: 'Choose what to do next.',
      actions: [{ label: 'Next', payload: 'next' }],
    })

    await wrapper.vm.$nextTick()

    const dialog = document.body.querySelector('[role="alertdialog"]')
    expect(dialog?.textContent).toContain('Puzzle complete')
    expect(dialog?.textContent).toContain('Choose what to do next.')

    document.body.querySelector('button')?.click()
    await nextTick()

    await expect(result).resolves.toBe('next')
    expect(document.body.querySelector('[role="alertdialog"]')).toBeNull()

    wrapper.unmount()
  })
})

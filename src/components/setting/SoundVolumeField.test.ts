import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { SliderRoot } from 'reka-ui'
import { installResizeObserverMock } from '@/test/resizeObserver'
import SoundVolumeField from './SoundVolumeField.vue'

describe('SoundVolumeField', () => {
  beforeEach(() => {
    installResizeObserverMock()
  })

  it('shows the current sound volume', () => {
    const wrapper = mount(SoundVolumeField, {
      props: {
        soundVolume: 45,
      },
    })

    expect(wrapper.text()).toContain('Sound Effects')
    expect(wrapper.text()).toContain('45%')
  })

  it('emits updated sound volume from the slider', async () => {
    const wrapper = mount(SoundVolumeField, {
      props: {
        soundVolume: 45,
      },
    })

    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [70])
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:soundVolume')).toEqual([[70]])
  })

  it('emits preview when the preview button is clicked', async () => {
    const wrapper = mount(SoundVolumeField, {
      props: {
        soundVolume: 45,
      },
    })

    await wrapper.get('button[aria-label="Preview sound effect"]').trigger('click')

    expect(wrapper.emitted('preview')).toEqual([[]])
  })
})

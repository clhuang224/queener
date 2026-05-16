import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../common/BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toContain('Click me')
  })
  it('emits click when clicked', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
  it('applies disabled when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
    })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })
  it('passes the aria label to the button element', () => {
    const wrapper = mount(BaseButton, {
      attrs: { 'aria-label': 'Open settings' },
    })
    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Open settings')
  })
  it('applies the icon button class when icon is true', () => {
    const wrapper = mount(BaseButton, {
      props: { icon: true },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('base-button--icon')
  })
  it('applies the ghost variant class when variant is ghost', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'ghost' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('base-button--ghost')
  })
})

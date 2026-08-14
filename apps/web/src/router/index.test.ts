import { describe, expect, it } from 'vitest'
import router from './index'

describe('router page titles', () => {
  it('updates the document title after navigation', async () => {
    await router.push('/setting')
    expect(document.title).toBe('Settings - Queener')

    await router.push('/game/3')
    expect(document.title).toBe('Level 3 - Queener')

    await router.push('/')
    expect(document.title).toBe('Queener')
  })
})

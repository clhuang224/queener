import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Position } from '@/modules/types/board'
import { useGameCellInputEvents } from './useGameCellInputEvents'

const setupCellInput = (isInteractive = true) => {
  const emit = vi.fn()
  const position = ref<Position>([1, 2])
  const cellInput = useGameCellInputEvents({
    emit,
    isInteractive: ref(isInteractive),
    position,
  })

  return {
    cellInput,
    emit,
    position,
  }
}

describe('useGameCellInputEvents', () => {
  it('maps pointer and mouse input to shared press intents', () => {
    const { cellInput, emit } = setupCellInput()

    cellInput.nativeListeners.pointerdown()
    cellInput.nativeListeners.pointerenter()
    cellInput.nativeListeners.click()
    cellInput.nativeListeners.dblclick()
    cellInput.nativeListeners.focus()

    expect(emit).toHaveBeenCalledWith('pressStart', [1, 2])
    expect(emit).toHaveBeenCalledWith('pressEnter', [1, 2])
    expect(emit).toHaveBeenCalledWith('pressClick', [1, 2])
    expect(emit).toHaveBeenCalledWith('pressDoubleClick', [1, 2])
    expect(emit).toHaveBeenLastCalledWith('pressEnter', [1, 2])
  })

  it('maps Space key events to shared press intents', () => {
    const { cellInput, emit } = setupCellInput()
    const keydown = new KeyboardEvent('keydown', { key: ' ', code: 'Space' })
    const keyup = new KeyboardEvent('keyup', { key: ' ', code: 'Space' })
    const keydownPreventDefault = vi.spyOn(keydown, 'preventDefault')
    const keyupPreventDefault = vi.spyOn(keyup, 'preventDefault')

    cellInput.nativeListeners.keydown(keydown)
    cellInput.nativeListeners.keyup(keyup)

    expect(keydownPreventDefault).toHaveBeenCalled()
    expect(keyupPreventDefault).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('pressStart', [1, 2])
    expect(emit).toHaveBeenCalledWith('pressClick', [1, 2])
    expect(emit).toHaveBeenCalledWith('pressEnd', [1, 2])
  })

  it('maps arrow keys to focus movement intents', () => {
    const { cellInput, emit } = setupCellInput()
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    const preventDefault = vi.spyOn(event, 'preventDefault')

    cellInput.nativeListeners.keydown(event)

    expect(preventDefault).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('moveFocus', [1, 2], 'right')
  })

  it('keeps pressEnd active when a cell becomes locked during a press', () => {
    const { cellInput, emit } = setupCellInput(false)

    cellInput.nativeListeners.click()
    cellInput.nativeListeners.keyup(new KeyboardEvent('keyup', { key: ' ', code: 'Space' }))

    expect(emit).not.toHaveBeenCalledWith('pressClick', [1, 2])
    expect(emit).toHaveBeenCalledWith('pressEnd', [1, 2])
  })
})

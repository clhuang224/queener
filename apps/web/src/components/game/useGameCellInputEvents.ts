import type { Ref } from 'vue'
import type { Position } from '@/modules/types/board'
import type { CellFocusDirection, CellInputEmit, CellPressIntent } from './gameInputEvents'

type UseGameCellInputEventsOptions = {
  emit: CellInputEmit
  isInteractive: Ref<boolean>
  position: Ref<Position>
}

type CellNativeListeners = {
  dblclick: () => void
  pointerdown: () => void
  pointerenter: () => void
  click: () => void
  focus: () => void
  keydown: (event: KeyboardEvent) => void
  keyup: (event: KeyboardEvent) => void
}

const focusDirectionByKey: Partial<Record<string, CellFocusDirection>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const isSpaceKey = (event: KeyboardEvent) => event.key === ' ' || event.code === 'Space'

export const useGameCellInputEvents = ({
  emit,
  isInteractive,
  position,
}: UseGameCellInputEventsOptions) => {
  const emitPressIntent = (event: CellPressIntent) => {
    if (event !== 'pressEnd' && !isInteractive.value) return
    emit(event, position.value)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const direction = focusDirectionByKey[event.key]
    if (direction !== undefined) {
      event.preventDefault()
      emit('moveFocus', position.value, direction)
      return
    }

    if (!isSpaceKey(event)) return

    event.preventDefault()
    if (event.repeat) return

    emitPressIntent('pressStart')
  }

  const handleKeyup = (event: KeyboardEvent) => {
    if (!isSpaceKey(event)) return

    event.preventDefault()
    emitPressIntent('pressClick')
    emitPressIntent('pressEnd')
  }

  const nativeListeners: CellNativeListeners = {
    dblclick: () => emitPressIntent('pressDoubleClick'),
    pointerdown: () => emitPressIntent('pressStart'),
    pointerenter: () => emitPressIntent('pressEnter'),
    click: () => emitPressIntent('pressClick'),
    focus: () => emitPressIntent('pressEnter'),
    keydown: handleKeydown,
    keyup: handleKeyup,
  }

  return {
    nativeListeners,
  }
}

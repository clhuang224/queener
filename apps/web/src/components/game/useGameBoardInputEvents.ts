import type { Ref } from 'vue'
import type { Position } from '@/modules/types/board'
import type { TouchMoveEvent } from './useGameBoardGestures'
import type { CellFocusDirection } from './gameInputEvents'

const moveOffsetByDirection: Record<CellFocusDirection, Position> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
}

type UseGameBoardInputEventsOptions = {
  boardRef: Ref<HTMLDivElement | null>
  boardSize: Ref<number>
}

type BoardInputHandlers = {
  pressEnd: () => void
  touchMove: (event: TouchMoveEvent) => void
}

type BoardNativeListeners = {
  pointerup: () => void
  pointercancel: () => void
  mouseleave: () => void
  touchmove: (event: TouchMoveEvent) => void
  touchend: () => void
  touchcancel: () => void
}

export const useGameBoardInputEvents = ({
  boardRef,
  boardSize,
}: UseGameBoardInputEventsOptions) => {
  const getElementFromPoint = (clientX: number, clientY: number) => {
    const element = document.elementFromPoint(clientX, clientY)
    if (!(element instanceof Element)) return null
    if (!boardRef.value?.contains(element)) return null
    return element
  }

  const moveFocus = ([row, column]: Position, direction: CellFocusDirection) => {
    const [rowOffset, columnOffset] = moveOffsetByDirection[direction]
    const nextRow = row + rowOffset
    const nextColumn = column + columnOffset

    if (
      nextRow < 0 ||
      nextRow >= boardSize.value ||
      nextColumn < 0 ||
      nextColumn >= boardSize.value
    ) {
      return
    }

    boardRef.value
      ?.querySelector<HTMLElement>(`[data-row="${nextRow}"][data-column="${nextColumn}"]`)
      ?.focus()
  }

  const createBoardNativeListeners = ({
    pressEnd,
    touchMove,
  }: BoardInputHandlers): BoardNativeListeners => ({
    pointerup: pressEnd,
    pointercancel: pressEnd,
    mouseleave: pressEnd,
    touchmove: touchMove,
    touchend: pressEnd,
    touchcancel: pressEnd,
  })

  return {
    createBoardNativeListeners,
    getElementFromPoint,
    moveFocus,
  }
}

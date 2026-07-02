import { onScopeDispose, ref } from 'vue'
import type { Position } from '@/modules/types/board'

type ElementFromPoint = (clientX: number, clientY: number) => Element | null
type TouchPoint = {
  clientX: number
  clientY: number
}

type TouchMoveEvent = {
  preventDefault: () => void
  touches: ArrayLike<TouchPoint>
}

type UseGameBoardGesturesOptions = {
  clickDelayMs?: number
  getElementFromPoint: ElementFromPoint
  isInteractive: (position: Position) => boolean
  isNote: (position: Position) => boolean
  markNote: (position: Position) => void
  markQueen: (position: Position) => void
  removeNote: (position: Position) => void
}

type DragNoteAction = 'mark' | 'remove'

export const useGameBoardGestures = ({
  clickDelayMs = 250,
  getElementFromPoint,
  isInteractive,
  isNote,
  markNote,
  markQueen,
  removeNote,
}: UseGameBoardGesturesOptions) => {
  const isDragging = ref(false)
  const isPointerDown = ref(false)
  const suppressNextClick = ref(false)

  let dragStartPosition: Position | null = null
  let dragNoteAction: DragNoteAction | null = null
  let draggedPositions = new Set<string>()
  let pendingNoteTimer: ReturnType<typeof setTimeout> | null = null
  let pendingNotePosition: Position | null = null

  const getPositionKey = ([row, column]: Position) => `${row}-${column}`

  const getPositionFromCellElement = (element: Element | null): Position | null => {
    const cell = element?.closest('.game-cell')
    if (!(cell instanceof HTMLElement)) return null

    const row = Number(cell.dataset.row)
    const column = Number(cell.dataset.column)

    if (Number.isNaN(row) || Number.isNaN(column)) return null

    return [row, column]
  }

  const clearPendingNote = () => {
    if (pendingNoteTimer !== null) {
      clearTimeout(pendingNoteTimer)
      pendingNoteTimer = null
    }
    pendingNotePosition = null
  }

  const applySingleClickNoteAction = (position: Position) => {
    if (!isInteractive(position)) return

    if (isNote(position)) {
      removeNote(position)
    } else {
      markNote(position)
    }
  }

  const flushPendingNote = () => {
    if (pendingNotePosition !== null) {
      applySingleClickNoteAction(pendingNotePosition)
    }
    clearPendingNote()
  }

  const applyDraggedNoteAction = (position: Position) => {
    if (!isInteractive(position)) return

    const key = getPositionKey(position)
    if (draggedPositions.has(key)) return

    if (dragNoteAction === 'remove') {
      removeNote(position)
    } else {
      markNote(position)
    }

    draggedPositions.add(key)
  }

  const resetPointerSession = () => {
    isPointerDown.value = false
    dragStartPosition = null
    dragNoteAction = null
    draggedPositions = new Set<string>()
  }

  const handlePointerDown = (position: Position) => {
    if (!isInteractive(position)) return

    isPointerDown.value = true
    isDragging.value = false
    suppressNextClick.value = false
    dragStartPosition = position
    dragNoteAction = isNote(position) ? 'remove' : 'mark'
    draggedPositions = new Set<string>()
  }

  const handlePointerEnter = (position: Position) => {
    if (!isInteractive(position)) return
    if (!isPointerDown.value || dragStartPosition === null) return

    const startKey = getPositionKey(dragStartPosition)
    const currentKey = getPositionKey(position)

    if (!isDragging.value && currentKey === startKey) return

    clearPendingNote()

    if (!isDragging.value) {
      isDragging.value = true
      suppressNextClick.value = true
      applyDraggedNoteAction(dragStartPosition)
    }

    applyDraggedNoteAction(position)
  }

  const handleTouchMove = (event: TouchMoveEvent) => {
    if (!isPointerDown.value || dragStartPosition === null) return

    const touch = event.touches[0]
    if (!touch) return

    const position = getPositionFromCellElement(getElementFromPoint(touch.clientX, touch.clientY))
    if (position === null) return

    event.preventDefault()
    handlePointerEnter(position)
  }

  const handleNoteClick = (position: Position) => {
    if (suppressNextClick.value) {
      suppressNextClick.value = false
      return
    }

    if (!isInteractive(position)) return

    if (
      pendingNotePosition !== null &&
      getPositionKey(pendingNotePosition) !== getPositionKey(position)
    ) {
      flushPendingNote()
    }

    clearPendingNote()
    pendingNotePosition = position
    pendingNoteTimer = setTimeout(() => {
      applySingleClickNoteAction(position)
      clearPendingNote()
    }, clickDelayMs)
  }

  const handleMarkQueen = (position: Position) => {
    if (!isInteractive(position)) return

    clearPendingNote()
    markQueen(position)
  }

  const handlePressClick = (position: Position) => {
    if (
      pendingNotePosition !== null &&
      getPositionKey(pendingNotePosition) === getPositionKey(position)
    ) {
      handleMarkQueen(position)
      return
    }

    handleNoteClick(position)
  }

  const handlePointerEnd = () => {
    isDragging.value = false
    resetPointerSession()
  }

  onScopeDispose(() => {
    clearPendingNote()
  })

  return {
    handleMarkQueen,
    handleNoteClick,
    handlePressClick,
    handlePressEnd: handlePointerEnd,
    handlePressEnter: handlePointerEnter,
    handlePressStart: handlePointerDown,
    handlePointerDown,
    handlePointerEnd,
    handlePointerEnter,
    handleTouchMove,
  }
}

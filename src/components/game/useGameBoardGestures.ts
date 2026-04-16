import { onScopeDispose, ref } from 'vue'
import type { Position } from '@/types/board'

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
  markQueen: (position: Position) => void
  toggleNote: (position: Position) => void
}

export const useGameBoardGestures = ({
  clickDelayMs = 250,
  getElementFromPoint,
  markQueen,
  toggleNote,
}: UseGameBoardGesturesOptions) => {
  const isDragging = ref(false)
  const isPointerDown = ref(false)
  const suppressNextClick = ref(false)

  let dragStartPosition: Position | null = null
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

  const flushPendingNote = () => {
    if (pendingNotePosition !== null) {
      toggleNote(pendingNotePosition)
    }
    clearPendingNote()
  }

  const toggleDraggedPosition = (position: Position) => {
    const key = getPositionKey(position)
    if (draggedPositions.has(key)) return
    toggleNote(position)
    draggedPositions.add(key)
  }

  const resetPointerSession = () => {
    isPointerDown.value = false
    dragStartPosition = null
    draggedPositions = new Set<string>()
  }

  const handlePointerDown = (position: Position) => {
    isPointerDown.value = true
    isDragging.value = false
    suppressNextClick.value = false
    dragStartPosition = position
    draggedPositions = new Set<string>()
  }

  const handlePointerEnter = (position: Position) => {
    if (!isPointerDown.value || dragStartPosition === null) return

    const startKey = getPositionKey(dragStartPosition)
    const currentKey = getPositionKey(position)

    if (!isDragging.value && currentKey === startKey) return

    clearPendingNote()

    if (!isDragging.value) {
      isDragging.value = true
      suppressNextClick.value = true
      toggleDraggedPosition(dragStartPosition)
    }

    toggleDraggedPosition(position)
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

    if (
      pendingNotePosition !== null &&
      getPositionKey(pendingNotePosition) !== getPositionKey(position)
    ) {
      flushPendingNote()
    }

    clearPendingNote()
    pendingNotePosition = position
    pendingNoteTimer = setTimeout(() => {
      toggleNote(position)
      clearPendingNote()
    }, clickDelayMs)
  }

  const handleMarkQueen = (position: Position) => {
    clearPendingNote()
    markQueen(position)
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
    handlePointerDown,
    handlePointerEnd,
    handlePointerEnter,
    handleTouchMove,
  }
}

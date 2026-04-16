import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import QueenGame from '@/game/QueenGame'
import type { Puzzle } from '@/types/puzzle'
import { useGameBoardGestures } from './useGameBoardGestures'

const TEST_PUZZLE: Puzzle = {
  id: 'test-puzzle',
  rules: {
    size: 2,
    allowDisconnectedRegions: false,
    queensPerUnit: 1,
  },
  regions: [
    [0, 0],
    [1, 1],
  ],
  queens: [[0, 0], [1, 1]],
}

const createCellElement = (row: number, column: number) => {
  const cell = document.createElement('div')
  cell.className = 'game-cell'
  cell.dataset.row = String(row)
  cell.dataset.column = String(column)
  return cell
}

const setupGestures = () => {
  const game = new QueenGame(TEST_PUZZLE)
  const getElementFromPoint = vi.fn<(_: number, __: number) => Element | null>()
  const scope = effectScope()

  const gestures = scope.run(() =>
    useGameBoardGestures({
      getElementFromPoint,
      markQueen: (position) => game.markQueen(position),
      toggleNote: (position) => game.toggleNote(position),
    }),
  )

  if (!gestures) {
    throw new Error('Failed to create game board gestures')
  }

  return {
    game,
    gestures,
    getElementFromPoint,
    stop: () => scope.stop(),
  }
}

describe('useGameBoardGestures', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('toggles a note after a single click delay', () => {
    const { game, gestures, stop } = setupGestures()

    gestures.handleNoteClick([0, 1])
    expect(game.board[0]![1]!.status).toBe('empty')

    vi.advanceTimersByTime(300)

    expect(game.board[0]![1]!.status).toBe('note')
    stop()
  })

  it('marks a queen on double click without leaving a note behind', () => {
    const { game, gestures, stop } = setupGestures()

    gestures.handleNoteClick([0, 0])
    gestures.handleNoteClick([0, 0])
    gestures.handleMarkQueen([0, 0])

    vi.advanceTimersByTime(300)

    expect(game.board[0]![0]!.status).toBe('found')
    expect(game.board[0]![0]!.isFound()).toBe(true)
    stop()
  })

  it('keeps drag note marking from being undone by the release click', () => {
    const { game, gestures, stop } = setupGestures()

    gestures.handlePointerDown([0, 0])
    gestures.handlePointerEnter([0, 1])
    gestures.handlePointerEnd()
    gestures.handleNoteClick([0, 1])

    vi.advanceTimersByTime(300)

    expect(game.board[0]![0]!.status).toBe('note')
    expect(game.board[0]![1]!.status).toBe('note')
    stop()
  })

  it('marks touched cells while sliding on mobile', () => {
    const { game, gestures, getElementFromPoint, stop } = setupGestures()
    const preventDefault = vi.fn()

    getElementFromPoint.mockReturnValue(createCellElement(0, 1))

    gestures.handlePointerDown([0, 0])
    gestures.handleTouchMove({
      preventDefault,
      touches: [{ clientX: 30, clientY: 30 }],
    })
    gestures.handlePointerEnd()

    expect(getElementFromPoint).toHaveBeenCalledWith(30, 30)
    expect(preventDefault).toHaveBeenCalled()
    expect(game.board[0]![0]!.status).toBe('note')
    expect(game.board[0]![1]!.status).toBe('note')
    stop()
  })
})

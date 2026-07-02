import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useGameBoardInputEvents } from './useGameBoardInputEvents'

const createCell = (row: number, column: number) => {
  const cell = document.createElement('div')
  cell.tabIndex = 0
  cell.dataset.row = String(row)
  cell.dataset.column = String(column)
  cell.dataset.test = `cell-${row}-${column}`
  return cell
}

const setupBoardInput = () => {
  const board = document.createElement('div')
  const cells = [
    createCell(0, 0),
    createCell(0, 1),
    createCell(1, 0),
    createCell(1, 1),
  ]

  for (const cell of cells) {
    board.append(cell)
  }

  document.body.append(board)

  const boardInput = useGameBoardInputEvents({
    boardRef: ref(board),
    boardSize: ref(2),
  })

  return {
    board,
    boardInput,
    cells,
  }
}

describe('useGameBoardInputEvents', () => {
  afterEach(() => {
    document.body.replaceChildren()
    Reflect.deleteProperty(document, 'elementFromPoint')
    vi.restoreAllMocks()
  })

  it('moves focus to the next cell in a direction', () => {
    const { boardInput, cells } = setupBoardInput()

    cells[0]!.focus()
    boardInput.moveFocus([0, 0], 'right')
    expect((document.activeElement as HTMLElement | null)?.dataset.test).toBe('cell-0-1')

    boardInput.moveFocus([0, 1], 'down')
    expect((document.activeElement as HTMLElement | null)?.dataset.test).toBe('cell-1-1')
  })

  it('keeps focus in place at the board edge', () => {
    const { boardInput, cells } = setupBoardInput()

    cells[0]!.focus()
    boardInput.moveFocus([0, 0], 'left')

    expect((document.activeElement as HTMLElement | null)?.dataset.test).toBe('cell-0-0')
  })

  it('resolves only elements inside the board from screen coordinates', () => {
    const { boardInput, cells } = setupBoardInput()
    const outside = document.createElement('div')
    document.body.append(outside)
    const elementFromPoint = vi.fn()
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPoint,
    })

    elementFromPoint.mockReturnValue(cells[1]!)
    expect(boardInput.getElementFromPoint(10, 20)).toBe(cells[1])

    elementFromPoint.mockReturnValue(outside)
    expect(boardInput.getElementFromPoint(10, 20)).toBeNull()
  })

  it('provides native board listeners for shared press handlers', () => {
    const { boardInput } = setupBoardInput()
    const pressEnd = vi.fn()
    const touchMove = vi.fn()

    const listeners = boardInput.createBoardNativeListeners({
      pressEnd,
      touchMove,
    })

    expect(Object.keys(listeners)).toEqual([
      'pointerup',
      'pointercancel',
      'mouseleave',
      'touchmove',
      'touchend',
      'touchcancel',
    ])

    listeners.pointerup()
    listeners.pointercancel()
    listeners.mouseleave()
    listeners.touchend()
    listeners.touchcancel()
    listeners.touchmove({
      preventDefault: vi.fn(),
      touches: [],
    })

    expect(pressEnd).toHaveBeenCalledTimes(5)
    expect(touchMove).toHaveBeenCalledTimes(1)
  })
})

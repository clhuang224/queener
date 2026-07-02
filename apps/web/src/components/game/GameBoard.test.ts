import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBoard from './GameBoard.vue'
import QueenGame from '@/modules/game/QueenGame'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { Puzzle } from '@/modules/types/puzzle'

const { playGameSound } = vi.hoisted(() => ({
  playGameSound: vi.fn(),
}))

vi.mock('@/modules/utils/playGameSound', () => ({
  playGameSound,
}))

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
  queens: [
    [0, 0],
    [1, 1],
  ],
}

const mountedWrappers: Array<ReturnType<typeof mount>> = []

const mountGameBoard = () => {
  const game = new QueenGame(TEST_PUZZLE)
  const wrapper = mount(GameBoard, {
    attachTo: document.body,
    props: {
      game,
      queenSkin: QueenSkinType.PINK_CROWN,
      boardSkin: BoardSkinType.LAKE,
      boardTextureEnabled: false,
      hintedPosition: null,
    },
  })
  mountedWrappers.push(wrapper)

  return {
    game,
    wrapper,
  }
}

const findCell = (wrapper: ReturnType<typeof mount>, row: number, column: number) => {
  return wrapper.find(`[data-test="cell-${row}-${column}"]`)
}

const pressSpace = async (cell: ReturnType<typeof findCell>) => {
  await cell.trigger('keydown', { key: ' ', code: 'Space' })
  await cell.trigger('keyup', { key: ' ', code: 'Space' })
}

const focusCell = async (cell: ReturnType<typeof findCell>) => {
  const element = cell.element as HTMLElement
  element.focus()
  await cell.trigger('focus')
}

const expectActiveCell = (row: number, column: number) => {
  expect((document.activeElement as HTMLElement | null)?.dataset.test).toBe(`cell-${row}-${column}`)
}

describe('GameBoard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    playGameSound.mockReset()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    for (const wrapper of mountedWrappers) {
      wrapper.unmount()
    }
    mountedWrappers.length = 0
  })

  it('emits note records after note state changes', async () => {
    const { wrapper } = mountGameBoard()

    await findCell(wrapper, 0, 1).trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('mark-note')).toEqual([[[0, 1]]])

    await findCell(wrapper, 0, 1).trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('remove-note')).toEqual([[[0, 1]]])
  })

  it('emits queen records after queen marking attempts', async () => {
    const { wrapper } = mountGameBoard()

    await findCell(wrapper, 0, 0).trigger('dblclick')
    await findCell(wrapper, 0, 1).trigger('dblclick')

    expect(wrapper.emitted('mark-queen')).toEqual([[[0, 0]], [[0, 1]]])
  })

  it('uses Space as a keyboard single-click note action', async () => {
    const { wrapper } = mountGameBoard()
    const cell = findCell(wrapper, 0, 1)

    await pressSpace(cell)
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('mark-note')).toEqual([[[0, 1]]])

    await pressSpace(cell)
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('remove-note')).toEqual([[[0, 1]]])
  })

  it('uses double Space as a keyboard double-click queen action', async () => {
    const { wrapper } = mountGameBoard()
    const queenCell = findCell(wrapper, 0, 0)

    await pressSpace(queenCell)
    await pressSpace(queenCell)
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('mark-queen')).toEqual([[[0, 0]]])
    expect(wrapper.emitted('mark-note')).toBeUndefined()
  })

  it('uses held Space as a keyboard drag note action across focused cells', async () => {
    const { wrapper } = mountGameBoard()
    const startCell = findCell(wrapper, 0, 1)
    const nextCell = findCell(wrapper, 1, 1)

    await focusCell(startCell)
    await startCell.trigger('keydown', { key: ' ', code: 'Space' })
    await startCell.trigger('keydown', { key: 'ArrowDown' })
    await nextCell.trigger('keyup', { key: ' ', code: 'Space' })
    await wrapper.vm.$nextTick()

    expectActiveCell(1, 1)
    expect(wrapper.emitted('mark-note')).toEqual([[[0, 1]], [[1, 1]]])
  })

  it('moves focus between board cells with arrow keys', async () => {
    const { wrapper } = mountGameBoard()
    const startCell = findCell(wrapper, 0, 0)

    await focusCell(startCell)
    await startCell.trigger('keydown', { key: 'ArrowRight' })
    await wrapper.vm.$nextTick()
    expectActiveCell(0, 1)

    await findCell(wrapper, 0, 1).trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    expectActiveCell(1, 1)

    await findCell(wrapper, 1, 1).trigger('keydown', { key: 'ArrowLeft' })
    await wrapper.vm.$nextTick()
    expectActiveCell(1, 0)

    await findCell(wrapper, 1, 0).trigger('keydown', { key: 'ArrowUp' })
    await wrapper.vm.$nextTick()
    expectActiveCell(0, 0)
  })

  it('keeps marked queens focusable while Space stays a no-op', async () => {
    const { game, wrapper } = mountGameBoard()
    const [queenRow, queenColumn] = game.board
      .flat()
      .find((cell) => cell.isQueen())!
      .getPosition()
    const queenCell = findCell(wrapper, queenRow, queenColumn)

    await queenCell.trigger('dblclick')
    await wrapper.vm.$nextTick()

    expect(queenCell.attributes('data-status')).toBe('found')
    expect(queenCell.attributes('tabindex')).toBe('0')

    await focusCell(queenCell)
    await pressSpace(queenCell)
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    expectActiveCell(queenRow, queenColumn)
    expect(wrapper.emitted('mark-queen')).toEqual([[[queenRow, queenColumn]]])
    expect(wrapper.emitted('mark-note')).toBeUndefined()
    expect(wrapper.emitted('remove-note')).toBeUndefined()
  })

  it('keeps focus in place when arrow navigation reaches the board edge', async () => {
    const { wrapper } = mountGameBoard()
    const startCell = findCell(wrapper, 0, 0)

    await focusCell(startCell)
    await startCell.trigger('keydown', { key: 'ArrowLeft' })
    await wrapper.vm.$nextTick()

    expectActiveCell(0, 0)
  })
})

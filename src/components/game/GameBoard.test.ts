import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBoard from '../game/GameBoard.vue'
import QueenGame from '@/game/QueenGame'
import type { Puzzle } from '@/types/puzzle'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
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
  queens: [[0, 0], [1, 1]],
}

const mountBoard = () => {
  const game = new QueenGame(TEST_PUZZLE)
  const wrapper = mount(GameBoard, {
    props: {
      game,
      queenSkin: 'grayscale',
      cellSkin: 'rainbow',
    },
  })

  return {
    game,
    wrapper,
    cells: wrapper.findAll('.game-cell'),
  }
}

describe('GameBoard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('toggles a note after a single click delay', async () => {
    const { game, cells } = mountBoard()

    await cells[1]!.trigger('click')
    expect(game.board[0]![1]!.status).toBe('empty')

    vi.advanceTimersByTime(300)

    expect(game.board[0]![1]!.status).toBe('note')
  })

  it('marks a queen on double click without leaving a note behind', async () => {
    const { game, cells } = mountBoard()

    await cells[0]!.trigger('click')
    await cells[0]!.trigger('click')
    await cells[0]!.trigger('dblclick')

    vi.advanceTimersByTime(300)

    expect(game.board[0]![0]!.status).toBe('found')
    expect(game.board[0]![0]!.isFound()).toBe(true)
  })

  it('keeps drag note marking from being undone by the release click', async () => {
    const { game, wrapper, cells } = mountBoard()

    await cells[0]!.trigger('pointerdown')
    await cells[1]!.trigger('pointerenter')
    await wrapper.trigger('pointerup')
    await cells[1]!.trigger('click')

    vi.advanceTimersByTime(300)

    expect(game.board[0]![0]!.status).toBe('note')
    expect(game.board[0]![1]!.status).toBe('note')
  })
})

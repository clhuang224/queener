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

const mountGameBoard = () => {
  const game = new QueenGame(TEST_PUZZLE)
  const wrapper = mount(GameBoard, {
    props: {
      game,
      queenSkin: QueenSkinType.PINK_CROWN,
      boardSkin: BoardSkinType.LAKE,
      boardTextureEnabled: false,
      hintedPosition: null,
    },
  })

  return {
    game,
    wrapper,
  }
}

const findCell = (wrapper: ReturnType<typeof mount>, row: number, column: number) => {
  return wrapper.find(`[data-test="cell-${row}-${column}"]`)
}

describe('GameBoard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    playGameSound.mockReset()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
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
})

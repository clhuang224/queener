import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameRunReplayBoard from './GameRunReplayBoard.vue'
import { ActionType } from '@/modules/enums/ActionType'
import type { Puzzle } from '@/modules/types/puzzle'
import type { RunActionRecord } from '@/modules/types/run'

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

const TEST_RECORDS: RunActionRecord[] = [
  {
    action: ActionType.MARK_NOTE,
    actionAtMillisecond: 500,
    position: [0, 1],
  },
  {
    action: ActionType.REMOVE_NOTE,
    actionAtMillisecond: 1000,
    position: [0, 1],
  },
  {
    action: ActionType.MARK_QUEEN,
    actionAtMillisecond: 1500,
    position: [0, 0],
  },
  {
    action: ActionType.MARK_QUEEN,
    actionAtMillisecond: 2000,
    position: [1, 0],
  },
]

const mountReplayBoard = () => {
  return mount(GameRunReplayBoard, {
    props: {
      puzzle: TEST_PUZZLE,
      puzzleVariantMetadata: {
        direction: 0,
        regionMap: {
          0: 0,
          1: 1,
        },
      },
      records: TEST_RECORDS,
    },
  })
}

describe('GameRunReplayBoard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-26T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders a read-only board at the default replay scale', () => {
    const wrapper = mountReplayBoard()

    expect(wrapper.attributes('style')).toContain('--replay-board-size: 62px')
    expect(wrapper.findAll('.replay-cell')).toHaveLength(4)
  })

  it('plays records at 2x speed by default', async () => {
    const wrapper = mountReplayBoard()

    vi.advanceTimersByTime(264)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-0-1"]').attributes('data-status')).toBe('note')

    vi.advanceTimersByTime(264)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-0-1"]').attributes('data-status')).toBe('empty')

    vi.advanceTimersByTime(264)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-0-0"]').attributes('data-status')).toBe('found')

    vi.advanceTimersByTime(264)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-1-0"]').attributes('data-status')).toBe('wrong')
  })
})

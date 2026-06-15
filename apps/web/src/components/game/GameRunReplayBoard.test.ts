import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameRunReplayBoard from './GameRunReplayBoard.vue'
import { ActionType } from '@/modules/enums/ActionType'
import type { Puzzle } from '@/modules/types/puzzle'
import type { RunActionRecord } from '@/modules/types/run'
import { GameSoundType } from '@/modules/enums/GameSoundType'

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

const LONG_RECORDS: RunActionRecord[] = [
  {
    action: ActionType.MARK_NOTE,
    actionAtMillisecond: 120_000,
    position: [0, 1],
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

const mountEmptyReplayBoard = () => {
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
      records: [],
    },
  })
}

describe('GameRunReplayBoard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-26T00:00:00.000Z'))
    playGameSound.mockReset()
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

  it('plays records at 3x speed by default', async () => {
    const wrapper = mountReplayBoard()

    vi.advanceTimersByTime(198)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-0-1"]').attributes('data-status')).toBe('note')

    vi.advanceTimersByTime(165)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-0-1"]').attributes('data-status')).toBe('empty')

    vi.advanceTimersByTime(165)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-0-0"]').attributes('data-status')).toBe('found')

    vi.advanceTimersByTime(165)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="replay-cell-1-0"]').attributes('data-status')).toBe('wrong')
    expect(playGameSound).toHaveBeenNthCalledWith(1, GameSoundType.NOTE, { playbackRate: 3 })
    expect(playGameSound).toHaveBeenNthCalledWith(2, GameSoundType.NOTE, { playbackRate: 3 })
    expect(playGameSound).toHaveBeenNthCalledWith(3, GameSoundType.CORRECT, { playbackRate: 3 })
    expect(playGameSound).toHaveBeenNthCalledWith(4, GameSoundType.WRONG, { playbackRate: 3 })
    const timeUpdates = wrapper.emitted('timeUpdate') ?? []
    expect(timeUpdates[timeUpdates.length - 1]).toEqual([2000])
    expect(wrapper.emitted('finished')).toHaveLength(1)
  })

  it('finishes once without starting a timer when there are no records', async () => {
    const wrapper = mountEmptyReplayBoard()

    await wrapper.vm.$nextTick()
    vi.advanceTimersByTime(1000)

    expect(wrapper.emitted('finished')).toHaveLength(1)
    expect(playGameSound).not.toHaveBeenCalled()
  })

  it('raises playback speed so long replays finish under the default max duration', async () => {
    const wrapper = mount(GameRunReplayBoard, {
      props: {
        puzzle: TEST_PUZZLE,
        puzzleVariantMetadata: {
          direction: 0,
          regionMap: {
            0: 0,
            1: 1,
          },
        },
        records: LONG_RECORDS,
        speed: 1,
      },
    })

    vi.advanceTimersByTime(10_033)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="replay-cell-0-1"]').attributes('data-status')).toBe('note')
    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.NOTE, { playbackRate: 12 })
    expect(wrapper.emitted('finished')).toHaveLength(1)
  })
})

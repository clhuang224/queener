import { describe, expect, it } from 'vitest'
import { ActionType } from '@/modules/enums/ActionType'
import type { CompletedRunRecord, LeaderboardItem } from '@/modules/types/run'
import type { Puzzle } from '@/modules/types/puzzle'
import { sortLeaderboardItems, toLeaderboardItem } from './leaderboardItems'

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

const createCompletedRunRecord = (
  overrides: Partial<CompletedRunRecord> = {},
): CompletedRunRecord => ({
  uid: 'run-1',
  level: 1,
  puzzle: TEST_PUZZLE,
  puzzleVariantMetadata: {
    direction: 0,
    regionMap: {
      0: 0,
      1: 1,
    },
  },
  record: [
    {
      action: ActionType.MARK_QUEEN,
      actionAtMillisecond: 1200,
      position: [0, 0],
    },
  ],
  startedAt: new Date('2026-07-22T10:00:00.000Z'),
  endedAt: new Date('2026-07-22T10:01:00.000Z'),
  user: {
    uid: 'user-1',
    name: 'Lynn',
  },
  score: 950,
  ...overrides,
})

describe('leaderboard items', () => {
  it('creates a leaderboard item from a completed run record', () => {
    const completedAt = new Date('2026-07-22T10:01:00.000Z')
    const item = toLeaderboardItem(
      createCompletedRunRecord({
        uid: 'run-2',
        level: 3,
        score: 870,
        endedAt: completedAt,
        user: {
          uid: 'user-2',
          name: 'Ada',
        },
      }),
    )

    expect(item).toEqual({
      uid: 'run-2',
      level: 3,
      score: 870,
      playerName: 'Ada',
      completedAt,
    })
  })

  it('sorts leaderboard items by score and earlier completion time', () => {
    const items: LeaderboardItem[] = [
      {
        uid: 'lower-score',
        level: 1,
        score: 700,
        playerName: 'Lin',
        completedAt: new Date('2026-07-22T10:00:00.000Z'),
      },
      {
        uid: 'later-high-score',
        level: 1,
        score: 900,
        playerName: 'Ada',
        completedAt: new Date('2026-07-22T10:02:00.000Z'),
      },
      {
        uid: 'earlier-high-score',
        level: 1,
        score: 900,
        playerName: 'Lynn',
        completedAt: new Date('2026-07-22T10:01:00.000Z'),
      },
    ]

    expect(sortLeaderboardItems(items).map((item) => item.uid)).toEqual([
      'earlier-high-score',
      'later-high-score',
      'lower-score',
    ])
    expect(items.map((item) => item.uid)).toEqual([
      'lower-score',
      'later-high-score',
      'earlier-high-score',
    ])
  })
})

import { describe, expect, it } from 'vitest'
import { ActionType } from '@/modules/enums/ActionType'
import type { GameRecord, RunActionRecord } from './run'
import type { Puzzle } from './puzzle'

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

describe('run record types', () => {
  it('uses stable action type values for recorded player actions', () => {
    expect(Object.values(ActionType)).toEqual([
      'mark-note',
      'remove-note',
      'mark-queen',
      'hint',
    ])
  })

  it('supports action records with run-relative timestamps and positions', () => {
    const record: RunActionRecord = {
      action: ActionType.MARK_NOTE,
      actionAtMillisecond: 1234,
      position: [1, 1],
    }

    expect(record).toEqual({
      action: 'mark-note',
      actionAtMillisecond: 1234,
      position: [1, 1],
    })
  })

  it('supports game records for leaderboard and replay storage', () => {
    const gameRecord: GameRecord = {
      uid: 'run-1',
      level: 1,
      puzzle: TEST_PUZZLE,
      puzzleVariantMetadata: {
        direction: 180,
        regionMap: {
          0: 1,
          1: 0,
        },
      },
      record: [
        {
          action: ActionType.MARK_QUEEN,
          actionAtMillisecond: 2400,
          position: [1, 0],
        },
      ],
      startedAt: new Date('2026-05-23T10:00:00.000Z'),
      endedAt: new Date('2026-05-23T10:01:00.000Z'),
      user: {
        uid: 'user-1',
        name: 'Lynn',
      },
      score: 950,
    }

    expect(gameRecord.startedAt).toBeInstanceOf(Date)
    expect(gameRecord.endedAt).toBeInstanceOf(Date)
    expect(gameRecord.puzzleVariantMetadata).toEqual({
      direction: 180,
      regionMap: {
        0: 1,
        1: 0,
      },
    })
  })
})

import { describe, expect, it } from 'vitest'
import { ActionType } from '@/modules/enums/ActionType'
import type { RunActionRecord } from '@/modules/types/run'
import QueenGameRunReplay from './QueenGameRunReplay'

const createRecord = (
  actionAtMillisecond: number,
  action = ActionType.MARK_NOTE,
): RunActionRecord => ({
  action,
  actionAtMillisecond,
  position: [0, 0],
})

describe('QueenGameRunReplay', () => {
  it('returns actions whose timestamps are ready to play', () => {
    const replay = new QueenGameRunReplay([
      createRecord(300, ActionType.MARK_QUEEN),
      createRecord(100, ActionType.MARK_NOTE),
      createRecord(200, ActionType.REMOVE_NOTE),
    ])

    expect(replay.getNextActions(150).map((record) => record.action)).toEqual([
      ActionType.MARK_NOTE,
    ])
    expect(replay.getNextActions(250).map((record) => record.action)).toEqual([
      ActionType.REMOVE_NOTE,
    ])
    expect(replay.getNextActions(350).map((record) => record.action)).toEqual([
      ActionType.MARK_QUEEN,
    ])
    expect(replay.isFinished()).toBe(true)
  })

  it('does not return the same action twice unless reset', () => {
    const replay = new QueenGameRunReplay([createRecord(100)])

    expect(replay.getNextActions(100)).toHaveLength(1)
    expect(replay.getNextActions(100)).toEqual([])

    replay.reset()

    expect(replay.getNextActions(100)).toHaveLength(1)
  })

  it('returns the duration from the final recorded action', () => {
    const replay = new QueenGameRunReplay([
      createRecord(300),
      createRecord(100),
      createRecord(700),
    ])

    expect(replay.getDurationMillisecond()).toBe(700)
  })

  it('uses zero duration when there are no records', () => {
    const replay = new QueenGameRunReplay([])

    expect(replay.getDurationMillisecond()).toBe(0)
  })

  it('returns copied records so replay consumers cannot mutate stored actions', () => {
    const replay = new QueenGameRunReplay([createRecord(100)])

    const [record] = replay.getNextActions(100)
    record!.position[0] = 9

    replay.reset()

    expect(replay.getNextActions(100)[0]!.position).toEqual([0, 0])
  })
})

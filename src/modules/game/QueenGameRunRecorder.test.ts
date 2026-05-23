import { describe, expect, it, vi } from 'vitest'
import { ActionType } from '@/modules/enums/ActionType'
import QueenGameRunRecorder from './QueenGameRunRecorder'

describe('QueenGameRunRecorder', () => {
  it('records actions with run-relative timestamps', () => {
    const now = vi.fn().mockReturnValueOnce(1000).mockReturnValueOnce(1250).mockReturnValueOnce(1800)
    const recorder = new QueenGameRunRecorder(now)

    recorder.markNote([1, 2])
    recorder.markQueen([3, 4])

    expect(recorder.getRecords()).toEqual([
      {
        action: ActionType.MARK_NOTE,
        actionAtMillisecond: 250,
        position: [1, 2],
      },
      {
        action: ActionType.MARK_QUEEN,
        actionAtMillisecond: 800,
        position: [3, 4],
      },
    ])
  })

  it('records supported game actions', () => {
    const now = vi.fn().mockReturnValue(0)
    const recorder = new QueenGameRunRecorder(now)

    recorder.markNote([0, 0])
    recorder.removeNote([0, 1])
    recorder.markQueen([1, 0])
    recorder.hint([1, 1])

    expect(recorder.getRecords().map((record) => record.action)).toEqual([
      ActionType.MARK_NOTE,
      ActionType.REMOVE_NOTE,
      ActionType.MARK_QUEEN,
      ActionType.HINT,
    ])
  })

  it('returns copied records so callers cannot mutate recorder state', () => {
    const recorder = new QueenGameRunRecorder(() => 0)

    recorder.markNote([0, 0])
    const records = recorder.getRecords()
    records[0]!.position[0] = 9

    expect(recorder.getRecords()[0]!.position).toEqual([0, 0])
  })
})

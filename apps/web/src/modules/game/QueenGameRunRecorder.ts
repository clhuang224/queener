import { ActionType } from '@/modules/enums/ActionType'
import type { Position } from '@/modules/types/board'
import type { RunActionRecord } from '@/modules/types/run'

type Now = () => number

export default class QueenGameRunRecorder {
  private readonly startedAtMillisecond: number
  private readonly now: Now
  private readonly records: RunActionRecord[] = []

  constructor(now: Now = () => Date.now()) {
    this.now = now
    this.startedAtMillisecond = this.now()
  }

  public record(action: ActionType, position: Position): RunActionRecord {
    const record: RunActionRecord = {
      action,
      actionAtMillisecond: this.now() - this.startedAtMillisecond,
      position: [...position],
    }

    this.records.push(record)
    return record
  }

  public markNote(position: Position): RunActionRecord {
    return this.record(ActionType.MARK_NOTE, position)
  }

  public removeNote(position: Position): RunActionRecord {
    return this.record(ActionType.REMOVE_NOTE, position)
  }

  public markQueen(position: Position): RunActionRecord {
    return this.record(ActionType.MARK_QUEEN, position)
  }

  public hint(position: Position): RunActionRecord {
    return this.record(ActionType.HINT, position)
  }

  public getRecords(): RunActionRecord[] {
    return this.records.map((record) => ({
      ...record,
      position: [...record.position],
    }))
  }
}

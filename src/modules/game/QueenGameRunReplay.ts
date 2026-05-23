import type { RunActionRecord } from '@/modules/types/run'

export default class QueenGameRunReplay {
  private readonly records: RunActionRecord[]
  private cursor = 0

  constructor(records: RunActionRecord[]) {
    this.records = [...records].sort(
      (first, second) => first.actionAtMillisecond - second.actionAtMillisecond,
    )
  }

  public getNextActions(elapsedMillisecond: number): RunActionRecord[] {
    const nextActions: RunActionRecord[] = []

    while (
      this.cursor < this.records.length &&
      this.records[this.cursor]!.actionAtMillisecond <= elapsedMillisecond
    ) {
      const record = this.records[this.cursor]!
      nextActions.push({
        ...record,
        position: [...record.position],
      })
      this.cursor += 1
    }

    return nextActions
  }

  public reset(): void {
    this.cursor = 0
  }

  public isFinished(): boolean {
    return this.cursor >= this.records.length
  }

  public getDurationMillisecond(): number {
    return this.records[this.records.length - 1]?.actionAtMillisecond ?? 0
  }
}

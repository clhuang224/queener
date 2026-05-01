import type { Position } from '@/modules/types/board'

type BoardCellStatus = 'empty' | 'note' | 'wrong' | 'found'

export default class BoardCell {
  public status: BoardCellStatus = 'empty'
  readonly row: number
  readonly column: number
  readonly region: number
  readonly hasQueen: boolean

  constructor(row: number, column: number, region: number, isQueen: boolean) {
    this.row = row
    this.column = column
    this.region = region
    this.hasQueen = isQueen
  }

  public isQueen(): boolean {
    return this.hasQueen
  }

  public getRegion(): number {
    return this.region
  }

  public getPosition(): Position {
    return [this.row, this.column]
  }

  public markNote(): void {
    if (this.status === 'empty') this.status = 'note'
  }

  public removeNote(): void {
    if (this.status === 'note') this.status = 'empty'
  }

  public isNote(): boolean {
    return this.status === 'note'
  }

  public markQueen(): boolean {
    if (this.status === 'found' || this.status === 'wrong') {
      return this.hasQueen
    }
    if (!this.hasQueen) {
      this.status = 'wrong'
      return false
    }
    this.status = 'found'
    return true
  }

  public isFound(): boolean {
    return this.status === 'found'
  }
}

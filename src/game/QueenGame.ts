import type { Position } from '@/types/board'
import BoardCell from './BoardCell'
import type { Puzzle } from '@/types/puzzle'
import { randomInteger } from '@/utils/random'

export default class QueenGame {
  private puzzle: Puzzle
  private hintUsed: boolean
  private hearts: number
  public board: BoardCell[][]

  constructor(puzzle: Puzzle) {
    this.puzzle = puzzle
    this.hintUsed = false
    this.hearts = 3
    this.board = this.createBoard(puzzle)
  }

  private createBoard(puzzle: Puzzle): BoardCell[][] {
    const queenSet = new Set(
      puzzle.queens.map(([row, column]) => row * puzzle.regions.length + column),
    )
    return puzzle.regions.map((row, rowIndex) =>
      row.map((region, colIndex) => {
        const cell = new BoardCell(
          rowIndex,
          colIndex,
          region,
          queenSet.has(rowIndex * puzzle.regions.length + colIndex),
        )
        return cell
      }),
    )
  }

  public getSize(): number {
    return this.board.length
  }

  public getHearts(): number {
    return this.hearts
  }

  public markQueen(position: Position) {
    const hasQueen = this.board[position[0]]![position[1]]!.markQueen()
    if (!hasQueen) {
      this.hearts -= 1
    }
  }

  public useHint(): Position | null {
    if (this.hintUsed) return null
    const queens = this.puzzle.queens.filter(
      ([row, column]) => !this.board[row]![column]!.isFound(),
    )
    if (queens.length === 0) return null

    const position = queens[randomInteger(0, queens.length - 1)]!
    this.board[position[0]]![position[1]]!.markQueen()
    this.hintUsed = true
    return position
  }

  public isHintUsed(): boolean {
    return this.hintUsed
  }

  public isWin(): boolean {
    return this.puzzle.queens.every(([row, column]) => this.board[row]![column]!.isFound())
  }

  public isGameOver(): boolean {
    return this.hearts <= 0
  }

  public resetGame(): void {
    this.board = this.createBoard(this.puzzle)
    this.hintUsed = false
    this.hearts = 3
  }
}

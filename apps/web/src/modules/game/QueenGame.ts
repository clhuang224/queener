import type { Position } from '@/modules/types/board'
import BoardCell from './BoardCell'
import type { Puzzle, PuzzleVariantMetadata } from '@/modules/types/puzzle'
import { randomInteger } from '@/modules/utils/random'
import { createRandomPuzzleVariant } from './puzzleVariant'

export default class QueenGame {
  private puzzle: Puzzle
  private activePuzzle: Puzzle
  private activePuzzleVariantMetadata: PuzzleVariantMetadata
  private hintUsed: boolean
  public maxHearts: number
  public hearts: number
  public board: BoardCell[][]

  constructor(puzzle: Puzzle) {
    this.puzzle = puzzle
    const puzzleVariant = createRandomPuzzleVariant(puzzle)
    this.activePuzzle = puzzleVariant.puzzle
    this.activePuzzleVariantMetadata = puzzleVariant.metadata
    this.hintUsed = false
    this.maxHearts = QueenGame.resolveHeartsBySize(puzzle.rules.size)
    this.hearts = this.maxHearts
    this.board = this.createBoard(this.activePuzzle)
  }

  public static resolveHeartsBySize(size: number): number {
    if (size <= 7) return 2
    if (size <= 10) return 3
    return Math.max(3, Math.ceil(size / 3))
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

  public getPuzzleVariantMetadata(): PuzzleVariantMetadata {
    return {
      direction: this.activePuzzleVariantMetadata.direction,
      regionMap: {
        ...this.activePuzzleVariantMetadata.regionMap,
      },
    }
  }

  public markNote(position: Position): void {
    this.board[position[0]]![position[1]]!.markNote()
  }

  public removeNote(position: Position): void {
    this.board[position[0]]![position[1]]!.removeNote()
  }

  public isNote(position: Position): boolean {
    return this.board[position[0]]![position[1]]!.isNote()
  }

  public markQueen(position: Position): boolean {
    const hasQueen = this.board[position[0]]![position[1]]!.markQueen()
    if (!hasQueen) {
      this.hearts -= 1
    }
    return hasQueen
  }

  public revealQueenHint(): Position | null {
    if (this.hintUsed) return null
    const queens = this.activePuzzle.queens.filter(
      ([row, column]) => !this.board[row]![column]!.isFound(),
    )
    if (queens.length === 0) return null

    const position = queens[randomInteger(0, queens.length - 1)]!
    this.board[position[0]]![position[1]]!.markQueen()
    this.hintUsed = true
    return position
  }

  public useHint(): Position | null {
    return this.revealQueenHint()
  }

  public isHintUsed(): boolean {
    return this.hintUsed
  }

  public isWin(): boolean {
    return this.activePuzzle.queens.every(([row, column]) => this.board[row]![column]!.isFound())
  }

  public isGameOver(): boolean {
    return this.hearts <= 0
  }

  public resetGame(): void {
    const puzzleVariant = createRandomPuzzleVariant(this.puzzle)
    this.activePuzzle = puzzleVariant.puzzle
    this.activePuzzleVariantMetadata = puzzleVariant.metadata
    this.board = this.createBoard(this.activePuzzle)
    this.hintUsed = false
    this.hearts = this.maxHearts
  }
}

export type QueenGamePublic = Pick<QueenGame, keyof QueenGame>

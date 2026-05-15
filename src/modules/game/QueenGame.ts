import type { Position } from '@/modules/types/board'
import BoardCell from './BoardCell'
import type { Puzzle } from '@/modules/types/puzzle'
import { randomInteger } from '@/modules/utils/random'

export default class QueenGame {
  private puzzle: Puzzle
  private activePuzzle: Puzzle
  private hintUsed: boolean
  public maxHearts: number
  public hearts: number
  public board: BoardCell[][]

  constructor(puzzle: Puzzle) {
    this.puzzle = puzzle
    this.activePuzzle = this.createPuzzleVariant(puzzle)
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

  private createPuzzleVariant(puzzle: Puzzle): Puzzle {
    const rotatedPuzzle = this.rotatePuzzle(puzzle, randomInteger(0, 3))
    return this.remapPuzzleRegions(rotatedPuzzle)
  }

  private rotatePuzzle(puzzle: Puzzle, quarterTurns: number): Puzzle {
    const turns = quarterTurns % 4
    if (turns === 0) {
      return {
        ...puzzle,
        regions: puzzle.regions.map((row) => [...row]),
        queens: puzzle.queens.map((position) => [...position]),
      }
    }

    return {
      ...puzzle,
      regions: this.rotateRegions(puzzle.regions, turns),
      queens: puzzle.queens.map((position) =>
        this.rotatePosition(position, puzzle.rules.size, turns),
      ),
    }
  }

  private rotateRegions(regions: number[][], quarterTurns: number): number[][] {
    const size = regions.length
    return Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, column) => {
        const [sourceRow, sourceColumn] = this.rotatePosition([row, column], size, 4 - quarterTurns)
        return regions[sourceRow]![sourceColumn]!
      }),
    )
  }

  private rotatePosition([row, column]: Position, size: number, quarterTurns: number): Position {
    let rotatedRow = row
    let rotatedColumn = column

    for (let turn = 0; turn < quarterTurns; turn++) {
      const nextRow = rotatedColumn
      const nextColumn = size - rotatedRow - 1
      rotatedRow = nextRow
      rotatedColumn = nextColumn
    }

    return [rotatedRow, rotatedColumn]
  }

  private remapPuzzleRegions(puzzle: Puzzle): Puzzle {
    const regionIds = [...new Set(puzzle.regions.flat())]
    const shuffledRegionIds = [...regionIds]

    for (let index = shuffledRegionIds.length - 1; index > 0; index--) {
      const swapIndex = randomInteger(0, index)
      const currentRegion = shuffledRegionIds[index]!
      shuffledRegionIds[index] = shuffledRegionIds[swapIndex]!
      shuffledRegionIds[swapIndex] = currentRegion
    }

    const regionMap = new Map(
      regionIds.map((regionId, index) => [regionId, shuffledRegionIds[index]!]),
    )

    return {
      ...puzzle,
      regions: puzzle.regions.map((row) => row.map((region) => regionMap.get(region)!)),
      queens: puzzle.queens.map((position) => [...position]),
    }
  }

  public getSize(): number {
    return this.board.length
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

  public useHint(): Position | null {
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
    this.activePuzzle = this.createPuzzleVariant(this.puzzle)
    this.board = this.createBoard(this.activePuzzle)
    this.hintUsed = false
    this.hearts = this.maxHearts
  }
}

export type QueenGamePublic = Pick<QueenGame, keyof QueenGame>

import type { Position } from './board'

export interface Puzzle {
  id: string
  regions: number[][]
  queens: Position[]
}

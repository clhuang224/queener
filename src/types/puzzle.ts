import type { Position } from './board'

export interface PuzzleRules {
  size: number
  allowDisconnectedRegions: boolean
  queensPerUnit: 1 | 2
}

export interface Puzzle {
  id: string
  rules: PuzzleRules
  regions: number[][]
  queens: Position[]
}

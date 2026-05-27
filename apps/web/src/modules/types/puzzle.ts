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

export type PuzzleDirection = 0 | 90 | 180 | 270

export interface PuzzleVariantMetadata {
  direction: PuzzleDirection
  regionMap: Record<number, number>
}

export interface PuzzleVariant {
  puzzle: Puzzle
  metadata: PuzzleVariantMetadata
}

import { ActionType } from '@/modules/enums/ActionType'
import type { Position } from './board'
import type { Puzzle, PuzzleVariantMetadata } from './puzzle'

export interface RunUser {
  uid: string
  name: string
}

export interface RunActionRecord {
  action: ActionType
  actionAtMillisecond: number
  position: Position
}

export interface CompletedRunRecord {
  uid: string
  level: number
  puzzle: Puzzle
  puzzleVariantMetadata: PuzzleVariantMetadata
  record: RunActionRecord[]
  startedAt: Date
  endedAt: Date
  user: RunUser
  score: number
}

export interface LeaderboardItem {
  uid: string
  level: number
  score: number
  playerName: string
  completedAt: Date
}

export interface RunReplayData {
  level: number
  puzzle: Puzzle
  puzzleVariantMetadata: PuzzleVariantMetadata
  record: RunActionRecord[]
}

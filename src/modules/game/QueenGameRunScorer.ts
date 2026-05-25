export const SCORE_TOTAL = 1000
export const TIME_SCORE_MAX = 700
export const HEARTS_SCORE_MAX = 200
export const HINTS_SCORE_MAX = 100

export const TIMEOUT_BY_BOARD_SIZE: Record<number, number> = {
  5: 60_000,
  6: 90_000,
  7: 120_000,
  8: 180_000,
  9: 240_000,
  10: 300_000,
}

export interface ScoreInput {
  boardSize: number
  startedAt: Date
  endedAt: Date
  remainingHearts: number
  maxHearts: number
  remainingHints: number
  maxHints: number
}

export interface ScoreBreakdown {
  score: number
  timeScore: number
  heartsScore: number
  hintsScore: number
  elapsedMs: number
  timeoutMs: number
}

export default class QueenGameRunScorer {
  public static calculate(input: ScoreInput): ScoreBreakdown {
    const elapsedMs = Math.max(0, input.endedAt.getTime() - input.startedAt.getTime())
    const timeoutMs = QueenGameRunScorer.getTimeoutMs(input.boardSize)
    const timeScore = QueenGameRunScorer.calculateTimeScore(elapsedMs, timeoutMs)
    const heartsScore = QueenGameRunScorer.calculateRatioScore(
      input.remainingHearts,
      input.maxHearts,
      HEARTS_SCORE_MAX,
    )
    const hintsScore = QueenGameRunScorer.calculateRatioScore(
      input.remainingHints,
      input.maxHints,
      HINTS_SCORE_MAX,
    )

    return {
      score: Math.min(SCORE_TOTAL, timeScore + heartsScore + hintsScore),
      timeScore,
      heartsScore,
      hintsScore,
      elapsedMs,
      timeoutMs,
    }
  }

  public static calculateScore(input: ScoreInput): number {
    return QueenGameRunScorer.calculate(input).score
  }

  public static getTimeoutMs(boardSize: number): number {
    return TIMEOUT_BY_BOARD_SIZE[boardSize] ?? boardSize * boardSize * 3_000
  }

  private static calculateTimeScore(elapsedMs: number, timeoutMs: number): number {
    if (elapsedMs <= 0) return TIME_SCORE_MAX
    if (elapsedMs >= timeoutMs) return 0

    const remainingRatio = (timeoutMs - elapsedMs) / timeoutMs
    return Math.round(TIME_SCORE_MAX * remainingRatio)
  }

  private static calculateRatioScore(value: number, maxValue: number, maxScore: number): number {
    if (maxValue <= 0) return 0

    const ratio = Math.max(0, Math.min(1, value / maxValue))
    return Math.round(maxScore * ratio)
  }
}

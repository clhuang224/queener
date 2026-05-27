import { describe, expect, it } from 'vitest'
import QueenGameRunScorer, {
  HEARTS_SCORE_MAX,
  HINTS_SCORE_MAX,
  SCORE_TOTAL,
  TIMEOUT_BY_BOARD_SIZE,
  TIME_SCORE_MAX,
} from './QueenGameRunScorer'

const STARTED_AT = new Date('2026-05-25T10:00:00.000Z')

const createInput = (elapsedMillisecond: number) => ({
  boardSize: 8,
  startedAt: STARTED_AT,
  endedAt: new Date(STARTED_AT.getTime() + elapsedMillisecond),
  remainingHearts: 3,
  maxHearts: 3,
  remainingHints: 1,
  maxHints: 1,
})

describe('QueenGameRunScorer', () => {
  it('returns 1000 points when the run is instant and resources are unused', () => {
    const score = QueenGameRunScorer.calculate(createInput(0))

    expect(score).toEqual({
      score: SCORE_TOTAL,
      timeScore: TIME_SCORE_MAX,
      heartsScore: HEARTS_SCORE_MAX,
      hintsScore: HINTS_SCORE_MAX,
      elapsedMs: 0,
      timeoutMs: TIMEOUT_BY_BOARD_SIZE[8],
    })
  })

  it('linearly reduces the time score until timeout time', () => {
    const timeoutTime = TIMEOUT_BY_BOARD_SIZE[8]!
    const middleTime = timeoutTime / 2

    const score = QueenGameRunScorer.calculate(createInput(middleTime))

    expect(score.timeScore).toBe(TIME_SCORE_MAX / 2)
    expect(score.score).toBe(650)
  })

  it('clamps the time score at zero after timeout', () => {
    const score = QueenGameRunScorer.calculate(
      createInput(TIMEOUT_BY_BOARD_SIZE[8]! + 1),
    )

    expect(score.timeScore).toBe(0)
    expect(score.score).toBe(300)
  })

  it('scores remaining hearts and hints by their remaining ratios', () => {
    const score = QueenGameRunScorer.calculate({
      ...createInput(0),
      remainingHearts: 1,
      maxHearts: 3,
      remainingHints: 0,
      maxHints: 1,
    })

    expect(score.heartsScore).toBe(67)
    expect(score.hintsScore).toBe(0)
    expect(score.score).toBe(767)
  })

  it('clamps invalid resource values into the scoring range', () => {
    const score = QueenGameRunScorer.calculate({
      ...createInput(0),
      remainingHearts: -1,
      maxHearts: 3,
      remainingHints: 3,
      maxHints: 1,
    })

    expect(score.heartsScore).toBe(0)
    expect(score.hintsScore).toBe(100)
    expect(score.score).toBe(800)
  })

  it('uses board-size fallback times outside the campaign constants', () => {
    expect(QueenGameRunScorer.getTimeoutMs(11)).toBe(363_000)
  })

  it('returns only the final score when using calculateScore', () => {
    expect(QueenGameRunScorer.calculateScore(createInput(0))).toBe(SCORE_TOTAL)
  })
})

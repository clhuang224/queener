import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActionType } from '@/modules/enums/ActionType'
import { useGameRun } from './useGameRun'

describe('useGameRun', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('records player actions for the current run', () => {
    const gameRun = useGameRun()

    gameRun.recordMarkNote([0, 1])
    gameRun.recordRemoveNote([0, 1])
    gameRun.recordMarkQueen([1, 0])
    gameRun.recordHint([1, 1])

    expect(gameRun.runRecorder.value.getRecords()).toEqual([
      expect.objectContaining({
        action: ActionType.MARK_NOTE,
        position: [0, 1],
      }),
      expect.objectContaining({
        action: ActionType.REMOVE_NOTE,
        position: [0, 1],
      }),
      expect.objectContaining({
        action: ActionType.MARK_QUEEN,
        position: [1, 0],
      }),
      expect.objectContaining({
        action: ActionType.HINT,
        position: [1, 1],
      }),
    ])
    gameRun.finishRun()
  })

  it('starts a fresh game and recorder for a new level', () => {
    const gameRun = useGameRun()
    const firstGame = gameRun.game.value
    const firstRecorder = gameRun.runRecorder.value

    gameRun.recordMarkNote([0, 1])
    gameRun.startLevel(2)

    expect(gameRun.activeLevel.value).toBe(2)
    expect(gameRun.game.value).not.toBe(firstGame)
    expect(gameRun.runRecorder.value).not.toBe(firstRecorder)
    expect(gameRun.runRecorder.value.getRecords()).toEqual([])
    gameRun.finishRun()
  })

  it('resets the active game and starts a fresh recorder when restarting a run', () => {
    const gameRun = useGameRun()
    const firstRecorder = gameRun.runRecorder.value
    const queenPosition = gameRun.game.value.board
      .flat()
      .find((cell) => cell.isQueen())!
      .getPosition()

    gameRun.game.value.markQueen(queenPosition)
    gameRun.recordMarkQueen(queenPosition)

    gameRun.restartRun()

    expect(gameRun.game.value.board.flat().some((cell) => cell.isFound())).toBe(false)
    expect(gameRun.runRecorder.value).not.toBe(firstRecorder)
    expect(gameRun.runRecorder.value.getRecords()).toEqual([])
    gameRun.finishRun()
  })

  it('tracks and formats run time until the run is finished', () => {
    const gameRun = useGameRun()

    vi.advanceTimersByTime(83_424)

    expect(gameRun.runTimeMs.value).toBe(83_424)
    expect(gameRun.formattedRunTime.value).toBe('01:23.424')

    gameRun.finishRun()
    const finishedRunTime = gameRun.runTimeMs.value

    vi.advanceTimersByTime(1000)

    expect(gameRun.runTimeMs.value).toBe(finishedRunTime)
    expect(gameRun.endedAt.value).toBeInstanceOf(Date)
  })

  it('restarts the clock when starting a level or restarting a run', () => {
    const gameRun = useGameRun()

    vi.advanceTimersByTime(1000)
    gameRun.startLevel(2)

    expect(gameRun.runTimeMs.value).toBe(0)
    expect(gameRun.formattedRunTime.value).toBe('00:00.000')

    vi.advanceTimersByTime(1000)
    gameRun.restartRun()

    expect(gameRun.runTimeMs.value).toBe(0)
    expect(gameRun.formattedRunTime.value).toBe('00:00.000')
    gameRun.finishRun()
  })
})

import { computed, getCurrentScope, onScopeDispose, ref } from 'vue'
import QueenGame from '@/modules/game/QueenGame'
import QueenGameRunRecorder from '@/modules/game/QueenGameRunRecorder'
import { getPuzzleByLevel } from '@/modules/puzzles/simple'
import type { Position } from '@/modules/types/board'
import { formatRunTime } from '@/modules/utils/formatRunTime'

const TIMER_UPDATE_INTERVAL_MS = 33

type Now = () => number

export const useGameRun = (initialLevel = 1, now: Now = () => Date.now()) => {
  const activeLevel = ref(initialLevel)
  const game = ref(new QueenGame(getPuzzleByLevel(initialLevel)))
  const runRecorder = ref(new QueenGameRunRecorder())
  const startedAt = ref(new Date(now()))
  const endedAt = ref<Date | null>(null)
  const runTimeMs = ref(0)
  const formattedRunTime = computed(() => formatRunTime(runTimeMs.value))

  let timer: ReturnType<typeof setInterval> | null = null

  const stopClock = () => {
    if (timer === null) return

    clearInterval(timer)
    timer = null
  }

  const updateRunTime = () => {
    const endTime = endedAt.value?.getTime() ?? now()
    runTimeMs.value = Math.max(0, endTime - startedAt.value.getTime())
  }

  const startClock = () => {
    stopClock()
    startedAt.value = new Date(now())
    endedAt.value = null
    runTimeMs.value = 0
    timer = setInterval(updateRunTime, TIMER_UPDATE_INTERVAL_MS)
  }

  const resetRunRecorder = () => {
    runRecorder.value = new QueenGameRunRecorder()
  }

  const startLevel = (level: number) => {
    activeLevel.value = level
    game.value = new QueenGame(getPuzzleByLevel(level))
    resetRunRecorder()
    startClock()
  }

  const restartRun = () => {
    game.value.resetGame()
    resetRunRecorder()
    startClock()
  }

  const finishRun = () => {
    if (endedAt.value !== null) return

    endedAt.value = new Date(now())
    updateRunTime()
    stopClock()
  }

  const recordMarkNote = (position: Position) => {
    runRecorder.value.markNote(position)
  }

  const recordRemoveNote = (position: Position) => {
    runRecorder.value.removeNote(position)
  }

  const recordMarkQueen = (position: Position) => {
    runRecorder.value.markQueen(position)
  }

  const recordHint = (position: Position) => {
    runRecorder.value.hint(position)
  }

  startClock()

  if (getCurrentScope()) {
    onScopeDispose(stopClock)
  }

  return {
    activeLevel,
    game,
    runRecorder,
    startedAt,
    endedAt,
    runTimeMs,
    formattedRunTime,
    startLevel,
    restartRun,
    finishRun,
    recordMarkNote,
    recordRemoveNote,
    recordMarkQueen,
    recordHint,
  }
}

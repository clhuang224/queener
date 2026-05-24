import { ref } from 'vue'
import QueenGame from '@/modules/game/QueenGame'
import QueenGameRunRecorder from '@/modules/game/QueenGameRunRecorder'
import { getPuzzleByLevel } from '@/modules/puzzles/simple'
import type { Position } from '@/modules/types/board'

export const useGameRun = (initialLevel = 1) => {
  const activeLevel = ref(initialLevel)
  const game = ref(new QueenGame(getPuzzleByLevel(initialLevel)))
  const runRecorder = ref(new QueenGameRunRecorder())

  const resetRunRecorder = () => {
    runRecorder.value = new QueenGameRunRecorder()
  }

  const startLevel = (level: number) => {
    activeLevel.value = level
    game.value = new QueenGame(getPuzzleByLevel(level))
    resetRunRecorder()
  }

  const restartRun = () => {
    game.value.resetGame()
    resetRunRecorder()
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

  return {
    activeLevel,
    game,
    runRecorder,
    startLevel,
    restartRun,
    recordMarkNote,
    recordRemoveNote,
    recordMarkQueen,
    recordHint,
  }
}

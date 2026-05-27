<script setup lang="ts">
import GameCell from '@/components/game/GameCell.vue'
import type { QueenGamePublic } from '@/modules/game/QueenGame'
import { CELL_TEXTURES } from '@/modules/constants/cellTextures'
import { useGameBoardGestures } from './useGameBoardGestures'
import { computed, ref } from 'vue'
import { BOARD_SKINS } from '@/modules/constants/boardSkins'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import type { BoardSkinType } from '@/modules/enums/BoardSkinType'
import type { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { Position } from '@/modules/types/board'
import { playGameSound } from '@/modules/utils/playGameSound'
import { pickDistributedColors } from '@/modules/utils/pickDistributedColors'
import { pickRandomItems } from '@/modules/utils/pickRandomItems'
import { GameSoundType } from '@/modules/enums/GameSoundType'

const props = defineProps<{
  queenSkin: QueenSkinType
  boardSkin: BoardSkinType
  boardTextureEnabled: boolean
  game: QueenGamePublic
  hintedPosition: Position | null
}>()

const emit = defineEmits<{
  'mark-note': [position: Position]
  'remove-note': [position: Position]
  'mark-queen': [position: Position]
}>()

const boardRef = ref<HTMLDivElement | null>(null)
const boardSize = computed(() => props.game.getSize())
const queenIcon = computed(() => QUEEN_SKINS[props.queenSkin].icon)
const queenNoteIcon = computed(() => QUEEN_SKINS[props.queenSkin].noteIcon)
const boardTextureTypes = computed(() => {
  return props.boardTextureEnabled ? pickRandomItems(CELL_TEXTURES, boardSize.value) : []
})
const boardStyle = computed(() => ({
  '--board-size': String(boardSize.value),
  '--board-max-size': `${boardSize.value * 62}px`,
  ...Object.fromEntries(
    pickDistributedColors(BOARD_SKINS[props.boardSkin], boardSize.value).map((color, index) => [
      `--cell-color-${index}`,
      color,
    ]),
  ),
}))

const getCellTextureClass = (region: number) => {
  return boardTextureTypes.value[region] ?? ''
}

const isInteractiveCell = ([row, column]: Position) => {
  const status = props.game.board[row]?.[column]?.status
  return status === 'empty' || status === 'note'
}

const isHintedCell = ([row, column]: Position) => {
  return props.hintedPosition?.[0] === row && props.hintedPosition[1] === column
}

const getBoardElementFromPoint = (clientX: number, clientY: number) => {
  const element = document.elementFromPoint(clientX, clientY)
  if (!(element instanceof Element)) return null
  if (!boardRef.value?.contains(element)) return null
  return element
}

const markNoteWithSound = (position: Position) => {
  const wasNote = props.game.isNote(position)
  props.game.markNote(position)
  if (!wasNote && props.game.isNote(position)) {
    emit('mark-note', position)
    void playGameSound(GameSoundType.NOTE)
  }
}

const removeNoteWithSound = (position: Position) => {
  const wasNote = props.game.isNote(position)
  props.game.removeNote(position)
  if (wasNote && !props.game.isNote(position)) {
    emit('remove-note', position)
    void playGameSound(GameSoundType.NOTE)
  }
}

const markQueenWithSound = (position: Position) => {
  const hasQueen = props.game.markQueen(position)
  emit('mark-queen', position)

  if (props.game.isWin() || props.game.isGameOver()) return

  void playGameSound(hasQueen ? GameSoundType.CORRECT : GameSoundType.WRONG)
}

const {
  handleMarkQueen,
  handleNoteClick,
  handlePointerDown,
  handlePointerEnd,
  handlePointerEnter,
  handleTouchMove,
} = useGameBoardGestures({
  getElementFromPoint: getBoardElementFromPoint,
  isInteractive: isInteractiveCell,
  isNote: (position) => props.game.isNote(position),
  markNote: markNoteWithSound,
  markQueen: markQueenWithSound,
  removeNote: removeNoteWithSound,
})
</script>

<template>
  <div
    ref="boardRef"
    class="game-board"
    data-test="game-board"
    :style="boardStyle"
    @pointerup="handlePointerEnd"
    @pointercancel="handlePointerEnd"
    @mouseleave="handlePointerEnd"
    @touchmove="handleTouchMove"
    @touchend="handlePointerEnd"
    @touchcancel="handlePointerEnd"
  >
    <div class="board-cells">
      <template v-for="(row, rowIndex) in game.board" :key="rowIndex">
        <GameCell
          v-for="cell in row"
          :key="cell.getPosition().join('-')"
          :cell="cell"
          :cell-texture-class-name="getCellTextureClass(cell.getRegion())"
          :is-hinted="isHintedCell(cell.getPosition())"
          :queen-icon="queenIcon"
          :queen-note-icon="queenNoteIcon"
          @pointer-down="handlePointerDown"
          @pointer-enter="handlePointerEnter"
          @note-click="handleNoteClick"
          @mark-queen="handleMarkQueen"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-board {
  --board-gap: 6px;

  touch-action: manipulation;
  width: 100%;
  max-width: var(--board-max-size);
  box-sizing: border-box;
}

.board-cells {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--board-gap);
  width: 100%;
}

@media (max-width: 480px) {
  .game-board {
    --board-gap: 4px;
  }
}
</style>

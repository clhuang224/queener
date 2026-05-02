<script setup lang="ts">
import GameCell from '@/components/game/GameCell.vue'
import type { QueenGamePublic } from '@/modules/game/QueenGame'
import HeartCounter from '../common/HeartCounter.vue'
import { useGameBoardGestures } from './useGameBoardGestures'
import { computed, ref } from 'vue'
import { CELL_SKINS } from '@/modules/constants/cellSkins'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import type { CellSkinType } from '@/modules/enums/CellSkinType'
import type { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { pickDistributedColors } from '@/modules/utils/pickDistributedColors'

const props = defineProps<{
  queenSkin: QueenSkinType
  cellSkin: CellSkinType
  game: QueenGamePublic
}>()

const boardRef = ref<HTMLDivElement | null>(null)
const boardSize = computed(() => props.game.getSize())
const queenIcon = computed(() => QUEEN_SKINS[props.queenSkin].icon)
const queenNoteIcon = computed(() => QUEEN_SKINS[props.queenSkin].noteIcon)
const boardStyle = computed(() => ({
  '--board-size': String(boardSize.value),
  '--board-max-size': `${boardSize.value * 62}px`,
  ...Object.fromEntries(
    pickDistributedColors(CELL_SKINS[props.cellSkin], boardSize.value).map((color, index) => [
      `--cell-color-${index}`,
      color,
    ]),
  ),
}))

const getBoardElementFromPoint = (clientX: number, clientY: number) => {
  const element = document.elementFromPoint(clientX, clientY)
  if (!(element instanceof Element)) return null
  if (!boardRef.value?.contains(element)) return null
  return element
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
  isNote: (position) => props.game.isNote(position),
  markNote: (position) => props.game.markNote(position),
  markQueen: (position) => props.game.markQueen(position),
  removeNote: (position) => props.game.removeNote(position),
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
    <heart-counter :hearts="game.hearts" :max-hearts="game.maxHearts" />
    <div class="board-cells">
      <template v-for="(row, rowIndex) in game.board" :key="rowIndex">
        <game-cell
          v-for="cell in row"
          :key="cell.getPosition().join('-')"
          :cell="cell"
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
  --board-padding: 12px;

  touch-action: manipulation;
  width: 100%;
  max-width: var(--board-max-size);
  padding: var(--board-padding);
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
    --board-padding: 8px;
  }
}
</style>

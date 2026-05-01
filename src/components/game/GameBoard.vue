<script setup lang="ts">
import GameCell from '@/components/game/GameCell.vue'
import type { QueenGamePublic } from '@/game/QueenGame'
import HeartCounter from '../common/HeartCounter.vue'
import { useGameBoardGestures } from './useGameBoardGestures'
import { computed, ref } from 'vue'

const props = defineProps<{
  queenSkin: 'rainbow' | 'grayscale'
  cellSkin: 'rainbow' | 'grayscale'
  game: QueenGamePublic
}>()

const boardRef = ref<HTMLDivElement | null>(null)
const boardSize = computed(() => props.game.getSize())
const boardStyle = computed(() => ({
  '--board-size': String(boardSize.value),
  '--board-max-size': `${boardSize.value * 62}px`,
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
    :class="`cell-${cellSkin} queen-${queenSkin}`"
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
@use 'sass:list';

.game-board {
  --board-gap: clamp(3px, 1.4vw, 6px);
  --board-padding: clamp(8px, 2.5vw, 12px);

  touch-action: manipulation;
  width: min(100%, var(--board-max-size));
  padding: var(--board-padding);
  box-sizing: border-box;
}

.board-cells {
  display: grid;
  grid-template-columns: repeat(var(--board-size), minmax(0, 1fr));
  justify-content: center;
  align-items: center;
  gap: var(--board-gap);
  width: 100%;
}
$rainbow-colors: #ff6b6b, #ffa94d, #ffd43b, #69db7c, #4dabf7, #748ffc, #b197fc, #343a40;
$gray-colors: #000, #222, #444, #666, #888, #aaa, #ccc, #eee;
$skins: (rainbow, grayscale);
@each $skin in $skins {
  .game-board.cell-#{$skin} {
    $palette: ();
    @if $skin == rainbow {
      $palette: $rainbow-colors;
    } @else {
      $palette: $gray-colors;
    }
    @for $i from 0 through 7 {
      --cell-color-#{$i}: #{list.nth($palette, $i + 1)};
    }
  }
  .game-board.queen-#{$skin} {
    @if $skin == rainbow {
      --queen-color: #{linear-gradient(45deg, $rainbow-colors)};
    } @else {
      --queen-color: #{linear-gradient(45deg, $gray-colors)};
    }
  }
}
</style>

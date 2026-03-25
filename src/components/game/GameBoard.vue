<script setup lang="ts">
import GameCell from '@/components/game/GameCell.vue'
import QueenGame from '@/game/QueenGame'
import { onBeforeUnmount, ref, watch } from 'vue'
import HeartCounter from '../common/HeartCounter.vue'
import { useRouter } from 'vue-router'
import type { Position } from '@/types/board'

const props = defineProps<{
  queenSkin: 'rainbow' | 'grayscale'
  cellSkin: 'rainbow' | 'grayscale'
  game: QueenGame
}>()

const router = useRouter()

const DOUBLE_CLICK_DELAY_MS = 250

const isDragging = ref(false)
const isPointerDown = ref(false)
const suppressNextClick = ref(false)

let dragStartPosition: Position | null = null
let draggedPositions = new Set<string>()
let pendingNoteTimer: ReturnType<typeof setTimeout> | null = null
let pendingNotePosition: Position | null = null

const getPositionKey = ([row, column]: Position) => `${row}-${column}`

const clearPendingNote = () => {
  if (pendingNoteTimer !== null) {
    clearTimeout(pendingNoteTimer)
    pendingNoteTimer = null
  }
  pendingNotePosition = null
}

const flushPendingNote = () => {
  if (pendingNotePosition !== null) {
    props.game.toggleNote(pendingNotePosition)
  }
  clearPendingNote()
}

const toggleDraggedPosition = (position: Position) => {
  const key = getPositionKey(position)
  if (draggedPositions.has(key)) return
  props.game.toggleNote(position)
  draggedPositions.add(key)
}

const resetPointerSession = () => {
  isPointerDown.value = false
  dragStartPosition = null
  draggedPositions = new Set<string>()
}

const handlePointerDown = (position: Position) => {
  isPointerDown.value = true
  isDragging.value = false
  suppressNextClick.value = false
  dragStartPosition = position
  draggedPositions = new Set<string>()
}

const handlePointerEnter = (position: Position) => {
  if (!isPointerDown.value || dragStartPosition === null) return

  const startKey = getPositionKey(dragStartPosition)
  const currentKey = getPositionKey(position)

  if (!isDragging.value && currentKey === startKey) return

  clearPendingNote()

  if (!isDragging.value) {
    isDragging.value = true
    suppressNextClick.value = true
    toggleDraggedPosition(dragStartPosition)
  }

  toggleDraggedPosition(position)
}

const handleNoteClick = (position: Position) => {
  if (suppressNextClick.value) {
    suppressNextClick.value = false
    return
  }

  if (
    pendingNotePosition !== null &&
    getPositionKey(pendingNotePosition) !== getPositionKey(position)
  ) {
    flushPendingNote()
  }

  clearPendingNote()
  pendingNotePosition = position
  pendingNoteTimer = setTimeout(() => {
    props.game.toggleNote(position)
    clearPendingNote()
  }, DOUBLE_CLICK_DELAY_MS)
}

const handleMarkQueen = (position: Position) => {
  clearPendingNote()
  props.game.markQueen(position)
}

const handlePointerEnd = () => {
  isDragging.value = false
  resetPointerSession()
}

onBeforeUnmount(() => {
  clearPendingNote()
})

watch(
  () => props.game.hearts,
  (newHearts) => {
    if (newHearts === 0) {
      // TODO: panel with "Game Over" message and "Restart" button
      alert('Game Over! You have run out of hearts.')
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  },
)
</script>

<template>
  <div
    class="game-board"
    :class="`cell-${cellSkin} queen-${queenSkin}`"
    :style="{ width: `${game.getSize() * 62}px` }"
    @pointerup="handlePointerEnd"
    @pointercancel="handlePointerEnd"
    @mouseleave="handlePointerEnd"
  >
    <heart-counter :hearts="game.hearts" />
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
</template>

<style scoped lang="scss">
@use 'sass:list';

.game-board {
  touch-action: manipulation;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 12px;
  box-sizing: border-box;
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

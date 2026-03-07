<script setup lang="ts">
import GameCell from '@/components/game/GameCell.vue'
import QueenGame from '@/game/QueenGame'
import { ref, watch } from 'vue'
import HeartCounter from '../common/HeartCounter.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  queenSkin: 'rainbow' | 'grayscale'
  cellSkin: 'rainbow' | 'grayscale'
  game: QueenGame
}>()

const router = useRouter()

const isDragging = ref(false)

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
    @pointerup="isDragging = false"
    @pointercancel="isDragging = false"
    @mouseleave="isDragging = false"
  >
    <heart-counter :hearts="game.hearts" />
    <template v-for="(row, rowIndex) in game.board" :key="rowIndex">
      <game-cell
        v-for="(cell, columnIndex) in row"
        :key="cell.getPosition().join('-')"
        :cell="cell"
        :is-dragging="isDragging"
        @startDrag="isDragging = true"
        @mark-queen="game.markQueen([rowIndex, columnIndex])"
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

<script setup lang="ts">
import type BoardCell from '@/modules/game/BoardCell'
import { computed } from 'vue'
import type { Position } from '@/modules/types/board'

const props = defineProps<{
  cell: BoardCell
}>()

const emit = defineEmits<{
  pointerDown: [position: Position]
  pointerEnter: [position: Position]
  noteClick: [position: Position]
  markQueen: [position: Position]
}>()

const cellColor = computed(() => `var(--cell-color-${props.cell.getRegion()})`)
const position = computed(() => props.cell.getPosition())
</script>

<template>
  <div
    class="game-cell"
    :style="{ backgroundColor: cellColor }"
    :data-row="position[0]"
    :data-column="position[1]"
    :data-test="`cell-${position[0]}-${position[1]}`"
    @dblclick="emit('markQueen', position)"
    @pointerdown="emit('pointerDown', position)"
    @pointerenter="emit('pointerEnter', position)"
    @click="emit('noteClick', position)"
  >
    <template v-if="props.cell.isQueen() && props.cell.status === 'found'">
      <div class="queen">👸</div>
    </template>
    <template v-if="['note', 'wrong'].includes(props.cell.status)">
      <span :class="{ wrong: props.cell.status === 'wrong' }">x</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.game-cell {
  touch-action: none;
  cursor: pointer;
  user-select: none;
  flex: 0 0 calc((100% - (var(--board-size) - 1) * var(--board-gap)) / var(--board-size));
  box-sizing: border-box;
  min-width: 0;
  aspect-ratio: 1;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.05s ease,
    box-shadow 0.1s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }
  .queen {
    width: 72%;
    height: 72%;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-image: var(--queen-color);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  }
  .wrong {
    color: red;
  }
}

@media (max-width: 480px) {
  .game-cell {
    font-size: 18px;

    .queen {
      font-size: 16px;
    }
  }
}
</style>

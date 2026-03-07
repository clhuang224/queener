<script setup lang="ts">
import type BoardCell from '@/game/BoardCell'
import { computed } from 'vue'

const props = defineProps<{
  cell: BoardCell
  isDragging: boolean
}>()

const emit = defineEmits<{
  startDrag: []
  markQueen: []
}>()

const onPointerEnter = () => {
  if (!props.isDragging) return
  props.cell.toggleNote()
}

const cellColor = computed(() => `var(--cell-color-${props.cell.getRegion()})`)
</script>

<template>
  <!-- FIXME: event order -->
  <div
    class="game-cell"
    :style="{ backgroundColor: cellColor }"
    @dblclick="emit('markQueen')"
    @pointerdown="[emit('startDrag'), props.cell.toggleNote()]"
    @pointerenter="onPointerEnter"
    @click="props.cell.toggleNote()"
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
  width: 50px;
  height: 50px;
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
    width: 36px;
    height: 36px;
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
</style>

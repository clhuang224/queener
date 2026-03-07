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
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 8px;
  box-sizing: border-box;
}
.queen {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #fff;
  background-image: var(--queen-color);
  border-radius: 50%;
}
.wrong {
  color: red;
}
</style>

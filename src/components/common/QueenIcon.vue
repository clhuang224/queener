<script setup lang="ts">
import type { BoardCellStatus } from '@/modules/game/BoardCell'

defineProps<{
  status: Extract<BoardCellStatus, 'found' | 'note' | 'wrong'>
  icon: string
  noteIcon: string
}>()
</script>

<template>
  <img v-if="status === 'found'" class="queen-icon found" :src="icon" alt="" draggable="false" />
  <span
    v-else
    class="queen-icon note"
    :class="{ wrong: status === 'wrong' }"
    v-html="noteIcon"
  ></span>
</template>

<style scoped lang="scss">
.queen-icon {
  pointer-events: none;
  user-select: none;
}

.queen-icon.found {
  width: 72%;
  height: 72%;
  object-fit: contain;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.22)) drop-shadow(0 4px 5px rgba(0, 0, 0, 0.18));
}

.queen-icon.note {
  width: 58%;
  height: 58%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.queen-icon.wrong {
  color: #d92d20;
}

.queen-icon.note :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
  flex: 0 0 100%;
  overflow: visible;
}
</style>

<script setup lang="ts">
import type BoardCell from '@/modules/game/BoardCell'
import { computed } from 'vue'
import type { Position } from '@/modules/types/board'

const props = defineProps<{
  cell: BoardCell
  queenIcon: string
}>()

const emit = defineEmits<{
  pointerDown: [position: Position]
  pointerEnter: [position: Position]
  noteClick: [position: Position]
  markQueen: [position: Position]
}>()

const cellColor = computed(() => `var(--cell-color-${props.cell.getRegion()})`)
const queenIconMaskStyle = computed(() => ({
  '--queen-icon-url': `url("${props.queenIcon}")`,
}))
const position = computed(() => props.cell.getPosition())
</script>

<template>
  <div
    class="game-cell"
    :style="{ backgroundColor: cellColor }"
    :data-row="position[0]"
    :data-column="position[1]"
    :data-status="props.cell.status"
    :data-test="`cell-${position[0]}-${position[1]}`"
    @dblclick="emit('markQueen', position)"
    @pointerdown="emit('pointerDown', position)"
    @pointerenter="emit('pointerEnter', position)"
    @click="emit('noteClick', position)"
  >
    <template v-if="props.cell.isQueen() && props.cell.status === 'found'">
      <img class="queen" :src="queenIcon" alt="" draggable="false" />
    </template>
    <template v-if="props.cell.status === 'note'">
      <span class="queen-note" :style="queenIconMaskStyle">
        <span class="queen-icon-fill"></span>
      </span>
    </template>
    <template v-if="props.cell.status === 'wrong'">
      <span class="queen-note queen-note-wrong" :style="queenIconMaskStyle">
        <span class="queen-icon-fill"></span>
      </span>
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
  .queen,
  .queen-note {
    pointer-events: none;
    user-select: none;
  }

  .queen {
    width: 72%;
    height: 72%;
    object-fit: contain;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.22)) drop-shadow(0 4px 5px rgba(0, 0, 0, 0.18));
  }

  .queen-note {
    width: 58%;
    height: 58%;
    position: relative;
    background: rgba(80, 80, 80, 0.86);
    mask-image: var(--queen-icon-url);
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: contain;
    -webkit-mask-image: var(--queen-icon-url);
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: contain;
  }

  .queen-note-wrong {
    background: #d92d20;
  }

  .queen-icon-fill {
    position: absolute;
    inset: 10%;
    background: #fff;
    mask-image: var(--queen-icon-url);
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: contain;
    -webkit-mask-image: var(--queen-icon-url);
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: contain;
  }
}

@media (max-width: 480px) {
  .game-cell {
    font-size: 18px;
  }
}
</style>

<script setup lang="ts">
import QueenIcon from '@/components/common/QueenIcon.vue'
import type BoardCell from '@/modules/game/BoardCell'
import { computed } from 'vue'
import type { Position } from '@/modules/types/board'

const props = defineProps<{
  cell: BoardCell
  cellTextureClassName: string
  isHinted: boolean
  queenIcon: string
  queenNoteIcon: string
}>()

type CellInteraction =
  | 'pointerDown'
  | 'pointerEnter'
  | 'noteClick'
  | 'markQueen'
  | 'pressStart'
  | 'pressEnter'
  | 'pressClick'
  | 'pressEnd'
type CellFocusDirection = 'up' | 'down' | 'left' | 'right'

const emit = defineEmits<{
  (event: CellInteraction, position: Position): void
  (event: 'moveFocus', position: Position, direction: CellFocusDirection): void
}>()

const cellColor = computed(() => `var(--cell-color-${props.cell.getRegion()})`)
const position = computed(() => props.cell.getPosition())
const isInteractive = computed(() => props.cell.status === 'empty' || props.cell.status === 'note')
const cellStatusLabel = computed(() => {
  if (props.cell.status === 'found') return 'found queen'
  if (props.cell.status === 'wrong') return 'wrong queen'
  return props.cell.status
})
const cellAriaLabel = computed(() => {
  const [row, column] = position.value
  const region = props.cell.getRegion()

  return `Row ${row + 1}, column ${column + 1}, region ${region + 1}, ${cellStatusLabel.value}`
})

const emitWhenInteractive = (event: CellInteraction) => {
  if (!isInteractive.value) return
  emit(event, position.value)
}

const isSpaceKey = (event: KeyboardEvent) => event.key === ' ' || event.code === 'Space'
const focusDirectionByKey: Partial<Record<string, CellFocusDirection>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const handleKeydown = (event: KeyboardEvent) => {
  const direction = focusDirectionByKey[event.key]
  if (direction !== undefined) {
    event.preventDefault()
    if (isInteractive.value) {
      emit('moveFocus', position.value, direction)
    }
    return
  }

  if (!isSpaceKey(event)) return

  event.preventDefault()
  if (event.repeat) return

  emitWhenInteractive('pressStart')
}

const handleKeyup = (event: KeyboardEvent) => {
  if (!isSpaceKey(event)) return

  event.preventDefault()
  emitWhenInteractive('pressClick')
  emitWhenInteractive('pressEnd')
}
</script>

<template>
  <div
    class="game-cell"
    :class="[
      cellTextureClassName,
      {
        'game-cell--hinted': isHinted,
        'game-cell--locked': !isInteractive,
      },
    ]"
    :style="{ backgroundColor: cellColor }"
    :data-row="position[0]"
    :data-column="position[1]"
    :data-status="props.cell.status"
    :data-test="`cell-${position[0]}-${position[1]}`"
    :aria-label="cellAriaLabel"
    :tabindex="isInteractive ? 0 : undefined"
    @dblclick="emitWhenInteractive('markQueen')"
    @pointerdown="emitWhenInteractive('pointerDown')"
    @pointerenter="emitWhenInteractive('pointerEnter')"
    @click="emitWhenInteractive('noteClick')"
    @focus="emitWhenInteractive('pressEnter')"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <template v-if="props.cell.isQueen() && props.cell.status === 'found'">
      <QueenIcon status="found" :icon="queenIcon" :note-icon="queenNoteIcon" />
    </template>
    <template v-if="props.cell.status === 'note'">
      <QueenIcon status="note" :icon="queenIcon" :note-icon="queenNoteIcon" />
    </template>
    <template v-if="props.cell.status === 'wrong'">
      <QueenIcon status="wrong" :icon="queenIcon" :note-icon="queenNoteIcon" />
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/texture.module.scss';

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
  border-radius: var(--radius-cell);
  border: 1px solid var(--color-border);
  transition:
    transform 0.05s ease,
    border-color 0.1s ease;
  &:hover {
    transform: translateY(-1px);
    border-color: var(--color-primary);
  }
  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    border-color: var(--color-primary);
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
  }
}

.game-cell--locked {
  cursor: default;
  pointer-events: none;

  &:hover,
  &:active {
    transform: none;
    border-color: var(--color-border);
  }
}

.game-cell--hinted :deep(.queen-icon) {
  animation: hint-tilt 0.48s ease-out;
}

@keyframes hint-tilt {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
  }

  45% {
    transform: translateY(-12%) rotate(-10deg) scale(1.18);
  }

  100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-cell--hinted :deep(.queen-icon) {
    animation: none;
  }
}

@media (max-width: 480px) {
  .game-cell {
    font-size: 18px;
  }
}
</style>

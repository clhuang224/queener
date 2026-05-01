<script setup lang="ts">
import { computed } from 'vue'
import { CELL_SKIN_COLOR_COUNT, CELL_SKINS } from '@/modules/constants/cellSkins'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import type { CellSkinType } from '@/modules/enums/CellSkinType'
import type { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { BoardCellStatus } from '@/modules/game/BoardCell'

const props = defineProps<{
  cellSkin: CellSkinType
  queenSkin: QueenSkinType
}>()

const previewStates: BoardCellStatus[] = ['found', 'note', 'wrong', 'empty']
const palette = computed(() => CELL_SKINS[props.cellSkin])
const queenIcon = computed(() => QUEEN_SKINS[props.queenSkin].icon)
const queenIconMaskStyle = computed(() => ({
  '--queen-icon-url': `url("${queenIcon.value}")`,
}))
const gridStyle = {
  '--preview-column-count': String(CELL_SKIN_COLOR_COUNT),
}
</script>

<template>
  <div
    class="cell-skin-preview"
    :style="gridStyle"
    data-test="cell-skin-preview"
  >
    <template v-for="state in previewStates" :key="state">
      <div
        v-for="(color, colorIndex) in palette"
        :key="`${state}-${color}`"
        class="preview-cell"
        :class="`state-${state}`"
        :style="{ backgroundColor: color }"
        :data-color="color"
        :data-state="state"
        :aria-label="`${state} preview color ${colorIndex + 1}`"
      >
        <img v-if="state === 'found'" class="queen" :src="queenIcon" alt="" draggable="false" />
        <span v-else-if="state === 'note'" class="queen-note" :style="queenIconMaskStyle">
          <span class="queen-icon-fill"></span>
        </span>
        <span v-else-if="state === 'wrong'" class="queen-note queen-note-wrong" :style="queenIconMaskStyle">
          <span class="queen-icon-fill"></span>
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.cell-skin-preview {
  --preview-gap: 4px;

  display: grid;
  grid-template-columns: repeat(var(--preview-column-count), 1fr);
  gap: var(--preview-gap);
  width: 100%;
}

.preview-cell {
  aspect-ratio: 1;
  min-width: 0;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  user-select: none;
}

.preview-cell.state-empty {
  box-shadow: none;
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
  filter:
    drop-shadow(0 1px 1px rgba(0, 0, 0, 0.22))
    drop-shadow(0 4px 5px rgba(0, 0, 0, 0.18));
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

@media (max-width: 480px) {
  .cell-skin-preview {
    --preview-gap: 3px;
  }

  .preview-cell {
    border-radius: 6px;
    font-size: 14px;
  }
}
</style>

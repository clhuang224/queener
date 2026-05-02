<script setup lang="ts">
import { computed } from 'vue'
import QueenIcon from '@/components/common/QueenIcon.vue'
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
const queenNoteIcon = computed(() => QUEEN_SKINS[props.queenSkin].noteIcon)
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
        <QueenIcon
          v-if="state === 'found' || state === 'note' || state === 'wrong'"
          :status="state"
          :icon="queenIcon"
          :note-icon="queenNoteIcon"
        />
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

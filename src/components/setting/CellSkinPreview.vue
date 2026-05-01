<script setup lang="ts">
import { computed } from 'vue'
import { CELL_SKIN_COLOR_COUNT, CELL_SKINS } from '@/modules/constants/cellSkins'
import type { QueenSkin } from '@/modules/types/skin'
import type { CellSkinType } from '@/modules/enums/CellSkinType'
import type { BoardCellStatus } from '@/modules/game/BoardCell'

const props = defineProps<{
  cellSkin: CellSkinType
  queenSkin: QueenSkin
}>()

const previewStates: BoardCellStatus[] = ['found', 'note', 'wrong', 'empty']
const palette = computed(() => CELL_SKINS[props.cellSkin])
const gridStyle = {
  '--preview-column-count': String(CELL_SKIN_COLOR_COUNT),
}
</script>

<template>
  <div
    class="cell-skin-preview"
    :class="`queen-${queenSkin}`"
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
        <div v-if="state === 'found'" class="queen">👸</div>
        <span v-else-if="state === 'note' || state === 'wrong'" :class="{ wrong: state === 'wrong' }">
          x
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

.wrong {
  color: red;
}

.queen {
  width: 72%;
  height: 72%;
  border-radius: 50%;
  background-image: var(--queen-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.queen-rainbow {
  --queen-color: linear-gradient(
    45deg,
    #f94144,
    #f3722c,
    #f8961e,
    #f9c74f,
    #90be6d,
    #43aa8b,
    #4d908e,
    #3b89aa,
    #277da1,
    #577590
  );
}

.queen-grayscale {
  --queen-color: linear-gradient(45deg, #000, #222, #444, #666, #888, #aaa, #ccc, #eee);
}

@media (max-width: 480px) {
  .cell-skin-preview {
    --preview-gap: 3px;
  }

  .preview-cell {
    border-radius: 6px;
    font-size: 14px;
  }

  .queen {
    font-size: 12px;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import QueenIcon from '@/components/common/QueenIcon.vue'
import { CELL_TEXTURES } from '@/modules/constants/cellTextures'
import { BOARD_SKIN_COLOR_COUNT, BOARD_SKINS } from '@/modules/constants/boardSkins'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import type { BoardSkinType } from '@/modules/enums/BoardSkinType'
import type { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { BoardCellStatus } from '@/modules/game/BoardCell'

const props = defineProps<{
  boardSkin: BoardSkinType
  boardTextureEnabled: boolean
  queenSkin: QueenSkinType
}>()

const previewStates: BoardCellStatus[] = ['found', 'note', 'wrong', 'empty']
const palette = computed(() => BOARD_SKINS[props.boardSkin])
const queenIcon = computed(() => QUEEN_SKINS[props.queenSkin].icon)
const queenNoteIcon = computed(() => QUEEN_SKINS[props.queenSkin].noteIcon)
const gridStyle = {
  '--preview-column-count': String(BOARD_SKIN_COLOR_COUNT),
}

const getTextureClass = (colorIndex: number) => {
  if (!props.boardTextureEnabled) return ''

  return CELL_TEXTURES[colorIndex % CELL_TEXTURES.length]!
}
</script>

<template>
  <div class="board-skin-preview" :style="gridStyle" data-test="board-skin-preview">
    <template v-for="state in previewStates" :key="state">
      <div
        v-for="(color, colorIndex) in palette"
        :key="`${state}-${color}`"
        class="preview-cell"
        :class="[`state-${state}`, getTextureClass(colorIndex)]"
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
@import '@/assets/texture.module.scss';

.board-skin-preview {
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
  .board-skin-preview {
    --preview-gap: 3px;
  }

  .preview-cell {
    border-radius: 6px;
    font-size: 14px;
  }
}
</style>

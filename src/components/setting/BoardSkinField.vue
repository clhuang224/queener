<script setup lang="ts">
import { BOARD_SKINS, boardSkinMapName } from '@/modules/constants/boardSkins'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { getEnumValues } from '@/modules/utils/getEnumValues'
import { RadioGroupItem, RadioGroupRoot, VisuallyHidden } from 'reka-ui'

defineProps<{
  boardSkin: BoardSkinType
}>()

const emit = defineEmits<{
  'update:boardSkin': [skin: BoardSkinType]
}>()

const boardSkinOptions = getEnumValues(BoardSkinType).map((type) => ({
  label: boardSkinMapName[type],
  value: type,
  colors: BOARD_SKINS[type],
}))

const isBoardSkinType = (value: unknown): value is BoardSkinType => {
  return boardSkinOptions.some((option) => option.value === value)
}

const handleBoardSkinChange = (value: unknown) => {
  if (isBoardSkinType(value)) {
    emit('update:boardSkin', value)
  }
}
</script>

<template>
  <section>
    <p class="field-label">Board Skin</p>
    <RadioGroupRoot
      class="board-skin-grid"
      :model-value="boardSkin"
      aria-label="Board skin"
      @update:model-value="handleBoardSkinChange"
    >
      <RadioGroupItem
        v-for="option in boardSkinOptions"
        :key="option.value"
        class="board-skin-option"
        :value="option.value"
        :aria-labelledby="`board-skin-${option.value}-label`"
      >
        <span class="board-swatch-strip" aria-hidden="true">
          <span
            v-for="color in option.colors"
            :key="color"
            class="board-swatch"
            :style="{ backgroundColor: color }"
          ></span>
        </span>
        <VisuallyHidden :id="`board-skin-${option.value}-label`" feature="fully-hidden">
          {{ option.label }}
        </VisuallyHidden>
      </RadioGroupItem>
    </RadioGroupRoot>
  </section>
</template>

<style scoped lang="scss">
.field-label {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: #39507a;
}

.board-skin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.board-skin-option {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 32px;
  padding: 4px;
  border: 1px solid #c7d2e4;
  border-radius: 8px;
  background: #f8fbff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.board-skin-option:hover {
  border-color: #6f86b7;
}

.board-skin-option:focus-visible {
  outline: 3px solid rgba(31, 60, 136, 0.28);
  outline-offset: 2px;
}

.board-skin-option[data-state='checked'] {
  border-color: #1f3c88;
  background: #eaf0ff;
  box-shadow: 0 6px 18px rgba(31, 60, 136, 0.22);
}

.board-swatch-strip {
  display: grid;
  grid-template-columns: repeat(10, 9px);
  width: 90px;
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  box-shadow: 0 0 0 1px rgba(31, 60, 136, 0.12);
}

.board-swatch {
  width: 9px;
  height: 9px;
}

@media (max-width: 480px) {
  .board-skin-option {
    border-radius: 6px;
  }
}
</style>

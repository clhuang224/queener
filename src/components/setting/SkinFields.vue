<script setup lang="ts">
import { boardSkinMapName } from '@/modules/constants/boardSkins'
import { isQueenSkinAvailable, queenSkinMapName } from '@/modules/constants/queenSkins'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { getEnumValues } from '@/modules/utils/getEnumValues'
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  boardSkin: BoardSkinType
  boardTextureEnabled: boolean
  queenSkin: QueenSkinType
}>()

const emit = defineEmits<{
  'update:boardSkin': [skin: BoardSkinType]
  'update:boardTextureEnabled': [enabled: boolean]
  'update:queenSkin': [skin: QueenSkinType]
}>()

const boardSkinOptions = getEnumValues(BoardSkinType).map((type) => ({
  label: boardSkinMapName[type],
  value: type,
}))

const queenSkinOptions = getEnumValues(QueenSkinType)
  .filter((type) => isQueenSkinAvailable(type))
  .map((type) => ({
    label: queenSkinMapName[type],
    value: type,
  }))
</script>

<template>
  <section>
    <div class="field-group">
      <p class="field-label">Board Skin</p>
      <div class="option-row">
        <button
          v-for="option in boardSkinOptions"
          :key="option.value"
          class="option-button"
          :class="{ active: option.value === boardSkin }"
          type="button"
          @click="emit('update:boardSkin', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="field-group">
      <div class="switch-field">
        <p id="board-texture-label" class="field-label">Board Texture</p>
        <div class="switch-control">
          <SwitchRoot
            class="texture-switch"
            :model-value="boardTextureEnabled"
            aria-labelledby="board-texture-label"
            @update:model-value="emit('update:boardTextureEnabled', $event)"
          >
            <SwitchThumb class="texture-switch-thumb" />
          </SwitchRoot>
        </div>
      </div>
    </div>

    <div class="field-group">
      <p class="field-label">Queen Skin</p>
      <div class="option-row">
        <button
          v-for="option in queenSkinOptions"
          :key="option.value"
          class="option-button"
          :class="{ active: option.value === queenSkin }"
          type="button"
          @click="emit('update:queenSkin', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.field-group + .field-group {
  margin-top: 16px;
}

.field-label {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: #39507a;
}

.option-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.option-button {
  flex: 0 0 130px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #c7d2e4;
  border-radius: 12px;
  background: #f8fbff;
  color: #345;
  font: inherit;
  cursor: pointer;
}

.option-button.active {
  border-color: #1f3c88;
  background: #1f3c88;
  color: #fff;
  box-shadow: 0 6px 18px rgba(31, 60, 136, 0.22);
}

.switch-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.switch-field .field-label {
  margin-bottom: 0;
}

.switch-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.texture-switch {
  position: relative;
  width: 52px;
  height: 30px;
  padding: 0;
  border: 1px solid #c7d2e4;
  border-radius: 999px;
  background: #dce5f2;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.texture-switch[data-state='checked'] {
  border-color: #1f3c88;
  background: #1f3c88;
}

.texture-switch-thumb {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(31, 60, 136, 0.22);
  transform: translateX(3px);
  transition: transform 0.2s ease;
}

.texture-switch-thumb[data-state='checked'] {
  transform: translateX(23px);
}

@media (max-width: 360px) {
  .option-button {
    flex-basis: 100%;
  }

  .switch-field {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

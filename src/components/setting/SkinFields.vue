<script setup lang="ts">
import { boardSkinMapName } from '@/modules/constants/boardSkins'
import { isQueenSkinAvailable, queenSkinMapName } from '@/modules/constants/queenSkins'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { getEnumValues } from '@/modules/utils/getEnumValues'

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
  <section class="skin-fields">
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
      <p class="field-label">Board Texture</p>
      <div class="option-row">
        <button
          class="option-button"
          :class="{ active: !boardTextureEnabled }"
          type="button"
          @click="emit('update:boardTextureEnabled', false)"
        >
          Off
        </button>
        <button
          class="option-button"
          :class="{ active: boardTextureEnabled }"
          type="button"
          @click="emit('update:boardTextureEnabled', true)"
        >
          On
        </button>
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
.skin-fields {
  width: min(100%, 420px);
}

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

@media (max-width: 360px) {
  .option-button {
    flex-basis: 100%;
  }
}
</style>

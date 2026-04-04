<script setup lang="ts">
import type { CellSkin, QueenSkin } from '@/types/skin'

defineProps<{
  cellSkin: CellSkin
  queenSkin: QueenSkin
}>()

const emit = defineEmits<{
  'update:cellSkin': [skin: CellSkin]
  'update:queenSkin': [skin: QueenSkin]
}>()

const cellSkinOptions: Array<{ label: string; value: CellSkin }> = [
  { label: 'Rainbow', value: 'rainbow' },
  { label: 'Grayscale', value: 'grayscale' },
]

const queenSkinOptions: Array<{ label: string; value: QueenSkin }> = [
  { label: 'Rainbow', value: 'rainbow' },
  { label: 'Grayscale', value: 'grayscale' },
]
</script>

<template>
  <section class="skin-fields">
    <div class="field-group">
      <p class="field-label">Board Skin</p>
      <div class="option-row">
        <button
          v-for="option in cellSkinOptions"
          :key="option.value"
          class="option-button"
          :class="{ active: option.value === cellSkin }"
          type="button"
          @click="emit('update:cellSkin', option.value)"
        >
          {{ option.label }}
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
  gap: 10px;
}

.option-button {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #c7d2e4;
  border-radius: 12px;
  background: #f8fbff;
  color: #345;
  font: inherit;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.option-button.active {
  border-color: #1f3c88;
  background: #1f3c88;
  color: #fff;
  box-shadow: 0 6px 18px rgba(31, 60, 136, 0.22);
}
</style>

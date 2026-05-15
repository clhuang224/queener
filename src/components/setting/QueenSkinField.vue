<script setup lang="ts">
import { isQueenSkinAvailable, QUEEN_SKINS, queenSkinMapName } from '@/modules/constants/queenSkins'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { getEnumValues } from '@/modules/utils/getEnumValues'
import { RadioGroupItem, RadioGroupRoot, VisuallyHidden } from 'reka-ui'

defineProps<{
  queenSkin: QueenSkinType
}>()

const emit = defineEmits<{
  'update:queenSkin': [skin: QueenSkinType]
}>()

const queenSkinOptions = getEnumValues(QueenSkinType)
  .filter((type) => isQueenSkinAvailable(type))
  .map((type) => ({
    label: queenSkinMapName[type],
    value: type,
    icon: QUEEN_SKINS[type].icon,
  }))

const isQueenSkinType = (value: unknown): value is QueenSkinType => {
  return queenSkinOptions.some((option) => option.value === value)
}

const handleQueenSkinChange = (value: unknown) => {
  if (isQueenSkinType(value)) {
    emit('update:queenSkin', value)
  }
}
</script>

<template>
  <section>
    <p class="field-label">Queen Skin</p>
    <RadioGroupRoot
      class="queen-skin-grid"
      :model-value="queenSkin"
      aria-label="Queen skin"
      @update:model-value="handleQueenSkinChange"
    >
      <RadioGroupItem
        v-for="option in queenSkinOptions"
        :key="option.value"
        class="queen-skin-option"
        :value="option.value"
        :aria-labelledby="`queen-skin-${option.value}-label`"
      >
        <img class="queen-skin-icon" :src="option.icon" alt="" draggable="false" />
        <VisuallyHidden :id="`queen-skin-${option.value}-label`" feature="fully-hidden">
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

.queen-skin-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}

.queen-skin-option {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
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

.queen-skin-option:hover {
  border-color: #6f86b7;
}

.queen-skin-option:focus-visible {
  outline: 3px solid rgba(31, 60, 136, 0.28);
  outline-offset: 2px;
}

.queen-skin-option[data-state='checked'] {
  border-color: #1f3c88;
  background: #eaf0ff;
  box-shadow: 0 6px 18px rgba(31, 60, 136, 0.22);
}

.queen-skin-option[data-state='checked'] .queen-skin-icon {
  transform: scale(1.08);
}

.queen-skin-icon {
  width: 72%;
  height: 72%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(31, 60, 136, 0.16));
  transition: transform 0.2s ease;
}

@media (max-width: 480px) {
  .queen-skin-grid {
    gap: 3px;
  }

  .queen-skin-option {
    border-radius: 6px;
  }
}
</style>

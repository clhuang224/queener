<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-vue'

defineProps<{
  selectedLevel: number
  canGoNext: boolean
  boardSize: number
  maxHearts: number
}>()

const emit = defineEmits<{
  previous: []
  next: []
}>()
</script>

<template>
  <div class="level-picker">
    <BaseButton
      icon
      class="arrow-button"
      :disabled="selectedLevel <= 1"
      aria-label="Previous level"
      @click="emit('previous')"
    >
      <IconArrowNarrowLeft />
    </BaseButton>
    <div class="level-card" aria-live="polite">
      <p class="label">Level</p>
      <strong class="level-number">{{ selectedLevel }}</strong>
      <p class="rules">Board: {{ boardSize }}x{{ boardSize }} · Hearts: {{ maxHearts }}</p>
    </div>
    <BaseButton
      icon
      class="arrow-button"
      :disabled="!canGoNext"
      aria-label="Next level"
      @click="emit('next')"
    >
      <IconArrowNarrowRight />
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.level-picker {
  display: flex;
  align-items: center;
  gap: 16px;
}

.level-card {
  min-width: 140px;
  padding: 18px 20px;
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 18px 14px 20px 15px;
}

.label,
.rules {
  margin: 0;
}

.label {
  font-size: 14px;
  color: var(--color-text-muted);
}

.level-number {
  display: block;
  margin: 8px 0 6px;
  font-size: 42px;
  line-height: 1;
  color: var(--color-primary);
}

.rules {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.arrow-button {
  --icon-button-size: 48px;

  background-color: var(--color-accent);
  color: var(--color-text);

  &:hover:not(:disabled) {
    background-color: var(--color-accent-hover);
  }
}
</style>

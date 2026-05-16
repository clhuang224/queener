<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'

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
      class="arrow-button"
      :disabled="selectedLevel <= 1"
      aria-label="Previous level"
      @click="emit('previous')"
    >
      ←
    </BaseButton>
    <div class="level-card" aria-live="polite">
      <p class="label">Level</p>
      <strong class="level-number">{{ selectedLevel }}</strong>
      <p class="rules">Board: {{ boardSize }}x{{ boardSize }} · Hearts: {{ maxHearts }}</p>
    </div>
    <BaseButton
      class="arrow-button"
      :disabled="!canGoNext"
      aria-label="Next level"
      @click="emit('next')"
    >
      →
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
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.label,
.rules {
  margin: 0;
}

.label {
  font-size: 14px;
  color: #5c677d;
}

.level-number {
  display: block;
  margin: 8px 0 6px;
  font-size: 42px;
  line-height: 1;
  color: #1f3c88;
}

.rules {
  margin-top: 6px;
  font-size: 13px;
  color: #4d5a74;
}

.arrow-button {
  min-width: 56px;
  padding-inline: 0;
  font-size: 24px;
}
</style>

<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'

defineProps<{
  selectedLevel: number
  highestUnlockedLevel: number
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
    <base-button class="arrow-button" :disabled="selectedLevel <= 1" @click="emit('previous')">
      ←
    </base-button>
    <div class="level-card">
      <p class="label">Level</p>
      <strong class="level-number">{{ selectedLevel }}</strong>
      <p class="progress">Unlocked: 1 - {{ highestUnlockedLevel }}</p>
      <p class="rules">Board: {{ boardSize }}x{{ boardSize }} · Hearts: {{ maxHearts }}</p>
    </div>
    <base-button
      class="arrow-button"
      :disabled="selectedLevel >= highestUnlockedLevel"
      @click="emit('next')"
    >
      →
    </base-button>
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
.progress,
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

.progress {
  font-size: 13px;
  color: #6c757d;
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

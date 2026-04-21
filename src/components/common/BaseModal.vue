<script setup lang="ts">
import type { ModalAction } from '@/types/modal'

defineProps<{
  title: string
  content: string
  actions: ModalAction[]
}>()
const emit = defineEmits<{
  (event: 'select', action: ModalAction): void
}>()

const handleSelect = (action: ModalAction) => {
  emit('select', action)
}
</script>

<template>
  <div class="base-modal">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <div class="actions">
      <button
        v-for="(action, index) in actions"
        :key="`${action.label}-${index}`"
        @click="handleSelect(action)"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-modal {
  width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>

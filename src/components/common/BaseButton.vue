<script setup lang="ts">
defineProps<{
  disabled?: boolean
  ariaLabel?: string
}>()
</script>

<template>
  <button :aria-label="ariaLabel" class="base-button" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.base-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}
</style>

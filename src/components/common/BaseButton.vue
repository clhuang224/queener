<script setup lang="ts">
defineProps<{
  disabled?: boolean
  icon?: boolean
}>()
</script>

<template>
  <button
    class="base-button"
    :class="{ 'base-button--icon': icon }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 22px;
  font-size: 16px;
  font-weight: 700;
  background-color: var(--color-primary);
  color: #fffdf7;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: transparent;
    color: var(--color-text-muted);
    border-color: var(--color-border);
    cursor: not-allowed;
    transform: none;
  }
}

.base-button--icon {
  width: var(--icon-button-size, 42px);
  min-width: var(--icon-button-size, 42px);
  min-height: var(--icon-button-size, 42px);
  padding: 0;
  gap: 0;
}
</style>

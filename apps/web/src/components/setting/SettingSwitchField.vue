<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  label: string
  labelId: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [enabled: boolean]
}>()
</script>

<template>
  <section class="setting-switch-field">
    <p :id="labelId" class="field-label">{{ label }}</p>
    <div class="switch-control">
      <SwitchRoot
        class="setting-switch"
        :model-value="modelValue"
        :aria-labelledby="labelId"
        @update:model-value="emit('update:modelValue', $event)"
      >
        <SwitchThumb class="setting-switch-thumb" />
      </SwitchRoot>
    </div>
  </section>
</template>

<style scoped lang="scss">
.setting-switch-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.field-label {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.switch-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-switch {
  position: relative;
  width: 52px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.setting-switch[data-state='checked'] {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.setting-switch:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.setting-switch-thumb {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-sizing: border-box;
  transform: translateX(3px);
  transition: transform 0.2s ease;
}

.setting-switch-thumb[data-state='checked'] {
  transform: translateX(23px);
}

@media (max-width: 360px) {
  .setting-switch-field {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  boardTextureEnabled: boolean
}>()

const emit = defineEmits<{
  'update:boardTextureEnabled': [enabled: boolean]
}>()
</script>

<template>
  <section class="switch-field">
    <p id="board-texture-label" class="field-label">Board Texture</p>
    <div class="switch-control">
      <SwitchRoot
        class="texture-switch"
        :model-value="boardTextureEnabled"
        aria-labelledby="board-texture-label"
        @update:model-value="emit('update:boardTextureEnabled', $event)"
      >
        <SwitchThumb class="texture-switch-thumb" />
      </SwitchRoot>
    </div>
  </section>
</template>

<style scoped lang="scss">
.switch-field {
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

.texture-switch {
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

.texture-switch[data-state='checked'] {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.texture-switch:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.texture-switch-thumb {
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

.texture-switch-thumb[data-state='checked'] {
  transform: translateX(23px);
}

@media (max-width: 360px) {
  .switch-field {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

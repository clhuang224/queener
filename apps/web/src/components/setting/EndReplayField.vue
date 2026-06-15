<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  endReplayEnabled: boolean
}>()

const emit = defineEmits<{
  'update:endReplayEnabled': [enabled: boolean]
}>()
</script>

<template>
  <section class="end-replay-field">
    <p id="end-replay-label" class="field-label">End Replay</p>
    <div class="switch-control">
      <SwitchRoot
        class="end-replay-switch"
        :model-value="endReplayEnabled"
        aria-labelledby="end-replay-label"
        @update:model-value="emit('update:endReplayEnabled', $event)"
      >
        <SwitchThumb class="end-replay-switch-thumb" />
      </SwitchRoot>
    </div>
  </section>
</template>

<style scoped lang="scss">
.end-replay-field {
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

.end-replay-switch {
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

.end-replay-switch[data-state='checked'] {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.end-replay-switch:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.end-replay-switch-thumb {
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

.end-replay-switch-thumb[data-state='checked'] {
  transform: translateX(23px);
}

@media (max-width: 360px) {
  .end-replay-field {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

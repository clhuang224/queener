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
  color: #39507a;
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
  border: 1px solid #c7d2e4;
  border-radius: 999px;
  background: #dce5f2;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.texture-switch[data-state='checked'] {
  border-color: #1f3c88;
  background: #1f3c88;
}

.texture-switch-thumb {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(31, 60, 136, 0.22);
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

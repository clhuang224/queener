<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import {
  formatShortcutKey,
  isReservedShortcutKey,
  isValidShortcutKey,
  normalizeShortcutKey,
} from '@/modules/utils/keyboardShortcut'

const props = defineProps<{
  label: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [shortcut: string]
}>()

const isCapturing = ref(false)
const errorMessage = ref('')

const startCapture = () => {
  isCapturing.value = true
  errorMessage.value = ''
}

const stopCapture = () => {
  isCapturing.value = false
  errorMessage.value = ''
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isCapturing.value) return

  event.preventDefault()
  event.stopPropagation()

  if (event.key === 'Escape') {
    stopCapture()
    return
  }

  if (isReservedShortcutKey(event.key)) {
    errorMessage.value = 'Reserved key'
    return
  }

  const shortcut = normalizeShortcutKey(event.key)
  if (!isValidShortcutKey(shortcut)) {
    errorMessage.value = 'Use one key'
    return
  }

  emit('update:modelValue', shortcut)
  stopCapture()
}
</script>

<template>
  <div class="keyboard-shortcut-field">
    <div class="keyboard-shortcut-copy">
      <span class="keyboard-shortcut-label">{{ props.label }}</span>
      <span class="keyboard-shortcut-description">Press the assigned key during play.</span>
    </div>
    <div class="keyboard-shortcut-control">
      <BaseButton
        type="button"
        variant="ghost"
        class="shortcut-button"
        :aria-label="`Change ${props.label} shortcut`"
        @click="startCapture"
        @blur="stopCapture"
        @keydown="handleKeydown"
      >
        {{ isCapturing ? 'Press key' : formatShortcutKey(props.modelValue) }}
      </BaseButton>
      <span class="keyboard-shortcut-message" aria-live="polite">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.keyboard-shortcut-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.keyboard-shortcut-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.keyboard-shortcut-label {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 800;
}

.keyboard-shortcut-description,
.keyboard-shortcut-message {
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.3;
}

.keyboard-shortcut-control {
  display: grid;
  justify-items: end;
  gap: 4px;
  flex: 0 0 auto;
}

.shortcut-button {
  min-width: 96px;
  padding-inline: 16px;
  color: var(--color-text);
  border-color: var(--color-border);
}

.keyboard-shortcut-message {
  min-height: 17px;
}

@media (max-width: 480px) {
  .keyboard-shortcut-field {
    align-items: stretch;
    flex-direction: column;
  }

  .keyboard-shortcut-control {
    justify-items: stretch;
  }
}
</style>

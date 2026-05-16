<script setup lang="ts">
import { IconCircle, IconX } from '@tabler/icons-vue'
import type { ModalAction } from '@/modules/types/modal'
import { AlertDialogDescription, AlertDialogTitle } from 'reka-ui'
import BaseButton from './BaseButton.vue'

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

const isConfirmAction = (action: ModalAction) => {
  return action.settle === 'resolve' || action.label === 'Confirm'
}

const isCancelAction = (action: ModalAction) => {
  return action.settle === 'reject' || action.label === 'Cancel'
}
</script>

<template>
  <div class="base-modal">
    <AlertDialogTitle class="title">
      {{ title }}
    </AlertDialogTitle>
    <AlertDialogDescription class="content">
      {{ content }}
    </AlertDialogDescription>
    <div class="actions">
      <BaseButton
        v-for="(action, index) in actions"
        :key="`${action.label}-${index}`"
        :aria-label="action.label"
        @click="handleSelect(action)"
      >
        <IconCircle v-if="isConfirmAction(action)" aria-hidden="true" />
        <IconX v-else-if="isCancelAction(action)" aria-hidden="true" />
        <span v-else>{{ action.label }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-modal {
  width: min(400px, calc(100vw - 32px));
  padding: 24px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
}

.title {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  line-height: 1.25;
}

.content {
  margin: 12px 0 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;

  button {
    min-width: 72px;
    padding: 10px 16px;
    color: white;
    font-size: 16px;
    border: 0;
    border-radius: 6px;
    background-color: #007bff;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background-color: #0056b3;
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>

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
        :icon="isConfirmAction(action) || isCancelAction(action)"
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
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 22px 18px 24px 18px;
}

.title {
  margin: 0;
  color: var(--color-text);
  font-size: 24px;
  line-height: 1.25;
}

.content {
  margin: 12px 0 0;
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>

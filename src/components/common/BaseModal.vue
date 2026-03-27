<script setup lang="ts">
defineProps<{
  title: string
  content: string
  type: 'alert' | 'confirm'
}>()
const emit = defineEmits<{
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="base-modal">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <div class="actions">
      <button @click="handleConfirm">確定</button>
      <button v-if="type === 'confirm'" @click="handleCancel">取消</button>
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
  .actions {
  }
}
</style>

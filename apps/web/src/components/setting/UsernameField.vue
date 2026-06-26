<script setup lang="ts">
defineProps<{
  username: string
}>()

const emit = defineEmits<{
  'update:username': [username: string]
}>()

const handleChange = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return

  emit('update:username', event.target.value)
}
</script>

<template>
  <section class="username-field">
    <label class="field-label" for="username-input">Player Name</label>
    <input
      id="username-input"
      class="username-input"
      type="text"
      autocomplete="nickname"
      :value="username"
      @change="handleChange"
    />
  </section>
</template>

<style scoped lang="scss">
.username-field {
  display: grid;
  gap: 8px;
}

.field-label {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.username-input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  line-height: 1.2;
}

.username-input:focus {
  outline: none;
}

.username-input:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
</style>

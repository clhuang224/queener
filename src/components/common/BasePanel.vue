<template>
  <section class="base-panel">
    <slot />
  </section>
</template>

<style scoped lang="scss">
.base-panel {
  padding: var(--panel-padding, 24px);
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 22px 18px 24px 18px;
}
</style>

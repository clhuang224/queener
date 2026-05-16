<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import GlobalModal from '@/components/GlobalModal.vue'
import { preloadGameAssets } from '@/modules/utils/preloadGameAssets'
import PrepareView from '@/views/PrepareView.vue'

const isPreparing = ref(true)

onMounted(async () => {
  await preloadGameAssets()
  isPreparing.value = false
})
</script>

<template>
  <div class="app">
    <PrepareView v-if="isPreparing" />
    <template v-else>
      <RouterView />
      <GlobalModal />
    </template>
  </div>
</template>

<style lang="scss">
@import 'normalize.css';
.app {
  --color-page: #f4ecd9;
  --color-surface: #fffdf7;
  --color-surface-muted: #f5dddf;
  --color-text: #3f4941;
  --color-text-muted: #7b7469;
  --color-primary: #7ea48c;
  --color-primary-hover: #6f947e;
  --color-accent: #b9d7dc;
  --color-accent-hover: #a9ccd2;
  --color-selected: #f3cbd2;
  --color-border: rgba(96, 111, 96, 0.22);
  --color-focus: rgba(126, 164, 140, 0.34);
  --radius-soft: 16px;
  --radius-control: 999px;

  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-page);
  color: var(--color-text);
  user-select: none;

  --border-radius: 8px;
}
</style>

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
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #eee;
  user-select: none;

  --border-radius: 8px;
}
</style>

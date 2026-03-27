<script setup lang="ts">
import { RouterView } from 'vue-router'
import GlobalModal from '@/components/GlobalModal.vue'
</script>

<template>
  <div class="app">
    <RouterView />
    <GlobalModal />
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

  --border-radius: 8px;
}
</style>

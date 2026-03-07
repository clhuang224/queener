<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
@import 'normalize.css';
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #eee;
}
</style>

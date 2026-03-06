<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
const router = useRouter()
</script>

<template>
  <main>
    <h2>Place the queens. Become the winner.</h2>
    <base-button class="btn" @click="router.push('/game')">Start</base-button>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>

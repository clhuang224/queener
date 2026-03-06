<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
const router = useRouter()
</script>

<template>
  <div class="game">
    <div class="board">board</div>
    <div class="buttons">
      <base-button class="quit" @click="router.push('/')">Quit</base-button>
      <base-button class="hint">Hint</base-button>
    </div>
  </div>
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  .board {
    width: 400px;
    height: 400px;
    background-color: #eee;
    border: 2px solid #aaa;
  }
  .buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
}
</style>

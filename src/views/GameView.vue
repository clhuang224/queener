<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import QueenGame from '@/game/QueenGame'
import { N_7_PUZZLES } from '@/puzzles/n7'
import { computed, ref, type Ref } from 'vue'

const router = useRouter()

// XXX: unwrapRef<QueenGame>
const game = ref(new QueenGame(N_7_PUZZLES[0]!)) as Ref<QueenGame>

const clickHint = () => {
  const position = game.value.useHint()
  // TODO: better hint UI instead of alert
  if (position) {
    alert(`Hint: Place a queen at (${position[0] + 1}, ${position[1] + 1})`)
  } else {
    alert('No hints available!')
  }
}

const isHintUsed = computed(() => game.value.isHintUsed())
</script>

<template>
  <div class="game">
    <game-board :game="game" queen-skin="grayscale" cell-skin="rainbow" />
    <div class="buttons">
      <base-button class="quit" @click="router.push('/')">Quit</base-button>
      <base-button class="hint" @click="clickHint" :disabled="isHintUsed">Hint</base-button>
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
  .buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
}
</style>

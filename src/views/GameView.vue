<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import QueenGame from '@/game/QueenGame'
import { SIMPLE_PUZZLES } from '@/puzzles/simple'
import { computed, reactive, watch } from 'vue'
import { useGlobalModalStore } from '@/stores/globalModal'

const router = useRouter()

const { openAlertModal, openConfirmModal } = useGlobalModalStore()

const game = reactive(new QueenGame(SIMPLE_PUZZLES[0]!))

const clickHint = async () => {
  const position = game.useHint()

  if (position) {
    await openAlertModal({
      title: 'Hint',
      content: `Place a queen at (${position[0] + 1}, ${position[1] + 1})`,
    })
    return
  }

  await openAlertModal({
    title: 'Hint',
    content: 'No hints available!',
  })
}

const clickQuit = async () => {
  try {
    await openConfirmModal({
      title: 'Quit Game',
      content: 'Are you sure you want to leave this puzzle?',
    })
    await router.push('/')
  } catch {
    return
  }
}

const isHintUsed = computed(() => game.isHintUsed())

watch(
  () => game.isGameOver(),
  async (gameOver) => {
    if (!gameOver) return
    await openAlertModal({
      title: 'Game Over',
      content: 'You lost! Try again.',
    })
    game.resetGame()
  },
)

watch(
  () => game.isWin(),
  async (win) => {
    if (!win) return
    await openAlertModal({
      title: 'Congratulations!',
      content: 'You solved the puzzle!',
    })
    await router.push('/')
  },
)
</script>

<template>
  <div class="game">
    <game-board :game="game" queen-skin="grayscale" cell-skin="rainbow" />
    <div class="buttons">
      <base-button class="quit" @click="clickQuit">Quit</base-button>
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

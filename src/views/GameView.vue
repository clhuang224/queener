<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import QueenGame from '@/game/QueenGame'
import { getPuzzleByLevel } from '@/puzzles/simple'
import { useGlobalModalStore } from '@/stores/globalModal'
import { useLevelStore } from '@/stores/level'

const props = defineProps<{
  level: number
}>()

const router = useRouter()
const levelStore = useLevelStore()

const { openAlertModal, openConfirmModal } = useGlobalModalStore()

const { activeLevel, isUnlocked } = levelStore.resolvePlayableLevel(props.level)
levelStore.setSelectedLevel(activeLevel)
let puzzle

try {
  puzzle = getPuzzleByLevel(activeLevel)
} catch (error) {
  void router.replace({
    name: 'home',
  })

  throw error
}

if (!isUnlocked) {
  void router.replace({
    name: 'home',
  })
}

const game = reactive(new QueenGame(puzzle))

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

    levelStore.completeLevel(activeLevel)

    await openAlertModal({
      title: 'Congratulations!',
      content: 'You solved the puzzle!',
    })
    await router.push({
      name: 'home',
    })
  },
)
</script>

<template>
  <div class="game">
    <p class="level-title">Level {{ activeLevel }}</p>
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

.level-title {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 700;
  color: #1f3c88;
}
</style>

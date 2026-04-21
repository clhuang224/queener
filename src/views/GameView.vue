<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import QueenGame from '@/game/QueenGame'
import { TOTAL_LEVELS, getPuzzleByLevel } from '@/puzzles/simple'
import { useSkinStore } from '@/stores/skin'
import { useGlobalModalStore } from '@/stores/globalModal'
import { useLevelStore } from '@/stores/level'

const props = defineProps<{
  level: number
}>()

const router = useRouter()
const skinStore = useSkinStore()
const levelStore = useLevelStore()
const { cellSkin, queenSkin } = storeToRefs(skinStore)

const { openAlertModal, openConfirmModal, openResultModal } = useGlobalModalStore()

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

skinStore.load()

const game = reactive(new QueenGame(puzzle))
const hasNextLevel = computed(() => activeLevel < TOTAL_LEVELS)
const isResolvingResult = ref(false)

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

const clickRestart = async () => {
  try {
    await openConfirmModal({
      title: 'Restart Level',
      content: 'Are you sure you want to restart this puzzle?',
    })
    game.resetGame()
  } catch {
    return
  }
}

const restartAfterResult = () => {
  game.resetGame()
}

const goHome = async () => {
  await router.push({
    name: 'home',
  })
}

const goToNextLevel = async () => {
  if (!hasNextLevel.value) return

  await router.push({
    name: 'game',
    params: {
      level: String(activeLevel + 1),
    },
  })
}

const isHintUsed = computed(() => game.isHintUsed())

watch(
  () => game.isGameOver(),
  async (gameOver) => {
    if (!gameOver || isResolvingResult.value) return

    isResolvingResult.value = true
    const action = await openResultModal({
      title: 'Game Over',
      content: 'Out of hearts. What would you like to do?',
      actions: [
        { label: 'Play Again', payload: 'retry' },
        { label: 'Home', payload: 'home' },
      ],
    })

    if (action === 'retry') {
      restartAfterResult()
    } else if (action === 'home') {
      await goHome()
    }

    isResolvingResult.value = false
  },
)

watch(
  () => game.isWin(),
  async (win) => {
    if (!win || isResolvingResult.value) return

    isResolvingResult.value = true
    levelStore.completeLevel(activeLevel)

    const actions = [{ label: 'Play Again', payload: 'retry' }, { label: 'Home', payload: 'home' }]
    if (hasNextLevel.value) {
      actions.unshift({ label: 'Next Level', payload: 'next' })
    }

    const action = await openResultModal({
      title: 'Congratulations!',
      content: 'You solved the puzzle. What would you like to do next?',
      actions,
    })

    if (action === 'next') {
      await goToNextLevel()
    } else if (action === 'retry') {
      restartAfterResult()
    } else if (action === 'home') {
      await goHome()
    }

    isResolvingResult.value = false
  },
)
</script>

<template>
  <div class="game">
    <p class="level-title">Level {{ activeLevel }}</p>
    <game-board :game="game" :queen-skin="queenSkin" :cell-skin="cellSkin" />
    <div class="buttons">
      <base-button class="restart" @click="clickRestart">Restart</base-button>
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

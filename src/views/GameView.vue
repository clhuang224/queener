<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import QueenGame from '@/modules/game/QueenGame'
import { TOTAL_LEVELS, getPuzzleByLevel } from '@/modules/puzzles/simple'
import { useSkinStore } from '@/modules/stores/skin'
import { useGlobalModalStore } from '@/modules/stores/globalModal'
import { useLevelStore } from '@/modules/stores/level'
import { playGameSound } from '@/modules/utils/playGameSound'
import { GameSoundType } from '@/modules/enums/GameSoundType'

const props = defineProps<{
  level: number
}>()

const router = useRouter()
const skinStore = useSkinStore()
const levelStore = useLevelStore()
const { boardSkin, boardTextureEnabled, queenSkin } = storeToRefs(skinStore)

const { openAlertModal, openConfirmModal, openResultModal } = useGlobalModalStore()

skinStore.load()

const activeLevel = ref(1)
const game = ref(new QueenGame(getPuzzleByLevel(activeLevel.value)))
const hasNextLevel = computed(() => activeLevel.value < TOTAL_LEVELS)
const isHandlingResult = ref(false)
const isWaitingSound = ref(false)

watch(
  () => props.level,
  (level) => {
    const playableLevel = levelStore.resolvePlayableLevel(level)

    if (!playableLevel.isUnlocked) {
      void router.replace({
        name: 'home',
      })
      return
    }

    activeLevel.value = playableLevel.activeLevel
    levelStore.setSelectedLevel(playableLevel.activeLevel)
    game.value = new QueenGame(getPuzzleByLevel(playableLevel.activeLevel))
    isHandlingResult.value = false
    isWaitingSound.value = false
  },
  { immediate: true },
)

const clickHint = async () => {
  const position = game.value.useHint()

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
    game.value.resetGame()
  } catch {
    return
  }
}

const restartAfterResult = () => {
  game.value.resetGame()
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
      level: String(activeLevel.value + 1),
    },
  })
}

const isHintUsed = computed(() => game.value.isHintUsed())

watch(
  () => game.value.isGameOver(),
  async (gameOver) => {
    if (!gameOver || isHandlingResult.value) return

    isHandlingResult.value = true
    isWaitingSound.value = true
    await playGameSound(GameSoundType.LOSE)
    isWaitingSound.value = false
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

    isHandlingResult.value = false
  },
)

watch(
  () => game.value.isWin(),
  async (win) => {
    if (!win || isHandlingResult.value) return

    isHandlingResult.value = true
    isWaitingSound.value = true
    levelStore.completeLevel(activeLevel.value)
    await playGameSound(GameSoundType.WIN)
    isWaitingSound.value = false

    const actions = [
      { label: 'Play Again', payload: 'retry' },
      { label: 'Home', payload: 'home' },
    ]
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

    isHandlingResult.value = false
  },
)
</script>

<template>
  <div class="game">
    <div v-if="isWaitingSound" class="interaction-overlay" data-test="result-lock-overlay"></div>
    <p class="level-title">Level {{ activeLevel }}</p>
    <GameBoard
      :game="game"
      :queen-skin="queenSkin"
      :board-skin="boardSkin"
      :board-texture-enabled="boardTextureEnabled"
    />
    <div class="buttons">
      <BaseButton class="restart" :disabled="isHandlingResult" @click="clickRestart">
        Restart
      </BaseButton>
      <BaseButton class="quit" :disabled="isHandlingResult" @click="clickQuit">Quit</BaseButton>
      <BaseButton class="hint" :disabled="isHintUsed || isHandlingResult" @click="clickHint">
        Hint
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.game {
  position: relative;
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

.interaction-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: wait;
}
</style>

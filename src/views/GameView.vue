<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePanel from '@/components/common/BasePanel.vue'
import HeartCounter from '@/components/common/HeartCounter.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import GameRunReplayBoard from '@/components/game/GameRunReplayBoard.vue'
import { TOTAL_LEVELS } from '@/modules/puzzles/simple'
import { useSkinStore } from '@/modules/stores/skin'
import { useGlobalModalStore } from '@/modules/stores/globalModal'
import { useLevelStore } from '@/modules/stores/level'
import type { Position } from '@/modules/types/board'
import type { RunReplayData } from '@/modules/types/run'
import { playGameSound } from '@/modules/utils/playGameSound'
import { GameSoundType } from '@/modules/enums/GameSoundType'
import { formatRunTime } from '@/modules/utils/formatRunTime'
import { IconBulb, IconBulbOff, IconHome, IconRefresh } from '@tabler/icons-vue'
import { useGameRun } from './useGameRun'

const props = defineProps<{
  level: number
}>()

const router = useRouter()
const skinStore = useSkinStore()
const levelStore = useLevelStore()
const { boardSkin, boardTextureEnabled, queenSkin } = storeToRefs(skinStore)

const { openAlertModal, openConfirmModal, openResultModal } = useGlobalModalStore()

skinStore.load()

const {
  activeLevel,
  game,
  startLevel,
  restartRun,
  recordMarkNote,
  recordRemoveNote,
  recordMarkQueen,
  recordHint,
  formattedRunTime,
  finishRun,
  createReplayData,
} = useGameRun()
const hasNextLevel = computed(() => activeLevel.value < TOTAL_LEVELS)
const isHandlingResult = ref(false)
const isWaitingSound = ref(false)
const isReplayingResult = ref(false)
const replayData = ref<RunReplayData | null>(null)
const replayRunTimeMs = ref(0)
const pendingResult = ref<'win' | 'loss' | null>(null)
const hintedPosition = ref<Position | null>(null)
const boardPanelStyle = computed(() => ({
  '--board-panel-max-size': `${game.value.getSize() * 62 + 40}px`,
}))
const formattedReplayRunTime = computed(() => formatRunTime(replayRunTimeMs.value))

const clearResultReplay = () => {
  isReplayingResult.value = false
  replayData.value = null
  replayRunTimeMs.value = 0
  pendingResult.value = null
}

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

    levelStore.setSelectedLevel(playableLevel.activeLevel)
    startLevel(playableLevel.activeLevel)
    hintedPosition.value = null
    isHandlingResult.value = false
    isWaitingSound.value = false
    clearResultReplay()
  },
  { immediate: true },
)

const clickHint = async () => {
  const position = game.value.useHint()

  if (position) {
    recordHint(position)
    hintedPosition.value = position
    void playGameSound(GameSoundType.HINT)
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
    restartRun()
    hintedPosition.value = null
  } catch {
    return
  }
}

const restartAfterResult = () => {
  restartRun()
  hintedPosition.value = null
  clearResultReplay()
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
const hintButtonLabel = computed(() => (isHintUsed.value ? 'Hint used' : 'Use hint'))

const openLossResult = async () => {
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
  clearResultReplay()

  if (action === 'retry') {
    restartAfterResult()
  } else if (action === 'home') {
    await goHome()
  }
}

const openWinResult = async () => {
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
  clearResultReplay()

  if (action === 'next') {
    await goToNextLevel()
  } else if (action === 'retry') {
    restartAfterResult()
  } else if (action === 'home') {
    await goHome()
  }
}

const startResultReplay = (result: 'win' | 'loss') => {
  finishRun()
  replayData.value = createReplayData()
  replayRunTimeMs.value = 0
  pendingResult.value = result
  isReplayingResult.value = true
}

const handleReplayTimeUpdate = (runTimeMs: number) => {
  replayRunTimeMs.value = runTimeMs
}

const handleReplayFinished = async () => {
  if (!pendingResult.value) return

  const result = pendingResult.value

  if (result === 'win') {
    await openWinResult()
  } else {
    await openLossResult()
  }

  isHandlingResult.value = false
}

watch(
  () => game.value.isGameOver(),
  async (gameOver) => {
    if (!gameOver || isHandlingResult.value) return

    isHandlingResult.value = true
    startResultReplay('loss')
  },
)

watch(
  () => game.value.isWin(),
  async (win) => {
    if (!win || isHandlingResult.value) return

    isHandlingResult.value = true
    startResultReplay('win')
  },
)
</script>

<template>
  <div class="game">
    <div v-if="isWaitingSound" class="interaction-overlay" data-test="result-lock-overlay"></div>
    <header class="game-header">
      <h2 class="level-title">Level {{ activeLevel }}</h2>
      <div class="page-actions">
        <BaseButton
          icon
          variant="ghost"
          class="restart"
          :disabled="isHandlingResult"
          aria-label="Restart level"
          @click="clickRestart"
        >
          <IconRefresh />
        </BaseButton>
        <BaseButton
          icon
          variant="ghost"
          class="quit"
          :disabled="isHandlingResult"
          aria-label="Quit to home"
          @click="clickQuit"
        >
          <IconHome />
        </BaseButton>
      </div>
    </header>
    <BasePanel class="board-panel" :style="boardPanelStyle">
      <div class="board-hud">
        <HeartCounter :hearts="game.hearts" :max-hearts="game.maxHearts" />
        <p class="run-timer" aria-label="Run time">{{ formattedRunTime }}</p>
      </div>
      <GameBoard
        :game="game"
        :queen-skin="queenSkin"
        :board-skin="boardSkin"
        :board-texture-enabled="boardTextureEnabled"
        :hinted-position="hintedPosition"
        @mark-note="recordMarkNote"
        @remove-note="recordRemoveNote"
        @mark-queen="recordMarkQueen"
      />
    </BasePanel>
    <BaseButton
      icon
      class="hint"
      :class="{ 'hint--used': isHintUsed }"
      :disabled="isHintUsed || isHandlingResult || isReplayingResult"
      :aria-label="hintButtonLabel"
      @click="clickHint"
    >
      <IconBulbOff v-if="isHintUsed" />
      <IconBulb v-else />
    </BaseButton>
    <div
      v-if="isReplayingResult && replayData"
      class="result-replay-overlay"
      data-test="result-replay-overlay"
    >
      <BasePanel class="result-replay-panel">
        <h2 class="result-replay-title">Replay</h2>
        <p class="result-replay-timer" aria-label="Replay run time">
          {{ formattedReplayRunTime }}
        </p>
        <GameRunReplayBoard
          :puzzle="replayData.puzzle"
          :puzzle-variant-metadata="replayData.puzzleVariantMetadata"
          :records="replayData.record"
          :queen-skin="queenSkin"
          :board-skin="boardSkin"
          :board-texture-enabled="boardTextureEnabled"
          style="--replay-cell-opacity: 0.58"
          @time-update="handleReplayTimeUpdate"
          @finished="handleReplayFinished"
        />
      </BasePanel>
    </div>
  </div>
</template>

<style scoped>
.game {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.game-header {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  &::before {
    content: '';
    flex: 1;
  }
}

.page-actions {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: 8px;
  gap: 8px;
}

.page-actions .base-button {
  --icon-button-size: 40px;
}

.board-panel {
  --panel-padding: 12px;
  width: var(--board-panel-max-size);
  max-width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.hint {
  --icon-button-size: 46px;

  margin-top: 20px;
}

.level-title {
  flex: 1;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: var(--color-text);
}

.board-hud {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 4px 8px;
}

.run-timer {
  min-width: 88px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 18px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.interaction-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: wait;
}

.result-replay-overlay {
  position: fixed;
  z-index: 8;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-replay-panel {
  --panel-padding: 24px;

  width: 100%;
  height: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--color-surface);
  border: 0;
  border-radius: 0;
}

.result-replay-title {
  margin: 0;
  color: var(--color-text);
  font-size: 28px;
  line-height: 1.2;
}

.result-replay-timer {
  margin: -6px 0 4px;
  color: var(--color-text-muted);
  font-size: 18px;
  font-variant-numeric: tabular-nums;
}
</style>

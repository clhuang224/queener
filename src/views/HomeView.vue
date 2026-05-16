<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import LevelPicker from '@/components/home/LevelPicker.vue'
import { useLevelStore } from '@/modules/stores/level'
import { storeToRefs } from 'pinia'
import QueenGame from '@/modules/game/QueenGame'
import { getPuzzleByLevel } from '@/modules/puzzles/simple'
import { IconPlayerPlay, IconSettings } from '@tabler/icons-vue'

const router = useRouter()
const levelStore = useLevelStore()
const { initializeSelectedLevel, selectPreviousLevel, selectNextLevel } = levelStore
const { selectedLevel, highestUnlockedLevel } = storeToRefs(levelStore)
const selectedPuzzle = computed(() => getPuzzleByLevel(selectedLevel.value))
const selectedBoardSize = computed(() => selectedPuzzle.value.rules.size)
const selectedMaxHearts = computed(() => QueenGame.resolveHeartsBySize(selectedBoardSize.value))
const canGoNextLevel = computed(() => selectedLevel.value < highestUnlockedLevel.value)

onMounted(() => {
  initializeSelectedLevel()
})

const startLevel = async () => {
  await router.push({
    name: 'game',
    params: {
      level: String(selectedLevel.value),
    },
  })
}

const openSetting = async () => {
  await router.push({
    name: 'setting',
  })
}
</script>

<template>
  <main>
    <header>
      <BaseButton aria-label="Open settings" @click="openSetting">
        <IconSettings />
      </BaseButton>
    </header>
    <h2>Place the queens. Become the winner.</h2>
    <LevelPicker
      :selected-level="selectedLevel"
      :can-go-next="canGoNextLevel"
      :board-size="selectedBoardSize"
      :max-hearts="selectedMaxHearts"
      @previous="selectPreviousLevel"
      @next="selectNextLevel"
    />
    <BaseButton aria-label="Start level" @click="startLevel">
      <IconPlayerPlay />
    </BaseButton>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  height: 100%;
  margin: 0 auto;
  max-width: 480px;
  header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>

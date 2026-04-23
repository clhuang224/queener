<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import LevelPicker from '@/components/home/LevelPicker.vue'
import { useLevelStore } from '@/stores/level'
import { storeToRefs } from 'pinia'
import QueenGame from '@/game/QueenGame'
import { getPuzzleByLevel } from '@/puzzles/simple'

const router = useRouter()
const levelStore = useLevelStore()
const { initializeSelectedLevel, selectPreviousLevel, selectNextLevel } = levelStore
const { selectedLevel, highestUnlockedLevel } = storeToRefs(levelStore)
const selectedPuzzle = computed(() => getPuzzleByLevel(selectedLevel.value))
const selectedBoardSize = computed(() => selectedPuzzle.value.rules.size)
const selectedMaxHearts = computed(() => QueenGame.resolveHeartsBySize(selectedBoardSize.value))

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
      <base-button @click="openSetting">⚙️</base-button>
    </header>
    <h2>Place the queens. Become the winner.</h2>
    <level-picker
      :selected-level="selectedLevel"
      :highest-unlocked-level="highestUnlockedLevel"
      :board-size="selectedBoardSize"
      :max-hearts="selectedMaxHearts"
      @previous="selectPreviousLevel"
      @next="selectNextLevel"
    />
    <base-button class="btn" @click="startLevel">Start</base-button>
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

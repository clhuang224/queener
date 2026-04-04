<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import LevelPicker from '@/components/home/LevelPicker.vue'
import { useLevelStore } from '@/stores/level'
import { storeToRefs } from 'pinia'

const router = useRouter()
const levelStore = useLevelStore()
const { initializeSelectedLevel, selectPreviousLevel, selectNextLevel } = levelStore
const { selectedLevel, highestUnlockedLevel } = storeToRefs(levelStore)

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

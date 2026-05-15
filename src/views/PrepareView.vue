<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { BOARD_SKINS } from '@/modules/constants/boardSkins'
import { useSkinStore } from '@/modules/stores/skin'
import { pickRandomItems } from '@/modules/utils/pickRandomItems'

const skinStore = useSkinStore()
skinStore.load()

const { boardSkin } = storeToRefs(skinStore)
const loaderColors = computed(() => pickRandomItems(BOARD_SKINS[boardSkin.value], 9))
</script>

<template>
  <main class="prepare-view" aria-busy="true">
    <span class="loader" aria-hidden="true">
      <span
        v-for="(color, index) in loaderColors"
        :key="`${color}-${index}`"
        class="loader-cell"
        :style="{ backgroundColor: color, animationDelay: `${index * 0.08}s` }"
      ></span>
    </span>
  </main>
</template>

<style scoped lang="scss">
.prepare-view {
  width: 100%;
  min-height: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.loader {
  --loader-cell-size: 32px;
  --loader-gap: 8px;

  display: grid;
  grid-template-columns: repeat(3, var(--loader-cell-size));
  gap: var(--loader-gap);
}

.loader-cell {
  box-sizing: border-box;
  width: var(--loader-cell-size);
  aspect-ratio: 1;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.14);
  animation: animloader 1.2s ease-in-out infinite;
}

@keyframes animloader {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(0.72);
    opacity: 0.42;
  }
}
</style>

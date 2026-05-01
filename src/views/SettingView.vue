<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import SkinFields from '@/components/setting/SkinFields.vue'
import { useSkinStore } from '@/modules/stores/skin'

const router = useRouter()
const skinStore = useSkinStore()
const { cellSkin, queenSkin } = storeToRefs(skinStore)

onMounted(() => {
  skinStore.load()
})

const goHome = async () => {
  await router.push({
    name: 'home',
  })
}
</script>

<template>
  <main class="setting-view">
    <section class="setting-card">
      <h1>Setting</h1>
      <p class="setting-copy">Customize your board and queen skins here.</p>
      <SkinFields
        :cell-skin="cellSkin"
        :queen-skin="queenSkin"
        @update:cell-skin="skinStore.setCellSkin"
        @update:queen-skin="skinStore.setQueenSkin"
      />
      <BaseButton class="back-button" @click="goHome">Back</BaseButton>
    </section>
  </main>
</template>

<style scoped lang="scss">
.setting-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;
}

.setting-card {
  width: min(100%, 520px);
  padding: 24px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0 0 8px;
  color: #1f3c88;
}

.setting-copy {
  margin: 0 0 20px;
  color: #5c677d;
}

.back-button {
  margin-top: 20px;
}
</style>

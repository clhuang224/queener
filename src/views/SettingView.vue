<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BoardSkinField from '@/components/setting/BoardSkinField.vue'
import BoardSkinPreview from '@/components/setting/BoardSkinPreview.vue'
import BoardTextureField from '@/components/setting/BoardTextureField.vue'
import QueenSkinField from '@/components/setting/QueenSkinField.vue'
import { useSkinStore } from '@/modules/stores/skin'
import { IconChevronLeft } from '@tabler/icons-vue'

const router = useRouter()
const skinStore = useSkinStore()
const { boardSkin, boardTextureEnabled, queenSkin } = storeToRefs(skinStore)

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
      <BoardSkinPreview
        class="skin-preview"
        :board-skin="boardSkin"
        :board-texture-enabled="boardTextureEnabled"
        :queen-skin="queenSkin"
      />
      <div class="skin-fields">
        <QueenSkinField :queen-skin="queenSkin" @update:queen-skin="skinStore.setQueenSkin" />
        <BoardSkinField :board-skin="boardSkin" @update:board-skin="skinStore.setBoardSkin" />
        <BoardTextureField
          :board-texture-enabled="boardTextureEnabled"
          @update:board-texture-enabled="skinStore.setBoardTextureEnabled"
        />
      </div>
      <BaseButton icon class="back-button" aria-label="Back home" @click="goHome">
        <IconChevronLeft />
      </BaseButton>
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

.skin-preview {
  margin-bottom: 20px;
}

.skin-fields > * + * {
  margin-top: 16px;
}
</style>

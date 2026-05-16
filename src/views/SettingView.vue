<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePanel from '@/components/common/BasePanel.vue'
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
    <BaseButton
      icon
      variant="ghost"
      class="back-button"
      aria-label="Back home"
      @click="goHome"
    >
      <IconChevronLeft />
    </BaseButton>
    <BasePanel class="setting-panel">
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
    </BasePanel>
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

.setting-panel {
  width: min(100%, 520px);
}

h1 {
  margin: 0 0 8px;
  color: var(--color-text);
}

.setting-copy {
  margin: 0 0 20px;
  color: var(--color-text-muted);
}

.back-button {
  --icon-button-size: 40px;

  position: fixed;
  top: 24px;
  left: 24px;
}

@media (max-width: 480px) {
  .back-button {
    top: 16px;
    left: 16px;
  }
}

.skin-preview {
  margin-bottom: 20px;
}

.skin-fields > * + * {
  margin-top: 16px;
}
</style>

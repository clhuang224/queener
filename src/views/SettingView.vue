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
    <header class="setting-header">
      <BaseButton
        icon
        variant="ghost"
        class="back-button"
        aria-label="Back home"
        @click="goHome"
      >
        <IconChevronLeft />
      </BaseButton>
      <h1>Setting</h1>
      <span aria-hidden="true"></span>
    </header>
    <BasePanel class="setting-panel">
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 100%;
  padding: 24px;
}

.setting-header,
.setting-panel {
  width: min(100%, 520px);
}

.setting-header {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
}

h1 {
  margin: 0;
  color: var(--color-text);
  text-align: center;
}

.setting-copy {
  margin: 0 0 20px;
  color: var(--color-text-muted);
}

.back-button {
  --icon-button-size: 40px;
}

.skin-preview {
  margin-bottom: 20px;
}

.skin-fields > * + * {
  margin-top: 16px;
}
</style>

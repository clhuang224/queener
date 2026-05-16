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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 22px 18px 24px 18px;
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
  --icon-button-size: 44px;

  margin-top: 20px;
  background-color: var(--color-accent);
  color: var(--color-text);

  &:hover:not(:disabled) {
    background-color: var(--color-accent-hover);
  }
}

.skin-preview {
  margin-bottom: 20px;
}

.skin-fields > * + * {
  margin-top: 16px;
}
</style>

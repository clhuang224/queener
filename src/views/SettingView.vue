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
import SoundVolumeField from '@/components/setting/SoundVolumeField.vue'
import { GameSoundType } from '@/modules/enums/GameSoundType'
import { useAudioStore } from '@/modules/stores/audio'
import { useSkinStore } from '@/modules/stores/skin'
import { playGameSound } from '@/modules/utils/playGameSound'
import { randomInteger } from '@/modules/utils/random'
import { IconChevronLeft, IconRestore } from '@tabler/icons-vue'
import { getEnumValues } from '@/modules/utils/getEnumValues'

const router = useRouter()
const skinStore = useSkinStore()
const audioStore = useAudioStore()
const { boardSkin, boardTextureEnabled, queenSkin } = storeToRefs(skinStore)
const { soundVolume } = storeToRefs(audioStore)

onMounted(() => {
  skinStore.load()
  audioStore.load()
})

const goHome = async () => {
  await router.push({
    name: 'home',
  })
}

const previewSounds = getEnumValues(GameSoundType).filter(
  (sound) => ![GameSoundType.WIN, GameSoundType.LOSE].includes(sound),
)

const previewSoundEffect = () => {
  const soundIndex = randomInteger(0, previewSounds.length - 1)
  const sound = previewSounds[soundIndex]
  if (!sound) return

  void playGameSound(sound)
}

const resetSettings = () => {
  skinStore.resetSkinSettings()
  audioStore.resetAudioSettings()
}
</script>

<template>
  <main class="setting-view">
    <header class="setting-header">
      <BaseButton icon variant="ghost" class="back-button" aria-label="Back home" @click="goHome">
        <IconChevronLeft />
      </BaseButton>
      <h1>Setting</h1>
      <span aria-hidden="true"></span>
    </header>
    <div class="setting-content">
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
          <SoundVolumeField
            :sound-volume="soundVolume"
            @update:sound-volume="audioStore.setSoundVolume"
            @preview="previewSoundEffect"
          />
          <BaseButton
            variant="ghost"
            class="reset-button"
            aria-label="Reset settings"
            @click="resetSettings"
          >
            <IconRestore aria-hidden="true" />
            <span>Reset Settings</span>
          </BaseButton>
        </div>
      </BasePanel>
    </div>
  </main>
</template>

<style scoped lang="scss">
.setting-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 24px;
  overflow: hidden;
}

.setting-header,
.setting-content {
  width: min(100%, 520px);
}

.setting-header {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
}

.setting-content {
  flex: 1 1 auto;
  min-height: 0;
  padding-bottom: 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.setting-panel {
  width: 100%;
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

.reset-button {
  width: 100%;
}
</style>

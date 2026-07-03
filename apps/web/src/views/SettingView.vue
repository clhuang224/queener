<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePanel from '@/components/common/BasePanel.vue'
import BoardSkinField from '@/components/setting/BoardSkinField.vue'
import BoardSkinPreview from '@/components/setting/BoardSkinPreview.vue'
import QueenSkinField from '@/components/setting/QueenSkinField.vue'
import SettingSwitchField from '@/components/setting/SettingSwitchField.vue'
import SoundVolumeField from '@/components/setting/SoundVolumeField.vue'
import UsernameField from '@/components/setting/UsernameField.vue'
import { GameSoundType } from '@/modules/enums/GameSoundType'
import { useAudioStore } from '@/modules/stores/audio'
import { useGameplayStore } from '@/modules/stores/gameplay'
import { useSkinStore } from '@/modules/stores/skin'
import { useUserStore } from '@/modules/stores/user'
import { playGameSound } from '@/modules/utils/playGameSound'
import { randomInteger } from '@/modules/utils/random'
import { IconChevronLeft, IconRestore } from '@tabler/icons-vue'
import { getEnumValues } from '@/modules/utils/getEnumValues'

const router = useRouter()
const skinStore = useSkinStore()
const audioStore = useAudioStore()
const gameplayStore = useGameplayStore()
const userStore = useUserStore()
const { boardSkin, boardTextureEnabled, queenSkin } = storeToRefs(skinStore)
const { soundVolume } = storeToRefs(audioStore)
const { endReplayEnabled } = storeToRefs(gameplayStore)
const { username } = storeToRefs(userStore)

userStore.load()

onMounted(() => {
  skinStore.load()
  audioStore.load()
  gameplayStore.load()
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
  gameplayStore.resetGameplaySettings()
  userStore.resetUserSettings()
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
        <div class="setting-fields">
          <fieldset class="setting-group">
            <legend class="setting-group-title">Player</legend>
            <div class="setting-group-content">
              <UsernameField :username="username" @update:username="userStore.setUsername" />
            </div>
          </fieldset>
          <fieldset class="setting-group">
            <legend class="setting-group-title">Appearance</legend>
            <div class="setting-group-content">
              <BoardSkinPreview
                class="skin-preview"
                :board-skin="boardSkin"
                :board-texture-enabled="boardTextureEnabled"
                :queen-skin="queenSkin"
              />
              <QueenSkinField :queen-skin="queenSkin" @update:queen-skin="skinStore.setQueenSkin" />
              <BoardSkinField :board-skin="boardSkin" @update:board-skin="skinStore.setBoardSkin" />
              <SettingSwitchField
                label="Board Texture"
                label-id="board-texture-label"
                :model-value="boardTextureEnabled"
                @update:model-value="skinStore.setBoardTextureEnabled"
              />
            </div>
          </fieldset>
          <fieldset class="setting-group">
            <legend class="setting-group-title">Audio</legend>
            <div class="setting-group-content">
              <SoundVolumeField
                :sound-volume="soundVolume"
                @update:sound-volume="audioStore.setSoundVolume"
                @preview="previewSoundEffect"
              />
            </div>
          </fieldset>
          <fieldset class="setting-group">
            <legend class="setting-group-title">Results</legend>
            <div class="setting-group-content">
              <SettingSwitchField
                label="Show Replay"
                label-id="end-replay-label"
                :model-value="endReplayEnabled"
                @update:model-value="gameplayStore.setEndReplayEnabled"
              />
            </div>
          </fieldset>
          <fieldset class="setting-group">
            <BaseButton
              variant="ghost"
              class="reset-button"
              aria-label="Reset settings"
              @click="resetSettings"
            >
              <IconRestore aria-hidden="true" />
              <span>Reset Settings</span>
            </BaseButton>
          </fieldset>
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
  overflow: hidden;
}

.setting-panel {
  width: 100%;
  max-height: 100%;
  display: flex;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: var(--color-border) transparent;
  scrollbar-width: thin;
}

.setting-panel::-webkit-scrollbar {
  width: 10px;
}

.setting-panel::-webkit-scrollbar-track {
  background: transparent;
}

.setting-panel::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 999px;
  background: var(--color-border);
  background-clip: content-box;
}

.setting-panel::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
  background-clip: content-box;
}

h1 {
  margin: 0;
  color: var(--color-text);
  text-align: center;
}

.back-button {
  --icon-button-size: 40px;
}

.skin-preview {
  margin-bottom: 4px;
}

.setting-fields {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 20px;
  width: 100%;
  min-height: 0;
  padding-bottom: 16px;
}

.setting-group {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  padding: 8px 0 28px;
  border-top: 1px solid var(--color-border);
}

.setting-group-title {
  margin-bottom: 14px;
  color: var(--color-primary);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0;
  text-transform: uppercase;
}

.setting-group-content {
  display: grid;
  gap: 16px;
}

.reset-button {
  width: 100%;
}
</style>

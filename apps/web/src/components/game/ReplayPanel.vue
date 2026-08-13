<script setup lang="ts">
import { computed } from 'vue'
import { IconPlayerSkipForward } from '@tabler/icons-vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePanel from '@/components/common/BasePanel.vue'
import GameRunReplayBoard from '@/components/game/GameRunReplayBoard.vue'
import { BOARD_SKINS } from '@/modules/constants/boardSkins'
import { pickDistributedColors } from '@/modules/utils/pickDistributedColors'
import { formatRunTime } from '@/modules/utils/formatRunTime'
import type { RunReplayData } from '@/modules/types/run'
import type { BoardSkinType } from '@/modules/enums/BoardSkinType'
import type { QueenSkinType } from '@/modules/enums/QueenSkinType'

const props = defineProps<{
  replayData: RunReplayData
  replayRunTimeMs: number
  queenSkin: QueenSkinType
  boardSkin: BoardSkinType
  boardTextureEnabled: boolean
}>()

const emit = defineEmits<{
  (e: 'time-update', ms: number): void
  (e: 'finished'): void
  (e: 'skip'): void
}>()

const size = computed(() => props.replayData?.puzzle.rules.size ?? 0)
const swatchIndexes = computed(() => Array.from({ length: size.value }, (_, i) => i))
const swatchTrackIndexes = computed(() => [...swatchIndexes.value, ...swatchIndexes.value])

const replayDurationMs = computed(() => {
  return (
    props.replayData?.record.reduce(
      (duration, record) => Math.max(duration, record.actionAtMillisecond),
      0,
    ) ?? 0
  )
})

const formattedReplayDuration = computed(() => formatRunTime(replayDurationMs.value))
const formattedReplayRunTime = computed(() => {
  return formatRunTime(Math.min(props.replayRunTimeMs, replayDurationMs.value))
})

const swatchStyle = computed(() => {
  const colors = pickDistributedColors(BOARD_SKINS[props.boardSkin], size.value) as string[]
  const progress =
    replayDurationMs.value > 0 ? Math.min(props.replayRunTimeMs / replayDurationMs.value, 1) : 0
  const translate = -50 + progress * 50

  return {
    '--replay-translate': `${translate}%`,
    ...Object.fromEntries(
      colors.map((color: string, index: number) => [`--replay-color-${index}`, color]),
    ),
  }
})
</script>

<template>
  <BasePanel class="replay-panel">
    <BaseButton
      icon
      variant="ghost"
      class="replay-skip-button"
      aria-label="Skip replay"
      title="Skip replay"
      @click="emit('skip')"
    >
      <IconPlayerSkipForward aria-hidden="true" />
    </BaseButton>
    <h2 class="replay-title">Replay</h2>
    <GameRunReplayBoard
      :puzzle="replayData.puzzle"
      :puzzle-variant-metadata="replayData.puzzleVariantMetadata"
      :records="replayData.record"
      :queen-skin="queenSkin"
      :board-skin="boardSkin"
      :board-texture-enabled="boardTextureEnabled"
      style="--replay-cell-opacity: 0.58"
      @time-update="(ms) => emit('time-update', ms)"
      @finished="() => emit('finished')"
    />

    <div class="replay-scale">
      <span class="replay-time">{{ formattedReplayRunTime }}</span>
      <div class="replay-swatch" :style="swatchStyle" aria-hidden="true">
        <div class="replay-track">
          <span
            v-for="(colorIndex, trackIndex) in swatchTrackIndexes"
            :key="`${colorIndex}-${trackIndex}`"
            class="replay-color"
            :class="`replay-color--${colorIndex}`"
          ></span>
        </div>
      </div>
      <span class="replay-time">{{ formattedReplayDuration }}</span>
    </div>
  </BasePanel>
</template>

<style scoped lang="scss">
.replay-panel {
  --panel-padding: 24px;

  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--color-surface);
  border: 0;
  border-radius: 0;
}

.replay-skip-button {
  --icon-button-size: 42px;

  position: absolute;
  top: calc(16px + env(safe-area-inset-top));
  right: calc(16px + env(safe-area-inset-right));
}

.replay-title {
  margin: 0;
  color: var(--color-text);
  font-size: 28px;
  line-height: 1.2;
}

.replay-scale {
  display: flex;
  align-items: center;
  gap: 8px;
}

.replay-time {
  min-width: 32px;
  color: var(--color-text-muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.replay-swatch {
  width: min(120px, 56vw);
  height: 10px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  opacity: 0.56;
}

.replay-track {
  display: flex;
  width: 200%;
  height: 100%;
  transform: translateX(var(--replay-translate, -50%));
  transition: transform 0.08s linear;
}

.replay-color {
  flex: 1 0 0;
  min-width: 0;
}

@for $index from 0 through 9 {
  .replay-color--#{$index} {
    background: var(--replay-color-#{$index});
  }
}
</style>

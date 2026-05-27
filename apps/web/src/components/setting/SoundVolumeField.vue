<script setup lang="ts">
import { computed } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import BaseButton from '@/components/common/BaseButton.vue'
import { IconVolume } from '@tabler/icons-vue'

const props = defineProps<{
  soundVolume: number
}>()

const emit = defineEmits<{
  'update:soundVolume': [volume: number]
  preview: []
}>()

const sliderValue = computed(() => [props.soundVolume])

const handleSoundVolumeChange = (value: number[] | undefined) => {
  const nextVolume = value?.[0]
  if (nextVolume === undefined) return

  emit('update:soundVolume', nextVolume)
}
</script>

<template>
  <section class="sound-volume-field">
    <p id="sound-volume-label" class="field-label">Sound Effects</p>
    <div class="sound-control">
      <SliderRoot
        class="sound-slider"
        :model-value="sliderValue"
        :min="0"
        :max="100"
        :step="5"
        aria-labelledby="sound-volume-label"
        @update:model-value="handleSoundVolumeChange"
      >
        <SliderTrack class="sound-slider-track">
          <SliderRange class="sound-slider-range" />
        </SliderTrack>
        <SliderThumb class="sound-slider-thumb" aria-label="Sound effects volume" />
      </SliderRoot>
      <div class="field-actions">
        <span class="volume-value">{{ soundVolume }}%</span>
        <BaseButton
          icon
          variant="ghost"
          class="preview-button"
          aria-label="Preview sound effect"
          @click="emit('preview')"
        >
          <IconVolume />
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sound-volume-field {
  display: grid;
  gap: 12px;
}

.sound-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-label,
.volume-value {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.volume-value {
  color: var(--color-text-muted);
}

.preview-button {
  --icon-button-size: 32px;
}

.sound-slider {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  height: 28px;
  touch-action: none;
  user-select: none;
}

.sound-slider-track {
  position: relative;
  flex: 1;
  height: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  background: var(--color-surface-muted);
}

.sound-slider-range {
  position: absolute;
  height: 100%;
  border-radius: var(--radius-control);
  background: var(--color-primary);
}

.sound-slider-thumb {
  display: block;
  width: 22px;
  height: 22px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  cursor: grab;
}

.sound-slider-thumb:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.sound-slider-thumb:active {
  cursor: grabbing;
}
</style>

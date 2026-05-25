<script setup lang="ts">
import { IconHeart, IconHeartFilled } from '@tabler/icons-vue'

defineProps({
  maxHearts: {
    type: Number,
    default: 3,
  },
  hearts: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="hearts">
    <div class="heart" v-for="i in maxHearts" :key="i">
      <IconHeartFilled v-if="i <= hearts" :size="40" />
      <IconHeart v-else :size="40" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hearts {
  display: flex;
  align-items: center;
  font-size: 40px;

  .heart {
    color: #e53e3e;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

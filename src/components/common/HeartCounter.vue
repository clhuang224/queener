<script setup lang="ts">
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
      {{ i <= hearts ? '❤️' : '🤍' }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.hearts {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 40px;
}
</style>

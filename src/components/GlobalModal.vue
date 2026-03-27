<script setup lang="ts">
import { useGlobalModalStore } from '@/stores/globalModal'
import { storeToRefs } from 'pinia'
import BaseModal from './common/BaseModal.vue'
const { globalModal } = storeToRefs(useGlobalModalStore())
const { cancelGlobalModal, confirmGlobalModal } = useGlobalModalStore()
</script>

<template>
  <div class="global-modal" v-if="globalModal.isOpen">
    <base-modal
      :title="globalModal.title"
      :content="globalModal.content"
      :type="globalModal.type"
      @confirm="confirmGlobalModal"
      @cancel="cancelGlobalModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.global-modal {
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100dvh;
}
</style>

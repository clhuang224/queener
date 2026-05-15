<script setup lang="ts">
import { useGlobalModalStore } from '@/modules/stores/globalModal'
import { storeToRefs } from 'pinia'
import {
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
} from 'reka-ui'
import BaseModal from './common/BaseModal.vue'

const { globalModal } = storeToRefs(useGlobalModalStore())
const { selectGlobalModalAction } = useGlobalModalStore()
</script>

<template>
  <AlertDialogRoot :open="globalModal.isOpen">
    <AlertDialogPortal>
      <AlertDialogOverlay class="global-modal__overlay" />
      <AlertDialogContent
        class="global-modal__content"
        @escape-key-down.prevent
      >
        <base-modal
          :title="globalModal.title"
          :content="globalModal.content"
          :actions="globalModal.actions"
          @select="selectGlobalModalAction"
        />
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style lang="scss" scoped>
.global-modal__overlay {
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100dvh;
}

.global-modal__content {
  position: fixed;
  z-index: 11;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  outline: none;
}
</style>

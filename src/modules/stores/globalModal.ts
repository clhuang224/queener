import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ModalAction } from '@/modules/types/modal'

interface GlobalResultModalOptions {
  title: string
  content: string
  actions: ModalAction[]
}

interface GlobalModalState {
  title: string
  content: string
  isOpen: boolean
  actions: ModalAction[]
}

export const useGlobalModalStore = defineStore('global-modal', () => {
  const globalModal = reactive<GlobalModalState>({
    title: '',
    content: '',
    isOpen: false,
    actions: [],
  })

  const resetGlobalModal = () => {
    globalModal.title = ''
    globalModal.content = ''
    globalModal.actions = []
    globalModal.isOpen = false
  }

  const actionResolver = ref<((value: unknown) => void) | null>(null)
  const actionRejecter = ref<((reason?: unknown) => void) | null>(null)

  const openResultModal = ({ title, content, actions }: GlobalResultModalOptions) => {
    globalModal.title = title
    globalModal.content = content
    globalModal.actions = actions
    globalModal.isOpen = true

    return new Promise<unknown>((resolve, reject) => {
      actionResolver.value = resolve
      actionRejecter.value = reject
    })
  }

  const selectGlobalModalAction = (action: ModalAction) => {
    if (action.settle === 'reject') {
      actionRejecter.value?.(action.payload)
    } else {
      actionResolver.value?.(action.payload)
    }

    resetGlobalModal()
  }

  const openAlertModal = async ({ title, content }: Omit<GlobalResultModalOptions, 'actions'>) => {
    await openResultModal({
      title,
      content,
      actions: [{ label: '確定', payload: undefined }],
    })
  }

  const openConfirmModal = async ({
    title,
    content,
  }: Omit<GlobalResultModalOptions, 'actions'>) => {
    await openResultModal({
      title,
      content,
      actions: [
        { label: '確定', payload: undefined, settle: 'resolve' },
        { label: '取消', payload: new Error('cancelled'), settle: 'reject' },
      ],
    })
  }

  return {
    globalModal,
    selectGlobalModalAction,
    openAlertModal,
    openConfirmModal,
    openResultModal,
  }
})

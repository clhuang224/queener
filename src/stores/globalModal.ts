import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

type GlobalModalType = 'alert' | 'confirm'

interface GlobalModalOptions {
  title: string
  content: string
  type?: GlobalModalType
}

interface GlobalModalState {
  title: string
  content: string
  isOpen: boolean
  type: GlobalModalType
}

export const useGlobalModalStore = defineStore('global-modal', () => {
  const globalModal = reactive<GlobalModalState>({
    title: '',
    content: '',
    isOpen: false,
    type: 'alert',
  })

  const resetGlobalModal = () => {
    globalModal.title = ''
    globalModal.content = ''
    globalModal.type = 'alert'
    globalModal.isOpen = false
  }

  const resolver = ref<(() => void) | null>(null)
  const rejecter = ref<((reason?: unknown) => void) | null>(null)

  const openGlobalModal = ({ title, content, type = 'alert' }: GlobalModalOptions) => {
    globalModal.title = title
    globalModal.content = content
    globalModal.type = type
    globalModal.isOpen = true

    return new Promise<void>((resolve, reject) => {
      resolver.value = resolve
      rejecter.value = reject
    })
  }

  const cancelGlobalModal = () => {
    rejecter.value?.()
    resetGlobalModal()
  }

  const confirmGlobalModal = () => {
    resolver.value?.()
    resetGlobalModal()
  }

  const openAlertModal = async (options: Omit<GlobalModalOptions, 'type'>) => {
    return await openGlobalModal({ ...options, type: 'alert' })
  }

  const openConfirmModal = async (options: Omit<GlobalModalOptions, 'type'>) => {
    return await openGlobalModal({ ...options, type: 'confirm' })
  }

  return {
    globalModal,
    cancelGlobalModal,
    confirmGlobalModal,
    openAlertModal,
    openConfirmModal,
  }
})

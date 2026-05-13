import { ref } from 'vue'
import { defineStore } from 'pinia'
import { BOARD_SKINS } from '@/modules/constants/boardSkins'
import { QUEEN_SKINS, isQueenSkinAvailable } from '@/modules/constants/queenSkins'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { SkinSettings } from '@/modules/types/skin'

const BOARD_SKIN_STORAGE_KEY = 'queen-game-board-skin'
const BOARD_TEXTURE_ENABLED_STORAGE_KEY = 'queen-game-board-texture-enabled'
const QUEEN_SKIN_STORAGE_KEY = 'queen-game-queen-skin'
const DEFAULT_SETTINGS: SkinSettings = {
  boardSkin: BoardSkinType.RAINBOW,
  boardTextureEnabled: false,
  queenSkin: QueenSkinType.PINK_CROWN,
}

const isBoardSkin = (value: unknown): value is BoardSkinType => {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(BOARD_SKINS, value)
}

const isQueenSkin = (value: unknown): value is QueenSkinType => {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(QUEEN_SKINS, value)
}

const isSelectableQueenSkin = (value: unknown): value is QueenSkinType => {
  return isQueenSkin(value) && isQueenSkinAvailable(value)
}

const getStoredBoardSkin = (): BoardSkinType => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS.boardSkin

  const storedValue = window.localStorage.getItem(BOARD_SKIN_STORAGE_KEY)
  return isBoardSkin(storedValue) ? storedValue : DEFAULT_SETTINGS.boardSkin
}

const getStoredQueenSkin = (): QueenSkinType => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS.queenSkin

  const storedValue = window.localStorage.getItem(QUEEN_SKIN_STORAGE_KEY)
  return isSelectableQueenSkin(storedValue) ? storedValue : DEFAULT_SETTINGS.queenSkin
}

const getStoredBoardTextureEnabled = (): boolean => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS.boardTextureEnabled

  const storedValue = window.localStorage.getItem(BOARD_TEXTURE_ENABLED_STORAGE_KEY)
  return storedValue === null ? DEFAULT_SETTINGS.boardTextureEnabled : storedValue === 'true'
}

const persistSkinSettings = ({ boardSkin, boardTextureEnabled, queenSkin }: SkinSettings) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(BOARD_SKIN_STORAGE_KEY, boardSkin)
  window.localStorage.setItem(BOARD_TEXTURE_ENABLED_STORAGE_KEY, String(boardTextureEnabled))
  window.localStorage.setItem(QUEEN_SKIN_STORAGE_KEY, queenSkin)
}

export const useSkinStore = defineStore('skin', () => {
  const boardSkin = ref<BoardSkinType>(DEFAULT_SETTINGS.boardSkin)
  const boardTextureEnabled = ref(DEFAULT_SETTINGS.boardTextureEnabled)
  const queenSkin = ref<QueenSkinType>(DEFAULT_SETTINGS.queenSkin)
  const hasLoaded = ref(false)

  const load = () => {
    boardSkin.value = getStoredBoardSkin()
    boardTextureEnabled.value = getStoredBoardTextureEnabled()
    queenSkin.value = getStoredQueenSkin()
    hasLoaded.value = true
  }

  const ensureLoaded = () => {
    if (!hasLoaded.value) {
      load()
    }
  }

  const setBoardSkin = (nextSkin: BoardSkinType) => {
    ensureLoaded()
    boardSkin.value = nextSkin
    persistSkinSettings({
      boardSkin: boardSkin.value,
      boardTextureEnabled: boardTextureEnabled.value,
      queenSkin: queenSkin.value,
    })
  }

  const setBoardTextureEnabled = (nextEnabled: boolean) => {
    ensureLoaded()
    boardTextureEnabled.value = nextEnabled
    persistSkinSettings({
      boardSkin: boardSkin.value,
      boardTextureEnabled: boardTextureEnabled.value,
      queenSkin: queenSkin.value,
    })
  }

  const setQueenSkin = (nextSkin: QueenSkinType) => {
    ensureLoaded()
    queenSkin.value = nextSkin
    persistSkinSettings({
      boardSkin: boardSkin.value,
      boardTextureEnabled: boardTextureEnabled.value,
      queenSkin: queenSkin.value,
    })
  }

  return {
    boardSkin,
    boardTextureEnabled,
    queenSkin,
    load,
    setBoardSkin,
    setBoardTextureEnabled,
    setQueenSkin,
  }
})

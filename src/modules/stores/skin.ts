import { ref } from 'vue'
import { defineStore } from 'pinia'
import { CELL_SKINS } from '@/modules/constants/cellSkins'
import { QUEEN_SKINS, isQueenSkinAvailable } from '@/modules/constants/queenSkins'
import { CellSkinType } from '@/modules/enums/CellSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { SkinSettings } from '@/modules/types/skin'

const CELL_SKIN_STORAGE_KEY = 'queen-game-cell-skin'
const QUEEN_SKIN_STORAGE_KEY = 'queen-game-queen-skin'
const DEFAULT_SETTINGS: SkinSettings = {
  cellSkin: CellSkinType.RAINBOW,
  queenSkin: QueenSkinType.PINK_CROWN,
}

const isCellSkin = (value: unknown): value is CellSkinType => {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(CELL_SKINS, value)
}

const isQueenSkin = (value: unknown): value is QueenSkinType => {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(QUEEN_SKINS, value)
}

const isSelectableQueenSkin = (value: unknown): value is QueenSkinType => {
  return isQueenSkin(value) && isQueenSkinAvailable(value)
}

const getStoredCellSkin = (): CellSkinType => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS.cellSkin

  const storedValue = window.localStorage.getItem(CELL_SKIN_STORAGE_KEY)
  return isCellSkin(storedValue) ? storedValue : DEFAULT_SETTINGS.cellSkin
}

const getStoredQueenSkin = (): QueenSkinType => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS.queenSkin

  const storedValue = window.localStorage.getItem(QUEEN_SKIN_STORAGE_KEY)
  return isSelectableQueenSkin(storedValue) ? storedValue : DEFAULT_SETTINGS.queenSkin
}

const persistSkinSettings = ({ cellSkin, queenSkin }: SkinSettings) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(CELL_SKIN_STORAGE_KEY, cellSkin)
  window.localStorage.setItem(QUEEN_SKIN_STORAGE_KEY, queenSkin)
}

export const useSkinStore = defineStore('skin', () => {
  const cellSkin = ref<CellSkinType>(DEFAULT_SETTINGS.cellSkin)
  const queenSkin = ref<QueenSkinType>(DEFAULT_SETTINGS.queenSkin)
  const hasLoaded = ref(false)

  const load = () => {
    cellSkin.value = getStoredCellSkin()
    queenSkin.value = getStoredQueenSkin()
    hasLoaded.value = true
  }

  const ensureLoaded = () => {
    if (!hasLoaded.value) {
      load()
    }
  }

  const setCellSkin = (nextSkin: CellSkinType) => {
    ensureLoaded()
    cellSkin.value = nextSkin
    persistSkinSettings({
      cellSkin: cellSkin.value,
      queenSkin: queenSkin.value,
    })
  }

  const setQueenSkin = (nextSkin: QueenSkinType) => {
    ensureLoaded()
    queenSkin.value = nextSkin
    persistSkinSettings({
      cellSkin: cellSkin.value,
      queenSkin: queenSkin.value,
    })
  }

  return {
    cellSkin,
    queenSkin,
    load,
    setCellSkin,
    setQueenSkin,
  }
})

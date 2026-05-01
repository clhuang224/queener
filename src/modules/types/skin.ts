import type { CellSkinType } from '@/modules/enums/CellSkinType'

export const QUEEN_SKINS = ['rainbow', 'grayscale'] as const

export type QueenSkin = (typeof QUEEN_SKINS)[number]

export interface SkinSettings {
  cellSkin: CellSkinType
  queenSkin: QueenSkin
}

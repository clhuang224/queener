import type { CellSkinType } from '@/enums/CellSkinType'

export const QUEEN_SKINS = ['rainbow', 'grayscale'] as const

export type QueenSkin = (typeof QUEEN_SKINS)[number]

export interface SkinSettings {
  cellSkin: CellSkinType
  queenSkin: QueenSkin
}

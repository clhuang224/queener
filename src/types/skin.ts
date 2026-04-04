export const CELL_SKINS = ['rainbow', 'grayscale'] as const
export const QUEEN_SKINS = ['rainbow', 'grayscale'] as const

export type CellSkin = (typeof CELL_SKINS)[number]
export type QueenSkin = (typeof QUEEN_SKINS)[number]

export interface SkinSettings {
  cellSkin: CellSkin
  queenSkin: QueenSkin
}

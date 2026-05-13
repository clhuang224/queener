import type { CellSkinType } from '@/modules/enums/CellSkinType'
import type { QueenSkinType } from '@/modules/enums/QueenSkinType'

export interface SkinSettings {
  cellSkin: CellSkinType
  cellTextureEnabled: boolean
  queenSkin: QueenSkinType
}

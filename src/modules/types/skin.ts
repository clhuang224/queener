import type { BoardSkinType } from '@/modules/enums/BoardSkinType'
import type { QueenSkinType } from '@/modules/enums/QueenSkinType'

export interface SkinSettings {
  boardSkin: BoardSkinType
  boardTextureEnabled: boolean
  queenSkin: QueenSkinType
}

import textureStyles from '@/assets/texture.module.scss'
import { CellTextureType } from '@/modules/enums/CellTextureType'
import { getEnumValues } from '@/modules/utils/getEnumValues'

export const CELL_TEXTURES = getEnumValues(CellTextureType)

const cellTextureStyles = textureStyles as Record<CellTextureType, string>

export const getCellTextureClassName = (texture: CellTextureType): string => {
  return cellTextureStyles[texture] ?? ''
}

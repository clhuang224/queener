import { CellSkinType } from '@/modules/enums/CellSkinType'

export const CELL_SKIN_COLOR_COUNT = 10

type HexColor = `#${string}`

type TenColorPalette = readonly [
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
]

export const CELL_SKINS: Record<CellSkinType, TenColorPalette> = {
  [CellSkinType.LAKE]: [
    '#d9ed92',
    '#b5e48c',
    '#99d98c',
    '#76c893',
    '#52b69a',
    '#34a0a4',
    '#168aad',
    '#1a759f',
    '#1e6091',
    '#184e77',
  ],
  [CellSkinType.DAWN]: [
    '#03071e',
    '#370617',
    '#6a040f',
    '#9d0208',
    '#d00000',
    '#dc2f02',
    '#e85d04',
    '#f48c06',
    '#faa307',
    '#ffba08',
  ],
  [CellSkinType.RAINBOW]: [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#f9c74f',
    '#90be6d',
    '#43aa8b',
    '#4d908e',
    '#3b89aa',
    '#277da1',
    '#577590',
  ],
  [CellSkinType.AUTUMN]: [
    '#f4f1de',
    '#eab69f',
    '#e07a5f',
    '#8f5d5d',
    '#3d405b',
    '#5f797b',
    '#81b29a',
    '#babf95',
    '#f2cc8f',
    '#c98518',
  ],
  [CellSkinType.COTTON_CANDY]: [
    '#fbf8cc',
    '#fde4cf',
    '#ffcfd2',
    '#f1c0e8',
    '#cfbaf0',
    '#a3c4f3',
    '#90dbf4',
    '#8eecf5',
    '#98f5e1',
    '#b9fbc0',
  ],
}

export const cellSkinMapName: Record<CellSkinType, string> = {
  [CellSkinType.LAKE]: 'Lake',
  [CellSkinType.DAWN]: 'Dawn',
  [CellSkinType.RAINBOW]: 'Rainbow',
  [CellSkinType.AUTUMN]: 'Autumn',
  [CellSkinType.COTTON_CANDY]: 'Cotton Candy',
}

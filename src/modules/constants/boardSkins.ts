import { BoardSkinType } from '@/modules/enums/BoardSkinType'

export const BOARD_SKIN_COLOR_COUNT = 10

export const ACCESSIBLE_BOARD_SKINS = [
  BoardSkinType.TROPICAL_ISLAND,
  BoardSkinType.CARTOON,
  BoardSkinType.POLO_SHIRT,
] as const

type AccessibleBoardSkin = (typeof ACCESSIBLE_BOARD_SKINS)[number]

export const isAccessibleBoardSkin = (skin: BoardSkinType): skin is AccessibleBoardSkin => {
  return ACCESSIBLE_BOARD_SKINS.includes(skin as AccessibleBoardSkin)
}

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

export const BOARD_SKINS: Record<BoardSkinType, TenColorPalette> = {
  [BoardSkinType.LAKE]: [
    '#d9ed92',
    '#b5e48c',
    '#99d98c',
    '#76c893',
    '#52b69a',
    '#34a0a4',
    '#168aad',
    '#006e9c',
    '#24538e',
    '#2d356b',
  ],
  [BoardSkinType.DAWN]: [
    '#03071e',
    '#370617',
    '#6a040f',
    '#9d0208',
    '#c00000',
    '#dc2f02',
    '#e85d04',
    '#f48c06',
    '#faa307',
    '#ffba08',
  ],
  [BoardSkinType.RAINBOW]: [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#f9c74f',
    '#90be6d',
    '#43aa8b',
    '#4d908e',
    '#46accb',
    '#1e6381',
    '#5c207e',
  ],
  [BoardSkinType.AUTUMN]: [
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
  [BoardSkinType.COTTON_CANDY]: [
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
  [BoardSkinType.EARTH]: [
    '#8f6857',
    '#a87e69',
    '#cb997e',
    '#ddbea9',
    '#ffe8d6',
    '#c8b090',
    '#b7b7a4',
    '#8f8f79',
    '#6b705c',
    '#3f4238',
  ],
  [BoardSkinType.TROPICAL_ISLAND]: [
    '#4477AA',
    '#EE6677',
    '#228833',
    '#CCBB44',
    '#66CCEE',
    '#AA3377',
    '#BBBBBB',
    '#000000',
    '#E69F00',
    '#00A6D6',
  ],
  [BoardSkinType.CARTOON]: [
    '#648FFF',
    '#785EF0',
    '#DC267F',
    '#FE6100',
    '#FFB000',
    '#000000',
    '#FFFFFF',
    '#004D40',
    '#1A75FF',
    '#FEFE62',
  ],
  [BoardSkinType.POLO_SHIRT]: [
    '#E69F00',
    '#56B4E9',
    '#009E73',
    '#F0E442',
    '#0072B2',
    '#D55E00',
    '#CC79A7',
    '#999999',
    '#000000',
    '#FFFFFF',
  ],
}

export const boardSkinMapName: Record<BoardSkinType, string> = {
  [BoardSkinType.LAKE]: 'Lake',
  [BoardSkinType.DAWN]: 'Dawn',
  [BoardSkinType.RAINBOW]: 'Rainbow',
  [BoardSkinType.AUTUMN]: 'Autumn',
  [BoardSkinType.COTTON_CANDY]: 'Cotton Candy',
  [BoardSkinType.EARTH]: 'Earth',
  [BoardSkinType.TROPICAL_ISLAND]: 'Tropical Island',
  [BoardSkinType.CARTOON]: 'Cartoon',
  [BoardSkinType.POLO_SHIRT]: 'Polo Shirt',
}

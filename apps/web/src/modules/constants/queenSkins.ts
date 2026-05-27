import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import { isDateInAnnualRange, type AnnualDateRange } from '@/modules/utils/isDateInAnnualRange'

const queenSkinIconModules = import.meta.glob<string>('../../assets/icons/*.png', {
  eager: true,
  import: 'default',
})

const queenSkinNoteIconModules = import.meta.glob<string>('../../assets/noteIcons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const getQueenSkinIcons = (skin: QueenSkinType) => {
  const icon = queenSkinIconModules[`../../assets/icons/${skin}.png`]
  const noteIcon = queenSkinNoteIconModules[`../../assets/noteIcons/${skin}.svg`]

  if (!icon) {
    throw new Error(`Missing queen skin icon: ${skin}.png`)
  }

  if (!noteIcon) {
    throw new Error(`Missing queen skin icon: ${skin}.svg`)
  }

  return { icon, noteIcon }
}

interface QueenSkinData {
  icon: string
  noteIcon: string
  available: AnnualDateRange | null
}

const halloweenAvailability: AnnualDateRange = {
  startsOn: { month: 10, day: 1 },
  endsOn: { month: 10, day: 31 },
}

export const QUEEN_SKINS: Record<QueenSkinType, QueenSkinData> = {
  [QueenSkinType.BROWN_CHESS]: {
    ...getQueenSkinIcons(QueenSkinType.BROWN_CHESS),
    available: null,
  },
  [QueenSkinType.BLACK_CHESS]: {
    ...getQueenSkinIcons(QueenSkinType.BLACK_CHESS),
    available: null,
  },
  [QueenSkinType.CHRISTMAS_TREE]: {
    ...getQueenSkinIcons(QueenSkinType.CHRISTMAS_TREE),
    available: {
      startsOn: { month: 12, day: 1 },
      endsOn: { month: 12, day: 31 },
    },
  },
  [QueenSkinType.BLACK_CROWN]: {
    ...getQueenSkinIcons(QueenSkinType.BLACK_CROWN),
    available: null,
  },
  [QueenSkinType.PINK_CROWN]: {
    ...getQueenSkinIcons(QueenSkinType.PINK_CROWN),
    available: null,
  },
  [QueenSkinType.RED_FLAG]: {
    ...getQueenSkinIcons(QueenSkinType.RED_FLAG),
    available: null,
  },
  [QueenSkinType.ORANGE_PUMPKIN]: {
    ...getQueenSkinIcons(QueenSkinType.ORANGE_PUMPKIN),
    available: halloweenAvailability,
  },
  [QueenSkinType.WHITE_GHOST]: {
    ...getQueenSkinIcons(QueenSkinType.WHITE_GHOST),
    available: halloweenAvailability,
  },
  [QueenSkinType.PURPLE_CANDY]: {
    ...getQueenSkinIcons(QueenSkinType.PURPLE_CANDY),
    available: halloweenAvailability,
  },
  [QueenSkinType.GREEN_CAULDRON]: {
    ...getQueenSkinIcons(QueenSkinType.GREEN_CAULDRON),
    available: halloweenAvailability,
  },
}

export const queenSkinMapName: Record<QueenSkinType, string> = {
  [QueenSkinType.BROWN_CHESS]: 'Brown Chess',
  [QueenSkinType.BLACK_CHESS]: 'Black Chess',
  [QueenSkinType.CHRISTMAS_TREE]: 'Christmas Tree',
  [QueenSkinType.BLACK_CROWN]: 'Black Crown',
  [QueenSkinType.PINK_CROWN]: 'Pink Crown',
  [QueenSkinType.RED_FLAG]: 'Red Flag',
  [QueenSkinType.ORANGE_PUMPKIN]: 'Orange Pumpkin',
  [QueenSkinType.WHITE_GHOST]: 'White Ghost',
  [QueenSkinType.PURPLE_CANDY]: 'Purple Candy',
  [QueenSkinType.GREEN_CAULDRON]: 'Green Cauldron',
}

export const isQueenSkinAvailable = (skin: QueenSkinType, date = new Date()): boolean => {
  const availability = QUEEN_SKINS[skin].available

  return availability === null || isDateInAnnualRange(date, availability)
}

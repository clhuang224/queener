import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import {
  isDateInAnnualRange,
  type AnnualDateRange,
} from '@/modules/utils/isDateInAnnualRange'

const queenSkinIconModules = import.meta.glob<string>('../../assets/icons/*.png', {
  eager: true,
  import: 'default',
})

const getQueenSkinIcon = (skin: QueenSkinType) => {
  const icon = queenSkinIconModules[`../../assets/icons/${skin}.png`]

  if (!icon) {
    throw new Error(`Missing queen skin icon: ${skin}.png`)
  }

  return icon
}

interface QueenSkinData {
  icon: string
  available: AnnualDateRange | null
}

const halloweenAvailability: AnnualDateRange = {
  startsOn: { month: 10, day: 1 },
  endsOn: { month: 10, day: 31 },
}

export const QUEEN_SKINS: Record<QueenSkinType, QueenSkinData> = {
  [QueenSkinType.BLACK_CHESS]: {
    icon: getQueenSkinIcon(QueenSkinType.BLACK_CHESS),
    available: null,
  },
  [QueenSkinType.CHRISTMAS_TREE]: {
    icon: getQueenSkinIcon(QueenSkinType.CHRISTMAS_TREE),
    available: {
      startsOn: { month: 12, day: 1 },
      endsOn: { month: 12, day: 31 },
    },
  },
  [QueenSkinType.BLACK_CROWN]: {
    icon: getQueenSkinIcon(QueenSkinType.BLACK_CROWN),
    available: null,
  },
  [QueenSkinType.PINK_CROWN]: {
    icon: getQueenSkinIcon(QueenSkinType.PINK_CROWN),
    available: null,
  },
  [QueenSkinType.RED_FLAG]: {
    icon: getQueenSkinIcon(QueenSkinType.RED_FLAG),
    available: null,
  },
  [QueenSkinType.ORANGE_PUMPKIN]: {
    icon: getQueenSkinIcon(QueenSkinType.ORANGE_PUMPKIN),
    available: halloweenAvailability,
  },
  [QueenSkinType.WHITE_GHOST]: {
    icon: getQueenSkinIcon(QueenSkinType.WHITE_GHOST),
    available: halloweenAvailability,
  },
}

export const isQueenSkinAvailable = (skin: QueenSkinType, date = new Date()): boolean => {
  const availability = QUEEN_SKINS[skin].available

  return availability === null || isDateInAnnualRange(date, availability)
}

export const getAvailableQueenSkinTypes = (date = new Date()): QueenSkinType[] => {
  return Object.values(QueenSkinType).filter((skin) => isQueenSkinAvailable(skin, date))
}

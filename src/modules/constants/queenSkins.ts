import { QueenSkinType } from '../enums/QueenSkinType'
import IconBlackChess from '@/assets/queen-skins/black-chess.png'
import IconChristmasTree from '@/assets/queen-skins/christmas-tree.png'
import IconBlackCrown from '@/assets/queen-skins/black-crown.png'
import IconPinkCrown from '@/assets/queen-skins/pink-crown.png'
import IconRedFlag from '@/assets/queen-skins/red-flag.png'
import IconColoredPumpkin from '@/assets/queen-skins/colored-pumpkin.png'
import IconWhiteGhost from '@/assets/queen-skins/white-ghost.png'

interface QueenSkinData {
  icon: string
  available: {
    started_at: Date
    ended_at: Date
  } | null
}

export const QUEEN_SKINS: Record<QueenSkinType, QueenSkinData> = {
  [QueenSkinType.BLACK_CHESS]: {
    icon: IconBlackChess,
    available: null,
  },
  [QueenSkinType.CHRISTMAS_TREE]: {
    icon: IconChristmasTree,
    available: {
      started_at: new Date('2026-12-01T00:00:00Z'),
      ended_at: new Date('2026-12-31T23:59:59Z'),
    },
  },
  [QueenSkinType.BLACK_CROWN]: {
    icon: IconBlackCrown,
    available: null,
  },
  [QueenSkinType.PINK_CROWN]: {
    icon: IconPinkCrown,
    available: null,
  },
  [QueenSkinType.RED_FLAG]: {
    icon: IconRedFlag,
    available: null,
  },
  [QueenSkinType.COLORED_PUMPKIN]: {
    icon: IconColoredPumpkin,
    available: {
      started_at: new Date('2026-10-01T00:00:00Z'),
      ended_at: new Date('2026-10-31T23:59:59Z'),
    },
  },
  [QueenSkinType.WHITE_GHOST]: {
    icon: IconWhiteGhost,
    available: {
      started_at: new Date('2026-10-01T00:00:00Z'),
      ended_at: new Date('2026-10-31T23:59:59Z'),
    },
  },
}

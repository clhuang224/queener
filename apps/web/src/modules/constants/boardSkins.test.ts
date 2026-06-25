import { describe, expect, it } from 'vitest'
import { BOARD_SKINS, isAccessibleBoardSkin } from './boardSkins'
import type { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { getCielabDistance, hexToLabColor } from '@/modules/utils/colorDistance'

const ACCESSIBLE_MINIMUM_CIELAB_DISTANCE = 15
const BASELINE_MINIMUM_CIELAB_DISTANCE = 8

describe('BOARD_SKINS', () => {
  it('keeps colors in each palette separated by CIELAB distance', () => {
    const failures: string[] = []

    for (const [skin, palette] of Object.entries(BOARD_SKINS)) {
      const skinType = skin as BoardSkinType
      const minimumDistance = isAccessibleBoardSkin(skinType)
        ? ACCESSIBLE_MINIMUM_CIELAB_DISTANCE
        : BASELINE_MINIMUM_CIELAB_DISTANCE
      const labPalette = palette.map(hexToLabColor)

      for (const [firstIndex, firstColor] of labPalette.entries()) {
        for (let secondIndex = firstIndex + 1; secondIndex < labPalette.length; secondIndex += 1) {
          const secondColor = labPalette[secondIndex]!
          const distance = getCielabDistance(firstColor, secondColor)

          if (distance < minimumDistance) {
            failures.push(
              `${skin}: ${palette[firstIndex]} and ${palette[secondIndex]} are ${distance.toFixed(1)} CIELAB delta E apart; expected at least ${minimumDistance}`,
            )
          }
        }
      }
    }

    expect(failures).toEqual([])
  })
})

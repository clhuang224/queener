import type { Position } from '@/modules/types/board'
import type {
  Puzzle,
  PuzzleDirection,
  PuzzleVariant,
  PuzzleVariantMetadata,
} from '@/modules/types/puzzle'
import { randomInteger } from '@/modules/utils/random'

export const PUZZLE_DIRECTIONS: PuzzleDirection[] = [0, 90, 180, 270]

const rotatePosition = ([row, column]: Position, size: number, direction: PuzzleDirection): Position => {
  let rotatedRow = row
  let rotatedColumn = column

  for (let turn = 0; turn < direction / 90; turn++) {
    const nextRow = rotatedColumn
    const nextColumn = size - rotatedRow - 1
    rotatedRow = nextRow
    rotatedColumn = nextColumn
  }

  return [rotatedRow, rotatedColumn]
}

const getInverseDirection = (direction: PuzzleDirection): PuzzleDirection => {
  return ((360 - direction) % 360) as PuzzleDirection
}

const rotateRegions = (regions: number[][], direction: PuzzleDirection): number[][] => {
  const size = regions.length
  const inverseDirection = getInverseDirection(direction)

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => {
      const [sourceRow, sourceColumn] = rotatePosition([row, column], size, inverseDirection)
      return regions[sourceRow]![sourceColumn]!
    }),
  )
}

const rotatePuzzle = (puzzle: Puzzle, direction: PuzzleDirection): Puzzle => {
  if (direction === 0) {
    return {
      ...puzzle,
      regions: puzzle.regions.map((row) => [...row]),
      queens: puzzle.queens.map((position) => [...position]),
    }
  }

  return {
    ...puzzle,
    regions: rotateRegions(puzzle.regions, direction),
    queens: puzzle.queens.map((position) =>
      rotatePosition(position, puzzle.rules.size, direction),
    ),
  }
}

const createRandomRegionMap = (regionIds: number[]): Record<number, number> => {
  const shuffledRegionIds = [...regionIds]

  for (let index = shuffledRegionIds.length - 1; index > 0; index--) {
    const swapIndex = randomInteger(0, index)
    const currentRegion = shuffledRegionIds[index]!
    shuffledRegionIds[index] = shuffledRegionIds[swapIndex]!
    shuffledRegionIds[swapIndex] = currentRegion
  }

  return Object.fromEntries(
    regionIds.map((regionId, index) => [regionId, shuffledRegionIds[index]!]),
  )
}

export const createPuzzleVariantFromMetadata = (
  puzzle: Puzzle,
  metadata: PuzzleVariantMetadata,
): PuzzleVariant => {
  const rotatedPuzzle = rotatePuzzle(puzzle, metadata.direction)

  return {
    puzzle: {
      ...rotatedPuzzle,
      regions: rotatedPuzzle.regions.map((row) =>
        row.map((region) => metadata.regionMap[region] ?? region),
      ),
      queens: rotatedPuzzle.queens.map((position) => [...position]),
    },
    metadata: {
      direction: metadata.direction,
      regionMap: {
        ...metadata.regionMap,
      },
    },
  }
}

export const createRandomPuzzleVariant = (puzzle: Puzzle): PuzzleVariant => {
  const direction = PUZZLE_DIRECTIONS[randomInteger(0, PUZZLE_DIRECTIONS.length - 1)]!
  const rotatedPuzzle = rotatePuzzle(puzzle, direction)
  const regionIds = [...new Set(rotatedPuzzle.regions.flat())]
  const regionMap = createRandomRegionMap(regionIds)

  return createPuzzleVariantFromMetadata(puzzle, {
    direction,
    regionMap,
  })
}

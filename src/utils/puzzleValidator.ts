import type { Puzzle } from '@/types/puzzle'

export class PuzzleValidationError extends Error {
  public readonly puzzleId: string

  constructor(message: string, puzzleId: string) {
    super(`${puzzleId}: ${message}`)
    this.name = 'PuzzleValidationError'
    this.puzzleId = puzzleId
  }
}

const getPositionKey = (row: number, column: number) => `${row},${column}`

const createError = (puzzleId: string, message: string) => {
  return new PuzzleValidationError(message, puzzleId)
}

const getOrthogonalNeighbors = (row: number, column: number): Array<[number, number]> => {
  return [
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ]
}

const validateRegionConnectivity = (puzzle: Puzzle): PuzzleValidationError[] => {
  const { id, regions, rules } = puzzle

  if (rules.allowDisconnectedRegions) {
    return []
  }

  const positionsByRegion = new Map<number, Array<[number, number]>>()

  for (const [rowIndex, row] of regions.entries()) {
    for (const [columnIndex, region] of row.entries()) {
      const positions = positionsByRegion.get(region) ?? []
      positions.push([rowIndex, columnIndex])
      positionsByRegion.set(region, positions)
    }
  }

  const errors: PuzzleValidationError[] = []

  for (const [region, positions] of positionsByRegion.entries()) {
    const [startRow, startColumn] = positions[0]!
    const queue: Array<[number, number]> = [[startRow, startColumn]]
    const visited = new Set<string>([getPositionKey(startRow, startColumn)])

    while (queue.length > 0) {
      const [row, column] = queue.shift()!

      for (const [neighborRow, neighborColumn] of getOrthogonalNeighbors(row, column)) {
        if (regions[neighborRow]?.[neighborColumn] !== region) continue

        const neighborKey = getPositionKey(neighborRow, neighborColumn)
        if (visited.has(neighborKey)) continue

        visited.add(neighborKey)
        queue.push([neighborRow, neighborColumn])
      }
    }

    if (visited.size !== positions.length) {
      errors.push(createError(id, `region ${region} is disconnected`))
    }
  }

  return errors
}

export const validatePuzzle = (puzzle: Puzzle): PuzzleValidationError[] => {
  const errors: PuzzleValidationError[] = []
  const {
    id,
    regions,
    queens,
    rules: { size, queensPerUnit },
  } = puzzle

  if (regions.length !== size) {
    errors.push(createError(id, `expected ${size} rows, got ${regions.length}`))
  }

  for (const [rowIndex, row] of regions.entries()) {
    if (row.length !== size) {
      errors.push(createError(id, `row ${rowIndex} expected length ${size}, got ${row.length}`))
    }
  }

  const expectedQueenCount = size * queensPerUnit

  if (queens.length !== expectedQueenCount) {
    errors.push(createError(id, `expected ${expectedQueenCount} queens, got ${queens.length}`))
  }

  const seenPositions = new Set<string>()
  const rowCounts = new Map<number, number>()
  const columnCounts = new Map<number, number>()
  const regionCounts = new Map<number, number>()
  const distinctRegions = new Set<number>()

  for (const row of regions) {
    for (const region of row) {
      distinctRegions.add(region)
    }
  }

  if (distinctRegions.size !== size) {
    errors.push(createError(id, `expected ${size} distinct regions, got ${distinctRegions.size}`))
  }

  errors.push(...validateRegionConnectivity(puzzle))

  for (const [queenIndex, [row, column]] of queens.entries()) {
    if (row < 0 || row >= size || column < 0 || column >= size) {
      errors.push(createError(id, `queen ${queenIndex} is out of bounds at (${row}, ${column})`))
      continue
    }

    const positionKey = getPositionKey(row, column)
    if (seenPositions.has(positionKey)) {
      errors.push(createError(id, `duplicate queen position at (${row}, ${column})`))
    }
    seenPositions.add(positionKey)

    rowCounts.set(row, (rowCounts.get(row) ?? 0) + 1)
    columnCounts.set(column, (columnCounts.get(column) ?? 0) + 1)

    const region = regions[row]?.[column]
    if (region === undefined) {
      errors.push(
        createError(id, `queen ${queenIndex} points to a missing cell at (${row}, ${column})`),
      )
      continue
    }

    regionCounts.set(region, (regionCounts.get(region) ?? 0) + 1)
  }

  for (let row = 0; row < size; row += 1) {
    const rowCount = rowCounts.get(row) ?? 0
    if (rowCount !== queensPerUnit) {
      errors.push(createError(id, `expected ${queensPerUnit} queens in row ${row}, got ${rowCount}`))
    }
  }

  for (let column = 0; column < size; column += 1) {
    const columnCount = columnCounts.get(column) ?? 0
    if (columnCount !== queensPerUnit) {
      errors.push(
        createError(id, `expected ${queensPerUnit} queens in column ${column}, got ${columnCount}`),
      )
    }
  }

  for (const region of distinctRegions) {
    const regionCount = regionCounts.get(region) ?? 0
    if (regionCount !== queensPerUnit) {
      errors.push(
        createError(id, `expected ${queensPerUnit} queens in region ${region}, got ${regionCount}`),
      )
    }
  }

  for (let i = 0; i < queens.length; i += 1) {
    const [rowA, columnA] = queens[i]!

    for (let j = i + 1; j < queens.length; j += 1) {
      const [rowB, columnB] = queens[j]!
      const rowDistance = Math.abs(rowA - rowB)
      const columnDistance = Math.abs(columnA - columnB)

      if (rowDistance <= 1 && columnDistance <= 1) {
        errors.push(
          createError(id, `queens at (${rowA}, ${columnA}) and (${rowB}, ${columnB}) are adjacent`),
        )
      }
    }
  }

  return errors
}

export const validatePuzzles = (puzzles: Puzzle[]): PuzzleValidationError[] => {
  return puzzles.flatMap(validatePuzzle)
}

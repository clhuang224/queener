import type { Puzzle } from '@/types/puzzle'

export const SIMPLE_PUZZLES: Puzzle[] = [
  {
    id: 'n5-00001',
    rules: {
      size: 5,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [2, 2, 0, 0, 0],
      [2, 2, 1, 1, 1],
      [3, 2, 2, 2, 2],
      [3, 3, 4, 4, 4],
      [3, 3, 3, 4, 4],
    ],
    queens: [
      [0, 2],
      [1, 4],
      [2, 1],
      [3, 3],
      [4, 0],
    ],
  },
  {
    id: 'n5-00002',
    rules: {
      size: 5,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3],
      [4, 4, 4, 4, 4],
    ],
    queens: [
      [0, 1],
      [1, 3],
      [2, 0],
      [3, 2],
      [4, 4],
    ],
  },
  {
    id: 'n6-00001',
    rules: {
      size: 6,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 1, 1, 1, 1],
      [0, 0, 2, 2, 2, 1],
      [3, 3, 2, 4, 2, 1],
      [3, 3, 4, 4, 4, 1],
      [5, 5, 5, 5, 4, 1],
      [5, 5, 5, 5, 4, 1],
    ],
    queens: [
      [0, 0],
      [1, 3],
      [2, 1],
      [3, 4],
      [4, 2],
      [5, 5],
    ],
  },
  {
    id: 'n6-00002',
    rules: {
      size: 6,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 1, 1, 1, 1],
      [0, 0, 1, 2, 2, 1],
      [3, 3, 1, 2, 4, 1],
      [3, 3, 1, 4, 4, 1],
      [5, 5, 5, 5, 4, 1],
      [5, 5, 5, 5, 4, 1],
    ],
    queens: [
      [0, 0],
      [1, 3],
      [2, 1],
      [3, 4],
      [4, 2],
      [5, 5],
    ],
  },
  {
    id: 'n7-00001',
    rules: {
      size: 7,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 2, 2, 6, 6, 5, 5],
      [0, 2, 6, 6, 6, 5, 5],
      [0, 2, 6, 6, 6, 5, 5],
      [0, 1, 1, 6, 5, 5, 4],
      [1, 1, 5, 5, 5, 5, 4],
      [1, 1, 3, 4, 4, 4, 4],
      [3, 3, 3, 3, 4, 4, 4],
    ],
    queens: [
      [0, 2],
      [1, 4],
      [2, 0],
      [3, 5],
      [4, 1],
      [5, 6],
      [6, 3],
    ],
  },
  {
    id: 'n7-00002',
    rules: {
      size: 7,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3, 3, 3],
      [4, 4, 4, 4, 4, 4, 4],
      [5, 5, 5, 5, 5, 5, 5],
      [6, 6, 6, 6, 6, 6, 6],
    ],
    queens: [
      [0, 0],
      [1, 2],
      [2, 4],
      [3, 6],
      [4, 1],
      [5, 3],
      [6, 5],
    ],
  },
  {
    id: 'n8-00001',
    rules: {
      size: 8,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 7, 7, 7, 7, 4, 4],
      [0, 0, 7, 7, 5, 5, 4, 4],
      [7, 7, 7, 7, 5, 5, 7, 7],
      [7, 1, 1, 7, 7, 7, 7, 7],
      [7, 1, 1, 6, 6, 6, 6, 7],
      [7, 7, 7, 6, 6, 6, 6, 7],
      [7, 2, 2, 6, 6, 6, 6, 7],
      [7, 2, 2, 6, 6, 6, 6, 3],
    ],
    queens: [
      [1, 0],
      [4, 1],
      [6, 2],
      [3, 3],
      [5, 4],
      [2, 5],
      [0, 6],
      [7, 7],
    ],
  },
  {
    id: 'n8-00002',
    rules: {
      size: 8,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3, 3, 3, 3],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [5, 5, 5, 5, 5, 5, 5, 5],
      [6, 6, 6, 6, 6, 6, 6, 6],
      [7, 7, 7, 7, 7, 7, 7, 7],
    ],
    queens: [
      [0, 0],
      [1, 4],
      [2, 7],
      [3, 5],
      [4, 2],
      [5, 6],
      [6, 1],
      [7, 3],
    ],
  },
  {
    id: 'n9-00001',
    rules: {
      size: 9,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3, 3, 3, 3, 3],
      [4, 4, 4, 4, 4, 4, 4, 4, 4],
      [5, 5, 5, 5, 5, 5, 5, 5, 5],
      [6, 6, 6, 6, 6, 6, 6, 6, 6],
      [7, 7, 7, 7, 7, 7, 7, 7, 7],
      [8, 8, 8, 8, 8, 8, 8, 8, 8],
    ],
    queens: [
      [0, 0],
      [1, 2],
      [2, 5],
      [3, 7],
      [4, 1],
      [5, 3],
      [6, 8],
      [7, 6],
      [8, 4],
    ],
  },
  {
    id: 'n10-00001',
    rules: {
      size: 10,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
      [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    ],
    queens: [
      [0, 0],
      [1, 2],
      [2, 5],
      [3, 7],
      [4, 9],
      [5, 4],
      [6, 8],
      [7, 1],
      [8, 3],
      [9, 6],
    ],
  },
]

export const TOTAL_LEVELS = SIMPLE_PUZZLES.length

export const getPuzzleByLevel = (level: number): Puzzle => {
  const puzzle = SIMPLE_PUZZLES[level - 1]

  if (puzzle === undefined) {
    throw new Error(`Unable to load puzzle for level ${level}`)
  }

  return puzzle
}

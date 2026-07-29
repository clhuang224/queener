import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ActionType } from '@/modules/enums/ActionType'
import type { GameRecord } from '@/modules/types/run'
import { createTestingPinia } from '@/test/pinia'
import { useGameRecordsStore } from './gameRecords'

const repositoryMocks = vi.hoisted(() => ({
  getAll: vi.fn(),
  save: vi.fn(),
}))

vi.mock('@/modules/repositories/gameRecords', () => ({
  gameRecordRepository: repositoryMocks,
}))

const createGameRecord = (overrides: Partial<GameRecord> = {}): GameRecord => ({
  uid: 'run-1',
  level: 1,
  puzzle: {
    id: 'test-puzzle',
    rules: {
      size: 2,
      allowDisconnectedRegions: false,
      queensPerUnit: 1,
    },
    regions: [
      [0, 0],
      [1, 1],
    ],
    queens: [
      [0, 0],
      [1, 1],
    ],
  },
  puzzleVariantMetadata: {
    direction: 0,
    regionMap: {
      0: 0,
      1: 1,
    },
  },
  record: [
    {
      action: ActionType.MARK_QUEEN,
      actionAtMillisecond: 1200,
      position: [0, 0],
    },
  ],
  startedAt: new Date('2026-07-28T10:00:00.000Z'),
  endedAt: new Date('2026-07-28T10:01:00.000Z'),
  user: {
    uid: 'user-1',
    name: 'Lynn',
  },
  score: 950,
  ...overrides,
})

describe('game records store', () => {
  beforeEach(() => {
    createTestingPinia()
    repositoryMocks.getAll.mockReset()
    repositoryMocks.save.mockReset()
  })

  it('loads game records through the repository', async () => {
    const record = createGameRecord()
    repositoryMocks.getAll.mockResolvedValue([record])

    const store = useGameRecordsStore()
    await store.load()

    expect(repositoryMocks.getAll).toHaveBeenCalledOnce()
    expect(store.records).toEqual([record])
    expect(store.isLoading).toBe(false)
    expect(store.getRecordsByLevel(1)).toEqual([record])
    expect(store.getRecordsByLevel(2)).toEqual([])
  })

  it('saves and updates a game record', async () => {
    repositoryMocks.save.mockResolvedValue(undefined)

    const store = useGameRecordsStore()
    const record = createGameRecord()
    const updatedRecord = createGameRecord({ score: 980 })

    await store.save(record)
    await store.save(updatedRecord)

    expect(repositoryMocks.save).toHaveBeenNthCalledWith(1, record)
    expect(repositoryMocks.save).toHaveBeenNthCalledWith(2, updatedRecord)
    expect(store.records).toEqual([updatedRecord])
    expect(store.isSaving).toBe(false)
  })
})

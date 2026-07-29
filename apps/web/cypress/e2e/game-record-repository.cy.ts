import { ActionType } from '../../src/modules/enums/ActionType'
import { createIndexedDbGameRecordRepository } from '../../src/modules/repositories/gameRecords'
import type { GameRecord } from '../../src/modules/types/run'

const TEST_DATABASE_NAME = 'queener-game-record-test'

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

const deleteDatabase = (databaseFactory: IDBFactory): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = databaseFactory.deleteDatabase(TEST_DATABASE_NAME)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Unable to delete game record test database'))
  })
}

describe('game record repository', () => {
  it('saves game records and updates records with the same uid', () => {
    cy.visit('/')
    cy.window().then(async (win) => {
      await deleteDatabase(win.indexedDB)

      const repository = createIndexedDbGameRecordRepository({
        databaseFactory: win.indexedDB,
        databaseName: TEST_DATABASE_NAME,
      })
      const initialRecord = createGameRecord()
      const updatedRecord = createGameRecord({
        score: 980,
        endedAt: new Date('2026-07-28T10:00:45.000Z'),
      })

      try {
        await repository.save(initialRecord)
        await repository.save(updatedRecord)

        const records = await repository.getAll()

        expect(records).to.deep.equal([updatedRecord])
        expect(records[0]?.startedAt.getTime()).to.equal(initialRecord.startedAt.getTime())
        expect(records[0]?.endedAt.getTime()).to.equal(updatedRecord.endedAt.getTime())
      } finally {
        await deleteDatabase(win.indexedDB)
      }
    })
  })
})

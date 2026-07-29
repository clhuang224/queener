import type { GameRecord } from '@/modules/types/run'

const DATABASE_NAME = 'queener'
const DATABASE_VERSION = 1
const GAME_RECORDS_STORE_NAME = 'gameRecords'
const LEVEL_INDEX_NAME = 'level'

interface GameRecordRepositoryOptions {
  databaseFactory?: IDBFactory
  databaseName?: string
}

export interface GameRecordRepository {
  save(record: GameRecord): Promise<void>
  getAll(): Promise<GameRecord[]>
}

const openDatabase = (
  databaseFactory: IDBFactory,
  databaseName: string,
): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = databaseFactory.open(databaseName, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      if (request.result.objectStoreNames.contains(GAME_RECORDS_STORE_NAME)) return

      const store = request.result.createObjectStore(GAME_RECORDS_STORE_NAME, {
        keyPath: 'uid',
      })
      store.createIndex(LEVEL_INDEX_NAME, LEVEL_INDEX_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Unable to open game records'))
  })
}

const completeRequest = <T>(
  transaction: IDBTransaction,
  createRequest: () => IDBRequest<T>,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    let request: IDBRequest<T>

    transaction.oncomplete = () => resolve(request.result)
    transaction.onerror = () => {
      reject(transaction.error ?? new Error('Game record transaction failed'))
    }
    transaction.onabort = () => {
      reject(transaction.error ?? new Error('Game record transaction was aborted'))
    }

    try {
      request = createRequest()
    } catch (error) {
      transaction.abort()
      reject(error)
    }
  })
}

export const createIndexedDbGameRecordRepository = ({
  databaseFactory,
  databaseName = DATABASE_NAME,
}: GameRecordRepositoryOptions = {}): GameRecordRepository => {
  const withDatabase = async <T>(
    operation: (database: IDBDatabase) => Promise<T>,
  ): Promise<T> => {
    const database = await openDatabase(databaseFactory ?? globalThis.indexedDB, databaseName)

    try {
      return await operation(database)
    } finally {
      database.close()
    }
  }

  return {
    save: (record) =>
      withDatabase(async (database) => {
        const transaction = database.transaction(GAME_RECORDS_STORE_NAME, 'readwrite')

        await completeRequest(transaction, () =>
          transaction.objectStore(GAME_RECORDS_STORE_NAME).put(record),
        )
      }),
    getAll: () =>
      withDatabase((database) => {
        const transaction = database.transaction(GAME_RECORDS_STORE_NAME, 'readonly')

        return completeRequest(transaction, () =>
          transaction.objectStore(GAME_RECORDS_STORE_NAME).getAll(),
        )
      }),
  }
}

export const gameRecordRepository = createIndexedDbGameRecordRepository()

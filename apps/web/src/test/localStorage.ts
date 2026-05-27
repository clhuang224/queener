interface StorageMock {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

const createStorageMock = (): StorageMock => {
  const storage = new Map<string, string>()

  return {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => {
      storage.set(key, value)
    },
    removeItem: (key) => {
      storage.delete(key)
    },
    clear: () => {
      storage.clear()
    },
  }
}

export const installStorageMock = () => {
  const storageMock = createStorageMock()
  Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    configurable: true,
  })

  storageMock.clear()

  return storageMock
}

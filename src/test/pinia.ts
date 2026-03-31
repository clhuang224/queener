import { createPinia, setActivePinia } from 'pinia'

export const createTestingPinia = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

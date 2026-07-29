import { ref } from 'vue'
import { defineStore } from 'pinia'
import { gameRecordRepository } from '@/modules/repositories/gameRecords'
import type { GameRecord } from '@/modules/types/run'

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unable to access game records'
}

export const useGameRecordsStore = defineStore('gameRecords', () => {
  const records = ref<GameRecord[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const errorMessage = ref<string | null>(null)

  const load = async () => {
    isLoading.value = true
    errorMessage.value = null

    try {
      records.value = await gameRecordRepository.getAll()
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const save = async (record: GameRecord) => {
    isSaving.value = true
    errorMessage.value = null

    try {
      await gameRecordRepository.save(record)

      const recordIndex = records.value.findIndex(({ uid }) => uid === record.uid)
      if (recordIndex === -1) {
        records.value.push(record)
      } else {
        records.value[recordIndex] = record
      }
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  const getRecordsByLevel = (level: number) => {
    return records.value.filter((record) => record.level === level)
  }

  return {
    records,
    isLoading,
    isSaving,
    errorMessage,
    load,
    save,
    getRecordsByLevel,
  }
})

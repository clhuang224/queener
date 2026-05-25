export const formatRunTime = (runTimeMs: number): string => {
  const safeRunTimeMs = Math.max(0, Math.floor(runTimeMs))
  const milliseconds = safeRunTimeMs % 1000
  const totalSeconds = Math.floor(safeRunTimeMs / 1000)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60)

  return [
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':') + `.${String(milliseconds).padStart(3, '0')}`
}
